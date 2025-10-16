/**
 * Prisma select fields for Marker queries
 * Used to explicitly select only required fields
 */

/**
 * Basic marker fields (without relations)
 */
export const markerSelectFields = {
  id: true,
  slug: true,
  name: true,
  fontColor: true,
  bgColor: true,
  isDefault: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Marker select fields with task count
 */
export const markerSelectFieldsWithCount = {
  ...markerSelectFields,
  _count: {
    select: {
      tasks: true,
    },
  },
} as const;
