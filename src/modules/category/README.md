# Category Module

This module handles category management for organizing tasks within projects, including CRUD operations, search, and pagination.

## Features

- ✅ CRUD operations for categories
- ✅ Auto-generated unique slugs from category names
- ✅ Category filtering and search
- ✅ Pagination support
- ✅ Project-based access control
- ✅ Slug-based lookups

## Endpoints

### Categories

| Method | Endpoint                 | Description                    | Auth Required | Access Level        |
| ------ | ------------------------ | ------------------------------ | ------------- | ------------------- |
| GET    | `/categories`            | Get all categories (paginated) | ✅            | Authenticated       |
| GET    | `/categories/:id`        | Get category by ID             | ✅            | Project member      |
| GET    | `/categories/slug/:slug` | Get category by slug           | ✅            | Project member      |
| POST   | `/categories`            | Create a new category          | ✅            | Project member      |
| PATCH  | `/categories/:id`        | Update a category              | ✅            | Project owner/admin |
| DELETE | `/categories/:id`        | Delete a category              | ✅            | Project owner/admin |

## Query Parameters (GET /categories)

| Parameter   | Type   | Default     | Description                            |
| ----------- | ------ | ----------- | -------------------------------------- |
| `page`      | number | 1           | Page number                            |
| `limit`     | number | 20          | Items per page (max 100)               |
| `search`    | string | -           | Search in category name or description |
| `sortBy`    | string | 'createdAt' | Field to sort by                       |
| `sortOrder` | string | 'desc'      | Sort order: 'asc' or 'desc'            |
| `projectId` | string | -           | Filter by project                      |

## Response Examples

### Get All Categories (Paginated)

**Request:**

```bash
GET /categories?page=1&limit=20&projectId=clx1234567890
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 5,
  "items": [
    {
      "id": "clx1111111111",
      "slug": "development",
      "name": "Development",
      "description": "Tasks related to software development and coding",
      "projectId": "clx1234567890",
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "id": "clx2222222222",
      "slug": "design",
      "name": "Design",
      "description": "UI/UX design and mockups",
      "projectId": "clx1234567890",
      "createdAt": "2025-01-12T11:00:00.000Z",
      "updatedAt": "2025-01-12T11:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pages": 1,
    "limit": 20,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Get Category by ID

**Request:**

```bash
GET /categories/clx1111111111
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "development",
  "name": "Development",
  "description": "Tasks related to software development and coding",
  "projectId": "clx1234567890",
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

### Get Category by Slug

**Request:**

```bash
GET /categories/slug/development
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "development",
  "name": "Development",
  "description": "Tasks related to software development and coding",
  "projectId": "clx1234567890",
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

### Create Category

**Request:**

```bash
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development",
  "description": "Tasks related to software development and coding",
  "projectId": "clx1234567890"
}
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "development",
  "name": "Development",
  "description": "Tasks related to software development and coding",
  "projectId": "clx1234567890",
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

**Note:** The `slug` is automatically generated from the category name.

### Update Category

**Request:**

```bash
PATCH /categories/clx1111111111
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Backend Development",
  "description": "Backend coding tasks"
}
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "backend-development",
  "name": "Backend Development",
  "description": "Backend coding tasks",
  "projectId": "clx1234567890",
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T12:00:00.000Z"
}
```

**Note:** If the name changes, the slug is automatically regenerated.

### Delete Category

**Request:**

```bash
DELETE /categories/clx1111111111
Authorization: Bearer <token>
```

**Response:** `204 No Content`

## Access Control

Category access is controlled through project membership:

- **View categories**: Any project member or owner
- **Create categories**: Any project member or owner
- **Update categories**: Project owner or admin only
- **Delete categories**: Project owner or admin only

## Slug Generation

Slugs are automatically generated from category names:

- Converted to lowercase
- Spaces replaced with hyphens
- Special characters removed
- Ensured to be URL-friendly

**Examples:**

- `"Development"` → `"development"`
- `"UI/UX Design"` → `"ui-ux-design"`
- `"Bug Fixes & Testing"` → `"bug-fixes-testing"`

Slugs must be unique across the entire system. If a duplicate slug is detected, a `ConflictException` is thrown.

## Relations

Categories are associated with:

- **Project** (required) - The project this category belongs to
- **Tasks** (one-to-many) - Tasks can be assigned to a category

## Usage Example

```typescript
import { CategoryModule, CategoryService } from '@/modules/category';
import type { CategoryResponse } from '@/modules/category';

// In another module
@Module({
  imports: [CategoryModule],
})
export class MyModule {
  constructor(private readonly categoryService: CategoryService) {}

  async getProjectCategories(projectId: string): Promise<CategoryResponse[]> {
    const result = await this.categoryService.findMany({
      projectId,
      page: 1,
      limit: 100,
    });
    return result.items;
  }

  async getCategoryBySlug(
    slug: string,
    userId: string,
  ): Promise<CategoryResponse> {
    return this.categoryService.findOneBySlug(slug, userId);
  }
}
```

## Module Structure

```
category/
├── constants/                    # Constants and messages
│   ├── category-messages.ts
│   ├── category-swagger.schemas.ts
│   ├── select-fields.ts
│   └── index.ts
├── decorators/                   # Swagger decorators
│   ├── category-swagger.decorator.ts
│   └── index.ts
├── dto/                          # Data Transfer Objects
│   ├── create-category.dto.ts
│   ├── update-category.dto.ts
│   ├── find-categories-query.dto.ts
│   ├── category-response.dto.ts
│   └── index.ts
├── types/                        # TypeScript types
│   ├── category.types.ts
│   └── index.ts
├── category.controller.ts        # REST controller
├── category.service.ts           # Business logic
├── category.module.ts            # NestJS module
├── index.ts                      # Public API
└── README.md                     # This file
```

## Error Handling

The module throws standard NestJS exceptions:

- `NotFoundException` - Category or project not found
- `ForbiddenException` - User doesn't have access to category or project
- `ConflictException` - Category slug already exists
- `BadRequestException` - Invalid input data

## Related Modules

- **Project Module** - Categories belong to projects
- **Task Module** - Tasks can be assigned to categories
- **Auth Module** - User authentication and authorization

## Implementation Details

### Service Methods

- `findMany(query)` - Get paginated list with filters
- `findOneById(id, userId)` - Get category by ID with access check
- `findOneBySlug(slug, userId)` - Get category by slug with access check
- `create(userId, dto)` - Create new category with auto-generated slug
- `update(id, userId, dto)` - Update category (regenerates slug if name changes)
- `delete(id, userId)` - Delete category

### Access Control Logic

The service uses project membership to control access:

1. For viewing: Checks if user is project owner or member
2. For creating: Checks if user is project owner or member
3. For updating/deleting: Checks if user is project owner or has ADMIN role

---

**Created**: 2025-01-12  
**Last Updated**: 2025-01-12  
**Version**: 1.0.0
