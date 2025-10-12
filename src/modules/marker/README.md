# Marker Module

This module handles marker (label/tag) management for tasks, supporting both default (system-wide) and personal (user-specific) markers with customizable colors.

## Features

- ✅ CRUD operations for personal markers
- ✅ Auto-generated unique slugs from marker names
- ✅ Default markers (read-only, available to all users)
- ✅ Personal markers (full CRUD for owner)
- ✅ Custom color schemes (font and background)
- ✅ Marker filtering and search
- ✅ Pagination support
- ✅ Slug-based lookups

## Marker Types

### 1. Default Markers (System-wide)

**Characteristics:**

- `isDefault: true`
- `userId: null`
- **Read-only** for all users
- Cannot be modified or deleted
- Visible to everyone

**Examples:**

- "Important" (red)
- "Urgent" (orange)
- "In Progress" (blue)
- "Completed" (green)

### 2. Personal Markers (User-specific)

**Characteristics:**

- `isDefault: false`
- `userId: <owner ID>`
- **Full CRUD** for owner only
- Private (visible only to owner)
- Customizable colors

**Examples:**

- "My Priority" (custom colors)
- "Client Work" (custom colors)
- "Bug Fix" (custom colors)

## Endpoints

### Markers

| Method | Endpoint              | Description                  | Auth Required | Access Level     |
| ------ | --------------------- | ---------------------------- | ------------- | ---------------- |
| GET    | `/markers`            | Get all markers (paginated)  | ✅            | Authenticated    |
| GET    | `/markers/:id`        | Get marker by ID             | ✅            | Default or owner |
| GET    | `/markers/slug/:slug` | Get marker by slug           | ✅            | Default or owner |
| POST   | `/markers`            | Create a new personal marker | ✅            | Authenticated    |
| PATCH  | `/markers/:id`        | Update a personal marker     | ✅            | Owner only       |
| DELETE | `/markers/:id`        | Delete a personal marker     | ✅            | Owner only       |

## Query Parameters (GET /markers)

| Parameter   | Type    | Default | Description                    |
| ----------- | ------- | ------- | ------------------------------ |
| `page`      | number  | 1       | Page number                    |
| `limit`     | number  | 20      | Items per page (max 100)       |
| `search`    | string  | -       | Search in marker name          |
| `sortBy`    | string  | 'name'  | Field to sort by               |
| `sortOrder` | string  | 'asc'   | Sort order: 'asc' or 'desc'    |
| `isDefault` | boolean | -       | Filter by default markers      |
| `userId`    | string  | -       | Filter by user ID (admin only) |

**Note:** The `findMany` endpoint automatically returns:

- All default markers (isDefault=true)
- Personal markers of the current user (userId=currentUser)

## Response Examples

### Get All Markers (Paginated)

**Request:**

```bash
GET /markers?page=1&limit=20
Authorization: Bearer <token>
```

**Response:**

```json
{
  "total": 8,
  "items": [
    {
      "id": "clx1111111111",
      "slug": "important",
      "name": "Important",
      "fontColor": "#FFFFFF",
      "bgColor": "#EF4444",
      "isDefault": true,
      "userId": null,
      "createdAt": "2025-01-12T10:00:00.000Z",
      "updatedAt": "2025-01-12T10:00:00.000Z"
    },
    {
      "id": "clx2222222222",
      "slug": "my-priority",
      "name": "My Priority",
      "fontColor": "#000000",
      "bgColor": "#FCD34D",
      "isDefault": false,
      "userId": "clx0987654321",
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

### Get Marker by ID

**Request:**

```bash
GET /markers/clx1111111111
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "important",
  "name": "Important",
  "fontColor": "#FFFFFF",
  "bgColor": "#EF4444",
  "isDefault": true,
  "userId": null,
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

### Get Marker by Slug

**Request:**

```bash
GET /markers/slug/important
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "clx1111111111",
  "slug": "important",
  "name": "Important",
  "fontColor": "#FFFFFF",
  "bgColor": "#EF4444",
  "isDefault": true,
  "userId": null,
  "createdAt": "2025-01-12T10:00:00.000Z",
  "updatedAt": "2025-01-12T10:00:00.000Z"
}
```

### Create Personal Marker

**Request:**

```bash
POST /markers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Priority",
  "fontColor": "#000000",
  "bgColor": "#FCD34D"
}
```

**Response:**

```json
{
  "id": "clx2222222222",
  "slug": "my-priority",
  "name": "My Priority",
  "fontColor": "#000000",
  "bgColor": "#FCD34D",
  "isDefault": false,
  "userId": "clx0987654321",
  "createdAt": "2025-01-12T11:00:00.000Z",
  "updatedAt": "2025-01-12T11:00:00.000Z"
}
```

**Note:** The `slug` is automatically generated from the marker name.

### Update Personal Marker

**Request:**

```bash
PATCH /markers/clx2222222222
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "High Priority",
  "bgColor": "#DC2626"
}
```

**Response:**

