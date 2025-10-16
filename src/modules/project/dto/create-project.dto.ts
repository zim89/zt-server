import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { projectSwaggerSchemas } from '../constants';

/**
 * DTO for creating a new project
 */
export class CreateProjectDto {
  @ApiProperty(projectSwaggerSchemas.name)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional(projectSwaggerSchemas.description)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional(projectSwaggerSchemas.slug)
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  slug?: string;

  @ApiPropertyOptional(projectSwaggerSchemas.isFavorite)
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiPropertyOptional(projectSwaggerSchemas.isHidden)
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
