# Config Directory

Centralized application configuration for various components and services.

## 📋 Table of Contents

- [Purpose](#purpose)
- [Structure](#structure)
- [JWT Configuration](#jwt-configuration)
- [Swagger Configuration](#swagger-configuration)
- [Environment Variables](#environment-variables)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Purpose

The `config` directory contains configuration files and functions for setting up various application components. All configuration is centralized and uses environment variables for deployment flexibility.

### Benefits of Centralized Configuration

- **Single Source of Truth**: All configuration in one place
- **Type Safety**: TypeScript typing for all settings
- **Environment-based**: Different settings for dev/prod/test
- **Easy Testing**: Easy to mock configuration in tests
- **DRY Principle**: No duplication of configuration logic

## Structure

```
src/shared/config/
├── jwt.config.ts          # JWT/authentication configuration
├── swagger/               # Swagger/OpenAPI documentation
│   ├── index.ts           # Public API
│   ├── swagger.config.ts          # Main Swagger setup
│   ├── swagger-schemas.config.ts  # Reusable schemas
│   └── swagger.decorator.ts       # Decorators for API responses
└── README.md              # Documentation
```

## JWT Configuration

### File: `jwt.config.ts`

Configuration for JWT module (authentication and authorization).

#### Structure

```typescript
import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import { envKeys } from '@/shared/constants/env-keys';

export function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    global: true,
    secret: configService.getOrThrow<string>(envKeys.jwtSecret),
    signOptions: {
      algorithm: 'HS256',
    },
  };
}
```

#### Parameters

| Parameter               | Type      | Description                   | Environment Variable |
| ----------------------- | --------- | ----------------------------- | -------------------- |
| `global`                | `boolean` | JWT module available globally | -                    |
| `secret`                | `string`  | Secret key for signing tokens | `JWT_SECRET`         |
| `signOptions.algorithm` | `string`  | Signing algorithm (HS256)     | -                    |

#### Usage

```typescript
// In auth.module.ts
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@/shared/config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
})
export class AuthModule {}
```

#### Important Notes

- **`getOrThrow`**: App won't start without `JWT_SECRET` (critical variable)
- **`global: true`**: JWT service available in all modules without explicit import
- **Algorithm**: Uses `HS256` (symmetric encryption)
- **TTL**: Token lifetime is set during generation, not in module config

#### Security Best Practices

1. **Never commit JWT_SECRET**: Use `.env` file
2. **Secret length**: Minimum 32 characters, recommended 64+
3. **Rotation**: Periodically change secret (when compromised)
4. **Different secrets**: Dev/Staging/Production should use different secrets

```bash
# Generate secure secret
openssl rand -base64 64
```

## Swagger Configuration

Configuration for automatic API documentation generation via Swagger/OpenAPI.

### Module Structure

```
swagger/
├── index.ts                     # Exports
├── swagger.config.ts            # Main setup
├── swagger-schemas.config.ts    # Reusable schemas
└── swagger.decorator.ts         # Custom decorators
```

### 1. swagger.config.ts

#### Main Setup Function

```typescript
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Zen Task API')
    .setDescription('API documentation for Zen Task application')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:4000', 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ErrorResponse, ValidationErrorResponse],
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
}
```

#### DocumentBuilder Parameters

| Method             | Description        | Example                                |
| ------------------ | ------------------ | -------------------------------------- |
| `setTitle()`       | API title          | "Zen Task API"                         |
| `setDescription()` | API description    | "API documentation..."                 |
| `setVersion()`     | API version        | "1.0"                                  |
| `addBearerAuth()`  | JWT authentication | Automatically adds Authorization field |
| `addServer()`      | Server URL         | localhost, staging, production         |

#### SwaggerOptions

| Option                 | Type      | Description                                      |
| ---------------------- | --------- | ------------------------------------------------ |
| `persistAuthorization` | `boolean` | Save JWT token between reloads                   |
| `docExpansion`         | `string`  | Collapsed display (`'none'`, `'list'`, `'full'`) |
| `filter`               | `boolean` | Show search field                                |
| `showRequestDuration`  | `boolean` | Show request execution time                      |

#### Usage

```typescript
// In main.ts
import { setupSwagger } from '@/shared/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  await app.listen(4000);
}
```

### 2. swagger-schemas.config.ts

#### Reusable Error Schemas

```typescript
export class ErrorResponse {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ example: 'error' })
  error: string;
}

export class ValidationErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: ['email must be an email', 'password is too short'],
    isArray: true,
  })
  message: string[];
}
```

#### Why Schemas Are Needed

- **Consistency**: Same responses for all endpoints
- **DRY**: Don't duplicate error schemas in each controller
- **Auto-documentation**: Swagger automatically shows possible errors

#### Usage in Controllers

```typescript
@ApiResponse({
  status: 400,
  description: 'Validation failed',
  type: ValidationErrorResponse,
})
@Post('register')
async register(@Body() dto: RegisterDto) {
  // ...
}
```

### 3. swagger.decorator.ts

#### Custom Decorators for Common Responses

```typescript
export const ApiValidationErrorResponse = () =>
  applyDecorators(
    ApiBadRequestResponse({
      description: 'Validation failed',
      type: ValidationErrorResponse,
    }),
  );

export const ApiUnauthorizedErrorResponse = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponse,
    }),
  );

export const ApiNotFoundErrorResponse = () =>
  applyDecorators(
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: ErrorResponse,
    }),
  );
```

#### Usage

```typescript
// Instead of multi-line @ApiResponse
@Post('login')
@ApiValidationErrorResponse()
@ApiUnauthorizedErrorResponse()
async login(@Body() dto: LoginDto) {
  // ...
}
```

#### Benefits

- **Less code**: One decorator instead of 5+ lines
- **Consistency**: Same descriptions for all endpoints
- **Easy to update**: Changes in one place apply everywhere

## Environment Variables

### Used Variables

All environment variables are defined in `@/shared/constants/env-keys.ts`:

```typescript
export const envKeys = {
  // JWT
  jwtSecret: 'JWT_SECRET',
  jwtAccessExpires: 'JWT_ACCESS_EXPIRES',
  jwtRefreshExpires: 'JWT_REFRESH_EXPIRES',

  // Cookies
  cookieDomain: 'COOKIE_DOMAIN',

  // Environment
  nodeEnv: 'NODE_ENV',
} as const;
```

### Example .env File

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zendb

# Cookies
COOKIE_DOMAIN=localhost
```

### Variable Validation

#### Critical Variables (getOrThrow)

```typescript
// App won't start without these variables
const secret = configService.getOrThrow<string>(envKeys.jwtSecret);
```

#### Optional Variables (get)

```typescript
// Uses default value if not set
const port = configService.get<number>('PORT', 4000);
const accessTTL = configService.get<string>(envKeys.jwtAccessExpires, '15m');
```

## Best Practices

### ✅ Do

#### 1. Use Factory Functions for Configuration

```typescript
// ✅ Good - type-safe, testable
export function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.getOrThrow<string>(envKeys.jwtSecret),
  };
}

// In module
JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: getJwtConfig,
});
```

#### 2. Group Related Configuration

```typescript
// ✅ Good - all Swagger settings together
swagger/
  ├── swagger.config.ts
  ├── swagger-schemas.config.ts
  └── swagger.decorator.ts
```

#### 3. Use Constants for Env Variables

```typescript
// ✅ Good - autocomplete, type-safe
import { envKeys } from '@/shared/constants/env-keys';
configService.get(envKeys.jwtSecret);

// ❌ Bad - typos, no autocomplete
configService.get('JWT_SECRE'); // Typo!
```

#### 4. Document Environment Variables

```typescript
/**
 * JWT Configuration
 *
 * Environment variables:
 * - JWT_SECRET (required): Secret key for signing tokens
 * - JWT_ACCESS_EXPIRES (optional): Access token TTL (default: 15m)
 */
export function getJwtConfig() {}
```

### ❌ Don't

#### 1. Hardcode Values

```typescript
// ❌ Bad
const config = {
  secret: 'my-secret-key', // Never!
};

// ✅ Good
const config = {
  secret: configService.getOrThrow<string>(envKeys.jwtSecret),
};
```

#### 2. Scattered Configuration

```typescript
// ❌ Bad - configuration in each module
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Duplication!
    }),
  ],
})
```

#### 3. Missing Validation

```typescript
// ❌ Bad - can be undefined
const secret = configService.get('JWT_SECRET');

