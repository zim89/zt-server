import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { taskSwaggerSchemas } from '../constants';

/**
 * DTO for assigning/unassigning task to user
 */
export class AssignTaskDto {
  @ApiPropertyOptional(taskSwaggerSchemas.assigneeId)
  @IsOptional()
  @IsString()
  assigneeId?: string | null;
}
