import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { AuthenticatedUser } from '@/modules/auth';
import { Auth, CurrentUser } from '@/modules/auth';
import { apiTags, controllerPaths } from '@/shared/constants';

import { StatSwaggerDocs } from './decorators';
import { StatisticService } from './statistic.service';
import type { OverviewResponse } from './types';

@ApiTags(apiTags.statistics)
@Controller(controllerPaths.statistics)
@Auth() // Protect all routes - authentication required
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  /**
   * GET /statistics/overview
   * Get user statistics overview
   */
  @Get('overview')
  @StatSwaggerDocs.getOverview()
  async getOverview(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<OverviewResponse> {
    return this.statisticService.getOverview(user.id);
  }
}
