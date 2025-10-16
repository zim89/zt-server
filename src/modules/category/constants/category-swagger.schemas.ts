/**
 * Swagger schema examples for category DTOs
 */
export const categorySwaggerSchemas = {
  name: {
    description: 'Category name',
    example: 'Development',
    minLength: 1,
    maxLength: 100,
  },
  description: {
    description: 'Category description (optional)',
    example: 'Tasks related to software development and coding',
    maxLength: 500,
  },
  slug: {
    description: 'Unique URL-friendly identifier (auto-generated from name)',
    example: 'development',
  },
  projectId: {
    description: 'ID of the project this category belongs to',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  },
  category: {
    description: 'Complete category object',
    example: {
      id: 'clx1a2b3c4d5e6f7g8h9i0j1',
      slug: 'development',
      name: 'Development',
      description: 'Tasks related to software development and coding',
      projectId: 'clx1a2b3c4d5e6f7g8h9i0j2',
      createdAt: '2025-01-12T12:00:00Z',
      updatedAt: '2025-01-12T12:00:00Z',
      _count: {
        tasks: 8,
      },
    },
  },
  categoriesList: {
    description: 'Paginated list of categories',
    example: {
      total: 10,
      items: [
        {
          id: 'clx1a2b3c4d5e6f7g8h9i0j1',
          slug: 'development',
          name: 'Development',
          description: 'Tasks related to software development and coding',
          projectId: 'clx1a2b3c4d5e6f7g8h9i0j2',
          createdAt: '2025-01-12T12:00:00Z',
          updatedAt: '2025-01-12T12:00:00Z',
          _count: {
            tasks: 8,
          },
        },
      ],
      pagination: {
        page: 1,
        pages: 1,
        limit: 20,
        hasNext: false,
        hasPrev: false,
      },
    },
  },
} as const;
