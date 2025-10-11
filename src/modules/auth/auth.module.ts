import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '@/prisma';
import { getJwtConfig } from '@/shared/config/jwt.config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
