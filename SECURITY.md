# Security

## Reporting

If you find a vulnerability, email the maintainer privately. Do not open a public issue with exploit details or secrets.

## Practices (current)

- `.env` is gitignored; use `.env.example` for non-secret defaults
- No production auth yet — do not expose this stack publicly without thin auth
- Dependency audits belong in CI (`pnpm audit` / Dependabot) as the project hardens

## Future

Auth, RBAC, audit logs, and tenant isolation hardening land before any multi-user dogfood. See [MVP.md](./docs/product/MVP.md).
