import type { Category } from '@prisma/client';

/**
 * Category response without sensitive data
 */
export type CategoryResponse = Omit<Category, 'deletedAt'>;

/**
 * Category with task count
 */
export interface CategoryWithTaskCount extends CategoryResponse {
  _count: {
    tasks: number;
  };
}

/**
 * Category name response for sidebar (minimal data with incomplete tasks count)
 */
export interface CategoryNameResponse {
  id: string;
  name: string;
  slug: string;
  incompleteTasksCount: number;
}
