/**
 * Swagger schema examples for marker DTOs
 */
export const markerSwaggerSchemas = {
  name: {
    description: 'Marker name',
    example: 'Important',
    minLength: 1,
    maxLength: 50,
  },
  fontColor: {
    description: 'Font color in hex format (optional)',
    example: '#FFFFFF',
    pattern: '^#[0-9A-Fa-f]{6}$',
  },
  bgColor: {
    description: 'Background color in hex format (optional)',
    example: '#EF4444',
    pattern: '^#[0-9A-Fa-f]{6}$',
  },
  slug: {
    description: 'Unique URL-friendly identifier (auto-generated from name)',
    example: 'important',
  },
  isDefault: {
    description: 'Whether this is a default marker (available to all users)',
    example: false,
  },
  userId: {
    description: 'User ID who owns this marker (null for default markers)',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  },
  marker: {
    description: 'Complete marker object',
    example: {
      id: 'clx1a2b3c4d5e6f7g8h9i0j1',
      slug: 'important',
      name: 'Important',
      fontColor: '#FFFFFF',
      bgColor: '#EF4444',
      isDefault: false,
      userId: 'clx1a2b3c4d5e6f7g8h9i0j2',
      createdAt: '2025-01-12T12:00:00Z',
      updatedAt: '2025-01-12T12:00:00Z',
    },
  },
  defaultMarker: {
    description: 'Default marker (available to all users)',
    example: {
      id: 'clx1111111111',
      slug: 'urgent',
      name: 'Urgent',
      fontColor: '#FFFFFF',
      bgColor: '#DC2626',
      isDefault: true,
      userId: null,
      createdAt: '2025-01-12T12:00:00Z',
      updatedAt: '2025-01-12T12:00:00Z',
    },
  },
} as const;
