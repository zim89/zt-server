import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { argon2id, hash, verify } from 'argon2';
import type { Response } from 'express';

import { PrismaService } from '@/prisma';
import { cookieNames, envKeys } from '@/shared/constants';

import { authMessages } from './constants';

@Injectable()
export class RefreshTokenService {
  private readonly REFRESH_TOKEN_KEY = cookieNames.refreshToken;
  private readonly COOKIE_DOMAIN: string;
  private readonly IS_PRODUCTION: boolean;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.COOKIE_DOMAIN = configService.get<string>(envKeys.cookieDomain) ?? '';
    this.IS_PRODUCTION =
      configService.get<string>(envKeys.nodeEnv) === 'production';
  }

  async addToResponse(
    res: Response,
    refreshToken: string,
    expires: Date,
  ): Promise<void> {
    const userId = res.locals['userId'] as string | undefined;

    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException(
        authMessages.user.error.idMissingOrInvalid,
      );
    }

    // Hash the refresh token for secure storage
    const refreshTokenHash = await hash(refreshToken, { type: argon2id });

    // Remove any existing active sessions for this user (single session policy)
    await this.prismaService.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: { isActive: false },
    });

    // Save new session to database
    await this.prismaService.session.create({
      data: {
        userId,
        refreshToken: refreshTokenHash,
        expiresAt: expires,
        clientIp: res.req.ip ?? 'unknown',
        userAgent: res.req.get('User-Agent') ?? 'unknown',
      },
    });

    // Set HTTP-only cookie
    res.cookie(
      this.REFRESH_TOKEN_KEY,
      refreshToken,
      this.getCookieConfig(expires),
    );
  }

  async validate(userId: string, refreshToken: string): Promise<boolean> {
    try {
      const session = await this.prismaService.session.findFirst({
        where: {
          userId,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session?.refreshToken) {
        return false;
      }

      return await verify(session.refreshToken, refreshToken);
    } catch {
      return false;
    }
  }

  async invalidate(userId: string, refreshToken: string): Promise<void> {
    try {
      const refreshTokenHash = await hash(refreshToken, { type: argon2id });

      await this.prismaService.session.updateMany({
        where: {
          userId,
          refreshToken: refreshTokenHash,
          isActive: true,
        },
        data: { isActive: false },
      });
    } catch {
      // Don't throw error to avoid breaking logout flow
    }
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    try {
      await this.prismaService.session.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: { isActive: false },
      });
    } catch {
      // Don't throw error to avoid breaking logout flow
    }
  }

  removeFromResponse(res: Response): void {
    res.clearCookie(this.REFRESH_TOKEN_KEY, this.getCookieConfig());
  }

  private getCookieConfig(expires?: Date) {
    return {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: this.IS_PRODUCTION,
      sameSite: this.IS_PRODUCTION ? ('strict' as const) : ('lax' as const),
      ...(expires && { expires }),
    };
  }
}
