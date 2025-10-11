# Project Module

This module handles project management, including creation, updates, membership management, and access control.

## Features

- ✅ CRUD operations for projects
- ✅ Project membership management
- ✅ Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
- ✅ Automatic slug generation from project name
- ✅ Pagination and filtering for project lists
- ✅ Search functionality (name, description, slug)
- ✅ Favorite, active, and hidden project flags

## Endpoints

### Projects

| Method | Endpoint               | Description                  | Auth Required | Roles        |
| ------ | ---------------------- | ---------------------------- | ------------- | ------------ |
| GET    | `/projects`            | Get all projects (paginated) | ✅            | Any          |
| GET    | `/projects/:id`        | Get project by ID            | ✅            | Member/Owner |
| GET    | `/projects/slug/:slug` | Get project by slug          | ✅            | Member/Owner |
| POST   | `/projects`            | Create a new project         | ✅            | Any          |
| PATCH  | `/projects/:id`        | Update a project             | ✅            | Owner/Admin  |
| DELETE | `/projects/:id`        | Delete a project             | ✅            | Owner only   |

### Membership

| Method | Endpoint                               | Description           | Auth Required | Roles       |
| ------ | -------------------------------------- | --------------------- | ------------- | ----------- |
| POST   | `/projects/:id/members`                | Add member to project | ✅            | Owner/Admin |
| DELETE | `/projects/:id/members/:memberId`      | Remove member         | ✅            | Owner/Admin |
| PATCH  | `/projects/:id/members/:memberId/role` | Update member role    | ✅            | Owner/Admin |

## Query Parameters (GET /projects)

| Parameter    | Type    | Default     | Description                       |
| ------------ | ------- | ----------- | --------------------------------- |
| `page`       | number  | 1           | Page number                       |
| `limit`      | number  | 20          | Items per page (max 100)          |
| `search`     | string  | -           | Search in name, description, slug |
| `sortBy`     | string  | 'createdAt' | Field to sort by                  |
| `sortOrder`  | string  | 'desc'      | Sort order: 'asc' or 'desc'       |
| `isFavorite` | boolean | -           | Filter by favorite status         |
| `isActive`   | boolean | -           | Filter by active status           |
| `isHidden`   | boolean | -           | Filter by hidden status           |
| `userId`     | string  | -           | Filter by owner (user ID)         |

## Response Examples

### Get All Projects (Paginated)

**Request:**

```bash
GET /projects?page=1&limit=20&search=awesome&isFavorite=true
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 42,
  "items": [
    {
      "id": "clx1234567890",
      "slug": "my-awesome-project",
      "name": "My Awesome Project",
      "description": "A project for managing awesome tasks",
      "isActive": true,
      "isFavorite": true,
      "isHidden": false,
      "userId": "clx0987654321",
      "createdAt": "2025-01-10T12:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
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

### Create Project

**Request:**

```bash
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My New Project",
  "description": "A project description",
  "slug": "my-new-project", // optional, auto-generated from name
  "isFavorite": false,
  "isHidden": false
}
```

**Response:**

```json
{
  "id": "clx1234567890",
  "slug": "my-new-project",
  "name": "My New Project",
  "description": "A project description",
  "isActive": true,
  "isFavorite": false,
  "isHidden": false,
  "userId": "clx0987654321",
  "createdAt": "2025-01-10T12:00:00.000Z",
  "updatedAt": "2025-01-10T12:00:00.000Z"
}
```

### Add Member to Project

**Request:**

```bash
POST /projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "clx1111111111",
  "roles": ["MEMBER"]
}
```

**Response:**

```json
{
  "id": "clx2222222222",
  "projectId": "clx1234567890",
  "userId": "clx1111111111",
  "roles": ["MEMBER"],
  "joinedAt": "2025-01-10T12:00:00.000Z"
}
```

## Access Control

### Project Roles

| Role   | Permissions                                                 |
| ------ | ----------------------------------------------------------- |
| OWNER  | Full control (create, read, update, delete, manage members) |
| ADMIN  | Read, update, manage members (cannot delete project)        |
| MEMBER | Read and create tasks                                       |
| VIEWER | Read only                                                   |

### Access Rules

1. **View Project**: User must be owner OR member of the project
2. **Update Project**: User must be owner OR have ADMIN role
3. **Delete Project**: User must be owner
4. **Add/Remove Members**: User must be owner OR have ADMIN role
5. **Update Member Roles**: User must be owner OR have ADMIN role

## Slug Generation

If slug is not provided in `CreateProjectDto`, it will be auto-generated from the project name:

```typescript
// Example:
"My Awesome Project!" → "my-awesome-project"
"Test  Project__2025" → "test-project-2025"
```

Rules:

- Lowercase
- Trim whitespace
- Remove special characters
- Replace spaces/underscores with hyphens
- Remove leading/trailing hyphens

## Error Responses

| Status Code | Error Message                         | When                                     |
| ----------- | ------------------------------------- | ---------------------------------------- |
| 400         | Cannot remove project owner           | Trying to remove owner from members      |
| 403         | You do not have permission            | User is not owner/admin/member           |
| 404         | Project not found                     | Project with given ID/slug doesn't exist |
| 404         | Membership not found                  | Member with given ID doesn't exist       |
| 404         | User not found                        | User to add doesn't exist                |
| 409         | Project with this slug already exists | Slug is not unique                       |
| 409         | User is already a member              | Trying to add existing member            |

## Usage in Other Modules

```typescript
import { ProjectsService } from '@/modules/projects';

@Injectable()
export class TasksService {
  constructor(private readonly projectsService: ProjectsService) {}

  async createTask(projectId: string, userId: string) {
    // Check if user has access to project
    const project = await this.projectsService.findOneById(projectId, userId);
    // ... create task
  }
}
```

## Database Relations

```
Project
├── User (owner) [1:1]
├── Membership[] [1:N]
├── Task[] [1:N]
└── Category[] [1:N]

Membership
├── Project [N:1]
└── User [N:1]
```

## Notes

- Projects are **not** soft-deleted (cascading deletes apply)
- Project owner **cannot be removed** from members
- Slug must be **unique** across all projects
- Default `isActive` is `true` for new projects
- When project is created, owner is **not** added to members automatically
- Membership has **array of roles** (`ProjectRole[]`), allowing multiple roles per member
