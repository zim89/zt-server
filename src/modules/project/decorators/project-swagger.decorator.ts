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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { routeParams } from '@/shared/constants';

import { projectSwaggerSchemas } from '../constants';

/**
 * Swagger documentation decorators for project endpoints
 *
 * Provides pre-configured Swagger decorators for all project operations
 *
 * @example
 * @ProjectSwaggerDocs.findMany()
 * @Get()
 * findMany(@Query() query: FindProjectsQueryDto) {
 *   return this.projectService.findMany(query);
 * }
 */
export const ProjectSwaggerDocs = {
  findMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all projects with pagination',
        description:
          'Returns paginated list of projects with optional filters and search',
      }),
      ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
      ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search in project name, description, or slug',
      }),
      ApiQuery({
        name: 'sortBy',
        required: false,
        type: String,
        example: 'createdAt',
      }),
      ApiQuery({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        example: 'desc',
      }),
      ApiQuery({ name: 'isFavorite', required: false, type: Boolean }),
      ApiQuery({ name: 'isActive', required: false, type: Boolean }),
      ApiQuery({ name: 'isHidden', required: false, type: Boolean }),
      ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'Filter by project owner',
      }),
      ApiOkResponse({
        description: 'Projects retrieved successfully',
        schema: { example: projectSwaggerSchemas.projectsList.example },
      }),
    ),

  findNames: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get project names for sidebar',
        description:
          'Returns minimal project data with incomplete tasks count for sidebar display',
      }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search in project name or slug',
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
      ApiQuery({ name: 'isFavorite', required: false, type: Boolean }),
      ApiQuery({ name: 'isActive', required: false, type: Boolean }),
      ApiQuery({ name: 'isHidden', required: false, type: Boolean }),
      ApiOkResponse({
        description: 'Project names retrieved successfully',
        schema: { example: projectSwaggerSchemas.projectNamesList.example },
      }),
    ),

  findOneById: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get project by ID',
        description: 'Returns a single project by its unique identifier',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiOkResponse({
        description: 'Project retrieved successfully',
        schema: { example: projectSwaggerSchemas.project.example },
      }),
      ApiNotFoundResponse({ description: 'Project not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - user is not a member',
      }),
    ),

  findOneBySlug: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get project by slug',
        description: 'Returns a single project by its unique slug',
      }),
      ApiParam({ name: routeParams.slug, description: 'Project slug' }),
      ApiOkResponse({
        description: 'Project retrieved successfully',
        schema: { example: projectSwaggerSchemas.project.example },
      }),
      ApiNotFoundResponse({ description: 'Project not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - user is not a member',
      }),
    ),

  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new project',
        description:
          'Creates a new project. Slug is auto-generated if not provided.',
      }),
      ApiCreatedResponse({
        description: 'Project created successfully',
        schema: { example: projectSwaggerSchemas.project.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiConflictResponse({
        description: 'Project with this slug already exists',
      }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a project',
        description: 'Updates project details. Requires owner or admin role.',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiOkResponse({
        description: 'Project updated successfully',
        schema: { example: projectSwaggerSchemas.project.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Project not found' }),
      ApiForbiddenResponse({
        description: 'Only owner or admin can update project',
      }),
      ApiConflictResponse({
        description: 'Project with this slug already exists',
      }),
    ),

  delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a project',
        description: 'Deletes a project. Only owner can delete.',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiNoContentResponse({ description: 'Project deleted successfully' }),
      ApiNotFoundResponse({ description: 'Project not found' }),
      ApiForbiddenResponse({ description: 'Only owner can delete project' }),
    ),

  addMember: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Add a member to project',
        description:
          'Adds a new member to the project. Requires owner or admin role.',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiCreatedResponse({
        description: 'Member added successfully',
        schema: { example: projectSwaggerSchemas.membership.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Project or user not found' }),
      ApiForbiddenResponse({
        description: 'Only owner or admin can add members',
      }),
      ApiConflictResponse({ description: 'User is already a member' }),
    ),

  removeMember: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove a member from project',
        description:
          'Removes a member from the project. Requires owner or admin role.',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiParam({
        name: routeParams.memberId,
        description: 'User ID to remove',
      }),
      ApiNoContentResponse({ description: 'Member removed successfully' }),
      ApiNotFoundResponse({ description: 'Project or membership not found' }),
      ApiForbiddenResponse({
        description: 'Only owner or admin can remove members',
      }),
      ApiBadRequestResponse({ description: 'Cannot remove project owner' }),
    ),

  updateMemberRole: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update member role in project',
        description:
          'Updates member roles in the project. Requires owner or admin role.',
      }),
      ApiParam({ name: routeParams.id, description: 'Project ID' }),
      ApiParam({ name: routeParams.memberId, description: 'User ID' }),
      ApiOkResponse({
        description: 'Member role updated successfully',
        schema: { example: projectSwaggerSchemas.membership.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Project or membership not found' }),
      ApiForbiddenResponse({
        description: 'Only owner or admin can update roles',
      }),
    ),
};
