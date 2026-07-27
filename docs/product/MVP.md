# Nexora MVP

**Status:** Phase 0 in progress  
**Rule:** Learning phases may go beyond the product MVP. The product MVP freezes when the workflow below works for one engineer on a deployed environment.

## First usable product

A single engineer (or single default organization) can:

1. Ingest or manually create an incident
2. See it on a simple dashboard
3. Get an AI-generated incident summary (suggest-only; no auto-actions)
4. Mark the incident resolved

### In scope for MVP

| Capability | Notes |
|------------|--------|
| Incidents CRUD (minimal) | Create, list, resolve |
| Alert ingest (webhook) | Idempotent; async via BullMQ |
| AI incident summary | Structured output; human reviews |
| Thin dashboard | List + detail; not a full SaaS surface |
| PostgreSQL + Redis | Local via Docker Compose |
| Soft tenancy | `organization_id` on tenant rows; default org for MVP |
| Health endpoint | API + DB check |
| Basic deploy | Compose locally; one PaaS target later |

### Explicitly not MVP (MVP+1 or later)

- Full auth / RBAC (add before any shared/public deploy)
- Organizations & team management UI
- Multi-agent AI, RAG runbooks, WebSockets polish
- Kafka, Kubernetes, billing, SSO, plugins

**Auth decision for MVP:** local/dev may use a documented single default org with no login. Any hosted dogfood requires thin auth first (ADR to follow).

## Primary workflow

```
alert webhook (or manual create)
  → validate + enqueue
  → enrich + persist incident
  → AI summary (suggest only)
  → human reviews on dashboard
  → resolve
```

## Alignment with learning curriculum

| Product need | Curriculum phase |
|--------------|------------------|
| Foundations, Compose, health, incidents API | Phase 0 |
| Domain model / clean architecture | Phase 1 |
| Alert ingest + BullMQ | Phase 2 |
| AI summary | Phase 3 |
| Minimal dashboard | Pulled forward (do not wait for Phase 12) |
| Auth / orgs UI | After first loop works; before public deploy |

Kafka, K8s, and multi-agent remain **learning/portfolio chapters after MVP**, not MVP blockers.

## Done criteria

MVP is done when:

- [ ] A stranger can follow the README and run the stack locally
- [ ] The primary workflow works end-to-end with mock or real webhook input
- [ ] The API is deployed somewhere beyond localhost (even a free PaaS)
- [ ] AI suggestions are clearly labeled and never auto-execute
