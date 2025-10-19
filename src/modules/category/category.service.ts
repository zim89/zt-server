import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus, type Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma';
import { queryModes, sortFields, sortOrders } from '@/shared/constants';
import type { PaginatedResponse } from '@/shared/types';
import { buildPaginatedResponse, generateSlug } from '@/shared/utils';

import {
  categoryMessages,
  categorySelectFields,
  categorySelectFieldsWithCount,
} from './constants';
import type {
  CreateCategoryDto,
  FindCategoriesQueryDto,
  FindCategoryNamesQueryDto,
  UpdateCategoryDto,
} from './dto';
import type {
  CategoryNameResponse,
  CategoryResponse,
  CategoryWithTaskCount,
} from './types';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all categories with pagination and filters
   */
  async findMany(
    query: FindCategoriesQueryDto,
  ): Promise<PaginatedResponse<CategoryWithTaskCount>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = sortFields.createdAt,
      sortOrder = sortOrders.desc,
      projectId,
    } = query;

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: queryModes.insensitive } },
          { description: { contains: search, mode: queryModes.insensitive } },
        ],
      }),
      ...(projectId && { projectId }),
    };

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        select: categorySelectFieldsWithCount,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.category.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  /**
   * Find category names for sidebar (minimal data with incomplete tasks count)
   */
  async findNames(
    query: FindCategoryNamesQueryDto,
    userId: string,
  ): Promise<CategoryNameResponse[]> {
    const { search, sortBy = 'name', sortOrder = 'asc' } = query;

    // Build where clause - only categories from user's projects
    const where: Prisma.CategoryWhereInput = {
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

    // Note: Category model doesn't have isActive field, so we skip this filter

    // Apply search
    if (search) {
      where.AND = [
        where,
        {
          OR: [
            { name: { contains: search, mode: queryModes.insensitive } },
            { slug: { contains: search, mode: queryModes.insensitive } },
          ],
        },
      ];
    }

    // Execute query with incomplete tasks count
    const categories: Array<{
      id: string;
      name: string;
      slug: string;
      _count: {
        tasks: number;
      };
    }> = await this.prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            tasks: {
              where: {
                status: {
                  not: TaskStatus.COMPLETED,
                },
              },
            },
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
    });

    // Transform to CategoryNameResponse
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      incompleteTasksCount: category._count.tasks,
    }));
  }

  /**
   * Find category by ID
   */
  async findOneById(
    id: string,
    userId: string,
  ): Promise<CategoryWithTaskCount> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        ...categorySelectFieldsWithCount,
        project: {
          select: {
            userId: true,
            members: {
              where: { userId },
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(categoryMessages.category.error.notFound);
    }

    // Check access: owner or member of project
    const isOwner = category.project.userId === userId;
    const isMember = category.project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        categoryMessages.category.error.accessDenied,
      );
    }

    // Remove nested project from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { project, ...categoryData } = category;

    return categoryData;
  }

  /**
   * Find category by slug
   */
  async findOneBySlug(slug: string, userId: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        ...categorySelectFields,
        project: {
          select: {
            userId: true,
            members: {
              where: { userId },
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(categoryMessages.category.error.notFound);
    }

    // Check access: owner or member of project
    const isOwner = category.project.userId === userId;
    const isMember = category.project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        categoryMessages.category.error.accessDenied,
      );
    }

    // Remove nested project from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { project, ...categoryData } = category;

    return categoryData;
  }

  /**
   * Create new category
   */
  async create(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    // Verify user has access to project
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: {
        userId: true,
        members: {
          where: { userId },
          select: { userId: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(categoryMessages.project.error.notFound);
    }

    // Check access: owner or member of project
    const isOwner = project.userId === userId;
    const isMember = project.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(categoryMessages.project.error.accessDenied);
    }

    // Generate slug from name
    const slug = generateSlug(dto.name);

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new ConflictException(categoryMessages.category.error.slugExists);
    }

    // Create category
    return this.prisma.category.create({
      data: {
        name: dto.name,
        description: dto.description,
        slug,
        projectId: dto.projectId,
      },
      select: categorySelectFields,
    });
  }

  /**
   * Update category
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponse> {
    // Verify access
    const category = await this.findOneById(id, userId);

    // Verify user is owner or admin of project
    const project = await this.prisma.project.findUnique({
      where: { id: category.projectId },
      select: {
        userId: true,
        members: {
          where: {
            userId,
            roles: { hasSome: ['OWNER', 'ADMIN'] },
          },
          select: { userId: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(categoryMessages.project.error.notFound);
    }

    const isOwner = project.userId === userId;
    const isAdmin = project.members.length > 0;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        categoryMessages.category.error.accessDenied,
      );
    }

    // If name is being updated, regenerate slug
    let slug: string | undefined;
    if (dto.name && dto.name !== category.name) {
      slug = generateSlug(dto.name);

      // Check if new slug already exists
      const existingCategory = await this.prisma.category.findUnique({
        where: { slug },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(categoryMessages.category.error.slugExists);
      }
    }

    // Update category
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(slug && { slug }),
      },
      select: categorySelectFields,
    });
  }

  /**
   * Delete category
   */
  async delete(id: string, userId: string): Promise<void> {
    // Verify access
    const category = await this.findOneById(id, userId);

    // Verify user is owner or admin of project
    const project = await this.prisma.project.findUnique({
      where: { id: category.projectId },
      select: {
        userId: true,
        members: {
          where: {
            userId,
            roles: { hasSome: ['OWNER', 'ADMIN'] },
          },
          select: { userId: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(categoryMessages.project.error.notFound);
    }

    const isOwner = project.userId === userId;
    const isAdmin = project.members.length > 0;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        categoryMessages.category.error.accessDenied,
      );
    }

    // Delete category
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
