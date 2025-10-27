/**
 * Prisma select fields for Task queries
 * Used to explicitly select only required fields
 */

/**
 * Task fields with project and category relations
 * This is now the default select for all task queries
 */
export const taskSelectFields = {
  id: true,
  name: true,
  description: true,
  status: true,
  note: true,
  dueDate: true,
  project: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  contactId: true,
  creatorId: true,
  assigneeId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Task fields with all relations
 */
export const taskSelectWithRelations = {
  ...taskSelectFields,
  creator: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  assignee: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  },
  contact: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  markers: {
    select: {
      id: true,
      markerId: true,
      marker: {
        select: {
          id: true,
          name: true,
          slug: true,
          fontColor: true,
          bgColor: true,
        },
      },
    },
  },
} as const;
