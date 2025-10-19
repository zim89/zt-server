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

import { categorySwaggerSchemas } from '../constants';
import { CategoryResponseDto } from '../dto';

export const CategorySwaggerDocs = {
  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create new category',
        description: 'Creates a new category within a project',
      }),
      ApiCreatedResponse({
        type: CategoryResponseDto,
        description: 'Category created successfully',
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({ description: 'No access to project' }),
      ApiConflictResponse({ description: 'Category slug already exists' }),
    ),

  findMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all categories',
        description:
          'Returns paginated list of categories with optional filters',
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
        description: 'Search in name and description',
        example: 'development',
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
        name: 'projectId',
        required: false,
        type: String,
        description: 'Filter by project ID',
        example: 'clx1a2b3c4d5e6f7g8h9i0j1',
      }),
      ApiOkResponse({
        description: 'Categories retrieved successfully',
        schema: {
          example: categorySwaggerSchemas.categoriesList.example,
          properties: {
            total: { type: 'number' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/CategoryResponseDto' },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                pages: { type: 'number' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' },
              },
            },
          },
        },
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ),

  findNames: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get category names for sidebar',
        description:
          'Returns minimal category data with incomplete tasks count for sidebar display',
      }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search in category name or slug',
      }),
      ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'name',
      }),
      ApiQuery({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        example: 'asc',
      }),
      ApiOkResponse({
        description: 'Category names retrieved successfully',
        schema: { example: categorySwaggerSchemas.categoryNamesList.example },
      }),
    ),

  findOneById: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get category by ID' }),
      ApiOkResponse({
        type: CategoryResponseDto,
        description: 'Category retrieved successfully',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({ description: 'Access to category denied' }),
      ApiNotFoundResponse({ description: 'Category not found' }),
    ),

  findOneBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get category by slug',
        description: 'Returns category by its unique slug',
      }),
      ApiOkResponse({
        type: CategoryResponseDto,
        description: 'Category retrieved successfully',
      }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({ description: 'Access to category denied' }),
      ApiNotFoundResponse({ description: 'Category not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update category',
        description: 'Updates category (requires project owner or admin role)',
      }),
      ApiOkResponse({
        type: CategoryResponseDto,
        description: 'Category updated successfully',
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({
        description: 'Access denied (owner/admin only)',
      }),
      ApiNotFoundResponse({ description: 'Category not found' }),
      ApiConflictResponse({ description: 'Category slug already exists' }),
    ),

  delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete category',
        description: 'Deletes category (requires project owner or admin role)',
      }),
      ApiNoContentResponse({ description: 'Category deleted successfully' }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
      ApiForbiddenResponse({
        description: 'Access denied (owner/admin only)',
      }),
      ApiNotFoundResponse({ description: 'Category not found' }),
    ),
};
