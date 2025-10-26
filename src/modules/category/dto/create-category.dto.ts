import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { categorySwaggerSchemas } from '../constants';

export class CreateCategoryDto {
  @ApiProperty(categorySwaggerSchemas.name)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional(categorySwaggerSchemas.description)
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
