/**
 * Prisma query mode constants
 */
export const queryModes = {
  insensitive: 'insensitive',
  default: 'default',
} as const;

export type QueryMode = (typeof queryModes)[keyof typeof queryModes];
