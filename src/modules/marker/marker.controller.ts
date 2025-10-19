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

import { MarkerSwaggerDocs } from './decorators';
import {
  CreateMarkerDto,
  FindMarkersQueryDto,
  FindMarkerNamesQueryDto,
  MarkerResponseDto,
  UpdateMarkerDto,
} from './dto';
import { MarkerService } from './marker.service';

@ApiTags(apiTags.markers)
@Controller(controllerPaths.markers)
@Auth()
export class MarkerController {
  constructor(private readonly markerService: MarkerService) {}

  @Post()
  @MarkerSwaggerDocs.create()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMarkerDto,
  ): Promise<MarkerResponseDto> {
    return this.markerService.create(user.id, dto);
  }

  @Get()
  @MarkerSwaggerDocs.findMany()
  async findMany(
    @Query() query: FindMarkersQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.markerService.findMany(query, user.id);
  }

  @Get('names')
  @MarkerSwaggerDocs.findNames()
  async findNames(
    @Query() query: FindMarkerNamesQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.markerService.findNames(query, user.id);
  }

  @Get(`:${routeParams.id}`)
  @MarkerSwaggerDocs.findOneById()
  async findOneById(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
  ): Promise<MarkerResponseDto> {
    return this.markerService.findOneById(id, user.id);
  }

  @Get(`slug/:${routeParams.slug}`)
  @MarkerSwaggerDocs.findOneBySlug()
  async findOneBySlug(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.slug) slug: string,
  ): Promise<MarkerResponseDto> {
    return this.markerService.findOneBySlug(slug, user.id);
  }

  @Patch(`:${routeParams.id}`)
  @MarkerSwaggerDocs.update()
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
    @Body() dto: UpdateMarkerDto,
  ): Promise<MarkerResponseDto> {
    return this.markerService.update(id, user.id, dto);
  }

  @Delete(`:${routeParams.id}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @MarkerSwaggerDocs.delete()
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param(routeParams.id) id: string,
  ): Promise<void> {
    return this.markerService.delete(id, user.id);
  }
}
