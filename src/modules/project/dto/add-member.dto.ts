import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import { IsArray, IsEnum, IsString } from 'class-validator';

import { projectSwaggerSchemas } from '../constants';

/**
 * DTO for adding a member to a project
 */
export class AddMemberDto {
  @ApiProperty(projectSwaggerSchemas.userId)
  @IsString()
  userId!: string;

  @ApiPropertyOptional(projectSwaggerSchemas.roles)
  @IsArray()
  @IsEnum(ProjectRole, { each: true })
  roles?: ProjectRole[] = [ProjectRole.MEMBER];
}
