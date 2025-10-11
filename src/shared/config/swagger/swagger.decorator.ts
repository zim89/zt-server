import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiResponseDto<T>(
  status: number,
  description: string,
  type?: Type<T>,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type,
      ...options,
    }),
  );
}

export function ApiOkResponseDto<T>(description: string, type?: Type<T>) {
  return ApiResponseDto(200, description, type);
}

export function ApiCreatedResponseDto<T>(description: string, type?: Type<T>) {
  return ApiResponseDto(201, description, type);
}

export function ApiBadRequestResponseDto(
  description: string = 'Неверные данные',
) {
  return ApiResponseDto(400, description, undefined, {
    description: 'Ошибка валидации или неверные параметры',
  });
}

export function ApiUnauthorizedResponseDto(
  description: string = 'Не авторизован',
) {
  return ApiResponseDto(401, description, undefined, {
    description: 'Требуется авторизация',
  });
}

export function ApiForbiddenResponseDto(
  description: string = 'Доступ запрещен',
) {
  return ApiResponseDto(403, description, undefined, {
    description: 'Недостаточно прав доступа',
  });
}

export function ApiNotFoundResponseDto(description: string = 'Не найдено') {
  return ApiResponseDto(404, description, undefined, {
    description: 'Ресурс не найден',
  });
}

export function ApiConflictResponseDto(description: string = 'Конфликт') {
  return ApiResponseDto(409, description, undefined, {
    description: 'Конфликт данных',
  });
}
