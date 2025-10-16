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
import { buildPaginatedResponse, generateSlug } from '@/shared/utils';

import { projectMessages } from './constants';
import type {
  AddMemberDto,
  CreateProjectDto,
  FindProjectsQueryDto,
  UpdateMemberRoleDto,
  UpdateProjectDto,
} from './dto';
import {
  hasAdminRole,
  isProjectOwner,
  membershipSelectFields,
  type MembershipResponse,
  projectSelectFields,
  projectSelectFieldsWithCounts,
  type ProjectResponse,
  type ProjectWithCounts,
} from './types';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find many projects with pagination and filters
   */
  async findMany(
    query: FindProjectsQueryDto,
    userId: string,
  ): Promise<PaginatedResponse<ProjectWithCounts>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = sortFields.createdAt,
      sortOrder = sortOrders.desc,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProjectWhereInput = {
      OR: [
        { userId }, // Projects owned by user
        {
          members: {
            some: { userId }, // Projects where user is a member
          },
        },
      ],
    };

    // Apply filters
    if (query.isFavorite !== undefined) {
      where.isFavorite = query.isFavorite;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.isHidden !== undefined) {
      where.isHidden = query.isHidden;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    // Apply search
    if (search) {
      where.OR = [
        { name: { contains: search, mode: queryModes.insensitive } },
        { description: { contains: search, mode: queryModes.insensitive } },
        { slug: { contains: search, mode: queryModes.insensitive } },
      ];
    }

    // Execute queries
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        select: projectSelectFieldsWithCounts,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.project.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  /**
   * Find one project by ID
   */
  async findOneById(id: string, userId: string): Promise<ProjectWithCounts> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: projectSelectFieldsWithCounts,
    });

    if (!project) {
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    // Check access
    await this.checkUserAccess(id, userId);

    return project;
  }

  /**
   * Find one project by slug
   */
  async findOneBySlug(slug: string, userId: string): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      select: projectSelectFields,
    });

    if (!project) {
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    // Check access
    await this.checkUserAccess(project.id, userId);

    return project;
  }

  /**
   * Create a new project
   */
  async create(
    dto: CreateProjectDto,
    userId: string,
  ): Promise<ProjectResponse> {
    // Generate slug if not provided
    const slug = dto.slug || generateSlug(dto.name);

    // Check if slug already exists
    const existingProject = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      throw new ConflictException(projectMessages.project.error.alreadyExists);
    }

    // Create project
    const project = await this.prisma.project.create({
      data: {
        ...dto,
        slug,
        userId,
      },
      select: projectSelectFields,
    });

    return project;
  }

  /**
   * Update a project
   */
  async update(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<ProjectResponse> {
    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    // Check permissions (only owner or admin can update)
    await this.checkAdminAccess(id, userId);

    // If slug is being updated, check uniqueness
    if (dto.slug && dto.slug !== project.slug) {
      const existingProject = await this.prisma.project.findUnique({
        where: { slug: dto.slug },
      });

      if (existingProject) {
        throw new ConflictException(
          projectMessages.project.error.alreadyExists,
        );
      }
    }

    // Update project
    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: dto,
      select: projectSelectFields,
    });

    return updatedProject;
  }

  /**
   * Delete a project (only owner can delete)
   */
  async delete(id: string, userId: string): Promise<void> {
    // Check if project exists
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    // Only owner can delete
    if (!isProjectOwner(project, userId)) {
      throw new ForbiddenException(projectMessages.project.error.forbidden);
    }

    // Delete project (cascade will handle memberships)
    await this.prisma.project.delete({
      where: { id },
    });
  }

  /**
   * Add a member to a project
   */
  async addMember(
    projectId: string,
    dto: AddMemberDto,
    userId: string,
  ): Promise<MembershipResponse> {
    // Check if project exists and user has admin access
    await this.checkAdminAccess(projectId, userId);

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        projectMessages.membership.error.userNotFound,
      );
    }

    // Check if membership already exists
    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: dto.userId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException(
        projectMessages.membership.error.alreadyExists,
      );
    }

    // Create membership
    const membership = await this.prisma.membership.create({
      data: {
        projectId,
        userId: dto.userId,
        roles: dto.roles,
      },
      select: membershipSelectFields,
    });

    return membership;
  }

  /**
   * Remove a member from a project
   */
  async removeMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    // Check if project exists and user has admin access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    await this.checkAdminAccess(projectId, userId);

    // Cannot remove project owner
    if (project.userId === memberId) {
      throw new BadRequestException(
        projectMessages.membership.error.cannotRemoveOwner,
      );
    }

    // Find and delete membership
    const membership = await this.prisma.membership.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(projectMessages.membership.error.notFound);
    }

    await this.prisma.membership.delete({
      where: { id: membership.id },
    });
  }

  /**
   * Update member role in a project
   */
  async updateMemberRole(
    projectId: string,
    memberId: string,
    dto: UpdateMemberRoleDto,
    userId: string,
  ): Promise<MembershipResponse> {
    // Check if project exists and user has admin access
    await this.checkAdminAccess(projectId, userId);

    // Find membership
    const membership = await this.prisma.membership.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(projectMessages.membership.error.notFound);
    }

    // Update membership roles
    const updatedMembership = await this.prisma.membership.update({
      where: { id: membership.id },
      data: { roles: dto.roles },
      select: membershipSelectFields,
    });

    return updatedMembership;
  }

  /**
   * Check if user has access to project (owner or member)
   */
  private async checkUserAccess(
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
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    const isOwner = isProjectOwner(project, userId);
    const isMember = project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(projectMessages.project.error.forbidden);
    }
  }

  /**
   * Check if user has admin access to project (owner or admin role)
   */
  private async checkAdminAccess(
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
      throw new NotFoundException(projectMessages.project.error.notFound);
    }

    const isOwner = isProjectOwner(project, userId);
    const hasAdmin =
      project.members.length > 0 && hasAdminRole(project.members[0]);

    if (!isOwner && !hasAdmin) {
      throw new ForbiddenException(projectMessages.project.error.forbidden);
    }
  }
}
