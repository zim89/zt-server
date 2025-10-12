# Statistic Module

Analytics and statistics module for Zen Task API. Provides comprehensive metrics about user's tasks, projects, and productivity.

## Overview

The Statistic module aggregates data from multiple sources (tasks, projects, memberships) to provide real-time analytics for the current user. All statistics are calculated on-demand without caching for MVP.

## Features

- ✅ Real-time statistics calculation
- ✅ Task metrics (total, by status, deadlines, completion rate)
- ✅ Project metrics (total, active, favorite)
- ✅ Productivity metrics (completed today/this week)
- ✅ User-specific data (only projects where user is a member)
- ✅ Efficient parallel queries with Promise.all()

## API Endpoints

### Get Statistics Overview

**Endpoint:** `GET /statistics/overview`

**Authentication:** Required (JWT)

**Description:** Returns comprehensive statistics overview for the current user.

**Response:**

```json
{
  "tasks": {
    "total": 42,
    "byStatus": {
      "NOT_STARTED": 10,
      "IN_PROGRESS": 8,
      "COMPLETED": 20,
      "CANCELED": 2,
      "DEFERRED": 1,
      "FOR_REVISION": 0,
      "REJECTED": 1,
      "READY_FOR_REVIEW": 0
    },
    "overdue": 3,
    "dueToday": 5,
    "dueThisWeek": 12,
    "completionRate": 47.62
  },
  "projects": {
    "total": 5,
    "active": 3,
    "favorite": 2
  },
  "productivity": {
    "completedToday": 4,
    "completedThisWeek": 18
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:4000/statistics/overview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Data Structure

### Task Statistics

| Field            | Type     | Description                                           |
| ---------------- | -------- | ----------------------------------------------------- |
| `total`          | `number` | Total tasks in user's projects                        |
| `byStatus`       | `object` | Tasks grouped by status                               |
| `overdue`        | `number` | Tasks past due date (not COMPLETED/CANCELED)          |
| `dueToday`       | `number` | Tasks due today (not COMPLETED/CANCELED)              |
| `dueThisWeek`    | `number` | Tasks due within next 7 days (not COMPLETED/CANCELED) |
| `completionRate` | `number` | Percentage of completed tasks (0-100)                 |

### Project Statistics

| Field      | Type     | Description                           |
| ---------- | -------- | ------------------------------------- |
| `total`    | `number` | Total projects where user is a member |
| `active`   | `number` | Projects with incomplete tasks        |
| `favorite` | `number` | Favorite projects                     |

### Productivity Statistics

| Field               | Type     | Description                        |
| ------------------- | -------- | ---------------------------------- |
| `completedToday`    | `number` | Tasks completed today              |
| `completedThisWeek` | `number` | Tasks completed in the last 7 days |

## Technical Details

### Data Sources

- **Tasks:** Via `Task` model filtered by user's project membership
- **Projects:** Via `Project` model filtered by `Membership`
- **Status:** Via `TaskStatus` enum from Prisma

### Date Calculations

- **Overdue:** `dueDate < now && status NOT IN (COMPLETED, CANCELED)`
- **Due Today:** `dueDate = today && status NOT IN (COMPLETED, CANCELED)`
- **Due This Week:** `dueDate <= now + 7 days && status NOT IN (COMPLETED, CANCELED)`
- **Completed Today:** `status = COMPLETED && updatedAt >= startOfToday`
- **Completed This Week:** `status = COMPLETED && updatedAt >= now - 7 days`

### Performance Optimizations

1. **Parallel Queries:** All metrics calculated simultaneously via `Promise.all()`
2. **Efficient Counting:** Uses Prisma `count()` and `groupBy()` aggregations
3. **Minimal Data Transfer:** Only counts, no full object fetches
4. **Index-Friendly Queries:** Filters use indexed fields (projectId, status, dueDate)

### Completion Rate Calculation

```typescript
completionRate = (completedTasks / totalTasks) * 100;
// Rounded to 2 decimal places
```

## Access Control

- **Scope:** User can only see statistics for projects where they are a member
- **Authentication:** All endpoints require valid JWT token
- **Authorization:** Statistics are automatically filtered by user's membership

## Module Structure

```
src/modules/statistic/
├── index.ts                        # Public API
├── statistic.module.ts             # NestJS module
├── statistic.controller.ts         # REST controller
├── statistic.service.ts            # Business logic
├── types/
│   ├── index.ts
│   └── statistic.types.ts          # TypeScript types
├── constants/
│   ├── index.ts
│   ├── statistic-messages.ts       # Error/success messages
│   └── statistic-swagger.schemas.ts # Swagger examples
├── decorators/
│   ├── index.ts
│   └── statistic-swagger.decorator.ts # Swagger decorators
└── README.md                       # This file
```

## Dependencies

- `@nestjs/common` - NestJS core
- `@prisma/client` - Database access
- `@/prisma` - Prisma service (global)
- `@/modules/auth` - Authentication decorators

## Usage Examples

### In Another Service

```typescript
import { StatisticService } from '@/modules/statistic';

