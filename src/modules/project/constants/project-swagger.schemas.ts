/**
 * Swagger response schemas for Projects endpoints
 */
export const projectSwaggerSchemas = {
  project: {
    example: {
      id: 'clx1234567890',
      slug: 'my-awesome-project',
      name: 'My Awesome Project',
      description: 'A project for managing awesome tasks',
      isActive: true,
      isFavorite: false,
      isHidden: false,
      userId: 'clx0987654321',
      createdAt: '2025-01-10T12:00:00.000Z',
      updatedAt: '2025-01-10T12:00:00.000Z',
    },
  },
  projectsList: {
    example: {
      total: 42,
      items: [
        {
          id: 'clx1234567890',
          slug: 'my-awesome-project',
          name: 'My Awesome Project',
          description: 'A project for managing awesome tasks',
          isActive: true,
          isFavorite: false,
          isHidden: false,
          userId: 'clx0987654321',
          createdAt: '2025-01-10T12:00:00.000Z',
          updatedAt: '2025-01-10T12:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        pages: 3,
        limit: 20,
        hasNext: true,
        hasPrev: false,
      },
    },
  },
  membership: {
    example: {
      id: 'clx1111111111',
      projectId: 'clx1234567890',
      userId: 'clx0987654321',
      roles: ['MEMBER'],
      joinedAt: '2025-01-10T12:00:00.000Z',
    },
  },
} as const;
