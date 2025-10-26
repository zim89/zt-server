import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
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

import { taskSwaggerSchemas } from '../constants';

/**
 * Swagger documentation decorators for task endpoints
 *
 * Provides pre-configured Swagger decorators for all task operations
 *
 * @example
 * @TaskSwaggerDocs.findMany()
 * @Get()
 * findMany(@Query() query: FindTasksQueryDto) {
 *   return this.taskService.findMany(query);
 * }
 */
export const TaskSwaggerDocs = {
  findMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get all tasks with pagination',
        description:
          'Returns paginated list of tasks with optional filters and search',
      }),
      ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
      ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search in task name or description',
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
      ApiQuery({
        name: 'projectSlug',
        required: false,
        type: String,
        description: 'Filter by project slug',
      }),
      ApiQuery({
        name: 'status',
        required: false,
        enum: [
          'NOT_STARTED',
          'IN_PROGRESS',
          'DEFERRED',
          'CANCELED',
          'COMPLETED',
          'FOR_REVISION',
          'REJECTED',
          'READY_FOR_REVIEW',
        ],
        description: 'Filter by status',
      }),
      ApiQuery({
        name: 'assigneeId',
        required: false,
        type: String,
        description: 'Filter by assignee',
      }),
      ApiQuery({
        name: 'categorySlug',
        required: false,
        type: String,
        description: 'Filter by category slug',
      }),
      ApiQuery({
        name: 'contactId',
        required: false,
        type: String,
        description: 'Filter by contact',
      }),
      ApiQuery({
        name: 'creatorId',
        required: false,
        type: String,
        description: 'Filter by creator',
      }),
      ApiQuery({
        name: 'dueDateFrom',
        required: false,
        type: String,
        description: 'Filter by due date from (ISO 8601)',
      }),
      ApiQuery({
        name: 'dueDateTo',
        required: false,
        type: String,
        description: 'Filter by due date to (ISO 8601)',
      }),
      ApiQuery({
        name: 'isOverdue',
        required: false,
        type: Boolean,
        description: 'Filter overdue tasks',
      }),
      ApiQuery({
        name: 'hasAssignee',
        required: false,
        type: Boolean,
        description: 'Filter tasks with/without assignee',
      }),
      ApiOkResponse({
        description: 'Tasks retrieved successfully',
        schema: { example: taskSwaggerSchemas.tasksList.example },
      }),
    ),

  findOneById: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get task by ID',
        description: 'Returns a single task by its unique identifier',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiOkResponse({
        description: 'Task retrieved successfully',
        schema: { example: taskSwaggerSchemas.task.example },
      }),
      ApiNotFoundResponse({ description: 'Task not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to project',
      }),
    ),

  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new task',
        description: 'Creates a new task in the specified project',
      }),
      ApiCreatedResponse({
        description: 'Task created successfully',
        schema: { example: taskSwaggerSchemas.task.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Project not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to project',
      }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a task',
        description: 'Updates task details. Requires creator or project admin.',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiOkResponse({
        description: 'Task updated successfully',
        schema: { example: taskSwaggerSchemas.task.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Task not found' }),
      ApiForbiddenResponse({
        description: 'Only creator or project admin can update task',
      }),
    ),

  delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a task',
        description: 'Deletes a task. Requires creator or project admin role.',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiNoContentResponse({ description: 'Task deleted successfully' }),
      ApiNotFoundResponse({ description: 'Task not found' }),
      ApiForbiddenResponse({
        description: 'Only creator or project admin can delete task',
      }),
    ),

  updateStatus: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update task status',
        description: 'Updates the status of a task',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiOkResponse({
        description: 'Task status updated successfully',
        schema: { example: taskSwaggerSchemas.task.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid status value' }),
      ApiNotFoundResponse({ description: 'Task not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to task',
      }),
    ),

  assignToUser: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Assign task to user',
        description: 'Assigns or unassigns a task to/from a user',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiOkResponse({
        description: 'Task assigned successfully',
        schema: { example: taskSwaggerSchemas.task.example },
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiNotFoundResponse({ description: 'Task or user not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to task',
      }),
    ),

  addMarker: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Add marker to task',
        description: 'Attaches a marker to the task',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiParam({ name: routeParams.markerId, description: 'Marker ID' }),
      ApiCreatedResponse({
        description: 'Marker added to task successfully',
      }),
      ApiNotFoundResponse({ description: 'Task or marker not found' }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to task',
      }),
      ApiBadRequestResponse({ description: 'Marker already added to task' }),
    ),

  removeMarker: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove marker from task',
        description: 'Detaches a marker from the task',
      }),
      ApiParam({ name: routeParams.id, description: 'Task ID' }),
      ApiParam({ name: routeParams.markerId, description: 'Marker ID' }),
      ApiNoContentResponse({
        description: 'Marker removed from task successfully',
      }),
      ApiNotFoundResponse({
        description: 'Task, marker or attachment not found',
      }),
      ApiForbiddenResponse({
        description: 'Access forbidden - no access to task',
      }),
    ),
};
