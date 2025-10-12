# Prisma Module

Infrastructure module for database operations using Prisma ORM.

## 📋 Table of Contents

- [Purpose](#purpose)
- [Structure](#structure)
- [Usage](#usage)
- [API](#api)
- [Configuration](#configuration)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Purpose

`PrismaModule` provides global access to Prisma Client for all application modules. It's the central point for all database operations.

### Why a Separate Module?

- **Encapsulation**: All database connection logic in one place
- **Global Access**: Import once, available everywhere
- **Lifecycle Management**: Automatic connection/disconnection on app start/stop
- **Testability**: Easy to mock in tests

## Structure

```
src/prisma/
├── index.ts           # Public API of the module
├── prisma.module.ts   # NestJS module with @Global decorator
├── prisma.service.ts  # Service with Prisma Client
└── README.md          # Documentation
```

### Files

#### `index.ts`

Exports the public API:

```typescript
export { PrismaModule } from './prisma.module';
export { PrismaService } from './prisma.service';
```

#### `prisma.module.ts`

NestJS module with global registration:

```typescript
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Key Features:**

- `@Global()` - available in all modules without explicit import
- `exports: [PrismaService]` - exports service for DI

#### `prisma.service.ts`

Service extending `PrismaClient`:

```typescript
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

**Key Features:**

- Extends `PrismaClient` - all Prisma methods available
- `OnModuleInit` - automatic connection on startup
- `OnModuleDestroy` - graceful shutdown on app stop

## Usage

### 1. Import in App Module

```typescript
// src/app.module.ts
import { PrismaModule } from '@/prisma';

@Module({
  imports: [
    PrismaModule, // Import once
    AuthModule,
    // ... other modules
  ],
})
export class AppModule {}
```

### 2. Inject into Services

```typescript
// src/modules/auth/auth.service.ts
import { PrismaService } from '@/prisma';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUser(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
```

### 3. Use in Any Module

Thanks to the `@Global()` decorator, `PrismaService` is available in all modules without explicitly importing `PrismaModule` into each one.

## API

### PrismaService

Inherits all methods from `PrismaClient`. Main capabilities:

#### Database Models

```typescript
// User operations
prismaService.user.findUnique();
prismaService.user.findMany();
prismaService.user.create();
prismaService.user.update();
prismaService.user.delete();

// Project operations
prismaService.project.findMany();
prismaService.project.create();
// ... etc. for all models
```

#### Transactions

```typescript
await prismaService.$transaction([
  prismaService.user.create({ data: userData }),
  prismaService.project.create({ data: projectData }),
]);

// Or interactive transaction
await prismaService.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.project.create({
    data: { ...projectData, userId: user.id },
  });
});
```

#### Raw Queries

```typescript
// Raw SQL
await prismaService.$queryRaw`SELECT * FROM User WHERE email = ${email}`;

// Execute raw
await prismaService.$executeRaw`UPDATE User SET verified = true`;
```

#### Middleware

```typescript
prismaService.$use(async (params, next) => {
  console.log('Query:', params.model, params.action);
  return next(params);
});
```

## Configuration

### Database URL

Connection configuration is defined in `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zen-task?schema=public"
```

### Prisma Schema

Database schema is located at project root:

```
zt-server/
├── prisma/
│   ├── schema.prisma      # DB Schema
│   └── migrations/        # Migrations
```

### Client Generation

```bash
# Generate Prisma Client
bun run prisma:generate

# Apply migrations
bun run prisma:migrate

# Open Prisma Studio
bun run prisma:studio
```

## Best Practices

### ✅ Do

#### 1. Use Prisma Types

```typescript
import { User, Prisma } from '@prisma/client';

async createUser(data: Prisma.UserCreateInput): Promise<User> {
  return this.prismaService.user.create({ data });
}
```

#### 2. Select Only Needed Fields

```typescript
// ❌ Bad - loads all fields
const user = await prismaService.user.findUnique({ where: { id } });

// ✅ Good - only needed fields
const user = await prismaService.user.findUnique({
  where: { id },
  select: { id: true, email: true, firstName: true },
});
```

#### 3. Use Transactions for Related Operations

```typescript
// ✅ Good - atomic operation
await prismaService.$transaction([
  prismaService.user.update({ where: { id }, data: { status: 'INACTIVE' } }),
  prismaService.session.deleteMany({ where: { userId: id } }),
]);
```

#### 4. Handle Prisma Errors

```typescript
import { Prisma } from '@prisma/client';

try {
  await prismaService.user.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('User already exists');
    }
  }
  throw error;
}
```

### ❌ Don't

#### 1. Don't Create New PrismaClient Instances

```typescript
// ❌ Bad
const prisma = new PrismaClient();

// ✅ Good - use DI
constructor(private readonly prismaService: PrismaService) {}
```

#### 2. Don't Forget Pagination

```typescript
// ❌ Bad - may return millions of records
const users = await prismaService.user.findMany();

// ✅ Good
const users = await prismaService.user.findMany({
  take: 20,
  skip: 0,
  orderBy: { createdAt: 'desc' },
});
```

#### 3. Don't Ignore Indexes

```prisma
// In schema.prisma
model User {
  email String @unique // Automatic index

  @@index([email]) // Additional indexes when needed
}
```

## Examples

### Example 1: CRUD Operations

```typescript
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Create
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  // Read
  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Update
  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // Delete
  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  // List with pagination
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit };
  }
}
```

### Example 2: Working with Relations

```typescript
// Get user with their projects
const user = await prismaService.user.findUnique({
  where: { id },
  include: {
    projects: true,
    memberships: {
      include: {
        project: true,
      },
    },
  },
});

// Create project with owner
const project = await prismaService.project.create({
  data: {
    name: 'New Project',
    user: {
      connect: { id: userId },
    },
  },
  include: {
    user: true,
  },
});
```

### Example 3: Complex Queries

```typescript
// Search with filtering
const users = await prismaService.user.findMany({
  where: {
    AND: [
      { status: UserStatus.ACTIVE },
      {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
        ],
      },
    ],
  },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    _count: {
      select: {
        projects: true,
      },
    },
  },
});

// Aggregation
const stats = await prismaService.task.groupBy({
  by: ['status'],
  _count: true,
  where: {
    projectId,
  },
});
```

### Example 4: Transactions

```typescript
async transferProjectOwnership(projectId: string, newOwnerId: string) {
  return this.prisma.$transaction(async (tx) => {
    // Get current project
    const project = await tx.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Remove old owner from members
    await tx.membership.deleteMany({
      where: {
        projectId,
        userId: project.userId,
      },
    });

    // Update project owner
    const updatedProject = await tx.project.update({
      where: { id: projectId },
      data: {
        userId: newOwnerId,
      },
    });

    // Add old owner as regular member
    await tx.membership.create({
      data: {
        projectId,
        userId: project.userId,
        roles: ['MEMBER'],
      },
    });

    return updatedProject;
  });
}
```

## Related Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Prisma Integration](https://docs.nestjs.com/recipes/prisma)
- [Database Schema](../../prisma/schema.prisma)

## Troubleshooting

### Issue: "PrismaClient is unable to connect"

**Solution:** Check `DATABASE_URL` in `.env`

### Issue: "Type X is not assignable to type Y"

**Solution:** Regenerate Prisma Client:

```bash
bun run prisma:generate
```

### Issue: Slow Queries

**Solution:**

1. Use `select` instead of loading all fields
2. Add indexes in `schema.prisma`
3. Use Prisma Studio to analyze queries

---

**Author**: zim89  
**Last Updated**: 2025-01-10
