import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

import { ROLES_KEY } from '../constants';
import type { RequestWithUser } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user?.roles) {
      return false;
    }

    return requiredRoles.some((requiredRole) =>
      user.roles.includes(requiredRole),
    );
  }
}
