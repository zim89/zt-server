# Auth Module

Authentication and authorization module for Zen Task application.

## 📁 Structure

```
src/modules/auth/
├── auth.controller.ts           # HTTP endpoints controller
├── auth.service.ts              # Core authentication business logic
├── auth.module.ts               # NestJS module
├── refresh-token.service.ts     # Refresh token management
├── constants/                   # Module constants
│   ├── auth.constants.ts        # Auth metadata keys
│   ├── auth-messages.ts         # Error and success messages
│   ├── auth-swagger.schemas.ts  # Swagger schemas
│   └── index.ts                 # Centralized exports
├── decorators/                  # Custom decorators
│   ├── auth.decorator.ts        # Combined auth + roles decorator
│   ├── auth-swagger.decorator.ts # Swagger documentation
│   ├── current-user.decorator.ts # Extract current user
│   ├── roles.decorator.ts       # Role metadata decorator
│   └── index.ts                 # Centralized exports
├── dto/                         # Data Transfer Objects
│   ├── register.dto.ts          # Registration DTO
│   ├── login.dto.ts             # Login DTO
│   ├── auth-response.dto.ts     # Authentication response DTO
│   └── index.ts                 # Centralized exports
├── guards/                      # Authentication guards
│   ├── jwt.guard.ts             # JWT authentication guard
│   ├── roles.guard.ts           # Role-based authorization guard
│   └── index.ts                 # Centralized exports
├── strategies/                  # Passport strategies
│   ├── jwt.strategy.ts          # JWT strategy
│   └── index.ts                 # Centralized exports
├── types/                       # TypeScript types
│   ├── auth.types.ts            # Authentication types
│   └── index.ts                 # Centralized exports
├── index.ts                     # Public API exports
└── README.md                    # Module documentation
```

## 🔧 Core Components

### AuthController

**Purpose**: Handle HTTP requests for authentication

**Endpoints:**

- `POST /auth/register` - Register new user account
- `POST /auth/login` - Login with email and password
- `POST /auth/refresh` - Refresh access token using cookie
- `POST /auth/logout` - Logout from current session
- `POST /auth/logout-all` - Logout from all devices
- `GET /auth/profile` - Get current user profile

**Usage:**

```typescript
// Automatically registered in AuthModule
// Access via http://localhost:4000/auth/*
```

### AuthService

**Purpose**: Core business logic for authentication

**Public Methods:**

- `register(res, dto)` - Register new user
- `login(res, dto)` - Authenticate user
- `refresh(req, res)` - Refresh access token
- `logout(res, userId)` - Logout user
- `logoutAllDevices(res, userId)` - Logout from all devices
- `getCurrentUser(userId)` - Get user by ID with latest data
- `validateUser(userId)` - Validate user for JWT strategy

**Usage in other modules:**

```typescript
import { AuthService } from 'src/modules/auth';

@Injectable()
export class TaskService {
  constructor(private authService: AuthService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    // Get fresh user data from database
    const user = await this.authService.getCurrentUser(userId);

    if (!user.roles.includes(UserRole.OWNER)) {
      throw new ForbiddenException();
    }

    // Create task...
  }
}
```

### RefreshTokenService

**Purpose**: Manage refresh tokens and user sessions

**Features:**

- Store refresh tokens in HTTP-only cookies
- Hash refresh tokens before saving to database
- Validate refresh tokens against database
- Invalidate tokens on logout
- Single session policy (removes old sessions)
- Track session metadata (IP, User-Agent)

## 🔐 Authentication & Authorization

### JWT Tokens

**Access Token:**

- Short lifetime (7 days by default)
- Sent in `Authorization: Bearer <token>` header
- Contains user ID, email, and roles

**Refresh Token:**

- Long lifetime (30 days by default)
- Stored in HTTP-only cookie
- Used to obtain new access token
- Hashed in database for security

### Roles and Access Control

**Available Roles:**

- `OWNER` - Default role, full access to own resources
- `ADMIN` - Administrative privileges
- `MEMBER` - Standard member access
- `VIEWER` - Read-only access

**Users can have multiple roles** (stored as array in database)

**Usage:**

```typescript
import { Auth, CurrentUser } from 'src/modules/auth';

// Default protection (OWNER role)
@Get('profile')
@Auth()
getProfile(@CurrentUser() user: AuthenticatedUser) {
  return user;
}

// Specific role
@Get('admin')
@Auth(UserRole.ADMIN)
getAdminData() {
  return 'Admin only data';
}

// Multiple roles
@Get('privileged')
@Auth([UserRole.ADMIN, UserRole.OWNER])
getPrivilegedData() {
  return 'Admin or Owner only';
}
```

## 📝 DTOs

### RegisterDto

**Purpose**: Data for user registration

**Fields:**

- `email` - Email address (valid email format)
- `password` - Password (minimum 6 characters)

**Auto-generated fields:**

