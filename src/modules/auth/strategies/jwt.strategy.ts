import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserStatus } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { envKeys } from '@/shared/constants';

import { AuthService } from '../auth.service';
import { authMessages } from '../constants';
import type { AuthenticatedUser, JwtPayload } from '../types';

/**
 * JWT Strategy for Passport authentication
 *
 * Validates JWT tokens and extracts user information.
 * Used by JwtGuard to authenticate requests.
 *
 * @example
 * // Automatically used by JwtGuard or @Auth() decorator
 * @Auth()
 * @Get('protected')
 * getProtectedData(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(envKeys.jwtSecret),
      algorithms: ['HS256'],
    });
  }

  /**
   * Validates JWT payload and returns user data
   * @param payload - JWT payload containing user ID, email and roles
   * @returns Authenticated user data
   * @throws UnauthorizedException if user not found or inactive
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    try {
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException(authMessages.user.error.notFound);
      }

      // Additional validation checks
      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException(
          authMessages.user.error.accountNotActive,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(authMessages.token.error.invalid);
    }
  }
}
