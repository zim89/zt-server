import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthResponseDto } from '../dto';

/**
 * Swagger documentation decorators for authentication endpoints
 *
 * Provides pre-configured Swagger decorators for:
 * - User registration
 * - User login
 * - Token refresh
 * - User logout
 * - User profile
 *
 * @example
 * // Use in controller
 * @AuthSwaggerDocs.register()
 * @Post('register')
 * register(@Body() dto: RegisterDto) {
 *   return this.authService.register(dto);
 * }
 */
export const AuthSwaggerDocs = {
  register: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Register a new account',
        description: 'Registers a new user account with the provided details.',
      }),
      ApiCreatedResponse({
        type: AuthResponseDto,
        description: 'User successfully registered',
      }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiConflictResponse({
        description: 'User with this email already exists',
      }),
    ),

  login: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Login to an existing account',
        description: 'Logs in a user with the provided email and password.',
      }),
      ApiOkResponse({ type: AuthResponseDto, description: 'Login successful' }),
      ApiBadRequestResponse({ description: 'Invalid input data' }),
      ApiUnauthorizedResponse({ description: 'Invalid email or password' }),
    ),

  refresh: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Refresh access token',
        description:
          'Refreshes the access token using the refresh token provided in cookies.',
      }),
      ApiOkResponse({
        type: AuthResponseDto,
        description: 'Tokens refreshed successfully',
      }),
      ApiUnauthorizedResponse({
        description: 'Refresh token is missing or invalid',
      }),
    ),

  logout: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Logout from the current session',
        description:
          'Logs out the current user and invalidates the refresh token',
      }),
      ApiOkResponse({ description: 'Successfully logged out' }),
      ApiUnauthorizedResponse({ description: 'User not authorized' }),
    ),

  profile: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get user profile',
        description: 'Returns the profile of the currently authenticated user.',
      }),
      ApiOkResponse({ description: 'User profile retrieved successfully' }),
      ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ),
};
