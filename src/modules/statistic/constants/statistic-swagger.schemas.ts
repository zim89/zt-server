/**
 * Swagger schemas for statistics module
 * Used in @ApiProperty decorators
 */
export const statSwaggerSchemas = {
  taskStats: {
    description: 'Task statistics',
    example: {
      total: 42,
      byStatus: {
        NOT_STARTED: 10,
        IN_PROGRESS: 8,
        COMPLETED: 20,
        CANCELED: 2,
        DEFERRED: 1,
        FOR_REVISION: 0,
        REJECTED: 1,
        READY_FOR_REVIEW: 0,
      },
      overdue: 3,
      dueToday: 5,
      dueThisWeek: 12,
      completionRate: 47.62,
    },
  },

  projectStats: {
    description: 'Project statistics',
    example: {
      total: 5,
      active: 3,
      favorite: 2,
    },
  },

  productivityStats: {
    description: 'Productivity statistics',
    example: {
      completedToday: 4,
      completedThisWeek: 18,
    },
  },

  overviewResponse: {
    description: 'Complete statistics overview',
    example: {
      tasks: {
        total: 42,
        byStatus: {
          NOT_STARTED: 10,
          IN_PROGRESS: 8,
          COMPLETED: 20,
          CANCELED: 2,
          DEFERRED: 1,
          FOR_REVISION: 0,
          REJECTED: 1,
          READY_FOR_REVIEW: 0,
        },
        overdue: 3,
        dueToday: 5,
        dueThisWeek: 12,
        completionRate: 47.62,
      },
      projects: {
        total: 5,
        active: 3,
        favorite: 2,
      },
      productivity: {
        completedToday: 4,
        completedThisWeek: 18,
      },
    },
  },
} as const;
