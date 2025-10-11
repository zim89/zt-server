/**
 * Route parameter names for @Param() decorator
 * Prevents hardcoded strings in controllers
 */
export const routeParams = {
  id: 'id',
  slug: 'slug',
  memberId: 'memberId',
  userId: 'userId',
  projectId: 'projectId',
  taskId: 'taskId',
  categoryId: 'categoryId',
  contactId: 'contactId',
  markerId: 'markerId',
} as const;

export type RouteParam = (typeof routeParams)[keyof typeof routeParams];
