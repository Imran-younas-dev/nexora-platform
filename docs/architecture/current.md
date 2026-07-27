# Current Architecture

**Phase:** 0 — Foundations  
**Last updated:** 2026-07-27

This page describes what exists in the repository today — not the long-term target architecture.

## Diagram

```text
┌─────────────┐     HTTP      ┌──────────────────┐     Prisma     ┌────────────┐
│  Next.js    │ ────────────► │  NestJS API      │ ─────────────► │ PostgreSQL │
│  apps/web*  │               │  apps/backend    │                │            │
└─────────────┘               │  /health         │                └────────────┘
                              │  /incidents      │
                              └────────┬─────────┘
                                       │ (reserved)
                                       ▼
                                  ┌─────────┐
                                  │  Redis  │  (Compose up; used from Phase 2)
                                  └─────────┘
```

\* App folder is still named `apps/frontend`.

## Runtime pieces

| Piece | Role |
|-------|------|
| `apps/backend` | NestJS modular monolith; Prisma; validation pipe; CORS |
| `apps/frontend` | Next.js App Router; incidents list/create against the API |
| PostgreSQL 16 | System of record for incidents |
| Redis 7 | Present in Compose for upcoming BullMQ work |

## Tenancy

`incidents.organization_id` exists from day one. MVP uses `org_default`. No auth yet — local use only.

## Explicitly not built yet

Queues, AI agents, auth, WebSockets, Kafka, Kubernetes, shared UI packages.

See [product milestones](../roadmap/product-milestones.md) and [learning curriculum](../learning/curriculum.md).
