import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { taskSwaggerSchemas } from '../constants';

/**
 * DTO for assigning/unassigning task to user
 */
export class AssignTaskDto {
  @ApiPropertyOptional(taskSwaggerSchemas.assigneeId)
  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;
}
