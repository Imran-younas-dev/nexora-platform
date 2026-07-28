# Contributing

This repository is optimized for a small team using AI-assisted development. Keep workflow lightweight, explicit, and easy to maintain.

## Source Of Truth

Before making structural changes, read:

1. `README.md`
2. `AGENTS.md`
3. `docs/product/MVP.md`
4. `docs/architecture/README.md`
5. `docs/decisions/README.md`

## Branching

- `main`: stable branch
- `feature/<short-name>`: normal feature work
- `fix/<short-name>`: focused bug fix
- `docs/<short-name>`: documentation-only change

Keep branches short-lived and scoped to one reviewable change.

## Commits

Use clear, small commits. Conventional Commit prefixes are preferred when they add clarity:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`

## Pull Requests

Prefer squash merges into `main`.

Every PR should explain:

- what changed
- why it changed
- how it was validated
- which docs changed, if any

Use `.github/PULL_REQUEST_TEMPLATE.md`.

## Code Review

Review for:

- correctness
- scope control
- architecture fit
- documentation impact
- test coverage for meaningful behavior changes

Avoid approving complexity that is only justified by a possible future need.

## Feature Workflow

Use `docs/engineering/feature-workflow.md` for feature work.

Not every change needs a long spec. Use the smallest artifact that clearly captures:

- requirements
- implementation plan
- tasks
- acceptance criteria

## ADRs

Use `docs/decisions/README.md` and `docs/decisions/ADR_TEMPLATE.md`.

Write an ADR when a decision changes architecture, boundaries, infrastructure, data shape, or long-lived engineering policy.

Do not write an ADR for routine endpoint additions, styling tweaks, or obvious local refactors.

## Validation Before A PR

1. `pnpm lint`
2. `pnpm test`
3. Update docs if behavior, architecture, or workflow changed
4. Add an ADR if the change is non-trivial and long-lived

## Release And Versioning

- Keep `main` releasable
- Use simple tagged releases when deployable milestones are reached
- Keep versioning lightweight until the product has external consumers

## Security

Never commit `.env`, credentials, or secrets. If a change affects auth, data boundaries, or external integrations, document the security implications in the PR and update `SECURITY.md` if policy changes.
