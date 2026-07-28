# Copilot Instructions

Read `AGENTS.md` first for repository context.

Authoritative documents:

- `docs/product/MVP.md` for current product scope
- `docs/architecture/current.md` for implemented architecture
- `docs/architecture/target.md` for near-term intended evolution
- `docs/roadmap/product-milestones.md` for priorities
- `docs/decisions/` for non-trivial technical decisions

Repository rules:

- Prefer simple solutions that fit the current milestone
- Keep the backend a modular monolith
- Keep the frontend thin
- Do not add shared packages, new services, or heavy infrastructure without a concrete need
- Preserve `organization_id` for tenant-owned data
- Update the authoritative doc instead of creating duplicate docs
