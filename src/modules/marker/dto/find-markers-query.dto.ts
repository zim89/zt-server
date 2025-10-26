import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/shared/dto';

export class FindMarkersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by default markers (available to all users)',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value as boolean;
  })
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by user ID (admin only)',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
