import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'cuid123', description: 'User ID' })
  id!: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email!: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName!: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName!: string;

  @ApiProperty({
    example: ['OWNER'],
    description: 'User roles',
    isArray: true,
    enum: UserRole,
  })
  roles!: UserRole[];

  @ApiProperty({
    example: 'ACTIVE',
    description: 'User status',
    enum: UserStatus,
  })
  status!: UserStatus;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken!: string;

  @ApiProperty({ type: UserResponseDto, description: 'User data' })
  user!: UserResponseDto;
}
