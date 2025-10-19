import { IsOptional, IsString } from 'class-validator';

/**
 * DTO for querying category names (for sidebar)
 */
export class FindCategoryNamesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
