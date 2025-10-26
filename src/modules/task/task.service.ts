import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma';
import { queryModes, sortFields, sortOrders } from '@/shared/constants';
import type { PaginatedResponse } from '@/shared/types';
import { buildPaginatedResponse } from '@/shared/utils';

import { taskMessages, taskSelectFields } from './constants';
import type {
  AssignTaskDto,
  CreateTaskDto,
  FindTasksQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto';
import type { TaskResponse } from './types';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find many tasks with pagination and filters
   */
  async findMany(
    query: FindTasksQueryDto,
    userId: string,
  ): Promise<PaginatedResponse<TaskResponse>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = sortFields.createdAt,
      sortOrder = sortOrders.desc,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause - user must have access to project
    const where: Prisma.TaskWhereInput = {
      project: {
        OR: [
          { userId }, // Projects owned by user
          {
            members: {
              some: { userId }, // Projects where user is a member
            },
          },
        ],
      },
    };

    // Resolve project slug to ID if provided
    if (query.projectSlug) {
      const project = await this.prisma.project.findUnique({
        where: { slug: query.projectSlug },
        select: { id: true },
      });

      if (!project) {
        throw new NotFoundException(taskMessages.task.error.projectNotFound);
      }

      where.projectId = project.id;
    }

    // Apply filters
    if (query.status) {
      where.status = query.status;
    }

    if (query.assigneeId) {
      where.assigneeId = query.assigneeId;
    }

    // Resolve category slug to ID if provided
    if (query.categorySlug) {
      const category = await this.prisma.category.findFirst({
        where: {
          slug: query.categorySlug,
          userId, // Category must belong to the user
        },
        select: { id: true },
      });

      if (!category) {
        throw new NotFoundException(taskMessages.task.error.categoryNotFound);
      }

      where.categoryId = category.id;
    }

    if (query.contactId) {
      where.contactId = query.contactId;
    }

    if (query.creatorId) {
      where.creatorId = query.creatorId;
    }

    // Date range filters
    if (query.dueDateFrom || query.dueDateTo) {
      where.dueDate = {};
      if (query.dueDateFrom) {
        where.dueDate.gte = new Date(query.dueDateFrom);
      }
      if (query.dueDateTo) {
        where.dueDate.lte = new Date(query.dueDateTo);
      }
    }

    // Overdue filter
    if (query.isOverdue === true) {
      where.dueDate = {
        lt: new Date(),
      };
      where.status = {
        notIn: ['COMPLETED', 'CANCELED', 'REJECTED'],
      };
    }

    // Has assignee filter
    if (query.hasAssignee !== undefined) {
      where.assigneeId = query.hasAssignee ? { not: null } : { equals: null };
    }

    // Apply search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: queryModes.insensitive } },
        { description: { contains: search, mode: queryModes.insensitive } },
      ];
    }

    // Execute queries
    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        select: taskSelectFields,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.task.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  /**
   * Find one task by ID
   */
  async findOneById(id: string, userId: string): Promise<TaskResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: taskSelectFields,
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check access through project
    if (task.projectId) {
      await this.checkTaskAccess(task.projectId, userId);
    }

    return task;
  }

  /**
   * Create a new task
   */
  async create(dto: CreateTaskDto, userId: string): Promise<TaskResponse> {
    // Check if user has access to the project (only if projectId is provided)
    if (dto.projectId) {
      await this.checkTaskAccess(dto.projectId, userId);
    }

    // Verify project exists if provided
    if (dto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!project) {
        throw new NotFoundException(taskMessages.task.error.projectNotFound);
      }
    }

    // Verify category exists if provided
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(taskMessages.task.error.categoryNotFound);
      }
    }

    // Verify contact exists if provided
    if (dto.contactId) {
      const contact = await this.prisma.contact.findUnique({
        where: { id: dto.contactId },
      });
      if (!contact) {
        throw new NotFoundException(taskMessages.task.error.contactNotFound);
      }
    }

    // Verify assignee exists and has access to project if provided
    if (dto.assigneeId && dto.projectId) {
      await this.verifyAssigneeAccess(dto.projectId, dto.assigneeId);
    }

    // Create task
    const task = await this.prisma.task.create({
      data: {
        ...dto,
        projectId: dto.projectId,
        status: dto.status ?? 'NOT_STARTED',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        creatorId: userId,
      },
      select: taskSelectFields,
    });

    return task;
  }

  /**
   * Update a task
   */
  async update(
    id: string,
    dto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskResponse> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access to modify (creator or project admin)
    if (task.projectId) {
      await this.checkTaskModifyAccess(task.projectId, task.creatorId, userId);
    } else if (task.creatorId !== userId) {
      throw new ForbiddenException(taskMessages.task.error.accessDenied);
    }

    // Verify category exists if being updated
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(taskMessages.task.error.categoryNotFound);
      }
    }

    // Verify contact exists if being updated
    if (dto.contactId) {
      const contact = await this.prisma.contact.findUnique({
        where: { id: dto.contactId },
      });
      if (!contact) {
        throw new NotFoundException(taskMessages.task.error.contactNotFound);
      }
    }

    // Verify assignee exists and has access if being updated
    if (dto.assigneeId && task.projectId) {
      await this.verifyAssigneeAccess(task.projectId, dto.assigneeId);
    }

    // Update task
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      select: taskSelectFields,
    });

    return updatedTask;
  }

  /**
   * Delete a task
   */
  async delete(id: string, userId: string): Promise<void> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access to delete (creator or project admin)
    if (task.projectId) {
      await this.checkTaskModifyAccess(task.projectId, task.creatorId, userId);
    } else if (task.creatorId !== userId) {
      throw new ForbiddenException(taskMessages.task.error.accessDenied);
    }

    // Delete task (cascade will handle markers)
    await this.prisma.task.delete({
      where: { id },
    });
  }

  /**
   * Update task status
   */
  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
    userId: string,
  ): Promise<TaskResponse> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access (any project member can update status)
    if (task.projectId) {
      await this.checkTaskAccess(task.projectId, userId);
    }

    // Update status
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { status: dto.status },
      select: taskSelectFields,
    });

    return updatedTask;
  }

  /**
   * Assign task to user
   */
  async assignToUser(
    id: string,
    dto: AssignTaskDto,
    userId: string,
  ): Promise<TaskResponse> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access to modify
    if (task.projectId) {
      await this.checkTaskModifyAccess(task.projectId, task.creatorId, userId);
    } else if (task.creatorId !== userId) {
      throw new ForbiddenException(taskMessages.task.error.accessDenied);
    }

    // Verify assignee exists and has access to project if provided
    if (dto.assigneeId && task.projectId) {
      await this.verifyAssigneeAccess(task.projectId, dto.assigneeId);
    }

    // Update assignee
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: { assigneeId: dto.assigneeId },
      select: taskSelectFields,
    });

    return updatedTask;
  }

  /**
   * Add marker to task
   */
  async addMarker(
    taskId: string,
    markerId: string,
    userId: string,
  ): Promise<void> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access
    if (task.projectId) {
      await this.checkTaskAccess(task.projectId, userId);
    }

    // Check if marker exists
    const marker = await this.prisma.marker.findUnique({
      where: { id: markerId },
    });

    if (!marker) {
      throw new NotFoundException(taskMessages.marker.error.notFound);
    }

    // Check if marker is already attached
    const existing = await this.prisma.taskMarker.findUnique({
      where: {
        taskId_markerId: {
          taskId,
          markerId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(taskMessages.marker.error.alreadyAdded);
    }

    // Add marker
    await this.prisma.taskMarker.create({
      data: {
        taskId,
        markerId,
      },
    });
  }

  /**
   * Remove marker from task
   */
  async removeMarker(
    taskId: string,
    markerId: string,
    userId: string,
  ): Promise<void> {
    // Get task and check it exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException(taskMessages.task.error.notFound);
    }

    // Check if user has access
    if (task.projectId) {
      await this.checkTaskAccess(task.projectId, userId);
    }

    // Check if marker is attached
    const taskMarker = await this.prisma.taskMarker.findUnique({
      where: {
        taskId_markerId: {
          taskId,
          markerId,
        },
      },
    });

    if (!taskMarker) {
      throw new NotFoundException(taskMessages.marker.error.notAttached);
    }

    // Remove marker
    await this.prisma.taskMarker.delete({
      where: { id: taskMarker.id },
    });
  }

  /**
   * Check if user has access to project (for viewing tasks)
   */
  private async checkTaskAccess(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(taskMessages.task.error.projectNotFound);
    }

    const isOwner = project.userId === userId;
    const isMember = project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(taskMessages.task.error.accessDenied);
    }
  }

  /**
   * Check if user has access to modify task (creator or project admin)
   */
  private async checkTaskModifyAccess(
    projectId: string,
    taskCreatorId: string,
    userId: string,
  ): Promise<void> {
    // Task creator can always modify
    if (taskCreatorId === userId) {
      return;
    }

    // Check if user is project owner or admin
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(taskMessages.task.error.projectNotFound);
    }

    const isOwner = project.userId === userId;
    const isAdmin =
      project.members.length > 0 &&
      (project.members[0].roles.includes('OWNER') ||
        project.members[0].roles.includes('ADMIN'));

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(taskMessages.task.error.accessDenied);
    }
  }

  /**
   * Verify that assignee exists and has access to project
   */
  private async verifyAssigneeAccess(
    projectId: string,
    assigneeId: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: assigneeId },
    });

    if (!user) {
      throw new NotFoundException(taskMessages.assignment.error.userNotFound);
    }

    // Check if user has access to project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId: assigneeId },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(taskMessages.task.error.projectNotFound);
    }

    const isOwner = project.userId === assigneeId;
    const isMember = project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new BadRequestException(
        taskMessages.assignment.error.userNotInProject,
      );
    }
  }
}
