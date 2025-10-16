import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { taskSwaggerSchemas } from '../constants';

/**
 * DTO for creating a new task
 */
export class CreateTaskDto {
  @ApiProperty(taskSwaggerSchemas.name)
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional(taskSwaggerSchemas.description)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty(taskSwaggerSchemas.status)
  @IsEnum(TaskStatus)
  status!: TaskStatus;

  @ApiPropertyOptional(taskSwaggerSchemas.note)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @ApiPropertyOptional(taskSwaggerSchemas.dueDate)
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty(taskSwaggerSchemas.projectId)
  @IsUUID()
  projectId!: string;

  @ApiPropertyOptional(taskSwaggerSchemas.categoryId)
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional(taskSwaggerSchemas.contactId)
  @IsOptional()
  @IsUUID()
  contactId?: string;

  @ApiPropertyOptional(taskSwaggerSchemas.assigneeId)
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
