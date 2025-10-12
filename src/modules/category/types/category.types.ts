import type { Category } from '@prisma/client';

/**
 * Category response without sensitive data
 */
export type CategoryResponse = Omit<Category, 'deletedAt'>;

/**
 * Category with project information
 */
export interface CategoryWithProject extends CategoryResponse {
  project: {
    id: string;
    name: string;
    slug: string;
  };
}

/**
 * Category with task count
 */
export interface CategoryWithTaskCount extends CategoryResponse {
  _count: {
    tasks: number;
  };
}
