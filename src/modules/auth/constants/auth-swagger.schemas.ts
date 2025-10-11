export const authSwaggerSchemas = {
  email: {
    description: 'User email address',
    example: 'user@example.com',
  },
  password: {
    description: 'User password (minimum 6 characters)',
    example: 'SecurePass123!',
  },
  accessToken: {
    description: 'JWT access token for API authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...',
  },
  refreshToken: {
    description: 'JWT refresh token stored in HTTP-only cookie',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0...',
  },
  user: {
    description: 'User data without sensitive information',
    example: {
      id: 'clx1a2b3c4d5e6f7g8h9i0j1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      roles: ['OWNER'],
      status: 'ACTIVE',
    },
  },
} as const;
