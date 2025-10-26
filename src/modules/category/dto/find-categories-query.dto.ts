import { PaginationQueryDto } from '@/shared/dto';

export class FindCategoriesQueryDto extends PaginationQueryDto {
  // No additional filters needed - categories are now global
}
