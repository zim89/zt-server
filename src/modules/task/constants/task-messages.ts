/**
 * Centralized messages for Task module
 */
export const taskMessages = {
  task: {
    error: {
      notFound: 'Task not found',
      accessDenied: 'You do not have permission to access this task',
      invalidStatus: 'Invalid task status',
      projectRequired: 'Project ID is required',
      projectNotFound: 'Project not found',
      categoryNotFound: 'Category not found',
      contactNotFound: 'Contact not found',
    },
    success: {
      created: 'Task created successfully',
      updated: 'Task updated successfully',
      deleted: 'Task deleted successfully',
      statusUpdated: 'Task status updated successfully',
    },
  },
  assignment: {
    error: {
      userNotFound: 'User not found for assignment',
      userNotInProject: 'User is not a member of the project',
      alreadyAssigned: 'Task is already assigned to this user',
    },
    success: {
      assigned: 'Task assigned successfully',
      unassigned: 'Task unassigned successfully',
    },
  },
  marker: {
    error: {
      notFound: 'Marker not found',
      alreadyAdded: 'Marker is already added to this task',
      notAttached: 'Marker is not attached to this task',
    },
    success: {
      added: 'Marker added to task successfully',
      removed: 'Marker removed from task successfully',
    },
  },
} as const;
