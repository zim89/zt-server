import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { Auth, CurrentUser, AuthSwaggerDocs } from './decorators';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';
import type { AuthenticatedUser } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AuthSwaggerDocs.register()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(res, dto);
  }

  @AuthSwaggerDocs.login()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.login(res, dto);
  }

  @AuthSwaggerDocs.refresh()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return await this.authService.refresh(req, res);
  }

  @AuthSwaggerDocs.logout()
  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(res, userId);
  }

  @AuthSwaggerDocs.logout()
  @Post('logout-all')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async logoutAllDevices(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logoutAllDevices(res, userId);
  }

  @AuthSwaggerDocs.profile()
  @Get('profile')
  @Auth()
  getProfile(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}
