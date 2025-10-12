# 📋 Zen Task API

> Modern task management REST API built with NestJS, Bun, PostgreSQL, and Prisma ORM

## 🎯 Overview

A secure and scalable task management API designed for personal productivity and team collaboration. Built with modern TypeScript stack focusing on type safety, security by default, and developer experience.

**Current Status:** MVP Complete — 6 core modules implemented (86% of planned features)

## ✨ Features

### Core Functionality

- 🔐 **Authentication & Authorization**
  - JWT access + refresh tokens
  - HTTP-only cookies for secure token storage
  - Role-based access control (OWNER, ADMIN, MEMBER, VIEWER)
  - Argon2id password hashing

- 📊 **Project Management**
  - Multi-user projects with membership system
  - Project roles and permissions (owner, admin, member, viewer)
  - Favorite and hidden projects
  - Auto-generated slugs for SEO-friendly URLs

- ✅ **Task Management**
  - 8 task statuses (NOT_STARTED, IN_PROGRESS, COMPLETED, etc.)
  - Task assignments to team members
  - Due dates with overdue tracking
  - Task notes and descriptions
  - Advanced filtering (10+ parameters)

- 🏷️ **Categories & Markers**
  - Task categorization with auto-generated slugs
  - Default markers available to all users (read-only)
  - Personal markers with custom colors (hex validation)
  - Multiple markers per task (many-to-many)

- 📈 **Statistics & Analytics**
  - Real-time dashboard metrics
  - Task completion rates and trends
  - Productivity tracking (daily/weekly)
  - Project activity overview

### Technical Features

- ⚡ **High Performance** - Bun runtime (faster than Node.js)
- 🛡️ **Security First** - Input validation, SQL injection protection, no sensitive data in responses
- 📝 **Type Safety** - Strict TypeScript, Prisma ORM for type-safe database queries
- 📚 **API Documentation** - Interactive Swagger UI at `/api/docs`
- 🎨 **Clean Architecture** - Modular structure, dependency injection, separation of concerns
- 🔄 **Developer Experience** - Hot reload, auto-formatting, centralized constants

## 🛠️ Tech Stack

| Layer          | Technology                          | Purpose                            |
| -------------- | ----------------------------------- | ---------------------------------- |
| **Runtime**    | Bun 1.x                             | Fast JavaScript runtime            |
| **Framework**  | NestJS 10.x                         | Enterprise-grade Node.js framework |
| **Language**   | TypeScript 5.x                      | Type-safe development              |
| **Database**   | PostgreSQL (Neon)                   | Serverless PostgreSQL              |
| **ORM**        | Prisma 6.x                          | Type-safe database client          |
| **Auth**       | JWT + Passport                      | Secure authentication              |
| **Validation** | class-validator + class-transformer | Request/response validation        |
| **Docs**       | Swagger/OpenAPI                     | Interactive API documentation      |
| **Hashing**    | Argon2id                            | Secure password hashing            |

## 📦 Implemented Modules

| Module    | Description                                  | Endpoints | Status       |
| --------- | -------------------------------------------- | --------- | ------------ |
| Auth      | Registration, login, JWT, refresh tokens     | 5         | ✅ Complete  |
| Project   | Project CRUD, membership, role-based access  | 9         | ✅ Complete  |
| Task      | Task CRUD, statuses, assignments, markers    | 9         | ✅ Complete  |
| Category  | Category CRUD, slug generation               | 6         | ✅ Complete  |
| Marker    | Marker CRUD, default/personal, custom colors | 6         | ✅ Complete  |
| Statistic | Real-time analytics, dashboard metrics       | 1         | ✅ Complete  |
| Contact   | Contact management                           | 0         | ⏸️ Postponed |

**Total API Endpoints:** 36

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────────────────┐
│           NestJS Application            │
│  ┌─────────────────────────────────┐   │
│  │        Controllers              │   │
│  │  (Routes + Validation)          │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │    Guards & Decorators          │   │
│  │  (@Auth, @CurrentUser, etc.)    │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │         Services                │   │
│  │    (Business Logic)             │   │
│  └──────────┬──────────────────────┘   │
│             │                           │
│  ┌──────────▼──────────────────────┐   │
│  │      Prisma Service             │   │
│  │   (Database Abstraction)        │   │
│  └──────────┬──────────────────────┘   │
└─────────────┼──────────────────────────┘
              │
       ┌──────▼───────┐
       │  PostgreSQL  │
       └──────────────┘
```

### Key Principles

- **Type Safety First** - Strict TypeScript, no `any` types
- **Security by Default** - Validation on all inputs, explicit field selection
- **Modular Architecture** - Singular module naming (project, task, not projects)
- **Centralized Constants** - No hardcoded strings (apiTags, controllerPaths, etc.)
- **Global Modules** - PrismaService available everywhere via DI
- **Explicit Field Selection** - Never return passwords or sensitive data

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- PostgreSQL >= 14 (or [Neon](https://neon.tech) account for serverless PostgreSQL)
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd zt-server

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# Setup database
bun run prisma:generate
bun run prisma:migrate

# Start development server
bun run start:dev
```

