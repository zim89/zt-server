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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Auth, CurrentUser } from '@/modules/auth/decorators';
import type { AuthenticatedUser } from '@/modules/auth/types';
import { apiTags, controllerPaths, routeParams } from '@/shared/constants';

import { ProjectSwaggerDocs } from './decorators';
import {
  AddMemberDto,
  CreateProjectDto,
  FindProjectsQueryDto,
  UpdateMemberRoleDto,
  UpdateProjectDto,
} from './dto';
import { ProjectService } from './project.service';

@ApiTags(apiTags.projects)
@ApiBearerAuth()
@Controller(controllerPaths.projects)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ProjectSwaggerDocs.findMany()
  @Get()
  @Auth()
  async findMany(
    @Query() query: FindProjectsQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.findMany(query, user.id);
  }

  @ProjectSwaggerDocs.findOneById()
  @Get(':id')
  @Auth()
  async findOneById(
    @Param(routeParams.id) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.findOneById(id, user.id);
  }

  @ProjectSwaggerDocs.findOneBySlug()
  @Get('slug/:slug')
  @Auth()
  async findOneBySlug(
    @Param(routeParams.slug) slug: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.findOneBySlug(slug, user.id);
  }

  @ProjectSwaggerDocs.create()
  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.create(dto, user.id);
  }

  @ProjectSwaggerDocs.update()
  @Patch(':id')
  @Auth()
  async update(
    @Param(routeParams.id) id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.update(id, dto, user.id);
  }

  @ProjectSwaggerDocs.delete()
  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param(routeParams.id) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.delete(id, user.id);
  }

  // Membership endpoints

  @ProjectSwaggerDocs.addMember()
  @Post(':id/members')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Param(routeParams.id) id: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.addMember(id, dto, user.id);
  }

  @ProjectSwaggerDocs.removeMember()
  @Delete(':id/members/:memberId')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param(routeParams.id) id: string,
    @Param(routeParams.memberId) memberId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.removeMember(id, memberId, user.id);
  }

  @ProjectSwaggerDocs.updateMemberRole()
  @Patch(':id/members/:memberId/role')
  @Auth()
  async updateMemberRole(
    @Param(routeParams.id) id: string,
    @Param(routeParams.memberId) memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.projectService.updateMemberRole(
      id,
      memberId,
      dto,
      user.id,
    );
  }
}
