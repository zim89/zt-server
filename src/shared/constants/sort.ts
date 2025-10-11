/**
 * Sort order constants for query parameters
 */
export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
} as const;

export type SortOrder = (typeof sortOrders)[keyof typeof sortOrders];

/**
 * Available sort fields for entities
 */
export const sortFields = {
  createdAt: 'createdAt',
} as const;

export type SortField = (typeof sortFields)[keyof typeof sortFields];

/**
 * Pagination defaults
 */
export const paginationDefaults = {
  page: 1,
  limit: 20,
  maxLimit: 100,
  minLimit: 1,
} as const;
