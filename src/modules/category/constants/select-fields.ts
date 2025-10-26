/**
 * Prisma select fields for Category queries
 * Used to explicitly select only required fields
 */

/**
 * Basic category fields (without relations)
 */
export const categorySelectFields = {
  id: true,
  slug: true,
  name: true,
  description: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Category select fields with task count
 */
export const categorySelectFieldsWithCount = {
  ...categorySelectFields,
  _count: {
    select: {
      tasks: true,
    },
  },
} as const;
