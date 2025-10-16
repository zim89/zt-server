import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { markerSwaggerSchemas } from '../constants';

export class MarkerResponseDto {
  @ApiProperty({
    description: 'Marker ID',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  id!: string;

  @ApiProperty(markerSwaggerSchemas.slug)
  slug!: string;

  @ApiProperty(markerSwaggerSchemas.name)
  name!: string;

  @ApiPropertyOptional(markerSwaggerSchemas.fontColor)
  fontColor?: string | null;

  @ApiPropertyOptional(markerSwaggerSchemas.bgColor)
  bgColor?: string | null;

  @ApiProperty(markerSwaggerSchemas.isDefault)
  isDefault!: boolean;

  @ApiPropertyOptional(markerSwaggerSchemas.userId)
  userId?: string | null;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-01-12T12:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-01-12T12:00:00Z',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'Count of related entities',
    type: 'object',
    properties: {
      tasks: { type: 'number', example: 12 },
    },
  })
  _count?: {
    tasks: number;
  };
}