// ✅ Good - guaranteed to exist
const secret = configService.getOrThrow<string>(envKeys.jwtSecret);
```

## Examples

### Example 1: Adding New Configuration

Let's say we need to add Redis configuration:

#### 1. Create Config File

```typescript
// src/shared/config/redis.config.ts
import { ConfigService } from '@nestjs/config';
import type { RedisOptions } from 'ioredis';
import { envKeys } from '@/shared/constants/env-keys';

export function getRedisConfig(configService: ConfigService): RedisOptions {
  return {
    host: configService.get<string>(envKeys.redisHost, 'localhost'),
    port: configService.get<number>(envKeys.redisPort, 6379),
    password: configService.get<string>(envKeys.redisPassword),
    db: configService.get<number>(envKeys.redisDb, 0),
  };
}
```

#### 2. Add Env Keys

```typescript
// src/shared/constants/env-keys.ts
export const envKeys = {
  // ... existing keys

  // Redis
  redisHost: 'REDIS_HOST',
  redisPort: 'REDIS_PORT',
  redisPassword: 'REDIS_PASSWORD',
  redisDb: 'REDIS_DB',
} as const;
```

#### 3. Use in Module

```typescript
// src/cache/cache.module.ts
import { RedisModule } from '@nestjs-modules/ioredis';
import { getRedisConfig } from '@/shared/config/redis.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getRedisConfig,
    }),
  ],
})
export class CacheModule {}
```

### Example 2: Extending Swagger Decorators

```typescript
// swagger/swagger.decorator.ts

