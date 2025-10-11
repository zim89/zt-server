import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import { argon2id, hash, verify } from 'argon2';
import type { Request, Response } from 'express';

import { PrismaService } from '@/prisma';
import { cookieNames, envKeys } from '@/shared/constants';

import { authMessages } from './constants';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import { RefreshTokenService } from './refresh-token.service';
import type { JwtPayload, AuthenticatedUser } from './types';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly JWT_SECRET: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly configService: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL =
      configService.get<string>(envKeys.jwtAccessExpires) ?? '7d';
    this.JWT_REFRESH_TOKEN_TTL =
      configService.get<string>(envKeys.jwtRefreshExpires) ?? '30d';
    this.JWT_SECRET = configService.getOrThrow<string>(envKeys.jwtSecret);
  }

  async register(res: Response, dto: RegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException(authMessages.user.error.alreadyExists);
    }

    // Hash password
    const hashedPassword = await hash(dto.password, { type: argon2id });

    // Create firstName from email (before @)
    const firstName = dto.email.split('@')[0];

    // Create user
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName: '',
        emailVerified: true,
        status: UserStatus.ACTIVE,
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.auth(res, user);
  }

  async login(res: Response, dto: LoginDto): Promise<AuthResponseDto> {
    // Find user
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        authMessages.user.error.invalidCredentials,
      );
    }

    // Verify password
    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        authMessages.user.error.invalidCredentials,
      );
    }

    // Check user status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(authMessages.user.error.accountNotActive);
    }

    // Update lastLoginAt
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return this.auth(res, userWithoutPassword);
  }

  async refresh(req: Request, res: Response): Promise<AuthResponseDto> {
    const token = req.cookies[cookieNames.refreshToken] as string | undefined;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new UnauthorizedException(
        authMessages.token.error.refreshTokenMissing,
      );
    }

    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException(
        authMessages.token.error.invalidOrExpired,
      );
    }

    const isValid = await this.refreshTokenService.validate(payload.sub, token);

    if (!isValid) {
      throw new UnauthorizedException(
        authMessages.token.error.invalidOrExpired,
      );
    }

    // Find user
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException(authMessages.user.error.notFoundOrInactive);
    }

    return this.auth(res, user);
  }

  async logout(res: Response, userId: string) {
    const cookies = res.req.cookies as Record<string, string> | undefined;
    const token = cookies?.[cookieNames.refreshToken];

    if (token) {
      await this.refreshTokenService.invalidate(userId, token);
    }

    this.refreshTokenService.removeFromResponse(res);

    return { message: authMessages.session.success.loggedOut };
  }

  async logoutAllDevices(res: Response, userId: string) {
    await this.refreshTokenService.invalidateAllSessions(userId);
    this.refreshTokenService.removeFromResponse(res);
    return { message: authMessages.session.success.loggedOutAllDevices };
  }

  async validateUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return user;
  }

  async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roles: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(authMessages.user.error.notFound);
    }

    return user;
  }

  private async auth(
    res: Response,
    user: AuthenticatedUser,
  ): Promise<AuthResponseDto> {
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.roles,
    );

    res.locals['userId'] = user.id;

    await this.refreshTokenService.addToResponse(
      res,
      refreshToken,
      new Date(Date.now() + this.parseTimeToMs(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return {
      accessToken,
      user,
    };
  }

  private generateTokens(userId: string, email: string, roles: UserRole[]) {
    const payload: JwtPayload = { sub: userId, email, roles };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload);

    return { accessToken, refreshToken };
  }

  private parseTimeToMs(time: string): number {
    const match = time.match(/^(\d+)([dhms])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      case 's':
        return value * 1000;
      default:
        return 7 * 24 * 60 * 60 * 1000;
    }
  }
}
