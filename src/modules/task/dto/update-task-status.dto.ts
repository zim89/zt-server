import { TaskStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

/**
 * DTO for updating task status
 */
export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
