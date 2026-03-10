# Contributing

Thank you for taking the time to contribute! Please read this guide before opening issues or pull requests.

## Table of contents

1. [Code of conduct](#code-of-conduct)
2. [Getting started](#getting-started)
3. [Branching strategy](#branching-strategy)
4. [Commit messages](#commit-messages)
5. [Code style](#code-style)
6. [Testing](#testing)
7. [Pull request process](#pull-request-process)
8. [Security](#security)

---

## Code of conduct

Be respectful and constructive. Harassment or abusive behaviour of any kind will not be tolerated.

---

## Getting started

```bash
# Fork and clone the repository
git clone https://github.com/<your-username>/nest-test.git
cd nest-test

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
# Edit .env and set a local JWT_SECRET

# Verify everything works
npm run test
npm run test:e2e
```

---

## Branching strategy

| Branch pattern      | Purpose                                      |
|---------------------|----------------------------------------------|
| `main`              | Production-ready code; protected             |
| `develop`           | Integration branch for ongoing work          |
| `feature/<name>`    | New features (`feature/jwt-refresh-tokens`)  |
| `fix/<name>`        | Bug fixes (`fix/health-check-db-timeout`)    |
| `chore/<name>`      | Non-functional changes (deps, config, docs)  |

Always branch off `develop`, not `main`.

---

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`

**Examples:**
```
feat(auth): add refresh-token endpoint
fix(health): handle DB connection timeout gracefully
docs: update README with production checklist
test(users): add edge-case specs for duplicate email
```

- Use the imperative mood in the summary line ("add" not "added")
- Keep the summary ≤ 72 characters
- Reference issue numbers in the footer: `Closes #42`

---

## Code style

- **Language:** TypeScript (strict mode)
- **Formatter:** [Prettier](https://prettier.io/) — run `npm run format` before committing
- **Linter:** ESLint — run `npm run lint` before committing
- **Module pattern:** One NestJS module per feature domain; keep controllers thin, put logic in services
- **Dependency injection:** Prefer constructor injection; avoid property injection
- **DTOs:** Use `class-validator` decorators for all request payloads
- **Error handling:** Throw NestJS built-in exceptions (`NotFoundException`, `UnauthorizedException`, etc.) from services; never let raw DB errors surface to the client
- **Environment secrets:** Read all secrets from `process.env` via `@nestjs/config`; never hard-code secrets

Pre-commit hooks enforce formatting and linting automatically (if configured via Husky).

---

## Testing

### Philosophy

- **Unit tests** live next to the source file they test (`*.spec.ts`).
- **E2E tests** live in the `test/` directory.
- Aim for 80 %+ statement coverage on new code.
- Mock external dependencies (DB, third-party APIs) in unit tests; use real in-memory SQLite in e2e tests.

### Running tests

```bash
# Unit tests (watch mode during development)
npm run test:watch

# Single run with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

### Test guidelines

- Each test should be independent and deterministic — no shared mutable state between tests.
- Name tests as: `it('should <expected behaviour> when <condition>', ...)`
- Prefer `jest.fn()` mock factories over `jest.spyOn` for service-level mocks.
- For database-backed e2e tests, use the in-memory SQLite instance; reset state between suites if necessary.

---

## Pull request process

1. Ensure `npm run lint`, `npm run test`, and `npm run test:e2e` all pass locally.
2. Keep PRs focused: one logical change per PR.
3. Update documentation (`README.md`, inline JSDoc) if the change affects the public API or configuration.
4. Fill in the PR template (summary, related issues, testing notes).
5. Request at least one reviewer before merging.
6. Squash-merge to `develop` once approved; the reviewer merges.

---

## Security

- **Do not** commit secrets, API keys, or passwords — not even to branches that will be deleted.
- If you discover a security vulnerability, please report it privately to the repository owner instead of opening a public issue.
- Follow the [OWASP Top 10](https://owasp.org/www-project-top-ten/) guidelines when adding new endpoints or handling user input.
