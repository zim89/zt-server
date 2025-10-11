# Task Module

This module handles task management within projects, including CRUD operations, status updates, assignments, and marker management.

## Features

- ✅ CRUD operations for tasks
- ✅ Task status management (8 statuses)
- ✅ Task assignment to project members
- ✅ Task filtering and search
- ✅ Pagination support
- ✅ Due date tracking
- ✅ Category and contact associations
- ✅ Marker (tags/labels) management
- ✅ Project-based access control

## Task Statuses

Tasks can have one of the following statuses:

- `NOT_STARTED` - Task hasn't been started yet
- `IN_PROGRESS` - Task is currently being worked on
- `DEFERRED` - Task has been postponed
- `CANCELED` - Task has been canceled
- `COMPLETED` - Task is finished
- `FOR_REVISION` - Task needs revisions
- `REJECTED` - Task has been rejected
- `READY_FOR_REVIEW` - Task is ready for review

## Endpoints

### Tasks

| Method | Endpoint                       | Description               | Auth Required | Access Level          |
| ------ | ------------------------------ | ------------------------- | ------------- | --------------------- |
| GET    | `/tasks`                       | Get all tasks (paginated) | ✅            | Project member        |
| GET    | `/tasks/:id`                   | Get task by ID            | ✅            | Project member        |
| POST   | `/tasks`                       | Create a new task         | ✅            | Project member        |
| PATCH  | `/tasks/:id`                   | Update a task             | ✅            | Creator/Project admin |
| DELETE | `/tasks/:id`                   | Delete a task             | ✅            | Creator/Project admin |
| PATCH  | `/tasks/:id/status`            | Update task status        | ✅            | Project member        |
| PATCH  | `/tasks/:id/assign`            | Assign/unassign task      | ✅            | Creator/Project admin |
| POST   | `/tasks/:id/markers/:markerId` | Add marker to task        | ✅            | Project member        |
| DELETE | `/tasks/:id/markers/:markerId` | Remove marker from task   | ✅            | Project member        |

## Query Parameters (GET /tasks)

| Parameter     | Type    | Default     | Description                                |
| ------------- | ------- | ----------- | ------------------------------------------ |
| `page`        | number  | 1           | Page number                                |
| `limit`       | number  | 20          | Items per page (max 100)                   |
| `search`      | string  | -           | Search in task name or description         |
| `sortBy`      | string  | 'createdAt' | Field to sort by                           |
| `sortOrder`   | string  | 'desc'      | Sort order: 'asc' or 'desc'                |
| `projectId`   | string  | -           | Filter by project                          |
| `status`      | enum    | -           | Filter by task status                      |
| `assigneeId`  | string  | -           | Filter by assignee                         |
| `categoryId`  | string  | -           | Filter by category                         |
| `contactId`   | string  | -           | Filter by contact                          |
| `creatorId`   | string  | -           | Filter by task creator                     |
| `dueDateFrom` | string  | -           | Filter tasks with due date from (ISO 8601) |
| `dueDateTo`   | string  | -           | Filter tasks with due date to (ISO 8601)   |
| `isOverdue`   | boolean | -           | Filter overdue tasks                       |
| `hasAssignee` | boolean | -           | Filter tasks with/without assignee         |

## Response Examples

### Get All Tasks (Paginated)

**Request:**

```bash
GET /tasks?page=1&limit=20&projectId=clx1234567890&status=IN_PROGRESS
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 42,
  "items": [
    {
      "id": "clx1111111111",
      "name": "Implement user authentication",
      "description": "Add JWT authentication with access and refresh tokens",
      "status": "IN_PROGRESS",
      "note": "Remember to add password hashing with Argon2id",
      "dueDate": "2025-12-31T23:59:59.000Z",
      "projectId": "clx1234567890",
      "categoryId": "clx9876543210",
      "contactId": "clx5555555555",
      "creatorId": "clx0987654321",
      "assigneeId": "clx0987654321",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-11T15:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 3,
    "limit": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Create Task

**Request:**

```bash
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Implement authentication",
  "description": "Add JWT authentication with refresh tokens",
  "status": "NOT_STARTED",
  "note": "Use Argon2id for password hashing",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "projectId": "clx1234567890",
  "categoryId": "clx9876543210",
  "assigneeId": "clx0987654321"
}
```

**Response:**

```json
{
  "id": "clx1111111111",
  "name": "Implement authentication",
  "description": "Add JWT authentication with refresh tokens",
  "status": "NOT_STARTED",
  "note": "Use Argon2id for password hashing",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "projectId": "clx1234567890",
  "categoryId": "clx9876543210",
  "contactId": null,
  "creatorId": "clx0987654321",
  "assigneeId": "clx0987654321",
  "createdAt": "2025-01-11T10:00:00.000Z",
  "updatedAt": "2025-01-11T10:00:00.000Z"
}
```

### Update Task Status

**Request:**

```bash
PATCH /tasks/clx1111111111/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

