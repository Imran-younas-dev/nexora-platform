# Architecture Decision Records

This folder stores Architecture Decision Records (ADRs) for non-trivial, long-lived engineering decisions.

## Purpose

Use ADRs to explain why the repository chose an architectural path, not to restate code.

Good ADRs help humans and AI assistants understand:

- why a decision was made
- what alternatives were considered
- what tradeoffs were accepted
- when the decision should be revisited

## Naming Convention

- File format: `NNN-short-kebab-case-title.md`
- Example: `001-pnpm-monorepo-nestjs-nextjs.md`

Use the next available zero-padded number.

## When To Write An ADR

Write an ADR when a change affects one or more of these:

- repository structure
- deployable boundaries
- database strategy or persistent data shape
- messaging, queues, or async architecture
- authentication or authorization model
- AI workflow design with long-lived implications
- infrastructure choices likely to persist across milestones

## When Not To Write An ADR

Do not write an ADR for:

- routine CRUD endpoints
- small refactors
- isolated bug fixes
- local naming cleanups
- UI polish
- tests added for existing behavior

If the decision is obvious, local, and easy to reverse, it does not need an ADR.

## Template

Start from `ADR_TEMPLATE.md`.

Keep ADRs short. One clear page is better than a long essay.
