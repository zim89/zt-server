import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { JwtGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';

/**
 * Decorator to protect endpoints with authentication and role-based authorization
 * @param roles - Single role, array of roles, or empty for default OWNER role
 * @returns Combined decorators for authentication and authorization
 *
 * @example
 * // Default protection (OWNER role)
 * @Get('profile')
 * @Auth()
 * getProfile() {
 *   return 'Protected endpoint';
 * }
 *
 * @example
 * // Specific role
 * @Get('admin')
 * @Auth(UserRole.ADMIN)
 * getAdminData() {
 *   return 'Admin only';
 * }
 *
 * @example
 * // Multiple roles
 * @Get('moderator')
 * @Auth([UserRole.MEMBER, UserRole.ADMIN])
 * getModeratorData() {
 *   return 'Member or Admin';
 * }
 */
export function Auth(roles: UserRole | UserRole[] = UserRole.OWNER) {
  const roleArray = Array.isArray(roles) ? roles : [roles];

  return applyDecorators(
    Roles(...roleArray),
    UseGuards(JwtGuard, RolesGuard),
    ApiBearerAuth('JWT-auth'),
  );
}
