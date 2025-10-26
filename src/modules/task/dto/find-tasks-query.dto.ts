import { TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/shared/dto';

/**
 * DTO for querying tasks with filters and pagination
 */
export class FindTasksQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  projectSlug?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  creatorId?: string;

  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isOverdue?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  hasAssignee?: boolean;
}