**Response:**

```json
{
  "id": "clx1111111111",
  "name": "Implement authentication",
  "status": "IN_PROGRESS",
  ...
}
```

### Assign Task

**Request:**

```bash
PATCH /tasks/clx1111111111/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assigneeId": "clx0987654321"
}
```

**Response:**

```json
{
  "id": "clx1111111111",
  "name": "Implement authentication",
  "assigneeId": "clx0987654321",
  ...
}
```

### Add Marker to Task

**Request:**

```bash
POST /tasks/clx1111111111/markers/clx2222222222
Authorization: Bearer <token>
```

**Response:** `201 Created`

### Remove Marker from Task

**Request:**

```bash
DELETE /tasks/clx1111111111/markers/clx2222222222
Authorization: Bearer <token>
```

**Response:** `204 No Content`

## Access Control

Task access is controlled through project membership:

- **View tasks**: Any project member or owner
- **Create tasks**: Any project member or owner
- **Update task**: Task creator or project owner/admin
- **Delete task**: Task creator or project owner/admin
- **Update status**: Any project member (allows team collaboration)
- **Assign task**: Task creator or project owner/admin
- **Manage markers**: Any project member

## Relations

Tasks can be associated with:

- **Project** (required) - The project this task belongs to
- **Category** (optional) - Task category for grouping
- **Contact** (optional) - Associated contact
- **Creator** (required) - User who created the task
- **Assignee** (optional) - User assigned to the task
- **Markers** (many-to-many) - Tags/labels for the task

## Usage Example

```typescript
import { TaskModule, TaskService } from '@/modules/task';
import type { TaskResponse } from '@/modules/task';

// In another module
@Module({
  imports: [TaskModule],
})
export class MyModule {
  constructor(private readonly taskService: TaskService) {}

  async getProjectTasks(
    projectId: string,
    userId: string,
  ): Promise<TaskResponse[]> {
    const result = await this.taskService.findMany(
      { projectId, page: 1, limit: 100 },
      userId,
    );
    return result.items;
  }
}
```

## Module Structure

```
task/
├── constants/                  # Constants and messages
│   ├── task-messages.ts
│   ├── task-swagger.schemas.ts
│   ├── select-fields.ts
│   └── index.ts
├── decorators/                 # Swagger decorators
│   ├── task-swagger.decorator.ts
│   └── index.ts
├── dto/                        # Data Transfer Objects
│   ├── create-task.dto.ts
│   ├── update-task.dto.ts
│   ├── find-tasks-query.dto.ts
│   ├── update-task-status.dto.ts
│   ├── assign-task.dto.ts
│   └── index.ts
├── types/                      # TypeScript types
│   ├── task.types.ts
│   └── index.ts
├── task.controller.ts          # REST controller
├── task.service.ts             # Business logic
├── task.module.ts              # NestJS module
├── index.ts                    # Public API
└── README.md                   # This file
```

## Error Handling

The module throws standard NestJS exceptions:

- `NotFoundException` - Task, project, category, contact, or marker not found
- `ForbiddenException` - User doesn't have access to task or project
- `BadRequestException` - Invalid input or assignee not in project
- `ConflictException` - Marker already attached to task

## Related Modules

- **Project Module** - Tasks belong to projects
- **Auth Module** - User authentication and authorization
- **Category Module** - Task categorization (future)
- **Contact Module** - Contact associations (future)
- **Marker Module** - Task markers/tags (future)

---

**Created**: 2025-01-11  
**Last Updated**: 2025-01-11  
**Version**: 1.0.0
