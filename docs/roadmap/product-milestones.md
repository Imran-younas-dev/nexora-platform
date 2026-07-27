# Product Milestones

Shippable product outcomes. For the detailed learning curriculum (concepts, interview questions, judgment), see [`docs/learning/curriculum.md`](../learning/curriculum.md).

**Rule:** Curriculum phases may overshoot the product. Product MVP freezes when [MVP.md](../product/MVP.md) done criteria are met.

## M0 — Foundations (current)

- [x] pnpm monorepo wiring (single lockfile)
- [x] Docker Compose: Postgres + Redis
- [x] Nest health + incidents API
- [x] Next.js page calling the API
- [x] Prisma schema + soft `organization_id`
- [ ] README-driven local setup verified on a clean machine

## M1 — Domain + ingest

- Clean architecture for Incident domain
- Alert webhook → BullMQ → persist incident (idempotent)
- Structured logging on the API

## M2 — AI summary (product MVP core)

- Hand-rolled agent loop, structured JSON summary
- Suggest-only (no auto-execute)
- Prompt versioning
- Minimal incident detail view on the dashboard

## M3 — Dogfood-ready

- Thin auth (before any shared/public deploy)
- Deploy beyond localhost
- Basic `/health` monitored
- Documented LLM cost ceiling

## M4 — MVP+1

- Org/team model beyond default org
- RAG runbooks (optional for first users)
- Real-time updates
- Stronger RBAC + audit log

## Later (learning / scale chapters)

Kafka, Kubernetes, multi-agent, full observability stack, billing, SSO — only when migration signals fire or as deliberate portfolio chapters **after** MVP.

## Kill criteria (per milestone)

A milestone is done when the demo script works, not when the curriculum essay for that phase is read:

1. Show create/list incident (M0)
2. Show webhook → queue → incident (M1)
3. Show AI summary on an incident (M2)
4. Show a non-local URL a teammate can open (M3)