- `firstName` - Extracted from email (before @)
- `lastName` - Empty string by default
- `emailVerified` - Set to `true` by default
- `status` - Set to `ACTIVE` by default
- `roles` - Set to `[OWNER]` by default

**Example:**

```typescript
const registerDto: RegisterDto = {
  email: 'john@example.com',
  password: 'SecurePass123!',
};

// Results in:
// firstName: 'john'
// lastName: ''
// emailVerified: true
// status: ACTIVE
// roles: [OWNER]
```

### LoginDto

**Purpose**: Data for user login

**Fields:**

- `email` - Email address
- `password` - Password

**Example:**

```typescript
const loginDto: LoginDto = {
  email: 'john@example.com',
  password: 'SecurePass123!',
};
```

### AuthResponseDto

**Purpose**: Response for successful authentication

**Fields:**

- `accessToken` - JWT access token
- `user` - User data (without password)

**Note:** Refresh token is NOT included in response - it's stored in HTTP-only cookie

**Example:**

```typescript
const response: AuthResponseDto = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: {
    id: 'clx1a2b3c4d5e6f7g8h9i0j1',
    email: 'john@example.com',
    firstName: 'john',
    lastName: '',
    roles: ['OWNER'],
    status: 'ACTIVE',
    emailVerified: true,
    lastLoginAt: '2024-01-15T10:30:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  },
};
```

## 🛡️ Guards and Decorators

### @Auth() Decorator (Recommended)

**Purpose**: Combined decorator for authentication and authorization

**Usage:**

```typescript
import { Auth } from 'src/modules/auth';

// Default protection (OWNER role)
@Get('my-tasks')
@Auth()
getMyTasks() {
  return 'Protected endpoint';
}

// Specific role
@Get('admin')
@Auth(UserRole.ADMIN)
getAdminPanel() {
  return 'Admin only';
}

// Multiple roles
@Get('management')
@Auth([UserRole.ADMIN, UserRole.OWNER])
getManagementData() {
  return 'Admin or Owner only';
}
```

**What it includes:**

- JWT authentication
- Role-based authorization
- Swagger Bearer Auth annotation

### @CurrentUser() Decorator

**Purpose**: Extract authenticated user from request

**Usage:**

```typescript
import { Auth, CurrentUser } from 'src/modules/auth';
import type { AuthenticatedUser } from 'src/modules/auth';

// Get full user object
@Get('profile')
@Auth()
getProfile(@CurrentUser() user: AuthenticatedUser) {
  console.log(user.id, user.email, user.roles);
  return user;
}

// Get specific field
@Get('user-id')
@Auth()
getUserId(@CurrentUser('id') userId: string) {
  return { userId };
}
```

### JwtGuard (Low-level)

**Purpose**: JWT token validation

**Usage:**

```typescript
import { JwtGuard } from 'src/modules/auth';

// Use when you need ONLY authentication (no role check)
@UseGuards(JwtGuard)
@Get('authenticated-only')
getData() {
  return 'Any authenticated user can access this';
}
```

**Note:** Prefer using `@Auth()` decorator instead.

## 🔄 Integration

### Add to AppModule

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    // other modules
  ],
})
export class AppModule {}
```

### Use in Other Modules

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TaskService } from './task.service';

@Module({
  imports: [AuthModule], // Import to use AuthService
  providers: [TaskService],
})
export class TaskModule {}
```

### Use AuthService in Other Services

```typescript
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { AuthenticatedUser } from '../auth';

@Injectable()
export class TaskService {
  constructor(private authService: AuthService) {}

  async getUserTasks(userId: string) {
    // Get fresh user data from database
    const user = await this.authService.getCurrentUser(userId);

    // Use user data...
    return this.getTasksForUser(user);
  }
}
```

## 🔧 Configuration

### Environment Variables

**Required:**

```env
# JWT Configuration
JWT_SECRET=your-secure-secret-key-here
JWT_ACCESS_EXPIRES=7d
JWT_REFRESH_EXPIRES=30d

# Server
PORT=4000
NODE_ENV=development

# Cookies
COOKIE_DOMAIN=
```

**Variable Details:**

- `JWT_SECRET` - Secret key for JWT signing (required, throw error if missing)
- `JWT_ACCESS_EXPIRES` - Access token lifetime (default: 7d)
- `JWT_REFRESH_EXPIRES` - Refresh token lifetime (default: 30d)
- `NODE_ENV` - Environment mode (development/production)
- `COOKIE_DOMAIN` - Cookie domain (empty for localhost, '.domain.com' for production)
- `PORT` - Server port (default: 4000)

### Generate JWT_SECRET

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Bun
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📋 API Examples

### Registration

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com",
    "firstName": "user",
    "lastName": "",
    "roles": ["OWNER"],
    "status": "ACTIVE"
  }
}
```

### Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Refresh Token

```bash
curl -X POST http://localhost:4000/auth/refresh \
  -H "Cookie: refreshToken=<token_from_login>"