@Injectable()
export class DashboardService {
  constructor(private readonly statisticService: StatisticService) {}

  async getDashboard(userId: string) {
    const stats = await this.statisticService.getOverview(userId);
    return { statistics: stats /* ... other data */ };
  }
}
```

### Using Types

```typescript
import type { OverviewResponse, TaskStats } from '@/modules/statistic';

const overview: OverviewResponse = await fetch('/statistics/overview');
const taskStats: TaskStats = overview.tasks;
```

## Future Enhancements

### Planned Features

- [ ] Filtering by project/category/marker
- [ ] Detailed project-specific statistics
- [ ] Time-series data (graphs and trends)
- [ ] Priority distribution statistics
- [ ] Streak tracking (consecutive days)
- [ ] Caching with Redis for large datasets
- [ ] Export to CSV/PDF

### Potential Endpoints

- `GET /statistics/projects/:id` - Per-project statistics
- `GET /statistics/trends` - Historical trends and graphs
- `GET /statistics/categories` - Category distribution
- `GET /statistics/markers` - Marker usage statistics

## Error Handling

The module uses centralized error messages from `constants/statistic-messages.ts`:

```typescript
export const statMessages = {
  stats: {
    error: {
      forbidden: 'Access to statistics denied',
      calculationFailed: 'Failed to calculate statistics',
    },
    success: {
      retrieved: 'Statistics retrieved successfully',
    },
  },
} as const;
```

## Testing

### Manual Testing

```bash
# 1. Login to get JWT token
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Get statistics (use token from step 1)
curl -X GET http://localhost:4000/statistics/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Expected Behavior

- ✅ Returns 200 with statistics data when authenticated
- ✅ Returns 401 when not authenticated
- ✅ Returns empty statistics for users with no projects
- ✅ Calculates completion rate correctly
- ✅ Handles date boundaries accurately (today, this week)

## Related Modules

- **Auth Module:** Provides authentication and authorization
- **Project Module:** Source of project data
- **Task Module:** Source of task data
- **Category Module:** (Future) Category-based statistics
- **Marker Module:** (Future) Marker-based statistics

## Architecture Patterns

### Patterns Used

- ✅ **Dependency Injection:** Service injected via constructor
- ✅ **Centralized Constants:** No hardcoded strings
- ✅ **Type Safety:** Strict TypeScript types
- ✅ **Swagger Documentation:** Clean controller with decorators
- ✅ **Real-time Calculation:** No caching for MVP
- ✅ **Parallel Processing:** Promise.all() for performance

### Code Quality

- ✅ JSDoc comments for all public methods
- ✅ English code and comments
- ✅ Explicit field selection in queries
- ✅ No `any` types
- ✅ Centralized error messages

## Swagger Documentation

The module is fully documented in Swagger UI at `/api/docs`.

**Tags:** `statistics` (URL plural)

**Endpoints:**

- `GET /statistics/overview` - Get user statistics overview

## Contributing

When modifying this module:

1. Follow the project's coding standards
2. Update types if changing response structure
3. Update Swagger schemas
4. Add JSDoc comments for new methods
5. Test with users having different project counts
6. Consider performance impact of new queries

## License

Part of Zen Task API project.

---

**Last Updated:** 2025-01-12  
**Module Version:** 1.0.0  
**Author:** zim89