```json
{
  "id": "clx2222222222",
  "slug": "high-priority",
  "name": "High Priority",
  "fontColor": "#000000",
  "bgColor": "#DC2626",
  "isDefault": false,
  "userId": "clx0987654321",
  "createdAt": "2025-01-12T11:00:00.000Z",
  "updatedAt": "2025-01-12T12:00:00.000Z"
}
```

**Note:** If the name changes, the slug is automatically regenerated.

### Delete Personal Marker

**Request:**

```bash
DELETE /markers/clx2222222222
Authorization: Bearer <token>
```

**Response:** `204 No Content`

## Color Scheme

Markers support customizable colors for visual differentiation:

### Font Color (`fontColor`)

- Text color for the marker label
- Format: Hex color code (e.g., `#FFFFFF`)
- Optional: defaults to null

### Background Color (`bgColor`)

- Background/highlight color for the marker
- Format: Hex color code (e.g., `#EF4444`)
- Optional: defaults to null

### Color Validation

Colors must match the hex format: `#RRGGBB`

**Valid examples:**

- `#FFFFFF` (white)
- `#000000` (black)
- `#EF4444` (red)
- `#10B981` (green)

**Invalid examples:**

- `#FFF` (too short)
- `FFFFFF` (missing #)
- `rgb(255, 0, 0)` (not hex)

## Access Control

### Default Markers (isDefault=true, userId=null)

- **View**: ✅ All authenticated users
- **Create**: ❌ Not allowed (system-created only)
- **Update**: ❌ Not allowed (read-only)
- **Delete**: ❌ Not allowed (read-only)

### Personal Markers (isDefault=false, userId=owner)

- **View**: ✅ Owner only
- **Create**: ✅ Any authenticated user
- **Update**: ✅ Owner only
- **Delete**: ✅ Owner only

### Automatic Filtering

The `findMany` endpoint automatically shows:

- **All default markers** (available to everyone)
- **Personal markers of current user** (private)

Users cannot see personal markers of other users.

## Slug Generation

Slugs are automatically generated from marker names:

- Converted to lowercase
- Spaces replaced with hyphens
- Special characters removed
- Ensured to be URL-friendly

**Examples:**

- `"Important"` → `"important"`
- `"High Priority"` → `"high-priority"`
- `"Bug Fix 🐛"` → `"bug-fix"`

### Slug Uniqueness

Slugs are unique per user (`@@unique([userId, slug])`):

- Different users can have markers with the same slug
- One user cannot have two markers with the same slug
- Example: User A and User B can both have "important" marker

## Relations

Markers are associated with:

- **User** (optional) - Owner of personal marker (null for default markers)
- **Tasks** (many-to-many via TaskMarker) - Tasks can have multiple markers

## Usage Example

```typescript
import { MarkerModule, MarkerService } from '@/modules/marker';
import type { MarkerResponse } from '@/modules/marker';

// In another module
@Module({
  imports: [MarkerModule],
})
export class MyModule {
  constructor(private readonly markerService: MarkerService) {}

  async getUserMarkers(userId: string): Promise<MarkerResponse[]> {
    // Get all markers (default + personal)
    const result = await this.markerService.findMany(
      { page: 1, limit: 100 },
      userId,
    );
    return result.items;
  }

  async getDefaultMarkers(userId: string): Promise<MarkerResponse[]> {
    // Get only default markers
    const result = await this.markerService.findMany(
      { isDefault: true, page: 1, limit: 100 },
      userId,
    );
    return result.items;
  }

  async createPersonalMarker(
    userId: string,
    name: string,
  ): Promise<MarkerResponse> {
    return this.markerService.create(userId, {
      name,
      fontColor: '#FFFFFF',
      bgColor: '#3B82F6',
    });
  }
}
```

## Module Structure

```
marker/
├── constants/                    # Constants and messages
│   ├── marker-messages.ts
│   ├── marker-swagger.schemas.ts
│   ├── select-fields.ts
│   └── index.ts
├── decorators/                   # Swagger decorators
│   ├── marker-swagger.decorator.ts
│   └── index.ts
├── dto/                          # Data Transfer Objects
│   ├── create-marker.dto.ts
│   ├── update-marker.dto.ts
│   ├── find-markers-query.dto.ts
│   ├── marker-response.dto.ts
│   └── index.ts
├── types/                        # TypeScript types
│   ├── marker.types.ts
│   └── index.ts
├── marker.controller.ts          # REST controller
├── marker.service.ts             # Business logic
├── marker.module.ts              # NestJS module
├── index.ts                      # Public API
└── README.md                     # This file
```

## Error Handling

The module throws standard NestJS exceptions:

- `NotFoundException` - Marker not found
- `ForbiddenException` - Access denied, cannot modify/delete default markers
- `ConflictException` - Marker slug already exists for this user
- `BadRequestException` - Invalid input data or color format

### Common Error Scenarios

1. **Trying to update default marker:**

   ```json
   {
     "statusCode": 403,
     "message": "Cannot modify default marker",
     "error": "Forbidden"
   }
   ```

2. **Trying to delete default marker:**

   ```json
   {
     "statusCode": 403,
     "message": "Cannot delete default marker",
     "error": "Forbidden"
   }
   ```

3. **Slug already exists:**

   ```json
   {
     "statusCode": 409,
     "message": "Marker with this slug already exists for your account",
     "error": "Conflict"
   }
   ```

4. **Invalid color format:**
   ```json
   {
     "statusCode": 400,
     "message": ["Font color must be a valid hex color (e.g., #FFFFFF)"],
     "error": "Bad Request"
   }
   ```

## Related Modules

- **Task Module** - Tasks can have multiple markers (many-to-many)
- **Auth Module** - User authentication and authorization

## Implementation Details

### Service Methods

- `findMany(query, userId)` - Get paginated list (default + personal markers)
- `findOneById(id, userId)` - Get marker by ID with access check
- `findOneBySlug(slug, userId)` - Get marker by slug with access check
- `create(userId, dto)` - Create new personal marker with auto-generated slug
- `update(id, userId, dto)` - Update personal marker (regenerates slug if name changes)
- `delete(id, userId)` - Delete personal marker

### Access Control Logic

The service implements two-tier access control:

1. **For viewing (findMany, findOneById, findOneBySlug):**
   - Show all default markers (isDefault=true)
   - Show personal markers of current user (userId=currentUser)

2. **For creating:**
   - Any authenticated user can create personal markers
   - isDefault is always set to false
   - userId is always set to current user

3. **For updating/deleting:**
   - Only owner can modify personal markers
   - Default markers cannot be modified or deleted
   - Throws `ForbiddenException` if attempt to modify default

### Slug Uniqueness

Slugs are unique per user using composite unique constraint:

```prisma
@@unique([userId, slug])
```

**This means:**

- User A can have marker "important"
- User B can also have marker "important"
- But User A cannot have two markers "important"

### findOneBySlug Implementation

Due to the composite unique key `[userId, slug]`, finding by slug requires special handling:

```typescript
// Find markers where slug matches AND (isDefault OR owned by user)
const markers = await this.prisma.marker.findMany({
  where: {
    slug,
    OR: [
      { isDefault: true }, // Default markers
      { userId }, // Personal markers
    ],
  },
  take: 1,
});
```

This approach:

- Returns default marker if exists
- Returns personal marker if exists
- Avoids TypeScript issues with null in composite keys

## Color Customization

### Using Custom Colors

```typescript
// Create marker with custom colors
await markerService.create(userId, {
  name: 'High Priority',
  fontColor: '#FFFFFF', // White text
  bgColor: '#DC2626', // Red background
});

// Update marker colors
await markerService.update(markerId, userId, {
  fontColor: '#000000', // Black text
  bgColor: '#FCD34D', // Yellow background
});

// Create marker without colors (defaults to null)
await markerService.create(userId, {
  name: 'Simple Tag',
  // fontColor and bgColor are optional
});
```

### Recommended Color Palettes

**Importance levels:**

- Critical: `{ fontColor: '#FFFFFF', bgColor: '#DC2626' }` (red)
- High: `{ fontColor: '#FFFFFF', bgColor: '#F59E0B' }` (orange)
- Medium: `{ fontColor: '#FFFFFF', bgColor: '#3B82F6' }` (blue)
- Low: `{ fontColor: '#000000', bgColor: '#D1D5DB' }` (gray)

**Status indicators:**

- Success: `{ fontColor: '#FFFFFF', bgColor: '#10B981' }` (green)
- Warning: `{ fontColor: '#000000', bgColor: '#FCD34D' }` (yellow)
- Error: `{ fontColor: '#FFFFFF', bgColor: '#EF4444' }` (red)
- Info: `{ fontColor: '#FFFFFF', bgColor: '#06B6D4' }` (cyan)

## Integration with Task Module

Markers are attached to tasks via the `TaskMarker` junction table:

```typescript
// In Task Module
POST /tasks/:taskId/markers/:markerId    // Add marker to task
DELETE /tasks/:taskId/markers/:markerId  // Remove marker from task
```

Tasks can have multiple markers, and markers can be assigned to multiple tasks (many-to-many relationship).

## Default Markers Setup

Default markers should be created manually via database seeding:

```typescript
// prisma/seed.ts (example)
await prisma.marker.createMany({
  data: [
    {
      slug: 'important',
      name: 'Important',
      fontColor: '#FFFFFF',
      bgColor: '#EF4444',
      isDefault: true,
      userId: null,
    },
    {
      slug: 'urgent',
      name: 'Urgent',
      fontColor: '#FFFFFF',
      bgColor: '#F59E0B',
      isDefault: true,
      userId: null,
    },
    {
      slug: 'in-progress',
      name: 'In Progress',
      fontColor: '#FFFFFF',
      bgColor: '#3B82F6',
      isDefault: true,
      userId: null,
    },
    {
      slug: 'completed',
      name: 'Completed',
      fontColor: '#FFFFFF',
      bgColor: '#10B981',
      isDefault: true,
      userId: null,
    },
  ],
});
```

---

**Created**: 2025-01-12  
**Last Updated**: 2025-01-12  
**Version**: 1.0.0
