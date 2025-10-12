<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

**Zen Task API** - A modern task management REST API built with NestJS, Bun, PostgreSQL, and Prisma ORM.

### Features

- ✅ **Authentication & Authorization** - JWT with access/refresh tokens, role-based access
- ✅ **Project Management** - Projects with membership and role-based permissions
- ✅ **Task Management** - Full CRUD with statuses, assignments, and markers
- ✅ **Categories** - Task categorization with auto-generated slugs
- ✅ **Markers** - Task labels/tags with default and personal markers, custom colors
- 🔜 **Contacts** - Contact management (coming soon)

### Tech Stack

- **Runtime**: Bun (faster than Node.js)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (access + refresh tokens, HTTP-only cookies)
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI at `/api/docs`
- **Password Hashing**: Argon2id

### Implemented Modules

- ✅ **Auth Module** - User registration, login, profile, JWT authentication (5 endpoints)
- ✅ **Project Module** - Project CRUD, membership management, role-based access (9 endpoints)
- ✅ **Task Module** - Task CRUD, status management, assignments, markers (9 endpoints)
- ✅ **Category Module** - Category CRUD, slug generation, project-based access (6 endpoints)
- ✅ **Marker Module** - Marker CRUD, default/personal markers, custom colors (6 endpoints)

For detailed documentation, see:

- [AGENTS.md](AGENTS.md) - AI agent guidelines
- [docs/module-implementation-plan.md](docs/module-implementation-plan.md) - Implementation roadmap
- [docs/code-standards.md](docs/code-standards.md) - Coding standards

## Project setup

```bash
# Install dependencies
$ bun install

# Setup database
$ bun run prisma:generate
$ bun run prisma:migrate
```

## Compile and run the project

```bash
# development with watch mode
$ bun run start:dev

# production mode
$ bun run build
$ bun run start:prod

# Open Prisma Studio (database GUI)
$ bun run prisma:studio
```

## API Documentation

Swagger UI is available at: `http://localhost:4000/api/docs`

## Run tests

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
