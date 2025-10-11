import { UserRole, UserStatus } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser {
  user?: AuthenticatedUser;
}
