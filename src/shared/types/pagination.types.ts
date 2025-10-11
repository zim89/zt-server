/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  total: number; // Total items in database (all pages)
  items: T[]; // Items in current page (items.length = count)
  pagination: PaginationMeta;
}