/**
 * Decorator for protected endpoints
 * Automatically adds Bearer Auth and 401 response
 */
export const ApiProtected = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedErrorResponse(),
  );

/**
 * Decorator for paginated endpoints
 */
export const ApiPaginated = (model: Type) =>
  applyDecorators(
    ApiOkResponse({
      description: 'Paginated list',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
            },
          },
        },
      },
    }),
  );

// Usage
@Get('users')
@ApiProtected()
@ApiPaginated(UserResponseDto)
async getUsers(@Query() query: PaginationDto) {
  // ...
}
```

### Example 3: Multi-environment Configuration

```typescript
// config/app.config.ts
export function getAppConfig(configService: ConfigService) {
  const env = configService.get('NODE_ENV', 'development');

  return {
    port: configService.get<number>('PORT', env === 'production' ? 3000 : 4000),
    cors: {
      enabled: env !== 'production',
      origins:
        env === 'production'
          ? ['https://app.zentask.com']
          : ['http://localhost:3000', 'http://localhost:4000'],
    },
    logging: {
      level: env === 'production' ? 'error' : 'debug',
      pretty: env !== 'production',
    },
    swagger: {
      enabled: env !== 'production', // Disable in production
    },
  };
}
```

## Related Resources

- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)
- [NestJS OpenAPI (Swagger)](https://docs.nestjs.com/openapi/introduction)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Environment Variables Constants](../constants/env-keys.ts)

## Troubleshooting

### Issue: "Cannot find module '@/shared/config/swagger'"

**Solution**: Use import through index.ts:

```typescript
import { setupSwagger } from '@/shared/config/swagger';
```

### Issue: "Configuration property 'JWT_SECRET' is not defined"

**Solution**:

1. Check `.env` file
2. Restart application after changing `.env`

### Issue: Swagger not updating after changes

**Solution**:

1. Clear cache: `rm -rf dist node_modules/.cache`
2. Restart dev server: `bun run start:dev`

---

**Author**: zim89  
**Last Updated**: 2025-01-10
