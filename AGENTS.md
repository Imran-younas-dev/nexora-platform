# AGENTS.md

This is the fastest repository entrypoint for AI assistants and new contributors.

## Mission

Nexora is an AI-native engineering operations platform. In the current phase, the repository proves the core foundation loop:

1. The frontend talks to the backend.
2. The backend talks to Postgres.
3. Incidents can be created and listed locally.

Do not optimize for the long-term vision before the current milestone needs it.

## Read This Order

Use these documents as the source-of-truth hierarchy:

1. `README.md` for setup, commands, and the top-level map.
2. `docs/product/MVP.md` for the authoritative product scope.
3. `docs/architecture/README.md` for the architecture map.
4. `docs/roadmap/product-milestones.md` for current priorities.
5. `docs/decisions/` for non-trivial architecture decisions.
6. `docs/engineering/feature-workflow.md` for feature planning and execution.
7. `CONTRIBUTING.md` for branch, PR, review, and release expectations.

If two documents seem to disagree, prefer the more specific one closest to the code or workflow being changed.

## Current Repository Shape

```text
apps/backend   NestJS modular monolith, Prisma, incidents + health
apps/frontend  Next.js App Router dashboard
docs/          Product, architecture, roadmap, ADRs, workflow docs
```

Current runtime path:

`browser -> frontend -> backend -> PostgreSQL`

Redis exists in `docker-compose.yml` but is intentionally reserved for later milestone work.

## Authoritative Facts

- Current milestone: `M0 - Foundations`
- Current working product loop: create and list incidents locally
- No auth yet for local development
- No queues yet
- No AI execution loops yet
- No shared internal packages yet
- No microservices yet

## Working Rules

- Prefer the simplest change that moves the current milestone forward.
- Do not add `packages/`, services, queues, or infra layers unless the codebase has a concrete duplication or scaling signal.
- Keep frontend logic thin; business logic belongs in the backend.
- Keep backend as a modular monolith until real split pressure appears.
- Preserve soft multi-tenancy: tenant-owned data keeps `organization_id` even while MVP uses `org_default`.
- For AI features, suggestions must stay reviewable and must not auto-execute by default.

## When Updating Docs

- Update `docs/architecture/current.md` when the implemented system changes.
- Update `docs/architecture/target.md` when the intended near-to-mid-term architecture changes.
- Update `docs/product/MVP.md` only when product scope changes.
- Add an ADR for non-trivial technical decisions; use `docs/decisions/README.md`.
- Do not create a new standalone doc if an existing source-of-truth can be updated instead.

## Before Implementing a Feature

Check `docs/engineering/feature-workflow.md` and keep the artifact lightweight:

- requirements
- implementation plan
- task list
- acceptance criteria

Not every task needs a long spec. Use the smallest artifact that preserves intent and reviewability.
