import {
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

import {
  markerMessages,
  markerSelectFields,
  markerSelectFieldsWithCount,
} from './constants';
import type {
  CreateMarkerDto,
  FindMarkersQueryDto,
  FindMarkerNamesQueryDto,
  UpdateMarkerDto,
} from './dto';
import type {
  MarkerNameResponse,
  MarkerResponse,
  MarkerWithTaskCount,
} from './types';

@Injectable()
export class MarkerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all markers with pagination and filters
   * Returns default markers + personal markers of current user
   */
  async findMany(
    query: FindMarkersQueryDto,
    userId: string,
  ): Promise<PaginatedResponse<MarkerWithTaskCount>> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = sortFields.name,
      sortOrder = sortOrders.asc,
      isDefault,
      userId: filterUserId,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause: default markers OR personal markers of current user
    const where = {
      OR: [
        { isDefault: true }, // All default markers
        { userId }, // Personal markers of current user
      ],
      ...(search && {
        name: { contains: search, mode: queryModes.insensitive },
      }),
      ...(isDefault !== undefined && { isDefault }),
      ...(filterUserId && { userId: filterUserId }),
    };

    const [items, total] = await Promise.all([
      this.prisma.marker.findMany({
        where,
        select: markerSelectFieldsWithCount,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.marker.count({ where }),
    ]);

    return buildPaginatedResponse(items, total, page, limit);
  }

  /**
   * Find marker names for sidebar (minimal data without task count)
   */
  async findNames(
    query: FindMarkerNamesQueryDto,
    userId: string,
  ): Promise<MarkerNameResponse[]> {
    const { search, isDefault, sortBy = 'name', sortOrder = 'asc' } = query;

    // Build where clause: default markers OR personal markers of current user
    const where: Prisma.MarkerWhereInput = {
      OR: [
        { isDefault: true }, // Default markers (accessible to all)
        { userId }, // Personal markers of current user
      ],
    };

    // Apply filters
    if (isDefault !== undefined) {
      where.isDefault = isDefault;
    }

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

    // Execute query without task count
    const markers: Array<{
      id: string;
      name: string;
      slug: string;
      isDefault: boolean;
      fontColor: string | null;
      bgColor: string | null;
    }> = await this.prisma.marker.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        isDefault: true,
        fontColor: true,
        bgColor: true,
      },
      orderBy: { [sortBy]: sortOrder },
    });

    // Transform to MarkerNameResponse
    return markers.map((marker) => ({
      id: marker.id,
      name: marker.name,
      slug: marker.slug,
      isDefault: marker.isDefault,
      fontColor: marker.fontColor,
      bgColor: marker.bgColor,
    }));
  }

  /**
   * Find marker by ID
   * Access: default markers (all) OR personal markers (owner only)
   */
  async findOneById(id: string, userId: string): Promise<MarkerWithTaskCount> {
    const marker = await this.prisma.marker.findUnique({
      where: { id },
      select: markerSelectFieldsWithCount,
    });

    if (!marker) {
      throw new NotFoundException(markerMessages.marker.error.notFound);
    }

    // Check access: default marker OR owned by current user
    if (!marker.isDefault && marker.userId !== userId) {
      throw new ForbiddenException(markerMessages.marker.error.accessDenied);
    }

    return marker;
  }

  /**
   * Find marker by slug
   * Note: slug is unique per user (@@unique([userId, slug]))
   */
  async findOneBySlug(slug: string, userId: string): Promise<MarkerResponse> {
    // Find marker by slug (default OR personal)
    const markers = await this.prisma.marker.findMany({
      where: {
        slug,
        OR: [
          { isDefault: true }, // Default markers
          { userId }, // Personal markers
        ],
      },
      select: markerSelectFields,
      take: 1,
    });

    const marker = markers[0];

    if (!marker) {
      throw new NotFoundException(markerMessages.marker.error.notFound);
    }

    return marker;
  }

  /**
   * Create new personal marker
   */
  async create(userId: string, dto: CreateMarkerDto): Promise<MarkerResponse> {
    // Generate slug from name
    const slug = generateSlug(dto.name);

    // Check if slug already exists for this user
    const existingMarker = await this.prisma.marker.findUnique({
      where: {
        userId_slug: {
          userId,
          slug,
        },
      },
    });

    if (existingMarker) {
      throw new ConflictException(markerMessages.marker.error.slugExists);
    }

    // Create personal marker
    return this.prisma.marker.create({
      data: {
        name: dto.name,
        fontColor: dto.fontColor,
        bgColor: dto.bgColor,
        slug,
        userId,
        isDefault: false, // Always false for user-created markers
      },
      select: markerSelectFields,
    });
  }

  /**
   * Update marker
   * Only personal markers can be updated (not default)
   */
  async update(
    id: string,
    userId: string,
    dto: UpdateMarkerDto,
  ): Promise<MarkerResponse> {
    // Find and verify access
    const marker = await this.findOneById(id, userId);

    // Cannot modify default markers
    if (marker.isDefault) {
      throw new ForbiddenException(
        markerMessages.marker.error.cannotModifyDefault,
      );
    }

    // Verify ownership
    if (marker.userId !== userId) {
      throw new ForbiddenException(markerMessages.marker.error.accessDenied);
    }

    // If name is being updated, regenerate slug
    let slug: string | undefined;
    if (dto.name && dto.name !== marker.name) {
      slug = generateSlug(dto.name);

      // Check if new slug already exists for this user
      const existingMarker = await this.prisma.marker.findUnique({
        where: {
          userId_slug: {
            userId,
            slug,
          },
        },
      });

      if (existingMarker && existingMarker.id !== id) {
        throw new ConflictException(markerMessages.marker.error.slugExists);
      }
    }

    // Update marker
    return this.prisma.marker.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.fontColor !== undefined && { fontColor: dto.fontColor }),
        ...(dto.bgColor !== undefined && { bgColor: dto.bgColor }),
        ...(slug && { slug }),
      },
      select: markerSelectFields,
    });
  }

  /**
   * Delete marker
   * Only personal markers can be deleted (not default)
   */
  async delete(id: string, userId: string): Promise<void> {
    // Find and verify access
    const marker = await this.findOneById(id, userId);

    // Cannot delete default markers
    if (marker.isDefault) {
      throw new ForbiddenException(
        markerMessages.marker.error.cannotDeleteDefault,
      );
    }

    // Verify ownership
    if (marker.userId !== userId) {
      throw new ForbiddenException(markerMessages.marker.error.accessDenied);
    }

    // Delete marker
    await this.prisma.marker.delete({
      where: { id },
    });
  }
}
