# Nexora API

NestJS backend for the Nexora Engineering Operations Platform.

## Scripts

```bash
pnpm dev              # watch mode
pnpm build
pnpm test
pnpm prisma:migrate   # run from apps/backend or via root db:migrate
```

## Endpoints (Phase 0)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + DB check |
| GET | `/incidents` | List incidents |
| POST | `/incidents` | Create incident |
