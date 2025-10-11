import { ProjectRole } from '@prisma/client';
import { IsArray, IsEnum } from 'class-validator';

/**
 * DTO for updating member roles in a project
 */
export class UpdateMemberRoleDto {
  @IsArray()
  @IsEnum(ProjectRole, { each: true })
  roles!: ProjectRole[];
}
