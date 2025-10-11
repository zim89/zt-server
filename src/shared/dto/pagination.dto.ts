import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import {
  paginationDefaults,
  sortFields,
  sortOrders,
  type SortOrder,
} from '../constants';

/**
 * Base pagination and filtering DTO for query parameters
 */
export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(paginationDefaults.minLimit)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = paginationDefaults.page;

  @IsOptional()
  @IsInt()
  @Min(paginationDefaults.minLimit)
  @Max(paginationDefaults.maxLimit)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = paginationDefaults.limit;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = sortFields.createdAt;

  @IsOptional()
  @IsEnum(sortOrders)
  sortOrder?: SortOrder = sortOrders.desc;
}
