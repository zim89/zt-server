import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { ROLES_KEY } from '../constants';

/**
 * Low-level decorator to set required roles metadata for endpoint authorization
 *
 * @internal This decorator is used internally by @Auth() decorator
 * @param roles - One or more UserRole enum values (passed as separate arguments)
 * @returns Metadata decorator with required roles
 *
 * @remarks
 * This decorator ONLY sets metadata and does NOT provide any protection.
 * You must also add guards (@UseGuards) for actual authorization.
 *
 * **DO NOT use this decorator directly in controllers.**
 * Use @Auth() decorator instead, which combines @Roles() with guards automatically.
 *
 * @example
 * // ❌ WRONG - Don't use directly in controllers
 * @Roles(UserRole.ADMIN)
 * @Get('admin')
 * adminEndpoint() {}
 *
 * @example
 * // ✅ CORRECT - Use @Auth() decorator in controllers
 * @Auth(UserRole.ADMIN)
 * @Get('admin')
 * adminEndpoint() {}
 *
 * @see Auth - Preferred decorator for endpoint protection
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
