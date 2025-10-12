import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Swagger decorators for Statistics endpoints
 */
export const StatSwaggerDocs = {
  /**
   * GET /statistics/overview
   * Get user statistics overview
   */
  getOverview: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get user statistics overview',
        description:
          'Returns comprehensive statistics including tasks, projects, and productivity metrics for the current user',
      }),
      ApiOkResponse({
        description: 'Statistics retrieved successfully',
        schema: {
          type: 'object',
          properties: {
            tasks: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 42 },
                byStatus: {
                  type: 'object',
                  properties: {
                    NOT_STARTED: { type: 'number', example: 10 },
                    IN_PROGRESS: { type: 'number', example: 8 },
                    COMPLETED: { type: 'number', example: 20 },
                    CANCELED: { type: 'number', example: 2 },
                    DEFERRED: { type: 'number', example: 1 },
                    FOR_REVISION: { type: 'number', example: 0 },
                    REJECTED: { type: 'number', example: 1 },
                    READY_FOR_REVIEW: { type: 'number', example: 0 },
                  },
                },
                overdue: { type: 'number', example: 3 },
                dueToday: { type: 'number', example: 5 },
                dueThisWeek: { type: 'number', example: 12 },
                completionRate: { type: 'number', example: 47.62 },
              },
            },
            projects: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 5 },
                active: { type: 'number', example: 3 },
                favorite: { type: 'number', example: 2 },
              },
            },
            productivity: {
              type: 'object',
              properties: {
                completedToday: { type: 'number', example: 4 },
                completedThisWeek: { type: 'number', example: 18 },
              },
            },
          },
        },
      }),
      ApiUnauthorizedResponse({
        description: 'Authentication required',
      }),
    ),
};
