import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { MarkerResponseDto } from '../dto';

export const MarkerSwaggerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create new marker',
        description: 'Creates a new personal marker with optional colors',
      }),
      ApiCreatedResponse({
        type: MarkerResponseDto,
        description: 'Marker created successfully',
      }),
      ApiBadRequestResponse({
        description: 'Invalid input data or color format',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiConflictResponse({
        description: 'Marker slug already exists for this user',
      }),
    ),

  findMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all markers',
        description:
          'Returns paginated list of markers (default markers + personal markers of current user)',
      }),
      ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number',
        example: 1,
      }),
      ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page',
        example: 20,
      }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search in marker name',
        example: 'important',
      }),
      ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        description: 'Sort by field',
        example: 'name',
      }),
      ApiQuery({
        name: 'sortOrder',
        required: false,
        type: String,
        description: 'Sort order (asc/desc)',
        example: 'asc',
      }),
      ApiQuery({
        name: 'isDefault',
        required: false,
        type: Boolean,
        description: 'Filter by default markers',
        example: false,
      }),
      ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'Filter by user ID (admin only)',
        example: 'clx1a2b3c4d5e6f7g8h9i0j1',
      }),
      ApiOkResponse({
        description: 'Markers retrieved successfully',
        schema: {
          properties: {
            total: { type: 'number', example: 10 },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/MarkerResponseDto' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 20 },
                pages: { type: 'number', example: 1 },
                hasNext: { type: 'boolean', example: false },
                hasPrev: { type: 'boolean', example: false },
              },
            },
          },
        },
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ),

  findOneById: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get marker by ID' }),
      ApiOkResponse({
        type: MarkerResponseDto,
        description: 'Marker retrieved successfully',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({ description: 'Access to marker denied' }),
      ApiNotFoundResponse({ description: 'Marker not found' }),
    ),

  findOneBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get marker by slug',
        description: 'Returns marker by its unique slug',
      }),
      ApiOkResponse({
        type: MarkerResponseDto,
        description: 'Marker retrieved successfully',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({ description: 'Access to marker denied' }),
      ApiNotFoundResponse({ description: 'Marker not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update marker',
        description: 'Updates personal marker (cannot update default markers)',
      }),
      ApiOkResponse({
        type: MarkerResponseDto,
        description: 'Marker updated successfully',
      }),
      ApiBadRequestResponse({
        description: 'Invalid input data or color format',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({
        description:
          'Access denied (owner only, cannot modify default markers)',
      }),
      ApiNotFoundResponse({ description: 'Marker not found' }),
      ApiConflictResponse({
        description: 'Marker slug already exists for this user',
      }),
    ),

  delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete marker',
        description: 'Deletes personal marker (cannot delete default markers)',
      }),
      ApiNoContentResponse({ description: 'Marker deleted successfully' }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({
        description:
          'Access denied (owner only, cannot delete default markers)',
      }),
      ApiNotFoundResponse({ description: 'Marker not found' }),
    ),
};
