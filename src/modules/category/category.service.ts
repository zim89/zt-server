import {
  ConflictException,
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
    userId: string,
  ): Promise<PaginatedResponse<CategoryWithTaskCount>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = sortFields.createdAt,
      sortOrder = sortOrders.desc,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {
      userId, // Only user's categories
      ...(search && {
        OR: [
          { name: { contains: search, mode: queryModes.insensitive } },
          { description: { contains: search, mode: queryModes.insensitive } },
        ],
      }),
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

    // Build where clause - only user's categories
    const where: Prisma.CategoryWhereInput = { userId };

    // Apply search
    if (search) {
      where.AND = [
        { userId },
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
      where: { id, userId },
      select: categorySelectFieldsWithCount,
    });

    if (!category) {
      throw new NotFoundException(categoryMessages.category.error.notFound);
    }

    return category;
  }

  /**
   * Find category by slug
   */
  async findOneBySlug(slug: string, userId: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { userId_slug: { userId, slug } },
      select: categorySelectFields,
    });

    if (!category) {
      throw new NotFoundException(categoryMessages.category.error.notFound);
    }

    return category;
  }

  /**
   * Create new category
   */
  async create(
    userId: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    // Generate slug from name
    const slug = generateSlug(dto.name);

    // Check if slug already exists for this user
    const existingCategory = await this.prisma.category.findUnique({
      where: { userId_slug: { userId, slug } },
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
        userId,
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
    // Verify category exists
    const category = await this.findOneById(id, userId);

    // If name is being updated, regenerate slug
    let slug: string | undefined;
    if (dto.name && dto.name !== category.name) {
      slug = generateSlug(dto.name);

      // Check if new slug already exists for this user
      const existingCategory = await this.prisma.category.findUnique({
        where: { userId_slug: { userId, slug } },
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
    // Verify category exists and belongs to user
    await this.findOneById(id, userId);

    // Delete category
    await this.prisma.category.delete({
      where: { id, userId },
    });
  }
}
