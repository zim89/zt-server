import { ProjectRole } from '@prisma/client';
import { IsArray, IsEnum, IsString } from 'class-validator';

/**
 * DTO for adding a member to a project
 */
export class AddMemberDto {
  @IsString()
  userId!: string;

  @IsArray()
  @IsEnum(ProjectRole, { each: true })
  roles?: ProjectRole[] = [ProjectRole.MEMBER];
}
