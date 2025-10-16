import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

import { taskSwaggerSchemas } from '../constants';

/**
 * DTO for updating task status
 */
export class UpdateTaskStatusDto {
  @ApiProperty(taskSwaggerSchemas.status)
  @IsEnum(TaskStatus)
  status!: TaskStatus;
}