```

### Get Profile

```bash
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer <access_token>"
```

### Logout

```bash
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer <access_token>"
```

## ⚠️ Important Notes

### Security

- ✅ Passwords hashed with Argon2id algorithm
- ✅ Refresh tokens stored in HTTP-only cookies (XSS protection)
- ✅ Refresh tokens hashed in database
- ✅ User status validation (only ACTIVE users can login)
- ✅ Single session policy (old sessions invalidated on new login)
- ✅ Session metadata tracking (IP, User-Agent)

### Session Management

**Single Session Policy:**

- When user logs in, all previous active sessions are invalidated
- Only one active session per user at a time
- Use `/auth/logout-all` to logout from all devices

**Session Data:**

- Refresh token hash (Argon2id)
- Expiration timestamp
- Client IP address
- User-Agent string
- Active status flag

### Cookie Settings

**Development:**

- `httpOnly: true` - Prevents JavaScript access
- `secure: false` - Works with HTTP
- `sameSite: 'lax'` - CSRF protection
- `domain: ''` - Works on localhost

**Production:**

- `httpOnly: true` - Prevents JavaScript access
- `secure: true` - Requires HTTPS
- `sameSite: 'strict'` - Strict CSRF protection
- `domain: '.yourdomain.com'` - Works on subdomains

## 🚀 Quick Start

### 1. Setup Environment

Create `.env` file with required variables:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-generated-secret"
JWT_ACCESS_EXPIRES=7d
JWT_REFRESH_EXPIRES=30d
NODE_ENV=development
COOKIE_DOMAIN=
PORT=4000
```

### 2. Run Migrations

```bash
bun run prisma:generate
bun run prisma:migrate
```

### 3. Start Server

```bash
bun run start:dev
```

### 4. Test API

Open Swagger documentation:

```
http://localhost:4000/api/docs
```

## 📖 API Documentation

### Swagger UI

Access interactive API documentation at:

```
http://localhost:4000/api/docs
```

Features:

- Try out all endpoints
- View request/response schemas
- Test authentication flow
- See error responses

### Endpoints Summary

| Method | Endpoint           | Auth Required | Description            |
| ------ | ------------------ | ------------- | ---------------------- |
| POST   | `/auth/register`   | ❌            | Register new account   |
| POST   | `/auth/login`      | ❌            | Login to account       |
| POST   | `/auth/refresh`    | ❌            | Refresh access token   |
| POST   | `/auth/logout`     | ✅            | Logout current session |
| POST   | `/auth/logout-all` | ✅            | Logout all sessions    |
| GET    | `/auth/profile`    | ✅            | Get user profile       |

## 🔍 Troubleshooting

### "User not authenticated" Error

**Cause:** Missing or invalid JWT token

**Solution:**

- Include `Authorization: Bearer <token>` header
- Check token expiration
- Refresh token if expired

### "Invalid or expired token" Error

**Cause:** Refresh token expired or invalid

**Solution:**

- Login again to get new tokens
- Check refresh token in cookies
- Verify cookie domain settings

### "User with this email already exists" Error

**Cause:** Email already registered

**Solution:**

- Use different email
- Try login instead of register
- Check if account exists

## 🧪 Testing

### Manual Testing with cURL

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | jq -r '.accessToken')

# 2. Get Profile
curl -X GET http://localhost:4000/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Logout
curl -X POST http://localhost:4000/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Swagger

1. Open http://localhost:4000/api/docs
2. Click "Try it out" on `/auth/register`
3. Fill in email and password
4. Execute request
5. Copy `accessToken` from response
6. Click "Authorize" button (top right)
7. Paste token and click "Authorize"
8. Now you can test protected endpoints

## 🏗️ Architecture

### Authentication Flow

```
1. User registers/logs in
2. Server generates access + refresh tokens
3. Access token sent in response body
4. Refresh token stored in HTTP-only cookie
5. Client sends access token in Authorization header
6. When access token expires, client calls /refresh
7. Server validates refresh token from cookie
8. Server generates new tokens
9. Cycle repeats
```

### Password Hashing

- Algorithm: **Argon2id**
- Type: Memory-hard, resistant to GPU attacks
- Library: `argon2` (Node.js native bindings)

### Token Generation

- Algorithm: **HS256** (HMAC with SHA-256)
- Secret: From `JWT_SECRET` environment variable
- Payload: `{ sub: userId, email, roles }`

## 📚 Additional Resources

### Related Modules

- `PrismaModule` - Database access
- `ConfigModule` - Environment configuration

### Database Models

- `User` - User accounts with roles and status
- `Session` - Active user sessions with refresh tokens

### Best Practices

1. Always use `@Auth()` decorator (not `@UseGuards()` directly)
2. Use `@CurrentUser()` to get user data in controllers
3. Use `authService.getCurrentUser()` to get fresh data in services
4. Never store passwords in plain text
5. Never send refresh tokens in response body
6. Always validate user status before authentication
7. Use `getOrThrow()` for critical environment variables

## 🔗 External Links

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [Argon2](https://github.com/P-H-C/phc-winner-argon2)
