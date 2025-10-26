import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { categorySwaggerSchemas } from '../constants';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  id!: string;

  @ApiProperty(categorySwaggerSchemas.slug)
  slug!: string;

  @ApiProperty(categorySwaggerSchemas.name)
  name!: string;

  @ApiPropertyOptional(categorySwaggerSchemas.description)
  description?: string | null;

  @ApiProperty({
    description: 'User ID who owns this category',
    example: 'clx1a2b3c4d5e6f7g8h9i0j1',
  })
  userId!: string;

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
      tasks: { type: 'number', example: 8 },
    },
  })
  _count?: {
    tasks: number;
  };
}
