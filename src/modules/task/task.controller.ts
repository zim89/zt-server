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

import { TaskSwaggerDocs } from './decorators';
import type {
  AssignTaskDto,
  CreateTaskDto,
  FindTasksQueryDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto';
import { TaskService } from './task.service';

@ApiTags(apiTags.tasks)
@ApiBearerAuth()
@Controller(controllerPaths.tasks)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @TaskSwaggerDocs.findMany()
  @Get()
  @Auth()
  async findMany(
    @Query() query: FindTasksQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.findMany(query, user.id);
  }

  @TaskSwaggerDocs.findOneById()
  @Get(':id')
  @Auth()
  async findOneById(
    @Param(routeParams.id) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.findOneById(id, user.id);
  }

  @TaskSwaggerDocs.create()
  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.create(dto, user.id);
  }

  @TaskSwaggerDocs.update()
  @Patch(':id')
  @Auth()
  async update(
    @Param(routeParams.id) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.update(id, dto, user.id);
  }

  @TaskSwaggerDocs.delete()
  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param(routeParams.id) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.delete(id, user.id);
  }

  // Special task operations

  @TaskSwaggerDocs.updateStatus()
  @Patch(':id/status')
  @Auth()
  async updateStatus(
    @Param(routeParams.id) id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.updateStatus(id, dto, user.id);
  }

  @TaskSwaggerDocs.assignToUser()
  @Patch(':id/assign')
  @Auth()
  async assignToUser(
    @Param(routeParams.id) id: string,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.assignToUser(id, dto, user.id);
  }

  @TaskSwaggerDocs.addMarker()
  @Post(':id/markers/:markerId')
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  async addMarker(
    @Param(routeParams.id) id: string,
    @Param(routeParams.markerId) markerId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.addMarker(id, markerId, user.id);
  }

  @TaskSwaggerDocs.removeMarker()
  @Delete(':id/markers/:markerId')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMarker(
    @Param(routeParams.id) id: string,
    @Param(routeParams.markerId) markerId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.taskService.removeMarker(id, markerId, user.id);
  }
}
