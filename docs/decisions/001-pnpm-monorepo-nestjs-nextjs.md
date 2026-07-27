# ADR-001: pnpm Monorepo with NestJS + Next.js

## Status

Accepted

## Date

2026-07-27

## Context

Nexora needs a backend API, a web dashboard, and room to grow shared libraries later — without inventing microservices on day one. Empty shared packages and nested app lockfiles already caused confusion.

## Decision

- Use a **pnpm workspace** monorepo with `apps/backend` (NestJS) and `apps/frontend` (Next.js).
- Keep **no shared packages** until two apps share real code.
- Run Postgres and Redis via **Docker Compose** at the repo root.
- Use **Prisma 6** for the first schema and migrations (pin major until Prisma 7 config migration is intentional).

## Alternatives considered

| Option | Why rejected (for now) |
|--------|-------------------------|
| Separate repos per app | Extra friction for a solo builder; shared types/docs harder |
| Turborepo / Nx | Useful later; adds tooling before there is a build graph problem |
| Microservices from day one | Violates simplicity-first; no team or scale pressure yet |
| TypeORM | Prisma gives faster schema feedback for early learning; revisit if needed |
| Prisma 7 | Breaking datasource config; adopt later with an explicit ADR |

## Consequences

- One root lockfile and `pnpm-workspace.yaml`; apps must not ship nested workspaces.
- Module boundaries live inside the Nest modular monolith until a real split signal appears.
- Revisit shared `packages/*` only after duplicated code appears twice (Rule of Three).
