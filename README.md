# nest-test

A NestJS boilerplate application featuring JWT authentication, a third-party API mockup, a TypeORM database layer, a health-check endpoint, and a full test suite.

## Features

- **JWT Authentication** — register and login endpoints issuing signed access tokens
- **Protected Routes** — guard any endpoint with `JwtAuthGuard`
- **Database Layer** — TypeORM with a SQLite in-memory database (swap to any supported DB in production)
- **Third-Party API Mockup** — injectable `ThirdPartyService` that simulates external HTTP calls; easy to replace with real `HttpService` calls
- **Health Check** — `GET /health` endpoint (powered by `@nestjs/terminus`) that reports app status, database reachability, and the current application version
- **Validation** — global `ValidationPipe` with `class-validator` DTOs
- **Environment Config** — `@nestjs/config` reads from `.env`; a `.env.example` template is included

## Project structure

```
src/
  app.module.ts          # Root module
  main.ts                # Bootstrap entry point
  auth/                  # JWT auth module (register, login, guard, strategy)
  health/                # Health-check module (/health endpoint)
  third-party/           # Mock third-party API service
  users/                 # Users module (TypeORM entity + service)
test/
  app.e2e-spec.ts        # End-to-end tests
```

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and set values
cp .env.example .env
# Edit .env: set JWT_SECRET to a strong random string before going to production

# 3. Start in development (watch mode)
npm run start:dev
```

The server starts on **http://localhost:3000**.

## Environment variables

| Variable         | Default (example)                    | Description                              |
|------------------|--------------------------------------|------------------------------------------|
| `JWT_SECRET`     | `your-secret-key-change-in-production` | Secret used to sign JWT tokens           |
| `JWT_EXPIRATION` | `3600s`                              | Token expiry duration (e.g. `3600s`, `1d`) |

> **Never** commit a real `JWT_SECRET` to source control.

## API endpoints

### Auth

| Method | Path             | Auth required | Description                    |
|--------|------------------|---------------|--------------------------------|
| POST   | `/auth/register` | No            | Create account, returns JWT    |
| POST   | `/auth/login`    | No            | Login, returns JWT             |

**Register / Login request body:**
```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

**Response:**
```json
{
  "access_token": "<jwt>"
}
```

Use the returned token in the `Authorization` header for protected routes:
```
Authorization: Bearer <access_token>
```

### Health check

| Method | Path      | Auth required | Description                          |
|--------|-----------|---------------|--------------------------------------|
| GET    | `/health` | No            | Returns app status, DB ping, version |

**Example response:**
```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } },
  "version": "0.0.1"
}
```

## Running tests

```bash
# Unit tests
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov
```

## Linting & formatting

```bash
# Lint
npm run lint

# Format with Prettier
npm run format
```

## Building for production

```bash
npm run build
npm run start:prod
```

> **Production checklist:**
> - Set a strong `JWT_SECRET` in your environment
> - Replace the SQLite in-memory database with a persistent database (e.g. PostgreSQL)
> - Disable TypeORM `synchronize: true` and use migrations instead
> - Enable HTTPS / TLS termination at the load balancer

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on branching, commits, code style, and testing.

## AI agents

See [AGENTS.md](AGENTS.md) for guidance on using AI coding agents effectively in this repository.

## License

[MIT](LICENSE)
