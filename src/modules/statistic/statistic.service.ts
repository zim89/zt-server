import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';

import { PrismaService } from '@/prisma';

import type {
  OverviewResponse,
  ProductivityStats,
  ProjectStats,
  TaskStats,
  TaskStatusStats,
} from './types';

@Injectable()
export class StatisticService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get complete statistics overview for the current user
   *
   * @param userId - Current user ID
   * @returns Statistics overview including tasks, projects, and productivity metrics
   *
   * @example
   * ```typescript
   * const overview = await statisticsService.getOverview(userId);
   * // Returns: { tasks: {...}, projects: {...}, productivity: {...} }
   * ```
   */
  async getOverview(userId: string): Promise<OverviewResponse> {
    // Get user's project IDs through membership
    const userMemberships = await this.prisma.membership.findMany({
      where: { userId },
      select: { projectId: true },
    });

    const projectIds = userMemberships.map((m) => m.projectId);

    // If user has no projects, return empty statistics
    if (projectIds.length === 0) {
      return {
        tasks: this.getEmptyTaskStats(),
        projects: { total: 0, active: 0, favorite: 0 },
        productivity: { completedToday: 0, completedThisWeek: 0 },
      };
    }

    // Calculate date boundaries
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    // Parallel queries for better performance
    const [
      totalTasks,
      tasksByStatus,
      overdueTasks,
      dueTodayTasks,
      dueThisWeekTasks,
      totalProjects,
      activeProjects,
      favoriteProjects,
      completedToday,
      completedThisWeek,
    ] = await Promise.all([
      // Total tasks
      this.prisma.task.count({
        where: { projectId: { in: projectIds } },
      }),

      // Tasks grouped by status
      this.prisma.task.groupBy({
        by: ['status'],
        where: { projectId: { in: projectIds } },
        _count: { status: true },
      }),

      // Overdue tasks (dueDate < now && not completed/canceled)
      this.prisma.task.count({
        where: {
          projectId: { in: projectIds },
          dueDate: { lt: now },
          status: {
            notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELED],
          },
        },
      }),

      // Tasks due today
      this.prisma.task.count({
        where: {
          projectId: { in: projectIds },
          dueDate: {
            gte: startOfToday,
            lt: endOfToday,
          },
          status: {
            notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELED],
          },
        },
      }),

      // Tasks due within the next 7 days
      this.prisma.task.count({
        where: {
          projectId: { in: projectIds },
          dueDate: {
            gte: now,
            lte: endOfWeek,
          },
          status: {
            notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELED],
          },
        },
      }),

      // Total projects
      this.prisma.project.count({
        where: { id: { in: projectIds } },
      }),

      // Active projects (with incomplete tasks)
      this.prisma.project.count({
        where: {
          id: { in: projectIds },
          tasks: {
            some: {
              status: {
                notIn: [TaskStatus.COMPLETED, TaskStatus.CANCELED],
              },
            },
          },
        },
      }),

      // Favorite projects
      this.prisma.project.count({
        where: {
          id: { in: projectIds },
          isFavorite: true,
        },
      }),

      // Tasks completed today
      this.prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: TaskStatus.COMPLETED,
          updatedAt: { gte: startOfToday },
        },
      }),

      // Tasks completed in the last 7 days
      this.prisma.task.count({
        where: {
          projectId: { in: projectIds },
          status: TaskStatus.COMPLETED,
          updatedAt: { gte: startOfWeek },
        },
      }),
    ]);

    // Build task status statistics
    const byStatus = this.buildTaskStatusStats(tasksByStatus);

    // Calculate completion rate
    const completedCount = byStatus[TaskStatus.COMPLETED];
    const completionRate =
      totalTasks > 0
        ? Math.round((completedCount / totalTasks) * 100 * 100) / 100 // Round to 2 decimals
        : 0;

    const taskStats: TaskStats = {
      total: totalTasks,
      byStatus,
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
      dueThisWeek: dueThisWeekTasks,
      completionRate,
    };

    const projectStats: ProjectStats = {
      total: totalProjects,
      active: activeProjects,
      favorite: favoriteProjects,
    };

    const productivityStats: ProductivityStats = {
      completedToday,
      completedThisWeek,
    };

    return {
      tasks: taskStats,
      projects: projectStats,
      productivity: productivityStats,
    };
  }

  /**
   * Build task status statistics from Prisma groupBy result
   */
  private buildTaskStatusStats(
    groupByResult: Array<{ status: TaskStatus; _count: { status: number } }>,
  ): TaskStatusStats {
    // Initialize all statuses with 0
    const stats: TaskStatusStats = {
      [TaskStatus.NOT_STARTED]: 0,
      [TaskStatus.IN_PROGRESS]: 0,
      [TaskStatus.COMPLETED]: 0,
      [TaskStatus.CANCELED]: 0,
      [TaskStatus.DEFERRED]: 0,
      [TaskStatus.FOR_REVISION]: 0,
      [TaskStatus.REJECTED]: 0,
      [TaskStatus.READY_FOR_REVIEW]: 0,
    };

    // Fill in actual counts
    for (const item of groupByResult) {
      stats[item.status] = item._count.status;
    }

    return stats;
  }

  /**
   * Get empty task statistics (for users with no projects)
   */
  private getEmptyTaskStats(): TaskStats {
    return {
      total: 0,
      byStatus: {
        [TaskStatus.NOT_STARTED]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.COMPLETED]: 0,
        [TaskStatus.CANCELED]: 0,
        [TaskStatus.DEFERRED]: 0,
        [TaskStatus.FOR_REVISION]: 0,
        [TaskStatus.REJECTED]: 0,
        [TaskStatus.READY_FOR_REVIEW]: 0,
      },
      overdue: 0,
      dueToday: 0,
      dueThisWeek: 0,
      completionRate: 0,
    };
  }
}
