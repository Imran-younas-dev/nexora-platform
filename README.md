# Nexora

![Nexora — AI-native Engineering Operations Platform](docs/Nexora — AI-native Engineering Operations Platform.png)

AI-native Engineering Operations Platform.

**Current phase:** Phase 0 - Foundations

Nexora helps engineering teams investigate incidents and reduce MTTR. This repository is intentionally small: a NestJS API, a Next.js dashboard, PostgreSQL, Redis reserved for later phases, and a docs set that records what exists and why.

## Start Here

If you want to run the project:

```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Prerequisites: Node `22.13+`, `pnpm 11+`, Docker with the Compose plugin.

- API: `http://localhost:5000`
- Web: `http://localhost:3000`
- Troubleshooting: `TROUBLESHOOTING.md`

If `docker compose` is unavailable, start Postgres and Redis manually as documented in `TROUBLESHOOTING.md`.

## Repository Guide

Use these documents in this order:

1. `README.md` for setup and the repo map.
2. `AGENTS.md` for AI and new-contributor repository context.
3. `docs/architecture/README.md` for current and target architecture.
4. `docs/product/MVP.md` for the authoritative current product scope.
5. `docs/roadmap/product-milestones.md` for near-term priorities.
6. `docs/decisions/` for architecture decisions.

## Stack

- NestJS
- Next.js App Router
- PostgreSQL
- Redis
- Prisma
- pnpm workspaces
- Docker Compose

## Common Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Run backend and frontend in watch mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm test` | Run backend tests |
| `pnpm db:up` | Start Postgres and Redis |
| `pnpm db:down` | Stop local infrastructure |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:generate` | Generate Prisma client |

## Repository Shape

```text
apps/backend   NestJS API and Prisma access
apps/frontend  Next.js dashboard
docs/          Product, architecture, roadmap, ADRs, workflow docs
```

Shared `packages/` do not exist yet on purpose. Add them only after two apps share real code.
