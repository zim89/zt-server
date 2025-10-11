import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 *
 * Validates JWT tokens and authenticates users.
 * Extends Passport's AuthGuard with 'jwt' strategy.
 *
 * @example
 * // Protect endpoint with JWT authentication
 * @UseGuards(JwtGuard)
 * @Get('protected')
 * getProtectedData() {
 *   return 'This endpoint requires authentication';
 * }
 *
 * @note
 * Prefer using @Auth() decorator instead of @UseGuards(JwtGuard) directly.
 */
export class JwtGuard extends AuthGuard('jwt') {}
