/**
 * Centralized messages for statistics module
 */
export const statMessages = {
  stats: {
    error: {
      forbidden: 'Access to statistics denied',
      calculationFailed: 'Failed to calculate statistics',
    },
    success: {
      retrieved: 'Statistics retrieved successfully',
    },
  },
} as const;
