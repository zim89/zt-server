import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/shared/dto';

export class FindCategoriesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by project ID',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;
}
