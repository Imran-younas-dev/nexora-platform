# Architecture

This folder explains the system from two angles:

- `current.md`: the architecture that is implemented in code today
- `target.md`: the intended next-stage architecture, boundaries, and planned evolution

Read `current.md` first when changing code. Read `target.md` when making roadmap or structural decisions.

## Boundaries

- `apps/frontend`: user interface and API consumption
- `apps/backend`: API, validation, domain modules, persistence orchestration
- `PostgreSQL`: system of record
- `Redis`: reserved for upcoming async workflows

## Related Source Of Truth

- Product scope: `../product/MVP.md`
- Priorities: `../roadmap/product-milestones.md`
- ADRs: `../decisions/`
