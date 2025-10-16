/**
 * Swagger response schemas for Task endpoints
 */
export const taskSwaggerSchemas = {
  // Field examples
  name: {
    description: 'Task name',
    example: 'Implement user authentication',
    minLength: 1,
    maxLength: 200,
  },
  description: {
    description: 'Detailed task description (optional)',
    example: 'Add JWT authentication with access and refresh tokens',
    maxLength: 500,
  },
  status: {
    description: 'Current task status',
    example: 'IN_PROGRESS',
    enum: [
      'NOT_STARTED',
      'IN_PROGRESS',
      'DEFERRED',
      'CANCELED',
      'COMPLETED',
      'FOR_REVISION',
      'REJECTED',
      'READY_FOR_REVIEW',
    ],
  },
  note: {
    description: 'Additional notes for the task (optional)',
    example: 'Remember to add password hashing with Argon2id',
    maxLength: 1000,
  },
  dueDate: {
    description: 'Task due date (optional)',
    example: '2025-12-31T23:59:59.000Z',
  },
  projectId: {
    description: 'ID of the project this task belongs to',
    example: 'clx1234567890',
  },
  categoryId: {
    description: 'ID of the task category (optional)',
    example: 'clx9876543210',
  },
  contactId: {
    description: 'ID of the associated contact (optional)',
    example: 'clx5555555555',
  },
  assigneeId: {
    description: 'ID of the user assigned to this task (optional)',
    example: 'clx0987654321',
  },

  // Complete objects
  task: {
    description: 'Task object',
    example: {
      id: 'clx1111111111',
      name: 'Implement user authentication',
      description: 'Add JWT authentication with access and refresh tokens',
      status: 'IN_PROGRESS',
      note: 'Remember to add password hashing with Argon2id',
      dueDate: '2025-12-31T23:59:59.000Z',
      projectId: 'clx1234567890',
      categoryId: 'clx9876543210',
      contactId: 'clx5555555555',
      creatorId: 'clx0987654321',
      assigneeId: 'clx0987654321',
      createdAt: '2025-01-10T12:00:00.000Z',
      updatedAt: '2025-01-11T15:30:00.000Z',
    },
  },

  taskWithRelations: {
    description: 'Task with related entities',
    example: {
      id: 'clx1111111111',
      name: 'Implement user authentication',
      description: 'Add JWT authentication with access and refresh tokens',
      status: 'IN_PROGRESS',
      note: 'Remember to add password hashing with Argon2id',
      dueDate: '2025-12-31T23:59:59.000Z',
      projectId: 'clx1234567890',
      categoryId: 'clx9876543210',
      contactId: 'clx5555555555',
      creatorId: 'clx0987654321',
      assigneeId: 'clx0987654321',
      createdAt: '2025-01-10T12:00:00.000Z',
      updatedAt: '2025-01-11T15:30:00.000Z',
      project: {
        id: 'clx1234567890',
        name: 'My Awesome Project',
        slug: 'my-awesome-project',
      },
      category: {
        id: 'clx9876543210',
        name: 'Backend',
        slug: 'backend',
      },
      creator: {
        id: 'clx0987654321',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      assignee: {
        id: 'clx0987654321',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      contact: {
        id: 'clx5555555555',
        name: 'Client Contact',
        email: 'client@example.com',
      },
    },
  },

  tasksList: {
    description: 'Paginated list of tasks',
    example: {
      total: 42,
      items: [
        {
          id: 'clx1111111111',
          name: 'Implement user authentication',
          description: 'Add JWT authentication with access and refresh tokens',
          status: 'IN_PROGRESS',
          note: 'Remember to add password hashing with Argon2id',
          dueDate: '2025-12-31T23:59:59.000Z',
          projectId: 'clx1234567890',
          categoryId: 'clx9876543210',
          contactId: 'clx5555555555',
          creatorId: 'clx0987654321',
          assigneeId: 'clx0987654321',
          createdAt: '2025-01-10T12:00:00.000Z',
          updatedAt: '2025-01-11T15:30:00.000Z',
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
} as const;
