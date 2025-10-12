import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { markerSwaggerSchemas } from '../constants';

export class CreateMarkerDto {
  @ApiProperty(markerSwaggerSchemas.name)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiPropertyOptional(markerSwaggerSchemas.fontColor)
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Font color must be a valid hex color (e.g., #FFFFFF)',
  })
  fontColor?: string;

  @ApiPropertyOptional(markerSwaggerSchemas.bgColor)
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Background color must be a valid hex color (e.g., #000000)',
  })
  bgColor?: string;
}
