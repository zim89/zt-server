import {
  createParamDecorator,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { authMessages } from '../constants';
import type { AuthenticatedUser } from '../types';

/**
 * Decorator to extract the current authenticated user from the request
 * @param data - Optional specific field to extract from user object
 * @param ctx - Execution context
 * @returns User object or specific field value
 * @throws UnauthorizedException if user is not authenticated
 *
 * @example
 * // Get full user object
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 *
 * @example
 * // Get specific field
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedException(authMessages.user.error.notAuthenticated);
    }

    return data ? user[data] : user;
  },
);
