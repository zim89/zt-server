/**
 * Centralized messages for category module
 */
export const categoryMessages = {
  category: {
    error: {
      notFound: 'Category not found',
      accessDenied: 'Access to category denied',
      slugExists: 'Category with this slug already exists',
      nameRequired: 'Category name is required',
      projectNotFound: 'Project not found',
      hasActiveTasks: 'Cannot delete category with active tasks',
    },
    success: {
      created: 'Category created successfully',
      updated: 'Category updated successfully',
      deleted: 'Category deleted successfully',
    },
  },
  project: {
    error: {
      notFound: 'Project not found',
      accessDenied: 'Access to project denied',
    },
  },
} as const;
