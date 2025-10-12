import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '@/modules/auth';
import { Auth, CurrentUser } from '@/modules/auth';
import { apiTags, controllerPaths, routeParams } from '@/shared/constants';

import { CategoryService } from './category.service';
import { CategorySwaggerDocs } from './decorators';
import {
  CategoryResponseDto,
  CreateCategoryDto,
  FindCategoriesQueryDto,
  UpdateCategoryDto,
} from './dto';

@ApiTags(apiTags.categories)
@Controller(controllerPaths.categories)
@Auth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @CategorySwaggerDocs.create()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.create(user.id, dto);
  }

  @Get()
  @CategorySwaggerDocs.findMany()
  async findMany(@Query() query: FindCategoriesQueryDto) {
    return this.categoryService.findMany(query);
  }

  @Get(`:${routeParams.id}`)
  @CategorySwaggerDocs.findOneById()
  async findOneById(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOneById(id, user.id);
  }

  @Get(`slug/:${routeParams.slug}`)
  @CategorySwaggerDocs.findOneBySlug()
  async findOneBySlug(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.slug) slug: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOneBySlug(slug, user.id);
  }

  @Patch(`:${routeParams.id}`)
  @CategorySwaggerDocs.update()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.update(id, user.id, dto);
  }

  @Delete(`:${routeParams.id}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @CategorySwaggerDocs.delete()
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
  ): Promise<void> {
    return this.categoryService.delete(id, user.id);
  }
}
