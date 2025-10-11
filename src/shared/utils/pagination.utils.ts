import type { PaginatedResponse, PaginationMeta } from '../types';

/**
 * Build paginated response with metadata
 */
export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  const pages = Math.ceil(total / limit);

  const pagination: PaginationMeta = {
    page,
    pages,
    limit,
    hasNext: page < pages,
    hasPrev: page > 1,
  };

  return {
    total,
    items,
    pagination,
  };
}
