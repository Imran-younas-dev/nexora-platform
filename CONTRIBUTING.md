# Contributing

## Branching

- `main` — stable
- `feature/*` — work branches; open a PR into `main`

Prefer squash merges. Use Conventional Commit style when practical (`feat:`, `fix:`, `docs:`, `chore:`).

## Local development

See the root [README](./README.md). Never commit `.env` or secrets.

## Before a PR

1. `pnpm lint`
2. `pnpm test`
3. Update docs if behavior or architecture changed
4. Add an ADR under `docs/decisions/` for non-trivial decisions

## Scope

Follow [MVP.md](./docs/product/MVP.md): introduce complexity only when it solves a real problem.
