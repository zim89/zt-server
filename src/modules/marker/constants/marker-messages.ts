/**
 * Centralized messages for marker module
 */
export const markerMessages = {
  marker: {
    error: {
      notFound: 'Marker not found',
      accessDenied: 'Access to marker denied',
      slugExists: 'Marker with this slug already exists for your account',
      cannotModifyDefault: 'Cannot modify default marker',
      cannotDeleteDefault: 'Cannot delete default marker',
      cannotDeleteWithTasks: 'Cannot delete marker attached to tasks',
      invalidColor: 'Invalid color format (use hex color like #FFFFFF)',
    },
    success: {
      created: 'Marker created successfully',
      updated: 'Marker updated successfully',
      deleted: 'Marker deleted successfully',
    },
  },
} as const;
