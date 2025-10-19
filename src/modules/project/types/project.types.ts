import type { Membership, Project } from '@prisma/client';
import { ProjectRole } from '@prisma/client';

/**
 * Project with selected fields (safe to return in API)
 */
export interface ProjectResponse {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isFavorite: boolean;
  isHidden: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project with counts
 */
export interface ProjectWithCounts extends ProjectResponse {
  _count: {
    members: number;
    tasks: number;
    categories: number;
  };
}

/**
 * Project name response for sidebar (minimal data)
 */
export interface ProjectNameResponse {
  id: string;
  name: string;
  slug: string;
  isFavorite: boolean;
  isHidden: boolean;
  incompleteTasksCount: number;
}

/**
 * Project with membership information
 */
export interface ProjectWithMembership extends ProjectResponse {
  membership?: MembershipResponse;
  membersCount?: number;
}

/**
 * Membership with selected fields (safe to return in API)
 */
export interface MembershipResponse {
  id: string;
  projectId: string;
  userId: string;
  roles: ProjectRole[];
  joinedAt: Date;
}

/**
 * Project select fields for Prisma queries
 */
export const projectSelectFields = {
  id: true,
  slug: true,
  name: true,
  description: true,
  isActive: true,
  isFavorite: true,
  isHidden: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Project select fields with counts
 */
export const projectSelectFieldsWithCounts = {
  ...projectSelectFields,
  _count: {
    select: {
      members: true,
      tasks: true,
      categories: true,
    },
  },
} as const;

/**
 * Membership select fields for Prisma queries
 */
export const membershipSelectFields = {
  id: true,
  projectId: true,
  userId: true,
  roles: true,
  joinedAt: true,
} as const;

/**
 * Type guard to check if user is project owner
 */
export function isProjectOwner(project: Project, userId: string): boolean {
  return project.userId === userId;
}

/**
 * Type guard to check if user has admin role in membership
 */
export function hasAdminRole(membership: Membership): boolean {
  return (
    membership.roles.includes(ProjectRole.OWNER) ||
    membership.roles.includes(ProjectRole.ADMIN)
  );
}
