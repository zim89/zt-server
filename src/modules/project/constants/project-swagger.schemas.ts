/**
 * Swagger schemas for Projects endpoints
 */
export const projectSwaggerSchemas = {
  // DTO field schemas
  name: {
    description: 'Project name',
    example: 'My Awesome Project',
    minLength: 1,
    maxLength: 100,
  },
  description: {
    description: 'Project description (optional)',
    example: 'A project for managing awesome tasks',
    maxLength: 500,
  },
  slug: {
    description:
      'Unique URL-friendly identifier (auto-generated from name if not provided)',
    example: 'my-awesome-project',
    minLength: 3,
    maxLength: 150,
  },
  isFavorite: {
    description: 'Whether the project is marked as favorite',
    example: false,
  },
  isHidden: {
    description: 'Whether the project is hidden',
    example: false,
  },
  userId: {
    description: 'User ID to add as a member',
    example: 'clx0987654321',
  },
  roles: {
    description: 'User roles in the project',
    example: ['MEMBER'],
    enum: ['OWNER', 'ADMIN', 'MEMBER'],
  },

  // Response schemas
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
      _count: {
        members: 3,
        tasks: 15,
        categories: 4,
      },
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
          _count: {
            members: 3,
            tasks: 15,
            categories: 4,
          },
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