Server will start at `http://localhost:4000`

### Environment Variables

Required variables in `.env`:

```env
# Database (Neon serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/zentask?sslmode=require"
# Or local PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/zentask"

# JWT
JWT_SECRET="your-secret-key-min-32-chars"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Application
NODE_ENV="development"
PORT=4000

# Cookies
COOKIE_DOMAIN="localhost"
```

## 📚 API Documentation

### 📖 Interactive Swagger UI

**URL:** `http://localhost:4000/api/docs`

Interactive API documentation with the following features:

- 🧪 **Try it out** - Test all endpoints directly from browser
- 📝 **Request/Response schemas** - View detailed data structures
- 🔐 **Authentication** - Authorize with JWT tokens (click "Authorize" button)
- 🏷️ **Module grouping** - Endpoints organized by tags (auth, projects, tasks, etc.)
- 📋 **Examples** - Pre-filled examples for all request bodies
- 🔍 **Search & filter** - Find endpoints quickly

**Quick Start with Swagger:**

1. Start the server: `bun run start:dev`
2. Open `http://localhost:4000/api/docs` in browser
3. Register a new user via `POST /auth/register`
4. Copy the `accessToken` from response
5. Click "Authorize" button at the top
6. Paste token and click "Authorize"
7. Try out any protected endpoint!

### API Endpoints Overview

**Auth (5 endpoints)**

- `POST /auth/register` - Create new account
- `POST /auth/login` - Login to existing account
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate tokens
- `GET /auth/profile` - Get current user profile

**Projects (9 endpoints)**

- `GET /projects` - List all projects (with pagination)
- `GET /projects/:id` - Get project by ID
- `GET /projects/slug/:slug` - Get project by slug
- `POST /projects` - Create new project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/members` - Add member to project
- `DELETE /projects/:id/members/:memberId` - Remove member
- `PATCH /projects/:id/members/:memberId/role` - Update member role

**Tasks (9 endpoints)**

- `GET /tasks` - List all tasks (with filters)
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status
- `PATCH /tasks/:id/assign` - Assign/unassign user
- `POST /tasks/:id/markers/:markerId` - Add marker to task
- `DELETE /tasks/:id/markers/:markerId` - Remove marker

**Categories (6 endpoints)**

- `GET /categories` - List categories
- `GET /categories/:id` - Get category by ID
- `GET /categories/slug/:slug` - Get category by slug
- `POST /categories` - Create category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

**Markers (6 endpoints)**

- `GET /markers` - List markers (default + personal)
- `GET /markers/:id` - Get marker by ID
- `GET /markers/slug/:slug` - Get marker by slug
- `POST /markers` - Create personal marker
- `PATCH /markers/:id` - Update personal marker
- `DELETE /markers/:id` - Delete personal marker

**Statistics (1 endpoint)**

- `GET /statistics/overview` - Get user statistics dashboard

## 📂 Project Structure

```
zt-server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── main.ts             # Application entry point
│   ├── app.module.ts       # Root module
│   ├── modules/            # Feature modules (singular naming!)
│   │   ├── auth/           # Authentication & authorization
│   │   ├── project/        # Project management
│   │   ├── task/           # Task management
│   │   ├── category/       # Categories
│   │   ├── marker/         # Markers/labels
│   │   └── statistic/      # Statistics & analytics
│   ├── prisma/             # Global Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   └── shared/             # Shared utilities
│       ├── config/         # Configuration (JWT, Swagger)
│       ├── constants/      # App constants (no hardcoded strings!)
│       ├── dto/            # Base DTOs (PaginationQueryDto)
│       ├── types/          # Shared types
│       └── utils/          # Utilities (pagination, slug generation)
├── test/                  # E2E tests
└── README.md              # This file
```

### Module Structure (Singular Naming!)

Each module follows consistent structure:

```
modules/{entity}/              # ⚠️ Singular: project, task, NOT projects!
├── {entity}.module.ts         # NestJS module
├── {entity}.controller.ts     # REST controller
├── {entity}.service.ts        # Business logic
├── index.ts                   # Public API exports
├── README.md                  # Module documentation
├── dto/                       # Data Transfer Objects
├── types/                     # TypeScript types
├── constants/                 # Messages & Swagger schemas
└── decorators/                # Swagger decorators
```

**Note:** URLs remain plural (`/projects`, `/tasks`) following REST conventions.

## 💻 Development Commands

```bash
# Development
bun run start:dev          # Start dev server with watch mode
bun run build              # Build for production
bun run start:prod         # Run production build

