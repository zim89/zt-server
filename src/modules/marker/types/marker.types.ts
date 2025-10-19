import type { Marker } from '@prisma/client';

/**
 * Marker response without sensitive data
 */
export type MarkerResponse = Omit<Marker, 'deletedAt'>;

/**
 * Marker with task count
 */
export interface MarkerWithTaskCount extends MarkerResponse {
  _count: {
    tasks: number;
  };
}

/**
 * Marker with user information (for personal markers)
 */
export interface MarkerWithUser extends MarkerResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}

/**
 * Marker name response for sidebar (minimal data without task count)
 */
export interface MarkerNameResponse {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
  fontColor: string | null;
  bgColor: string | null;
}
