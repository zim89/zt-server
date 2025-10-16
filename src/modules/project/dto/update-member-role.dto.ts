import { ApiProperty } from '@nestjs/swagger';
import { ProjectRole } from '@prisma/client';
import { IsArray, IsEnum } from 'class-validator';

import { projectSwaggerSchemas } from '../constants';

/**
 * DTO for updating member roles in a project
 */
export class UpdateMemberRoleDto {
  @ApiProperty(projectSwaggerSchemas.roles)
  @IsArray()
  @IsEnum(ProjectRole, { each: true })
  roles!: ProjectRole[];
}
