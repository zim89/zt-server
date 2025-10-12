import type { TaskStatus } from '@prisma/client';

/**
 * Task statistics by status
 * Uses Prisma TaskStatus enum as keys
 */
export type TaskStatusStats = Record<TaskStatus, number>;

/**
 * Task statistics
 */
export interface TaskStats {
  /** Total number of tasks in user's projects */
  total: number;

  /** Tasks grouped by status */
  byStatus: TaskStatusStats;

  /** Overdue tasks (dueDate < now && status not DONE/CANCELLED) */
  overdue: number;

  /** Tasks due today */
  dueToday: number;

  /** Tasks due within the next 7 days */
  dueThisWeek: number;

  /** Completion rate percentage (0-100) */
  completionRate: number;
}

/**
 * Project statistics
 */
export interface ProjectStats {
  /** Total number of projects where user is a member */
  total: number;

  /** Projects with incomplete tasks (TODO/IN_PROGRESS/etc.) */
  active: number;

  /** Favorite projects */
  favorite: number;
}

/**
 * Productivity statistics
 */
export interface ProductivityStats {
  /** Tasks completed today */
  completedToday: number;

  /** Tasks completed in the last 7 days */
  completedThisWeek: number;
}

/**
 * Complete overview response for statistics
 */
export interface OverviewResponse {
  tasks: TaskStats;
  projects: ProjectStats;
  productivity: ProductivityStats;
}
