# Troubleshooting — Nexora local setup

Use this when something fails during Phase 0.  
**Daily happy path:** Postgres running → `pnpm dev`.

---

## Everyday checklist

```bash
# 1) Node 22
nvm use

# 2) Postgres up?
docker ps | grep nexora-postgres
# if missing/stopped:
docker start nexora-postgres
# or: pnpm db:up
# or first-time create (see below)

# 3) Apps
pnpm dev
```

| Need every session? | Command / action |
|---------------------|------------------|
| Usually yes | Postgres container running |
| Yes | `pnpm dev` |
| No | `pnpm install` (only after deps change) |
| No | `pnpm db:migrate` (only after schema/migrations change) |
| No | `pnpm db:generate` (only after schema change / fresh install) |

---

## If `pnpm dev` fails

### Error: `None of the selected packages has a "./apps/frontend" script`

**Cause:** Shell expanded `./apps/*` before pnpm saw it.

**Fix:** Root script must quote the filter:

```json
"dev": "pnpm --parallel --filter \"./apps/*\" run dev"
```

Then run `pnpm dev` again from the repo root.

---

### Error: Port 3000 in use / “Another next dev server is already running”

**Cause:** A previous Next.js process is still alive.

**Fix:**

```bash
# use the PID from the error, or:
pkill -f "next dev"
# or:
lsof -i :3000
kill <PID>
```

Then `pnpm dev` again. Web should be on http://localhost:3000.

---

### Error: `Environment variable not found: DATABASE_URL` (Prisma P1012)

**Cause:** Nest/Prisma Client do **not** auto-load the monorepo root `.env`. The API process never sees `DATABASE_URL`.

**Fix:**

1. Ensure env file exists for the backend:

```bash
cp .env.example apps/backend/.env
# keep DATABASE_URL in sync with root .env if you use both
```

2. Confirm `apps/backend/src/main.ts` loads dotenv **before** the app listens:

```ts
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env') }); // → apps/backend/.env
```

3. Confirm `dotenv` is installed in the backend package:

```bash
pnpm --filter backend add dotenv
```

4. Restart `pnpm dev`.

**Expected `DATABASE_URL`:**

```env
DATABASE_URL=postgresql://nexora:nexora@localhost:5432/nexora?schema=public
```

---

### Error: `Can't reach database server at localhost:5432` (Prisma P1001)

**Cause:** `DATABASE_URL` is loaded, but PostgreSQL is not running (or not on port 5432).

**Fix:**

```bash
# Is Docker running?
docker ps

# Start existing container
docker start nexora-postgres

# If container does not exist, create it:
docker run -d --name nexora-postgres \
  -e POSTGRES_USER=nexora \
  -e POSTGRES_PASSWORD=nexora \
  -e POSTGRES_DB=nexora \
  -p 5432:5432 \
  postgres:16-alpine

# Prefer Compose when the plugin is installed:
pnpm db:up
```

Wait a few seconds, then:

```bash
docker exec -it nexora-postgres pg_isready -U nexora -d nexora
pnpm dev
```

---

### Error: `docker compose` unknown / `pnpm db:up` fails

**Cause:** Docker Compose V2 plugin is not installed on this machine.

**Fix:** Use `docker run` (commands above), or install Compose V2, then `pnpm db:up`.

---

### Error: Redis port 6379 already in use

**Cause:** Another Redis is bound to 6379. Redis is only needed from Phase 2 (BullMQ).

**Fix for Phase 0:** Ignore Redis. For later phases, change the host port in `docker-compose.yml` / `docker run` and update `REDIS_URL`.

---

## First-time / clean machine setup

```bash
nvm use                          # Node >= 22.13 (.nvmrc)
cp .env.example .env
cp .env.example apps/backend/.env
pnpm install
pnpm db:up                       # or docker run … for postgres
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Smoke test:

- http://localhost:5000/health
- http://localhost:3000
- http://localhost:5000/incidents

---

## Inspect the database

```bash
# Browser UI
pnpm --filter backend prisma:studio

# CLI
docker exec -it nexora-postgres psql -U nexora -d nexora
# then: SELECT * FROM incidents;
```

---

## Quick “is it working?” matrix

| Check | Command / URL | Healthy look |
|-------|---------------|--------------|
| Node | `node -v` | v22.x |
| Postgres | `docker ps \| grep nexora-postgres` | Status `Up` |
| API | `curl -s http://localhost:5000/health` | `"status":"ok"` |
| Web | open http://localhost:3000 | Incidents page loads |
| Env | `grep DATABASE_URL apps/backend/.env` | postgresql://… |

---

## Still stuck?

1. Stop leftover Node processes: `pkill -f "nest start"` / `pkill -f "next dev"`
2. Confirm Postgres: `pg_isready` inside the container
3. Confirm env load: Nest should not crash with P1012
4. Re-run migrate if the DB is empty/new: `pnpm db:migrate`
