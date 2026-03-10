# AGENTS.md — AI Coding Agent Guidelines

This document describes best practices for using AI coding agents (GitHub Copilot, Copilot Workspace, Claude, ChatGPT, etc.) in this repository.

---

## Table of contents

1. [Scope of autonomy](#scope-of-autonomy)
2. [How to prompt agents effectively](#how-to-prompt-agents-effectively)
3. [What agents should and should not do](#what-agents-should-and-should-not-do)
4. [Code quality expectations](#code-quality-expectations)
5. [Security rules](#security-rules)
6. [Testing requirements](#testing-requirements)
7. [Review checklist for AI-generated code](#review-checklist-for-ai-generated-code)
8. [Preferred tools and patterns](#preferred-tools-and-patterns)

---

## Scope of autonomy

Agents are expected to:

- Implement well-scoped features described in an issue or PR description.
- Write or update tests for every change.
- Update inline documentation and JSDoc when the public API changes.
- Run linting and tests before reporting completion.
- Commit only the files directly related to the task; do not include build artifacts or `node_modules`.

Agents should **stop and ask** before:

- Changing the database schema in a way that requires a migration.
- Adding new third-party runtime dependencies (check the security advisory database first).
- Modifying authentication or authorisation logic significantly.
- Touching environment configuration in a way that affects production.

---

## How to prompt agents effectively

### Be specific about scope

❌ Vague: "improve the auth module"  
✅ Specific: "add a `POST /auth/refresh` endpoint that accepts a refresh token and returns a new access token; include unit and e2e tests"

### Provide context

Include relevant file paths, existing interfaces, and any constraints (e.g. "do not change the User entity schema").

### Specify outputs

Tell the agent what artifacts to produce:
- Source files to create or modify
- Test files
- Documentation updates

### Example prompt template

```
Task: <one-sentence description>

Files to change:
- src/auth/auth.service.ts
- src/auth/auth.controller.ts
- src/auth/auth.service.spec.ts

Constraints:
- Use the existing JwtService from @nestjs/jwt
- Do not modify the User entity
- Keep backwards compatibility with the existing /auth/login response shape

Definition of done:
- npm run test passes
- npm run test:e2e passes
- npm run lint passes
```

---

## What agents should and should not do

### ✅ Agents SHOULD

- Follow the existing code style (Prettier + ESLint config in this repo).
- Use NestJS built-in primitives: modules, injectable services, guards, pipes, interceptors.
- Use `class-validator` and `class-transformer` for all request DTO validation.
- Read secrets from `process.env` via `@nestjs/config`; never hard-code values.
- Write tests that mock external dependencies at the service boundary.
- Use TypeORM repositories injected via `@InjectRepository`.
- Return consistent HTTP status codes using NestJS exception classes.
- Add JSDoc to public service methods.

### ❌ Agents SHOULD NOT

- Commit `.env` files containing real secrets.
- Hard-code JWT secrets, passwords, or API keys anywhere in source or tests.
- Disable ESLint rules without a clear documented reason.
- Use `any` types without a comment explaining why.
- Remove or weaken existing tests.
- Introduce `eval`, dynamic `require`, or `exec`/`execSync` calls.
- Add new npm packages without checking for known vulnerabilities.
- Use `synchronize: true` in TypeORM config comments without noting it must be disabled in production.

---

## Code quality expectations

All AI-generated code is held to the same standard as human-written code:

| Criterion        | Expectation                                                           |
|------------------|-----------------------------------------------------------------------|
| TypeScript       | Strict mode; no implicit `any`; explicit return types on all methods  |
| Naming           | `camelCase` variables/methods, `PascalCase` classes, `UPPER_SNAKE` constants |
| Module size      | ≤ 400 LOC per file; split if larger                                   |
| Cyclomatic complexity | ≤ 10 per function                                               |
| Test coverage    | ≥ 80 % statement coverage on new code                                 |
| Docs             | JSDoc on every exported class and public method                       |

---

## Security rules

These rules are **non-negotiable** and must never be overridden by an agent prompt:

1. **No secrets in code.** All secrets must come from environment variables.
2. **Validate all user input.** Use DTOs with `class-validator` on every request body.
3. **Sanitise error messages.** Do not expose stack traces or internal DB errors to clients.
4. **Password storage.** Always hash passwords with bcrypt (cost factor ≥ 10); never store plaintext.
5. **JWT.** Use asymmetric keys (RS256) in production; verify `exp`, `iss`, and `aud` claims.
6. **Dependency vetting.** Check new packages against the GitHub Advisory Database before adding them.
7. **SQL injection.** Use TypeORM query builder or repository methods; never interpolate raw SQL.
8. **CORS.** Restrict allowed origins explicitly; do not use `*` in production.

---

## Testing requirements

Every PR touching application code must include:

- **Unit tests** (`*.spec.ts` next to the source file) covering the happy path and the most important error paths.
- **E2E tests** (`test/app.e2e-spec.ts`) for any new HTTP endpoint.
- All existing tests must continue to pass.

Agents should run the following before declaring a task complete:

```bash
npm run lint
npm run test
npm run test:e2e
```

---

## Review checklist for AI-generated code

Before approving a PR that contains AI-generated code, reviewers should verify:

- [ ] The change is minimal and focused on the stated task.
- [ ] No secrets or credentials have been committed.
- [ ] All new public methods have JSDoc.
- [ ] DTOs use `class-validator` decorators.
- [ ] Tests cover both success and failure cases.
- [ ] `npm run lint`, `npm run test`, and `npm run test:e2e` all pass.
- [ ] No new `any` types without justification.
- [ ] No disabled ESLint rules without justification.
- [ ] New dependencies have been checked for known CVEs.
- [ ] Error messages do not leak sensitive internal details.

---

## Preferred tools and patterns

| Concern            | Preferred approach                                  |
|--------------------|-----------------------------------------------------|
| HTTP framework     | NestJS (`@nestjs/core`)                             |
| Auth               | `@nestjs/passport` + `passport-jwt`                 |
| Config             | `@nestjs/config` with `.env` files                  |
| Validation         | `class-validator` + `class-transformer`             |
| ORM                | TypeORM (`@nestjs/typeorm`)                         |
| Testing            | Jest + `@nestjs/testing`                            |
| Health checks      | `@nestjs/terminus`                                  |
| Password hashing   | `bcrypt` (cost ≥ 10)                                |
| Logging            | NestJS built-in `Logger`; structured JSON in prod   |
| API documentation  | `@nestjs/swagger` (add when first public API ships) |
