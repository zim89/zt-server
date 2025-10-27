import type { TaskStatus } from '@prisma/client';

/**
 * Task with selected fields (safe to return in API)
 */
export interface TaskResponse {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  note: string | null;
  dueDate: Date | null;
  project: {
    id: string;
    name: string;
    slug: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  contactId: string | null;
  creatorId: string;
  assigneeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task with related entities
 */
export interface TaskWithRelations extends TaskResponse {
  creator?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  assignee?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  contact?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  markers?: Array<{
    id: string;
    markerId: string;
    marker: {
      id: string;
      name: string;
      slug: string;
      fontColor: string | null;
      bgColor: string | null;
    };
  }>;
}
