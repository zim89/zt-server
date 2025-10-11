import { IsOptional, IsUUID } from 'class-validator';

/**
 * DTO for assigning/unassigning task to user
 */
export class AssignTaskDto {
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;
}
