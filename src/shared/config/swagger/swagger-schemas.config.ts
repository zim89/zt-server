import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTP статус код' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Описание ошибки' })
  message: string;

  @ApiProperty({ example: 'Validation failed', description: 'Детали ошибки' })
  error: string;
}

export class ValidationErrorDto {
  @ApiProperty({ example: 'email', description: 'Поле с ошибкой' })
  field: string;

  @ApiProperty({
    example: 'Email должен быть валидным',
    description: 'Сообщение об ошибке',
  })
  message: string;
}

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Номер страницы' })
  page: number;

  @ApiProperty({ example: 10, description: 'Количество элементов на странице' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Общее количество элементов' })
  total: number;

  @ApiProperty({ example: 10, description: 'Общее количество страниц' })
  totalPages: number;
}