# Database
bun run prisma:generate    # Generate Prisma Client types
bun run prisma:migrate     # Create and apply migration
bun run prisma:studio      # Open Prisma Studio (database GUI)
bun run prisma:db:push     # Push schema without migration (dev only)

# Code Quality
bunx eslint --fix "src/**/*.ts"  # Auto-fix linting issues
bun run format             # Format code with Prettier
```

## 🗄️ Database Schema

### Core Models

- **User** - Users with roles and authentication
- **Project** - Projects with membership system
- **Membership** - User-project relationships with roles
- **Task** - Tasks with statuses, assignments, and deadlines
- **Category** - Task categories with slugs
- **Marker** - Task markers/labels (default + personal)
- **Contact** - Contacts and team members (planned)
- **Session** - Refresh token sessions

### Key Relations

```
User ──[owner]──> Project
User ──[member]─> Membership <─[project]── Project
User ──[creator]─> Task
User ──[assignee]─> Task
Project ──[has many]──> Task
Task ──[has one]──> Category
Task ──[many-to-many]──> Marker
```

**Database Tool:** Prisma Studio available at `http://localhost:5555` (run `bun run prisma:studio`)

## 🔒 Security

### Implemented Security Measures

- ✅ **Argon2id Password Hashing** - Most secure hashing algorithm
- ✅ **JWT Access Tokens** - Short-lived (15 minutes)
- ✅ **Refresh Tokens** - Long-lived (7 days) in HTTP-only cookies
- ✅ **Role-Based Access Control** - User and project-level roles
- ✅ **Input Validation** - class-validator on all DTOs
- ✅ **SQL Injection Protection** - Prisma parameterized queries
- ✅ **Explicit Field Selection** - Never expose passwords in API responses
- ✅ **CORS Configuration** - Configurable allowed origins

### Best Practices

- All endpoints require authentication (except register/login)
- Sensitive data (passwords, tokens) never returned in responses
- Access control at service level (not just route guards)
- Environment variables for all secrets (never hardcoded)

## 🚢 Deployment

### Production Build

```bash
# Build the application
bun run build

# Run production server
bun run start:prod
```

### Environment Setup

Ensure all required environment variables are set:

```bash
NODE_ENV=production
DATABASE_URL=<neon-database-url>
JWT_SECRET=<secure-secret-min-32-chars>
COOKIE_DOMAIN=<your-domain>
```

### Recommended Platforms

- **Database:** [Neon](https://neon.tech) - Serverless PostgreSQL
- **Hosting:** Railway, Render, Vercel, AWS, DigitalOcean
- **Monitoring:** Sentry for error tracking

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Complete)

- Auth, Project, Task, Category, Marker, Statistic modules

### 🔜 Phase 2: Enhanced Features (Planned)

- 💬 Comments on tasks
- 📎 File attachments
- 🔔 Notifications system
- 🔗 External integrations (GitHub, Slack)

### 🔮 Future Phases

- WebSockets for real-time updates
- Advanced analytics and reports
- Team collaboration features
- Mobile API optimization

## 📝 Code Standards

### Naming Conventions

- **Modules:** Singular form (`project`, `task`, NOT `projects`)
- **URLs:** Plural form (`/projects`, `/tasks`)
- **Files:** kebab-case (`auth.service.ts`)
- **Classes:** PascalCase (`AuthService`)
- **Variables:** camelCase (`userId`)
- **Constants:** UPPER_SNAKE_CASE or camelCase + `as const`

### No Hardcoded Strings!

```typescript
// ✅ Good - use constants
import { apiTags, controllerPaths, routeParams } from '@/shared/constants';

@ApiTags(apiTags.projects)
@Controller(controllerPaths.projects)
export class ProjectController {
  @Get(':id')
  findOne(@Param(routeParams.id) id: string) {}
}

// ❌ Bad - hardcoded strings
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  @Get(':id')
  findOne(@Param('id') id: string) {}
}
```

## 🤝 Contributing

### Development Guidelines

1. **Naming:** Use singular naming for modules (`task`, not `tasks`)
2. **Code Style:** Run `bunx eslint --fix "src/**/*.ts"` before committing
3. **Language:** All code and comments must be in English
4. **Documentation:** Update module README and Swagger for new features
5. **Constants:** Never use hardcoded strings (use `apiTags`, `controllerPaths`, etc.)
6. **Types:** Strict TypeScript, no `any` types
7. **Security:** Always use explicit field selection in Prisma queries

## 📄 License

[MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

This project is a personal pet-project for learning and portfolio purposes.

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Neon PostgreSQL](https://neon.tech)

---

**Version:** 1.4.0  
**Last Updated:** 2025-01-12  
**Author:** zim89  
**Status:** MVP Complete ✅
