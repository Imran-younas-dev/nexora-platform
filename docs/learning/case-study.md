# Nexora Interview Case Study

Use this when someone asks: "Tell me about a project you are building."

Speak the product as the full story. Be honest about what is built today.

---

## One line

Nexora is an AI helper for engineering teams when something breaks in production. It helps them see the incident, understand what happened, and fix it faster — with a human still in control.

---

## Problem I am solving

When a system goes down, engineers get alerts, logs, and messages from many places. They waste time collecting information instead of fixing the issue.

Typical pain:

- Alerts come, but nobody quickly understands what they mean
- People jump between Slack, logs, dashboards, and tickets
- Junior engineers do not know where to start
- Senior engineers repeat the same investigation again and again
- AI tools that auto-fix things are dangerous, because they can make production worse

**The real problem:** incidents are slow to understand, not only slow to detect.

**The goal:** reduce time to understand and resolve incidents (MTTR).

---

## What I am building

Nexora is an AI-native engineering operations platform.

First useful product (MVP):

1. An alert comes in, or an engineer creates an incident by hand
2. The incident appears on a simple dashboard
3. AI writes a short summary of what happened
4. A human reviews it
5. The engineer marks it resolved

AI only **suggests**. It does not auto-fix production. That is a design choice, not a missing feature.

Later it can grow into more: root cause help, runbooks, postmortems, deployment risk. That is not being built now.

---

## 2-minute case study

**Context**  
I am building Nexora, a platform that helps engineering teams handle production incidents with AI support.

**Problem**  
When production breaks, teams lose time gathering context. Monitoring tools show symptoms. Tickets show status. Nobody quickly answers: what broke, how bad is it, and what should I check first?

**Users**  
First: small teams, startups, and individual engineers. Later: SRE and platform teams.

**Solution**  
A simple loop: ingest or create incident → store it → show it on a dashboard → AI summary for review → human resolves it.

**How I am building it**  
I am not starting with microservices, Kafka, or Kubernetes. I am building a modular monolith:

- Frontend: Next.js dashboard
- Backend: NestJS API
- Database: PostgreSQL with Prisma
- Later: Redis + BullMQ for alert ingest in the background
- AI: one summarization step, structured output, human review

Why this way: ship a working product first. Add queues, auth, and scale only when the product needs them.

**Current status**  
Foundations are in place. Frontend talks to backend, backend talks to Postgres, and I can create and list incidents locally. Alert ingest, AI summary, auth, and public deploy are next.

**Impact I want**  
An engineer opens one dashboard, understands the incident faster, and resolves it with AI help — without giving AI permission to change production by itself.

---

## 30-second version

I am building Nexora, an incident platform for engineering teams. The problem is that when production breaks, engineers spend too long collecting context. Nexora takes an alert, stores an incident, shows it on a dashboard, and uses AI to summarize it for a human to review. I am using Next.js, NestJS, and Postgres. I started with a simple create/list flow, and next I will add webhook ingest and AI summaries. The main product rule is: AI helps, humans decide.

---

## Follow-up answers

### What have you actually built?

Right now I am on foundations. The app can create and list incidents. The full MVP is: webhook ingest, AI summary, dashboard review, and resolve. I am building it milestone by milestone so each step is real, not a demo screenshot.

### Why not just use PagerDuty / Datadog?

Those tools are strong at alerts and monitoring. Nexora is about the investigation layer in between: turn a raw incident into a clear summary a human can act on. I am starting small for small teams, not trying to replace the full observability stack.

### Why this architecture?

I chose a NestJS + Next.js + Postgres modular monolith. Business logic stays in the backend. Frontend stays thin. I put `organization_id` on data from day one so multi-tenant later is easier. Redis is already in Docker, but unused until I need background jobs. Simple now, ready to grow.

### What is hard / interesting?

- **AI safety:** suggestions only, never auto-execute
- **Idempotent alert ingest:** the same webhook should not create duplicate incidents
- **Async jobs:** alerts should not block the HTTP request
- **Soft multi-tenancy:** tenant data is isolated even in MVP
- **Build in the right order:** working incidents loop before Kafka/Kubernetes

---

## Current vs later

| Now (M0) | Next (MVP) | Later |
| --- | --- | --- |
| Create and list incidents | Alert webhook ingest | Auth, orgs, RBAC |
| Next.js dashboard | Redis + BullMQ jobs | Root cause help, runbooks |
| NestJS + Postgres | AI summary (suggest only) | Postmortems, deploy risk |
| Soft tenancy with `organization_id` | Human review and resolve | Kafka, Kubernetes only if needed |

Do not claim later items as finished.

---

## Resume (copy this)

Use the same style as your other projects: name, stack, two short bullets.

**Nexora** | Next.js, NestJS, PostgreSQL, Prisma

- Built an incident operations platform with a Next.js dashboard and NestJS REST API so engineers can create and list production incidents in one place.
- Designed a modular backend with PostgreSQL, Prisma, and organization-scoped data, and run the local stack with Docker Compose.

Do not add AI summary, Redis jobs, auth, or webhooks until those are actually built.

When the MVP is done, replace with:

**Nexora** | Next.js, NestJS, PostgreSQL, Prisma, Redis

- Built an incident operations platform that ingests alerts, stores incidents, and shows them on a dashboard so engineers can investigate faster.
- Added an AI incident summary that is suggest-only, with human review before resolve, using background jobs for alert ingest.

---

## Related docs

- Product scope: [`docs/product/MVP.md`](../product/MVP.md)
- Vision: [`docs/product/PROJECT_VISION.md`](../product/PROJECT_VISION.md)
- What exists in code: [`docs/architecture/current.md`](../architecture/current.md)
- Near-term architecture: [`docs/architecture/target.md`](../architecture/target.md)
- Milestones: [`docs/roadmap/product-milestones.md`](../roadmap/product-milestones.md)
