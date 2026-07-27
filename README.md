# Nexora

AI-native Engineering Operations Platform.

**Current phase:** Phase 0 — Foundations (in progress)

Helps engineering teams investigate incidents and use AI to reduce MTTR — built as both a real SaaS product and a senior engineering learning platform.

## Stack

- NestJS · Next.js · PostgreSQL · Redis · Prisma · pnpm workspaces · Docker Compose

## Quick start

```bash
# Prerequisites: Node 22.13+ (see .nvmrc), pnpm 11+, Docker with Compose plugin

cp .env.example .env
pnpm install
pnpm db:up          # requires: docker compose (Compose V2 plugin)
pnpm db:generate
pnpm db:migrate
pnpm dev
```

If `docker compose` is missing, install the Compose plugin or start Postgres manually:

```bash
docker run -d --name nexora-postgres -e POSTGRES_USER=nexora -e POSTGRES_PASSWORD=nexora -e POSTGRES_DB=nexora -p 5432:5432 postgres:16-alpine
docker run -d --name nexora-redis -p 6379:6379 redis:7-alpine
```

> Redis is reserved for Phase 2 (BullMQ). Port 6379 must be free, or change the mapping and `REDIS_URL`.

- API: http://localhost:5000 (`GET /health`, `GET/POST /incidents`)
- Web: http://localhost:3000

If something fails (env, Postgres, ports, `pnpm dev`), see **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | API + web in watch mode |
| `pnpm db:up` | Start Postgres + Redis |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm test` | Backend unit tests |
| `pnpm lint` | Lint all apps |

## Docs

| Doc | Purpose |
|-----|---------|
| [Troubleshooting](./TROUBLESHOOTING.md) | Fix local failures (DB, env, ports, pnpm) |
| [Product vision](docs/product/PROJECT_VISION.md) | Why Nexora exists |
| [MVP](docs/product/MVP.md) | First usable product definition |
| [Product milestones](docs/roadmap/product-milestones.md) | What we ship |
| [Learning curriculum](docs/learning/curriculum.md) | Phase-by-phase engineering curriculum |
| [Current architecture](docs/architecture/current.md) | What the code does today |
| [ADRs](docs/decisions/) | Architecture decisions |

## Repo layout

```text
apps/backend   NestJS API
apps/frontend  Next.js dashboard
docs/          Product, architecture, learning, ADRs
docker-compose.yml
```

Shared `packages/` will appear only when two apps share real code.
