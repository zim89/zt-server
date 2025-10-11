/**
 * Centralized messages for Project module
 */
export const projectMessages = {
  project: {
    error: {
      notFound: 'Project not found',
      alreadyExists: 'Project with this slug already exists',
      forbidden: 'You do not have permission to access this project',
      cannotDelete: 'Cannot delete project with active tasks',
      invalidSlug: 'Invalid project slug format',
    },
    success: {
      created: 'Project created successfully',
      updated: 'Project updated successfully',
      deleted: 'Project deleted successfully',
    },
  },
  membership: {
    error: {
      notFound: 'Membership not found',
      alreadyExists: 'User is already a member of this project',
      cannotRemoveOwner: 'Cannot remove project owner',
      userNotFound: 'User not found',
    },
    success: {
      added: 'Member added successfully',
      removed: 'Member removed successfully',
      updated: 'Member role updated successfully',
    },
  },
} as const;
