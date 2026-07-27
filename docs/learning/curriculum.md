# Nexora Learning Curriculum

### From foundations to production-grade engineering

Product milestones live in [`docs/roadmap/product-milestones.md`](../roadmap/product-milestones.md). This file is the learning curriculum.

---

## 0. Philosophy

This is not "a project with AI in it." This is a **curriculum disguised as a product**.

The product (Nexora — an AI-native engineering operations platform) is just the vehicle. The real goal is that by the time it's done, you can sit in a Staff Engineer interview at Stripe, Uber, Netflix, Shopify, Datadog, or Anthropic and speak fluently about *every* decision — not because you memorized definitions, but because you hit the actual problem each concept solves and made a real tradeoff.

**The rule that governs this whole document:** nothing gets added because it's popular. Every technology and pattern is introduced at the exact phase where the *simple version breaks* — because that's the only way to actually understand why it exists. You will start with a boring modular monolith and evolve it into an event-driven, observable, horizontally-scalable system, the same way real systems evolve at real companies.

This doc is organized in six layers. **Everything below Part C is new in v2** — the philosophy, phase ordering, and Part A/B/C content from v1 are unchanged.

1. **Part 0 — Engineering Mindset**: how experienced engineers actually think, independent of any technology (read this first — it's the lens for everything else)
2. **Part A — Learning Roadmap**: phase-by-phase build plan (this is what you follow week to week) — *unchanged from v1*
3. **Part B — Concept Reference**: deep-dive tables on every technology and system design concept, mapped to exactly where it lives in this project — *unchanged from v1, extended with new B6–B11*
4. **Part C — Resume & Interview Mapping**: how to talk about all of it — *unchanged from v1*
5. **Part A2 — Phase Deep-Dives**: for every phase — common beginner mistakes, senior-engineer thinking, recommended reading, a stretch goal, and an expanded interview question bank (whiteboard/system design/behavioral/coding)
6. **Part D — Judgment**: technology evolution & migration signals, a decision-framework template, and a "how would Stripe/Uber/Netflix/Datadog/Cloudflare approach this" lens on the project's hardest decisions

A note on scope: Part D's "how would Company X solve this" lens is applied to the project's five or six *hardest* decisions, not every single one — doing it exhaustively for 12 phases would turn a learning roadmap into a trivia list and dilute the parts that actually matter. Depth on the decisions that matter beats shallow coverage of everything.

---

# PART 0 — ENGINEERING MINDSET

Read this before Phase 0. Everything in Part A is a vehicle for practicing the thinking described here — the technologies are replaceable, this isn't.

| Concept | Why it exists | Real-world example | Common beginner mistake | How senior engineers think differently |
|---|---|---|---|---|
| **Approaching a new project** | You can't design well before you understand the actual constraints (traffic, team size, deadline, blast radius of failure) | Before writing any code for Phase 0, a senior engineer spends time asking "what actually breaks first — load, complexity, or team coordination?" | Jumping straight to code / picking the "cool" stack first | Starts by listing constraints and unknowns, then picks the simplest design that satisfies today's constraints while not blocking tomorrow's |
| **Breaking down a large problem** | Large problems can't be estimated or reviewed as one unit | This entire project is broken into 12 phases specifically so each one is independently shippable and reviewable | Trying to build "the whole platform" in one giant PR/branch | Decomposes along seams that can ship and be tested independently — a phase boundary is a decomposition, not just a checklist item |
| **Identifying bottlenecks** | Optimizing the wrong thing wastes time and adds complexity for no benefit | In Phase 11, you profile before assuming the LLM call (not the DB query) is the slow part | Guessing at what's slow and optimizing that first | Measures first (profiler, APM, `EXPLAIN ANALYZE`), forms a hypothesis, then changes one thing at a time |
| **Identifying technical debt** | Debt is often invisible until it's expensive; naming it is the first step to managing it | Skipping the Outbox Pattern in Phase 2 to ship faster is debt — fine short-term, but it must be tracked, not forgotten | Either ignoring debt entirely, or refusing to ship anything until it's "perfect" | Makes debt visible (a ticket, an ADR marked "Accepted — revisit at X scale"), and treats it as a deliberate loan, not an accident |
| **Refactor vs rewrite** | Rewrites are expensive and risky; most "we should rewrite this" instincts are wrong | Migrating BullMQ → Kafka in Phase 8 is a targeted refactor of one pipeline, not a rewrite of the whole system | Reaching for "let's just rewrite it" when the real problem is isolated to one module | Asks: can I change this in place, incrementally, with tests as a safety net? Rewrites are reserved for when the architecture itself is provably wrong for the new requirements |
| **Estimating engineering work** | Bad estimates break trust with stakeholders and cause burnout | Estimating "Phase 8 (Kafka migration): 1 week" without accounting for dual-write cutover risk is optimistic estimating | Estimating the happy path only | Breaks the task into known work + identified unknowns + explicit risk buffer, and states the estimate's assumptions out loud |
| **Writing technical proposals** | Getting sign-off *before* building prevents wasted work and surfaces objections early | A one-page doc before Phase 8: "why Kafka, why now, what changes, what's the rollback plan" | Building first, explaining after (and defending it, not discussing it) | Writes the proposal to be *disagreed with* — clearly states alternatives considered, invites objections before the decision is locked in |
| **Writing ADRs** | Decisions without recorded context get re-litigated forever or silently reversed by someone who doesn't know why they exist | Every phase in this project should produce one (template in Part D) | Skipping ADRs because "it's obvious why we chose this" (it won't be, in 8 months) | Writes the ADR at decision time, not after — the reasoning is freshest then |
| **Reviewing pull requests** | Review is where quality, knowledge-sharing, and standards actually get enforced | Reviewing your own Phase 3 agent code a day later with fresh eyes, checking for the same rigor you'd apply to a teammate's PR | Only checking "does it run," or nitpicking style while missing design issues | Reviews for correctness, blast radius, and testability first; style last (and often automated away with linters) |
| **Communicating tradeoffs** | Every real decision has a cost; hiding it erodes trust when the cost shows up later | Saying "BullMQ is simpler now, but we lose independent replay — we accept that until Phase 8" | Presenting a choice as strictly better with no downside | States the cost of the chosen option explicitly, in the same breath as the benefit |
| **Mentoring junior engineers** | Multiplying your own output only scales so far; multiplying others' understanding doesn't | Explaining *why* the outbox pattern exists (Phase 8) rather than just "copy this code" | Just fixing the code for them, or answering the literal question asked instead of the real confusion | Asks what they've already tried, explains the underlying model (not just the fix), and leaves them able to solve the next similar problem alone |
| **Leading technical discussions** | Discussions without a driver drift, re-litigate settled points, or end without a decision | Driving the "BullMQ vs Kafka" discussion in Phase 8 toward a decision with a clear owner and deadline, not an open-ended debate | Letting the loudest opinion win, or a discussion that ends with no decision | Frames the decision, states the deadline for deciding, and explicitly closes with "here's what we're doing and why" |
| **Debugging complex production issues** | Under pressure, unstructured debugging wastes the most valuable minutes of an incident | Using the distributed trace from Phase 7 to localize *which* service in the alert pipeline is slow before touching any code | Changing things and hoping, or debugging by guessing based on the last incident | Forms a hypothesis from evidence (metrics/traces/logs, in that order), tests the cheapest way to confirm/deny it, and only then acts |
| **Deciding under uncertainty** | Perfect information never exists at decision time; waiting for it has its own cost | Choosing pgvector over Qdrant in Phase 4 despite not knowing final scale, because the migration path is known and cheap later | Freezing / over-researching instead of deciding | Picks the option that is cheapest to reverse when uncertainty is high, and reserves "hard to reverse" decisions for when there's real evidence |
| **Build vs Buy** | Building everything ignores opportunity cost; buying everything creates vendor lock-in and hides costs | Using Anthropic/OpenAI's API (buy) instead of training your own model (build) — Phase 3 | Defaulting to "build" out of pride, or "buy" out of laziness, without comparing total cost of ownership | Compares long-term cost (maintenance, lock-in, differentiation value) not just upfront effort |
| **YAGNI** ("You Aren't Gonna Need It") | Speculative generality adds complexity for requirements that may never arrive | Not building multi-tenancy in Phase 0 when there's one tenant and no evidence a second is coming | Building "flexible" abstractions for imagined future needs | Builds for today's known requirement, and makes the *next* requirement easy to add rather than pre-building it |
| **KISS** | Complexity is a cost paid by everyone who reads the code afterward, including future you | Hand-rolling the Phase 3 agent loop instead of pulling in a framework you don't need yet | Reaching for the most sophisticated tool available | Picks the simplest solution that correctly solves the actual problem, not the most impressive one |
| **DRY** | Duplicated logic drifts out of sync and becomes two bugs instead of one | One `IncidentStatus` transition validator used by both the API and the worker, not copy-pasted | Copy-pasting a validation check "just this once" | Applies DRY to *knowledge* (business rules), not to superficially similar-looking code — see Rule of Three below |
| **Rule of Three** | Abstracting after the first duplication is premature; after the third, it's overdue | Waiting until you have three similar retry-with-backoff implementations (Phase 2, 8, 11) before extracting a shared utility | Abstracting on the first duplication ("let's make this generic now") | Tolerates duplication twice, then extracts — because the right abstraction is only visible once you've seen enough real variation |
| **Premature optimization** | Optimizing before you know the bottleneck usually optimizes the wrong thing and adds complexity | Not adding a cache in Phase 0 before you have any evidence of a slow query | Micro-optimizing code paths that never show up in a profile | Optimizes only what's measured to matter, and treats readability as the default until proven otherwise |
| **Conway's Law** | System architecture tends to mirror the communication structure of the org that built it | If this were a real team, having one team own "ingestion+enrichment" and another own "the agent" would naturally produce the Phase 8 service boundary | Ignoring team structure when designing service boundaries (as a solo builder, the analogue is: module boundaries should mirror where *you* context-switch, e.g., "AI work" vs "infra work") | Designs service/module boundaries deliberately to match who (or what future team) will own them |
| **Brooks' Law** | Adding people to a late project doesn't linearly add throughput — onboarding cost and communication overhead grow faster | Relevant if you ever imagine handing off a phase to a collaborator mid-build: the ramp-up cost is real and must be planned for, not waved away | Assuming "more hands" always means "faster" | Accounts for ramp-up time and communication overhead explicitly when planning any work involving more than one person |

---

# PART A — LEARNING ROADMAP (MVP → Production)

Each phase below states: what you build, what breaks if you *don't* learn the concept, new technologies, new concepts across architecture/system design/AI/DevOps, expected commits, and expected interview questions you'll be able to answer afterward.

## Phase 0 — Foundations & Local Environment

**Build:** Repo skeleton, Docker Compose with Postgres + Redis, a NestJS app with one module (`incidents`), Next.js frontend shell talking to it over REST.

**Why NestJS instead of Express/FastAPI:** NestJS forces you to structure code the way large companies actually structure backend services — modules, dependency injection, decorators for validation, a clear separation between controllers/services/repositories. Express gives you total freedom, which is exactly why large codebases in Express become unmaintainable without imposing the same structure yourself. NestJS is essentially "Angular's architecture applied to backend Node" — and Angular's DI system is itself modeled on Spring (Java), which is what most enterprise backend teams already know. Learning NestJS properly means you're learning transferable concepts (DI containers, decorators, module boundaries) not just a framework's API.

**New tech:** NestJS, TypeScript, Docker, Docker Compose, PostgreSQL, Next.js (basic pages)

**New concepts:**
- Dependency Injection — *why*: testability (swap real DB repo for a fake in tests without touching business logic) and decoupling (services don't construct their own dependencies)
- Modular Monolith structure — *why*: you will later split this into microservices; if module boundaries are clean now, that split is a refactor, not a rewrite
- Containerization — *why*: "works on my machine" is not a valid production story; Docker is how you guarantee environment parity between your laptop and prod

**Expected commit:** `feat: scaffold NestJS + Next.js monorepo with Dockerized Postgres`

**Interview question you can now answer:** "Why did you structure your NestJS app this way?" → talk about modules as bounded contexts, DI as the seam that makes testing possible.

---

## Phase 1 — Clean Architecture & Domain Model

**Build:** Proper layering inside the `incidents` module: Domain (entities, value objects) → Application (use cases/services) → Infrastructure (Postgres repository implementation) → Interface (controllers). Add `Incident`, `Alert`, `Service` entities with real business rules (e.g., an incident can't move from `resolved` back to `open` without a new alert).

**What breaks without this:** Once AI agents, WebSockets, and queues get added later, a codebase without layering turns into "everything imports everything" spaghetti — you cannot safely change the DB schema without breaking business logic that has no business knowing about SQL.

**New concepts:**
- **Clean Architecture / Hexagonal Architecture** — the domain layer knows nothing about Postgres, NestJS, or HTTP. Dependencies point *inward*. This is why you can later swap Postgres for something else, or add Kafka, without touching business rules.
- **DDD (Domain-Driven Design) basics** — model `Incident` as an entity with identity and invariants, not just a database row. Use a **Repository Pattern** so the application layer talks to an interface (`IncidentRepository`), not Postgres directly.
- **SOLID principles** — specifically Dependency Inversion (application layer depends on an abstraction, infra implements it) and Single Responsibility (a controller only translates HTTP ↔ use case, it never contains business logic).

**Why big companies do this:** Stripe's API layer is famous for extremely strict separation between "core" domain logic and transport concerns — it's what lets them run the same business logic across API versions for a decade. This isn't academic; it's how you avoid a rewrite every 2 years.

**Expected commit:** `refactor: introduce clean architecture layers and repository pattern for Incident domain`

**Interview question:** "How do you structure a backend service to stay maintainable as it grows?" → full answer using this phase.

---

## Phase 2 — MVP Event Loop with BullMQ

**Build:** Alert webhook endpoint → validate → push a job to a BullMQ queue (backed by Redis) → a worker processes it (dedupe, enrich, save incident). Add a **dead letter queue** for jobs that fail repeatedly.

**Why BullMQ before Kafka:** This is the single most important sequencing decision in the whole roadmap. Kafka solves problems you don't have yet (multiple independent consumer groups, replay, massive throughput, strict ordering across services). Introducing it now would mean you can't explain *why* you need it — you'd just be cargo-culting. BullMQ (Redis-backed) gives you real background-job concepts — retries, backoff, DLQ, concurrency — with a fraction of the operational complexity. You "graduate" to Kafka in Phase 8 specifically when a second consumer needs the same event stream independently, which is the actual reason Kafka exists over a simple queue.

**New tech:** BullMQ, Redis (as queue backend, distinct from cache use later)

**New concepts:**
- **Idempotency** — the webhook can be called twice for the same alert (network retries are normal). Use a `dedupe_key` unique constraint in Postgres *and* a Redis `SETNX` lock, and explain why you need both (DB constraint = correctness guarantee; Redis lock = fast-path to avoid even hitting the DB under load).
- **Retry strategies & exponential backoff** — BullMQ lets you configure `attempts` and `backoff`. Explain why naive immediate retries make outages worse (retry storms).
- **Dead Letter Queues** — after N failed attempts, move the job somewhere for manual inspection instead of losing it or retrying forever.
- **Background jobs vs request/response** — why alert processing shouldn't happen synchronously inside the HTTP request (webhook sender times out, you lose the alert).

**Expected commit:** `feat: async alert processing with BullMQ, retries, and DLQ`

**Interview question:** "How do you handle a webhook that might be delivered more than once?" → idempotency key + dedupe answer, straight from this phase.

---

## Phase 3 — AI Agent v1: Tool Calling & Structured Outputs

**Build:** An `AgentOrchestrator` service (plain TypeScript, no framework yet) that takes an enriched alert and calls the Anthropic API with tool definitions: `searchLogs`, `getRecentDeploys`, `getSimilarIncidents`. Force **structured JSON output** for the triage result (severity, summary, confidence, recommended action).

**Why build the loop by hand first:** If you start with LangGraph, you'll be able to make something work but not explain *why* it works — which is the difference between "I used an agent framework" and "I understand agent architecture," and interviewers can tell the difference in about 30 seconds. Build: prompt → model requests tool → you execute tool → feed result back → repeat until final answer. Once you've done this manually, adopting LangGraph later (Phase 10, for multi-agent orchestration) is an informed choice, not a crutch.

**New concepts:**
- **Agent architecture** — the loop of plan → act → observe → repeat
- **Tool calling / function calling** — how the model requests structured actions instead of free text, and why this is safer and more reliable than parsing prose
- **Structured outputs** — using JSON schema-constrained responses so downstream code never has to regex-parse an LLM's prose
- **Prompt engineering** — system prompt design, few-shot examples of good triage summaries, and prompt versioning (store prompts with a version tag, not hardcoded strings, so you can roll back a bad prompt like you would a bad deploy)
- **Confidence scoring** — the model can be asked to self-report confidence, but you'll learn quickly this is unreliable alone; better: derive confidence from *signal quality* (did a runbook match well? Is there a clear precedent?) rather than trusting the model's own claimed confidence blindly
- **Token budgeting / cost optimization** — track tokens per triage, cap context size, and understand why sending your entire log history to the model is both expensive and worse for quality (needle-in-haystack problem)

**Why production AI companies care about this:** every serious AI product (Anthropic's own tool-use docs, OpenAI's function calling, Sierra, Adept) converges on the same loop. This phase is literally rebuilding the primitive that every agent framework wraps — which is exactly why doing it by hand is valuable.

**Expected commit:** `feat: AI triage agent with tool calling and structured JSON output`

**Interview question:** "How does your agent decide what tools to call?" and "How do you keep LLM output reliable enough to build software around it?" — both answered directly by this phase.

---

## Phase 4 — RAG with pgvector

**Build:** A `runbooks` table with a `pgvector` column. Embed a handful of markdown runbooks (chunked by section, not fixed token windows). Add a `searchRunbooks` tool to the agent that does a vector similarity search and returns the top matches *with citations* (which runbook, which section).

**New concepts:**
- **Embeddings** — what they are, why cosine similarity on them approximates semantic similarity
- **Vector databases** — why pgvector is the right starting choice (one less service to run, "good enough" performance at small-to-medium scale) and when you'd migrate to Qdrant/Pinecone (millions of vectors, need for filtered/hybrid search at scale, need for a dedicated ANN index type like HNSW that pgvector supports but doesn't tune as aggressively as dedicated engines)
- **RAG (Retrieval-Augmented Generation)** — why you retrieve relevant text and inject it into the prompt instead of fine-tuning a model on your runbooks (cheaper, always up to date, explainable)
- **Chunking strategy** — semantic chunking (by heading/section) beats fixed-size chunking because it keeps a complete idea together, improving retrieval precision
- **Hallucination prevention** — forcing the agent to cite the specific runbook chunk it used means a human can verify the claim; an answer with no citation is a signal to lower confidence automatically

**Expected commit:** `feat: RAG-based runbook retrieval with pgvector and citation tracking`

**Interview question:** "How did you implement RAG, and what would you do differently at scale?" — you now have a real, specific answer instead of "I used a vector database."

---

## Phase 5 — Real-Time Layer: WebSockets + Frontend Dashboard

**Build:** A WebSocket gateway in NestJS (`@WebSocketGateway`) that streams: new alerts, agent reasoning steps (as they happen, not just the final answer), and incident status changes. Next.js dashboard: incident list, live incident detail page showing the agent "thinking" in real time, and a chat panel for humans to discuss.

**New concepts:**
- **Real-time systems** — why WebSockets over polling (polling wastes requests and adds latency; WebSockets give you push-based updates)
- **Connection state management at scale** — even at small scale, learn *why* this gets hard: if you ever run more than one instance of this gateway, a client connected to instance A won't see an event published by instance B unless you fan out via Redis Pub/Sub — implement this now even at small scale, because it's the same problem Discord solves at massive scale with their gateway architecture
- **Backpressure** — what happens if the agent produces reasoning steps faster than the frontend can render/the socket can flush; bound your event queue

**Expected commit:** `feat: real-time incident room via WebSockets with Redis pub/sub fan-out`

**Interview question:** "How would you scale WebSocket connections across multiple server instances?" — Redis pub/sub fan-out, straight from this phase.

---

## Phase 6 — Security & Auth

**Build:** JWT-based auth, RBAC (roles: `viewer`, `responder`, `admin`), audit log middleware that records every state-changing action with actor + timestamp.

**New concepts:**
- **JWT** — stateless auth tokens, why you need short expiry + refresh tokens, not one long-lived token
- **RBAC** — roles determine who can *approve* an AI-proposed action vs who can only view
- **Audit trails** — append-only log of every human and agent action (who approved this rollback, and when)
- **Input validation** — NestJS `class-validator` DTOs on every endpoint; explain this is your first line of defense against injection and malformed data
- **Secure headers, CSRF, XSS, SQL injection prevention** — concretely: parameterized queries via your ORM (TypeORM/Prisma) prevent SQL injection by construction; `helmet` middleware sets secure headers; CSRF matters because you have cookie-based sessions or a browser client — explain why JWT-in-header (not cookie) sidesteps CSRF but introduces XSS-token-theft risk instead, and how you mitigate that (short expiry, httpOnly refresh cookie)

**Expected commit:** `feat: JWT auth, RBAC, and audit logging middleware`

**Interview question:** "Walk me through your auth model and how you prevent common web vulnerabilities." — full concrete answer.

---

## Phase 7 — Observability: OpenTelemetry, Prometheus, Grafana, Loki, Jaeger

**Build:** Instrument every service with OpenTelemetry (traces + metrics). Export metrics to Prometheus, dashboards in Grafana. Centralize logs in Loki. Trace a single alert end-to-end across ingestion → queue → agent → WebSocket in Jaeger.

**New concepts:**
- **Metrics vs logs vs traces** — the three pillars, and specifically *why* you need all three: metrics tell you *something* is wrong (P99 latency spike), traces tell you *where* (which service/span), logs tell you *why* (the actual error message/context)
- **Distributed tracing** — a single alert crosses 4+ services; without a trace ID propagated through Kafka headers/HTTP headers, correlating logs across services is nearly impossible during an actual incident (ironic, given the product)
- **RED/USE metrics** — Rate, Errors, Duration for services; Utilization, Saturation, Errors for resources — the standard vocabulary for what to dashboard
- **Alerting on your own metrics** — AlertManager rules for things like "agent P99 latency > 5s" or "DLQ depth > 0 for 5 minutes"

**Why this matters for interviews:** "how do you debug a production issue you can't reproduce locally" is one of the most common Senior/Staff questions, and this phase is the direct answer.

**Expected commit:** `feat: OpenTelemetry tracing, Prometheus metrics, and Grafana dashboards across all services`

---

## Phase 8 — Migrate BullMQ → Kafka (Event-Driven Architecture)

**Build:** Introduce Kafka. Replace BullMQ for the alert pipeline with topics: `alerts.raw` → `alerts.enriched` → `alerts.triaged` → `actions.requested`. Each stage is its own consumer group. Add the **Outbox Pattern** for reliably publishing events from Postgres transactions.

**Why now, not earlier:** The real trigger for Kafka is: **you now have multiple independent consumers that need the same event stream** — the WebSocket gateway needs `alerts.triaged` to push to clients, *and* an analytics/postmortem service needs the same events, *and* you want replay capability if a consumer was down. BullMQ jobs are consumed once and gone; Kafka retains events on a topic so multiple consumer groups can each read independently, and you can replay history. This is the actual, defensible reason to add Kafka — not "because big companies use it."

**New concepts:**
- **Event-driven architecture** — services communicate via events, not direct calls; producers don't know who consumes
- **Consumer groups & partitioning** — partition by `incident_id` so all events for one incident stay ordered on one partition; explain the tradeoff (too few partitions limits parallelism, too many creates overhead and rebalancing cost)
- **Ordering guarantees** — Kafka guarantees order *within a partition* only; this is why partition key choice is a real design decision, not an implementation detail
- **Replay** — a new consumer (e.g., a future ML feature-store service) can read from the beginning of a topic and reconstruct state; a queue can't do this
- **Outbox Pattern** — writing "incident created" to Postgres and publishing to Kafka must be atomic; you can't reliably do both in a single transaction across two systems, so you write the event to an `outbox` table in the *same* Postgres transaction as your business write, then a separate relay process publishes from the outbox to Kafka. This solves the classic "dual write" consistency problem.
- **CQRS (Command Query Responsibility Segregation)** — writes go through the domain model (Phase 1's clean architecture), but the dashboard's incident list can read from a denormalized, Kafka-populated read model optimized for the UI, instead of joining live tables
- **Event Sourcing (conceptually, applied selectively)** — the `agent_actions` and `audit_log` tables are already append-only event logs; explain how this *is* event sourcing for that slice of the system, without going full event-sourcing for the whole domain (a realistic, non-dogmatic choice you should be ready to defend)
- **Saga Pattern** — when an approved action requires multiple steps (call runbook API, wait for result, update incident, notify), coordinate this as a saga (choreography via events) rather than a single fragile synchronous transaction
- **Dead Letter Queues (Kafka version)** — a consumer that fails repeatedly on a message routes it to a `*.dlq` topic instead of blocking the partition forever

**Expected commit:** `feat: migrate alert pipeline to Kafka with outbox pattern and CQRS read model`

**Interview question:** "When would you choose Kafka over a simpler queue, and why?" — you now have a real, first-hand answer instead of a textbook one.

---

## Phase 9 — Kubernetes & Production-Grade Deployment

**Build:** Helm charts per service. NGINX Ingress. Health checks (`/healthz`, `/readyz`) and graceful shutdown (drain in-flight requests/jobs before pod termination). Horizontal Pod Autoscaler on CPU first, then **KEDA** scaling the Kafka consumer deployments based on consumer lag. GitHub Actions pipeline: lint → test → build → push → deploy, with a rolling deployment strategy; add a canary step for the agent service specifically (since AI behavior changes are riskier than typical code changes).

**New concepts:**
- **Service discovery** — Kubernetes DNS-based service discovery; explain why hardcoding IPs breaks the moment a pod restarts
- **Load balancing & reverse proxy** — NGINX Ingress as the entry point, round-robin/least-conn across pod replicas
- **Health checks** — liveness (is the process alive) vs readiness (can it accept traffic) — a common interview trap topic, and you'll have implemented the difference for real
- **Graceful shutdown** — SIGTERM handling: stop accepting new jobs, finish in-flight ones, *then* exit; without this, rolling deploys silently drop in-flight incident processing
- **Horizontal vs vertical scaling** — why you scale consumer pods horizontally (add more) rather than vertically (bigger box) for this workload, and when vertical scaling is actually the right call (Postgres primary, at least until you need read replicas)
- **Read replicas & connection pooling** — PgBouncer in front of Postgres; explain the failure mode this prevents (connection exhaustion under load) and why replicas serve read-heavy dashboard queries while writes stay on the primary
- **Blue/Green, Canary, Rolling deployments** — the tradeoffs of each (instant rollback vs cost of running two full environments vs gradual exposure); you'll implement rolling for most services and canary specifically for the AI agent (since a prompt or model change is a "silent" behavior change harder to catch than a typical bug)
- **Feature flags** — gate the "auto-execute" behavior behind a flag you can kill instantly without a redeploy, in case the agent starts behaving badly in production

**Expected commit:** `feat: Kubernetes deployment with Helm, KEDA autoscaling, and canary rollout for agent service`

**Interview question:** "How do you safely deploy changes to a system that includes non-deterministic AI behavior?" — canary + feature flag answer, directly from this phase.

---

## Phase 10 — Advanced AI Engineering: Multi-Agent, MCP, Evaluation

**Build:** Split the single agent into specialized sub-agents (a `DiagnosticsAgent`, a `RunbookAgent`, a `SummaryAgent`) coordinated by a supervisor — now is the appropriate time to adopt **LangGraph**, since you've already built the primitive by hand and can explain what the framework is doing for you. Expose your internal tools via **MCP (Model Context Protocol)** so any MCP-compatible client (not just your own orchestrator) could use them. Build a small **AI evaluation harness**: a labeled set of alert → expected-triage pairs, run automatically in CI, fail the build if triage accuracy regresses.

**New concepts:**
- **Multi-agent systems** — when to split one agent into several (separation of concerns, different tools/context per sub-agent) vs when it's overkill (added coordination complexity for no accuracy gain — be ready to argue *both* sides)
- **MCP (Model Context Protocol)** — a standard way to expose tools/resources to *any* LLM client, not just your own code; explain it as "USB-C for AI tools" — you build the tool once, any compliant agent can use it
- **AI evaluation & benchmarking** — golden datasets, regression testing for prompts, why "it looks right when I tried it" is not engineering
- **AI observability** — log every prompt, tool call, and response with a trace ID (tie into your OpenTelemetry setup from Phase 7) so a bad triage in production is debuggable, not a black box
- **Guardrails** — schema validation on every structured output, refusing to auto-execute if confidence is below threshold *or* if the output fails validation, rate-limiting how many auto-actions can fire per hour (defense against a feedback loop of bad decisions)
- **Memory** — short-term (conversation context within one incident) vs long-term (feedback from resolved incidents improving future retrieval) — implement long-term memory as: human corrections get stored and are searchable by future RAG queries, so the system genuinely improves over time

**Expected commit:** `feat: multi-agent architecture via LangGraph, MCP tool exposure, and CI-integrated eval harness`

**Interview question:** "How do you test and evaluate a system with non-deterministic output?" — this is currently one of the highest-signal AI engineering interview questions, and you'll have a real harness to describe.

---

## Phase 11 — Resilience at Scale

**Build:** Circuit breakers around every external call (LLM API, mocked "infra" APIs). Rate limiting on ingestion (per-service token bucket). Distributed locks (Redis `Redlock` or Postgres advisory locks) for any operation that must not run twice concurrently across replicas (e.g., "only one pod should execute this auto-remediation at a time").

**New concepts:**
- **Circuit Breaker pattern** — after N failures to the LLM API, stop calling it for a cooldown period and fail fast/escalate to human instead of hammering a degraded dependency
- **Rate limiting** — token bucket vs sliding window, applied per-tenant so one noisy service can't starve others
- **Distributed locks** — why a simple in-memory lock doesn't work once you have multiple pod replicas; Redlock's tradeoffs and when Postgres advisory locks are actually the simpler, more consistent choice
- **Optimistic vs pessimistic locking** — optimistic (version column, retry on conflict) for the incident record most of the time; pessimistic (`SELECT FOR UPDATE`) for the rare case where a conflict is expensive to retry (e.g., mid-execution of an approved action)

**Expected commit:** `feat: circuit breakers, rate limiting, and distributed locking for auto-remediation safety`

**Interview question:** "How do you prevent a flaky dependency from cascading into a full outage?" — circuit breaker answer, first-hand.

---

## Phase 12 — Frontend Polish & SaaS Product Surface

**Build out the Next.js app into a full product surface:**
- Dashboard (open incidents, severity breakdown, MTTR trend)
- Incident timeline (chronological: alert → agent steps → human actions → resolution)
- AI Reasoning panel (live agent thought stream with tool calls and citations, from Phase 5)
- Logs Explorer (query Loki from the UI)
- Metrics view (embed/proxy Grafana panels)
- Service Health page
- Deployments feed (mock CI/CD events correlated with incidents — "was this caused by a recent deploy?")
- Runbooks library (browse/search, tied to Phase 4's RAG source data)
- Organization & Team management, User management, RBAC-aware UI (buttons hidden/disabled based on role)
- Feature flags panel (toggle auto-execute, toggle canary agent version)
- Notifications (in-app + webhook out to Slack-style endpoint)
- Settings

**New concepts:**
- **API versioning** — `/api/v1/...` from day one, so you can explain how you'd introduce `/v2` without breaking existing clients
- **Pagination & search** — cursor-based pagination for incident lists (stable under concurrent writes, unlike offset pagination)
- **Soft deletes** — incidents/runbooks are never hard-deleted (compliance/audit reasons), just flagged, and all queries must respect this consistently (a good place to discuss ORM-level query scoping)

**Expected commit:** `feat: full SaaS dashboard with org/team management, feature flags, and runbook library`

---

# PART A2 — PHASE DEEP-DIVES

For every phase in Part A: the mistake beginners make building this exact thing, how a senior engineer's instinct differs, where to read further, an optional stretch goal, and an expanded interview bank (whiteboard / system design / behavioral / coding / how interviewers actually grade the answer).

## Phase 0 — Foundations

- **Common mistake:** Reaching for microservices or Kubernetes on day one "to do it right," and spending week one fighting infrastructure instead of shipping the `incidents` module.
- **Senior engineer thinking:** Ships the boring monolith first. The infrastructure complexity is *deferred*, not skipped — Phase 8/9 exist precisely because this phase built clean module boundaries that make the later split cheap.
- **Recommended reading:** NestJS official docs ("Fundamentals" section); *Clean Architecture* (Robert C. Martin), ch. 1–3; Martin Fowler's "MonolithFirst" article.
- **Stretch goal:** Add a second bounded-context module (`services`) with zero cross-imports into `incidents` except through a defined interface — prove the boundary holds before you need it to.
- **Interview bank:**
  - *Whiteboard:* "Sketch the module boundaries for a system that ingests events and stores incidents."
  - *System design:* "Would you start this as a monolith or microservices? Defend it."
  - *Behavioral:* "Tell me about a time you resisted over-engineering something."
  - *Coding:* Implement a small DI container from scratch to prove you understand what NestJS is doing for you.
  - *Common candidate mistake:* Answering "microservices" by default because it sounds more senior — interviewers specifically probe for whether you can justify simplicity.
  - *How it's graded:* Staff-level interviewers score *reasoning about tradeoffs*, not which answer you land on — a well-justified monolith beats a reflexive microservices answer.

## Phase 1 — Clean Architecture & Domain Model

- **Common mistake:** Anemic domain models — entities that are just data bags, with all logic living in "service" classes, defeating the purpose of DDD.
- **Senior engineer thinking:** Puts invariants (e.g., "resolved incidents can't reopen without a new alert") *inside* the entity, so it's structurally impossible to violate them from a controller or worker.
- **Recommended reading:** *Domain-Driven Design Distilled* (Vaughn Vernon); Khalil Stemmler's DDD-in-TypeScript blog series; Uber Engineering's blog on service architecture evolution.
- **Stretch goal:** Write a unit test that proves an invalid state transition is *impossible to construct*, not just rejected at runtime.
- **Interview bank:**
  - *Whiteboard:* "Design the domain model for an incident with valid state transitions."
  - *System design:* "How do you keep business logic out of your database layer?"
  - *Behavioral:* "Describe a time you inherited a codebase with no separation of concerns. What did you do?"
  - *Coding:* Implement a repository interface + in-memory fake, then swap in a real Postgres implementation without touching the use case.
  - *Common candidate mistake:* Conflating "layers" with "folders" — reorganizing files without actually inverting the dependency direction.
  - *How it's graded:* Interviewers check whether you can name the *direction* dependencies point and why, not just recite "Domain, Application, Infrastructure."

## Phase 2 — MVP Event Loop with BullMQ

- **Common mistake:** Handling the webhook synchronously and "just making the DB write fast enough" instead of decoupling with a queue.
- **Senior engineer thinking:** Treats "the sender might retry" as a certainty, not an edge case, and designs idempotency in from the start rather than patching it in after a duplicate-incident bug in production.
- **Recommended reading:** BullMQ docs ("Rate limiting," "Stalled jobs"); Stripe's engineering blog on idempotency keys; "Idempotency Keys" pattern on microservices.io.
- **Stretch goal:** Simulate a burst of 1,000 duplicate webhook deliveries with `autocannon` and prove exactly one incident is created.
- **Interview bank:**
  - *Whiteboard:* "Design an idempotent webhook receiver."
  - *System design:* "How would you handle 10x more alert volume tomorrow?"
  - *Behavioral:* "Tell me about a bug caused by an assumption that a request would only happen once."
  - *Coding:* Implement exponential backoff with jitter from scratch.
  - *Common candidate mistake:* Proposing a unique constraint alone, missing the fast-path lock that avoids hitting the DB under load at all.
  - *How it's graded:* Look for whether you mention *both* correctness (DB constraint) and performance (Redis fast path) — one alone is a partial answer.

## Phase 3 — AI Agent v1

- **Common mistake:** Trusting the model's self-reported confidence directly, or letting free-text output flow into code that assumes structure.
- **Senior engineer thinking:** Treats the LLM as an unreliable external dependency — validate its output the same way you'd validate any third-party API response, schema and all.
- **Recommended reading:** Anthropic's tool-use documentation and prompt-engineering guide; the ReAct paper (Yao et al., "Reasoning and Acting"); Simon Willison's blog on prompt injection and structured output.
- **Stretch goal:** Add an automatic retry-with-repair step: if structured output fails schema validation, feed the validation error back to the model and ask it to correct itself once before failing.
- **Interview bank:**
  - *Whiteboard:* "Design the control loop for an agent that can call tools."
  - *System design:* "How do you keep a system reliable when one component (the LLM) is non-deterministic?"
  - *Behavioral:* "Describe a time you had to build trust in an unreliable dependency."
  - *Coding:* Implement JSON schema validation with a repair-retry loop.
  - *Common candidate mistake:* Describing "prompt engineering" as the whole solution and skipping validation/guardrails entirely.
  - *How it's graded:* Strong answers separate "getting a good response most of the time" (prompting) from "guaranteeing the system doesn't break when it isn't" (validation, fallback, confidence gating).

## Phase 4 — RAG with pgvector

- **Common mistake:** Fixed-size chunking (e.g., every 500 tokens) that splits a runbook mid-idea, degrading retrieval quality invisibly.
- **Senior engineer thinking:** Evaluates retrieval quality with actual test queries before blaming the LLM for a "bad answer" that was actually a retrieval problem.
- **Recommended reading:** Pinecone's "Chunking Strategies for LLM Applications"; the original RAG paper (Lewis et al. 2020); pgvector GitHub README on HNSW vs IVFFlat.
- **Stretch goal:** Build a tiny retrieval-quality eval (10 known query→expected-chunk pairs) and measure recall before/after changing chunking strategy.
- **Interview bank:**
  - *Whiteboard:* "Design a retrieval pipeline for grounding an LLM in internal docs."
  - *System design:* "pgvector vs a dedicated vector DB — when do you switch?"
  - *Behavioral:* "Tell me about a time a fix that looked like a model problem turned out to be a data problem."
  - *Coding:* Implement cosine similarity from scratch and explain why it's used over Euclidean distance for embeddings.
  - *Common candidate mistake:* Jumping straight to "we need a vector database" without discussing chunking or retrieval evaluation, which matter more at small-to-medium scale.
  - *How it's graded:* Interviewers weight *retrieval quality reasoning* heavily — most RAG failures in practice are retrieval bugs, not generation bugs, and candidates who only talk about the LLM miss this.

## Phase 5 — Real-Time Layer

- **Common mistake:** Building WebSockets assuming a single server instance, then being surprised when horizontal scaling breaks message delivery.
- **Senior engineer thinking:** Designs for the eventual multi-instance case (Redis pub/sub fan-out) even at small scale, because retrofitting it later means a connection-handling rewrite.
- **Recommended reading:** Discord's engineering blog "How Discord Scaled Elixir to 5,000,000 Concurrent Users"; Ably's "WebSockets vs SSE vs Long Polling" guide.
- **Stretch goal:** Run two instances of the WebSocket gateway locally behind a load balancer and prove a message published to one is received by a client connected to the other.
- **Interview bank:**
  - *Whiteboard:* "Design a real-time notification system for a multi-instance backend."
  - *System design:* "How do you scale WebSocket connections horizontally?"
  - *Behavioral:* "Describe a time you designed for scale you didn't have yet, and whether that was the right call."
  - *Coding:* Implement a simple pub/sub fan-out using Redis.
  - *Common candidate mistake:* Proposing "just use more WebSocket servers" without addressing how events reach the right connected client.
  - *How it's graded:* Look for explicit mention of the fan-out mechanism (pub/sub, message broker) — "just scale horizontally" without this detail is an incomplete answer.

## Phase 6 — Security & Auth

- **Common mistake:** Storing JWTs in `localStorage` (vulnerable to XSS token theft) instead of an httpOnly cookie.
- **Senior engineer thinking:** Treats auth as a system with attacker-modeled tradeoffs (XSS vs CSRF), not a checklist of "add JWT."
- **Recommended reading:** OWASP Top 10 (current edition); OWASP JWT cheat sheet; Auth0's blog on refresh token rotation.
- **Stretch goal:** Implement refresh-token rotation with reuse detection (if a used-up refresh token is presented again, revoke the whole session — a sign of theft).
- **Interview bank:**
  - *Whiteboard:* "Design an auth flow with access + refresh tokens."
  - *System design:* "How do you handle authorization for multiple roles across a growing set of resources?"
  - *Behavioral:* "Tell me about a security tradeoff you had to explain to a non-technical stakeholder."
  - *Coding:* Implement RBAC middleware that checks role against a resource-action matrix.
  - *Common candidate mistake:* Treating JWT as "solved" once implemented, without discussing revocation, rotation, or storage location tradeoffs.
  - *How it's graded:* Interviewers probe past the happy path — "what happens when a token is stolen" separates candidates who implemented auth from candidates who understand it.

## Phase 7 — Observability

- **Common mistake:** Adding logs everywhere but no correlation ID, so a single alert's journey across services can't actually be reconstructed.
- **Senior engineer thinking:** Treats trace-ID propagation as non-negotiable infrastructure, added before it's needed, because retrofitting tracing during an actual incident is impossible.
- **Recommended reading:** *Distributed Tracing in Practice* (O'Reilly); Google's "Dapper" paper (the origin of modern distributed tracing); Grafana Labs' "Three Pillars of Observability" blog.
- **Stretch goal:** Inject an artificial 2-second delay into one random service and find it purely from the Grafana/Jaeger dashboards, without reading code.
- **Interview bank:**
  - *Whiteboard:* "Design an observability strategy for a 5-service pipeline."
  - *System design:* "Metrics vs logs vs traces — when do you reach for each?"
  - *Behavioral:* "Walk me through debugging a production incident you couldn't reproduce locally."
  - *Coding:* Instrument a function with an OpenTelemetry span and propagate context to a downstream call.
  - *Common candidate mistake:* Describing observability as "adding logging" without mentioning correlation/trace IDs or metrics.
  - *How it's graded:* This is one of the highest-signal Staff-level questions — graders listen for a structured debugging *process* (hypothesis → cheapest check → narrow down), not a list of tools.

## Phase 8 — Kafka Migration

- **Common mistake:** Treating the Postgres write and the Kafka publish as "basically the same transaction" and not noticing the dual-write consistency gap until an event is silently lost.
- **Senior engineer thinking:** Names the dual-write problem explicitly before writing code, and picks the Outbox Pattern *because* it was named, not by accident.
- **Recommended reading:** Confluent's blog "Transactional Outbox Pattern"; Martin Kleppmann's *Designing Data-Intensive Applications*, ch. 11 (Stream Processing); Debezium docs (CDC-based outbox relay).
- **Stretch goal:** Kill the outbox-relay process mid-batch and prove no events are lost or duplicated on restart.
- **Interview bank:**
  - *Whiteboard:* "Design a reliable way to publish an event whenever a database row changes."
  - *System design:* "When would you choose Kafka over a simpler queue?"
  - *Behavioral:* "Describe a migration you did on a live system without downtime."
  - *Coding:* Implement an outbox table + a simple polling relay that publishes and marks rows as sent.
  - *Common candidate mistake:* Suggesting "just publish to Kafka right after the DB write" without addressing what happens if the process crashes between the two.
  - *How it's graded:* This question specifically filters for dual-write awareness — candidates who've actually hit this in production name it unprompted.

## Phase 9 — Kubernetes & Deployment

- **Common mistake:** Confusing liveness and readiness probes, causing Kubernetes to restart a pod that's just temporarily busy (readiness failure), not actually dead.
- **Senior engineer thinking:** Treats graceful shutdown as part of the deployment design, not an afterthought — verifies no in-flight job is dropped during a rolling deploy before calling it done.
- **Recommended reading:** Kubernetes docs on "Pod Lifecycle" and "Liveness, Readiness and Startup Probes"; the KEDA docs; Google's SRE book, ch. on release engineering.
- **Stretch goal:** Trigger a rolling deploy while a load test is running against the ingestion endpoint and verify zero dropped requests.
- **Interview bank:**
  - *Whiteboard:* "Explain the difference between liveness and readiness probes with an example failure mode for each."
  - *System design:* "How would you safely deploy a risky change to a production system?"
  - *Behavioral:* "Tell me about a deployment that went wrong and what you changed afterward."
  - *Coding:* Write a SIGTERM handler that drains in-flight BullMQ jobs before exiting.
  - *Common candidate mistake:* Conflating canary and blue/green deployment, or not knowing the cost tradeoff (blue/green needs 2x infrastructure).
  - *How it's graded:* Graders check whether you can state the actual failure mode each probe/strategy prevents, not just define the term.

## Phase 10 — Multi-Agent & Evaluation

- **Common mistake:** Splitting into multiple agents for architectural aesthetics, adding coordination overhead without any accuracy or maintainability gain.
- **Senior engineer thinking:** Builds the eval harness *before* refactoring to multi-agent, so there's a number to prove the split actually helped (or to prove it didn't, and revert).
- **Recommended reading:** Anthropic's "Building Effective Agents" blog post; the MCP specification docs; OpenAI's evals framework docs.
- **Stretch goal:** Run your eval harness against both the single-agent (Phase 3) and multi-agent (Phase 10) versions and report which actually scores higher — be willing to find the single-agent version wins.
- **Interview bank:**
  - *Whiteboard:* "Design an evaluation harness for a non-deterministic system."
  - *System design:* "When does a multi-agent architecture help, and when is it overkill?"
  - *Behavioral:* "Tell me about a time you added complexity and later had to walk it back."
  - *Coding:* Write a test harness that runs N labeled examples through a pipeline and reports a pass rate.
  - *Common candidate mistake:* Assuming more agents = more sophisticated = better, without evidence.
  - *How it's graded:* This is a judgment question — the strongest answers argue *against* their own added complexity unless they have a number to justify it.

## Phase 11 — Resilience at Scale

- **Common mistake:** Adding a circuit breaker with no cooldown/half-open state, so it either never trips or never recovers.
- **Senior engineer thinking:** Chooses Postgres advisory locks over Redlock by default (fewer moving parts, one less distributed-consensus problem to reason about), and only reaches for Redlock when Postgres genuinely can't be the lock authority.
- **Recommended reading:** Martin Kleppmann's "How to do distributed locking" (critique of Redlock) and the Redis Labs rebuttal — read both sides; the Circuit Breaker pattern chapter in *Release It!* (Michael Nygard).
- **Stretch goal:** Deliberately degrade the mocked LLM API (add random 5-second delays) and verify the circuit breaker trips and the system degrades to human-escalation-only, without a full outage.
- **Interview bank:**
  - *Whiteboard:* "Design a circuit breaker with states and transitions."
  - *System design:* "How do you prevent one degraded dependency from taking down the whole system?"
  - *Behavioral:* "Describe an outage caused by a dependency, and what you changed afterward."
  - *Coding:* Implement a token-bucket rate limiter from scratch.
  - *Common candidate mistake:* Describing only the "open" state of a circuit breaker and forgetting half-open/recovery.
  - *How it's graded:* Interviewers look for the full state machine (closed → open → half-open) and an understanding of *why* fail-fast is better than a hung request under load.

## Phase 12 — Frontend Polish

- **Common mistake:** Building every dashboard panel to poll the API every few seconds "for simplicity," creating unnecessary load and stale-data windows.
- **Senior engineer thinking:** Reuses the Phase 5 WebSocket/pub-sub infrastructure for anything genuinely real-time, and reserves polling/refetch (React Query) only for data that's fine being slightly stale.
- **Recommended reading:** TanStack Query docs ("Important Defaults"); web.dev's guide on cursor vs offset pagination; WCAG 2.2 Quick Reference.
- **Stretch goal:** Run an accessibility audit (axe or Lighthouse) on the incident dashboard and fix every critical violation.
- **Interview bank:**
  - *Whiteboard:* "Design a paginated incident list API that stays correct under concurrent writes."
  - *System design:* "Cursor vs offset pagination — tradeoffs?"
  - *Behavioral:* "Tell me about a time you had to balance polish against shipping speed."
  - *Coding:* Implement cursor-based pagination against a Postgres table.
  - *Common candidate mistake:* Defaulting to offset pagination because it's simpler to implement, without mentioning the page-drift problem under concurrent inserts.
  - *How it's graded:* A correct tradeoff discussion (offset is simpler but drifts; cursor is stable but can't jump to an arbitrary page) scores higher than a one-sided answer.

---

# PART B — CONCEPT REFERENCE

## B1. Technology Deep-Dive

| Technology | Why we chose it | Why large companies use it | Problem it solves | Alternatives | When NOT to use it | Concepts to learn while using it |
|---|---|---|---|---|---|---|
| **NestJS** | Enforces structure (modules, DI) that scales with team size | Consistent architecture across many services/teams reduces onboarding cost | "Any structure goes" chaos in large Express codebases | Express (more freedom, less structure), Fastify (raw speed), Go/Gin (if perf-critical) | A tiny single-purpose script/lambda — the ceremony isn't worth it | Dependency Injection, decorators, module boundaries |
| **TypeScript** | Type safety across a growing codebase with many contributors (even if it's just you over time) | Catches entire classes of bugs at compile time; makes refactors safe | Runtime type errors in large JS codebases | Plain JS (fine for tiny scripts), Go/Rust (if you want compiled performance too) | Extremely small, short-lived scripts | Structural typing, generics, discriminated unions |
| **PostgreSQL** | Strong consistency (ACID), extensible (pgvector), mature tooling | Correctness for financial/critical data; one engine covers relational + vector needs early on | Need for transactional guarantees + relational modeling | MySQL (similar niche), MongoDB (if truly document-shaped, weaker consistency guarantees) | Extremely high-write, loosely-structured event data at massive scale (that's what Kafka/analytics stores are for) | ACID, indexing, connection pooling, replication |
| **Redis** | Sub-millisecond cache/lock/queue backend | Cheap, fast, simple mental model (mostly single-threaded, predictable) | Slow DB round-trips for hot data; need for idempotency locks and job queues before Kafka | Memcached (cache-only, no data structures/pubsub), KeyDB | As a system of record for critical data (it's not durable by default the way Postgres is) | Caching strategies (cache-aside, write-through), TTL, pub/sub, distributed locks |
| **BullMQ** | Simple, Redis-backed job queue with retries/DLQ built in | Good enough for most background-job needs without operating a Kafka cluster | Need for async processing, retries, backoff without Kafka's operational overhead | Kafka (overkill until multiple independent consumers exist), Sidekiq (Ruby ecosystem equivalent), SQS | Multiple independent consumer groups needing replay — that's Kafka's job | Retry/backoff strategies, DLQ, job concurrency |
| **Kafka** | Durable, replayable, multi-consumer event log | Decouples producers/consumers at massive scale; replay is essential for reprocessing/backfills | Multiple services need the same event stream independently, with ordering guarantees and replay | Redpanda (Kafka-API compatible, simpler ops), Pulsar, AWS Kinesis | Simple single-consumer background jobs — that's over-engineering; use BullMQ/SQS instead | Partitioning, consumer groups, ordering, outbox pattern, replay |
| **WebSockets** | Push-based real-time updates | Live dashboards, collaborative tools, chat — anywhere polling is too slow/wasteful | Client needs server-initiated updates, not just request/response | Server-Sent Events (simpler, one-directional), long polling (legacy fallback) | Simple request/response APIs with no live-update need | Connection state, fan-out via pub/sub, backpressure |
| **Docker** | Environment parity, reproducible builds | Eliminates "works on my machine"; standard unit of deployment | Dependency/environment drift between dev and prod | Podman (drop-in alternative), bare VM/bare metal (rare now) | — | Images vs containers, layers, networking |
| **Kubernetes** | Declarative orchestration, self-healing, autoscaling | Standard for running many services reliably at scale with rolling deploys | Manual server/process management doesn't scale past a handful of services | Docker Swarm (simpler, far less common now), Nomad, serverless (for the right workloads) | A single simple app with low traffic — this is real operational overhead you shouldn't take on early | Pods, deployments, services, scheduling, autoscaling, networking |
| **OpenTelemetry** | Vendor-neutral instrumentation standard | One instrumentation format works with any backend (Jaeger, Datadog, Honeycomb, etc.) — avoids vendor lock-in | Debugging a request that crosses many services | Vendor SDKs directly (locks you in), manual logging only (insufficient for distributed tracing) | — | Traces, spans, context propagation |
| **Prometheus** | Pull-based metrics standard, powerful query language (PromQL) | De facto standard for Kubernetes-native monitoring | Need to know system health/trends over time, not just point-in-time logs | Datadog/New Relic (managed, paid), InfluxDB | — | Metric types (counter/gauge/histogram), PromQL, alerting rules |
| **Grafana** | Best-in-class dashboarding, works with Prometheus/Loki/Jaeger together | Single pane of glass across metrics/logs/traces | Raw metrics aren't useful without visualization | Kibana (more log-centric), managed vendor dashboards | — | Dashboard design, alerting, data source correlation |
| **GitHub Actions** | Free for public/small private repos, tightly integrated with GitHub | Fast to adopt, huge ecosystem of actions | Manual deploys are slow and error-prone | GitLab CI, CircleCI, Jenkins (more setup overhead) | — | Pipelines as code, caching, matrix builds, secrets in CI |
| **pgvector** | Vector search without a new service, "good enough" at small-to-medium scale | Simplicity — one database for relational + vector data during early/mid stage | Need for semantic search over runbooks/docs | Qdrant, Pinecone, Weaviate (dedicated engines, better at massive scale/hybrid search) | Millions+ of vectors needing heavily tuned ANN search | Embeddings, cosine similarity, HNSW/IVFFlat indexing |
| **Anthropic/OpenAI APIs** | State-of-the-art tool-calling and reasoning | Building on top of frontier models rather than training your own is the practical choice for almost every product team | Need for reasoning, summarization, structured decision-making | Open-weight models (Llama, Mistral) if you need self-hosting/data residency | Simple deterministic logic that doesn't need reasoning — don't reach for an LLM if a rule engine solves it | Tool calling, structured outputs, prompt versioning, cost/token budgeting |
| **LangGraph** | Only introduced once you have genuine multi-agent coordination needs (Phase 10) | Useful once state machines between agents get complex enough that hand-rolling becomes error-prone | Coordinating multiple specialized agents with shared state | Hand-rolled orchestration (what you build first, Phase 3) | A single agent with a simple tool loop — building it by hand teaches more and is not meaningfully harder | Graph-based state machines, agent handoff patterns |

## B2. System Design Concept Map

| Concept | Where it lives in this project |
|---|---|
| CAP theorem | Discussed when choosing Postgres (CP) for incidents vs. accepting eventual consistency (AP) for the Kafka-driven read model in Phase 8 |
| ACID vs BASE | Postgres transactions for incident writes (ACID) vs. eventually-consistent CQRS read model fed by Kafka (BASE) |
| Event-driven architecture | Whole Phase 8 pipeline: alerts.raw → enriched → triaged → actions.requested |
| CQRS | Separate write model (domain/Postgres) from read model (denormalized dashboard views, Phase 8) |
| Event sourcing | `agent_actions` and `audit_log` as append-only logs (applied selectively, not dogmatically) |
| Saga pattern | Multi-step approved-action execution (Phase 8) |
| Outbox pattern | Reliable event publishing alongside Postgres writes (Phase 8) |
| Circuit breaker | Wrapping LLM API and mocked infra-API calls (Phase 11) |
| Retry strategies / exponential backoff | BullMQ job retries (Phase 2), Kafka consumer retry topics (Phase 8) |
| Dead letter queues | BullMQ DLQ (Phase 2), Kafka `*.dlq` topics (Phase 8) |
| Rate limiting | Ingestion endpoint per-tenant token bucket (Phase 11) |
| Distributed locks | Redis/Postgres advisory locks preventing double-execution of remediation actions (Phase 11) |
| Idempotency | Dedupe key on alerts (Phase 2) |
| Horizontal vs vertical scaling | Consumer pods scale horizontally via KEDA; Postgres primary scales vertically until read replicas (Phase 9) |
| Load balancing | NGINX Ingress across pod replicas (Phase 9) |
| Caching strategies | Redis cache-aside for enrichment lookups (service owner, deploy history) |
| Database indexing | Indexes on `incident_id`, `dedupe_key`, and the pgvector HNSW index on `runbooks.embedding` |
| Read replicas | Dashboard read queries offloaded from the primary (Phase 9) |
| Connection pooling | PgBouncer in front of Postgres (Phase 9) |
| API Gateway | NGINX Ingress acting as the single entry point routing to services |
| Service discovery | Kubernetes DNS-based service discovery (Phase 9) |
| Reverse proxy | NGINX Ingress (Phase 9) |
| Health checks | `/healthz` (liveness) and `/readyz` (readiness) on every service (Phase 9) |
| Graceful shutdown | SIGTERM handling draining in-flight jobs/requests before pod termination (Phase 9) |
| Feature flags | Kill switch for auto-execute behavior and canary agent version (Phase 9/10) |
| Blue/Green deployment | Discussed as an alternative to canary, tradeoffs explained (Phase 9) |
| Canary deployment | Used specifically for the AI agent service (Phase 9) |
| Rolling deployment | Default deployment strategy for stateless services (Phase 9) |

## B3. AI Engineering Concept Map

| Concept | Why it exists | How production companies use it | How you implement it here |
|---|---|---|---|
| Agent architecture | LLMs alone can't take multi-step action; an agent loop lets a model plan, act, and observe results | Anthropic/OpenAI's own tool-use docs, Sierra, Adept all use this loop as the base primitive | Phase 3's hand-built plan→act→observe loop |
| Tool calling | Lets a model request structured actions instead of hoping you parse free text correctly | Every serious agent product (Claude, GPT, Sierra) is built on this | `searchLogs`, `getRecentDeploys`, `searchRunbooks` tools (Phase 3) |
| MCP | Standardizes tool/resource exposure so any compliant client can use the same tools | Emerging standard for interoperable agent tooling across vendors | Expose internal tools via MCP in Phase 10 |
| RAG | Keeps knowledge current and explainable without retraining a model | Standard technique for grounding LLMs in private/internal data | pgvector runbook retrieval with citations (Phase 4) |
| Vector databases | Enable semantic (not just keyword) search over unstructured text | Underpins every RAG system in production | pgvector → optionally Qdrant if scale demands it |
| Embeddings | Numeric representations of meaning, enabling similarity search | Core primitive behind RAG, semantic search, clustering | Runbook chunk embeddings (Phase 4) |
| Prompt engineering | Model behavior is steered by prompt structure/examples, not code | Every AI product team maintains and versions prompts like code | System prompt + few-shot examples, versioned (Phase 3) |
| Structured outputs | Free text is unreliable to parse; JSON-schema-constrained output is safe to build software around | Standard practice for any LLM output consumed by other systems | Triage result schema (severity/summary/confidence/action) |
| Memory | Systems that don't remember past corrections repeat the same mistakes | Production copilots store user feedback to improve future retrieval/behavior | Human corrections stored and retrievable by future RAG queries (Phase 10) |
| Multi-agent systems | Splitting responsibilities improves focus and tool-scoping per agent | Used when a single agent's context/tool surface gets too broad to reason well | Diagnostics/Runbook/Summary sub-agents (Phase 10) |
| AI evaluation | "Looked right when I tried it" isn't engineering; you need regression detection | Every serious AI team runs golden-dataset evals in CI | Labeled alert→triage dataset run in CI (Phase 10) |
| Hallucination prevention | Ungrounded claims are dangerous in an incident-response context | Citation-forcing, confidence gating, human approval are standard mitigations | Runbook citations + confidence gating (Phase 4 & 3) |
| Confidence scoring | A single trust signal to decide automation vs escalation | Used to gate autonomy level in any agentic production system | Derived from signal quality, not self-reported model confidence (Phase 3) |
| Human approval workflow | The safety valve for any imperfect autonomous system | Universal pattern in agentic ops/support tools | Approve/reject UI for proposed actions (Phase 5/12) |
| Guardrails | Prevents bad outputs from causing real-world harm | Schema validation, rate-limited auto-actions, confidence thresholds | Phase 10 |
| Cost optimization / token budgeting | LLM calls cost real money and have latency; unbounded usage doesn't scale | Every production AI team tracks and caps token spend | Context size caps, per-incident token tracking (Phase 3) |
| Prompt versioning | Prompts change behavior like code changes; need rollback capability | Treated like feature flags/config, not hardcoded strings | Versioned prompt storage (Phase 3) |
| AI observability | A bad triage in production needs to be debuggable, not a black box | Trace every prompt/tool-call/response with correlation IDs | Tied into OpenTelemetry trace IDs (Phase 10) |
| Prompt injection | User- or alert-payload-controlled text can attempt to hijack agent instructions | Every production agent that ingests untrusted text (support tickets, alert payloads, web content) must treat it as adversarial input | Treat alert payload fields as data, never concatenate them into the system prompt as instructions; validate/strip suspicious directives before they reach the model (Phase 3/10) |
| Context engineering | What you put in the context window matters as much as the prompt wording — irrelevant context degrades reasoning | Distinguishes mature AI teams from ones that just "add more context to fix it" | Curate exactly which tool results enter context per step, rather than dumping everything retrieved (Phase 3/4) |
| Semantic caching | Identical or near-identical queries shouldn't re-pay full LLM cost/latency | Used by high-traffic AI products to cut cost on repeated/similar queries | Cache triage results keyed by embedding similarity of the alert signature, with a freshness TTL (stretch goal, Phase 10/11) |
| Model routing | Not every request needs the most expensive/capable model | Production systems route cheap/simple queries to a small model and escalate to a large one only when needed | Route low-severity, high-confidence-precedent alerts to a cheaper/smaller model; escalate ambiguous ones to the primary model (stretch goal, Phase 11) |
| Fallback models | A single model provider being down shouldn't take down the whole system | Standard resilience pattern once a product depends on an external LLM API | Circuit breaker (Phase 11) trips to a secondary provider or a "human-only" degraded mode, never a hard failure |
| Hybrid search / BM25 / re-ranking | Pure vector search misses exact keyword matches (error codes, service names); pure keyword search misses semantic matches | Most production RAG systems combine both, then re-rank the merged results | Combine pgvector similarity with Postgres full-text search (`tsvector`) on runbooks, then re-rank combined results (stretch goal, Phase 4) |
| Knowledge graphs | Some relationships (service ownership, dependency chains) are structural, not semantic — a vector search over prose won't capture "Service A depends on Service B" reliably | Used by companies with complex internal topologies (e.g., service dependency graphs) to ground agent reasoning in facts, not retrieved prose | A `service_dependencies` table queried directly as a tool, rather than trying to retrieve this fact via RAG (Phase 3 tool) |
| Fine-tuning vs prompting | Fine-tuning is expensive, slow to iterate, and usually unnecessary if prompting + RAG + tools solve the problem | Most production AI teams default to prompting/RAG first and only fine-tune when there's a specific, measured gap (style, latency, cost at scale) | This project deliberately never fine-tunes — a good place to explain *why* prompting+RAG was sufficient and what evidence would change that |
| Small vs large models / model selection | Bigger models cost more and are often slower; not every step of the agent loop needs frontier-level reasoning | Production systems mix model sizes deliberately per task | Use a smaller/cheaper model for structured extraction steps, reserve the largest model for the final triage reasoning step (stretch goal) |
| LLM gateway | Centralizes API key management, rate limiting, logging, and provider routing across every service that calls an LLM | Standard infra pattern once more than one internal service calls an LLM | A thin internal service all agent calls go through, so cost/logging/routing logic lives in one place, not duplicated per caller (stretch goal, Phase 10/11) |
| Prompt A/B testing | Prompt changes are behavior changes; you need evidence a new prompt is actually better, not just "it read well" | Mature AI teams treat prompts like any other shipped change requiring measurement | Run both prompt versions against the Phase 10 eval harness before rolling one out fully |
| Tool retry / reflection / self-correction | Tool calls fail (network, bad args) and models sometimes reason incorrectly on the first pass; retrying blindly or giving up both underperform | Techniques like Reflexion (self-critique loops) improve reliability without human intervention | Feed a failed tool call's error back to the model once for self-correction before escalating to a human (Phase 3 stretch goal) |
| AI cost monitoring | Token spend can silently balloon as usage grows; without per-feature tracking, you find out from the bill | Every production AI team dashboards cost per feature/endpoint, not just aggregate spend | Tag every LLM call with an incident ID and log token cost, surfaced in Grafana alongside your other metrics (Phase 7/10) |
| AI permissions | Not every agent action should have the same blast radius; a diagnostic read and an auto-remediation write need different authorization | Production agentic systems scope tool permissions per action type, the same way RBAC scopes human permissions | Read-only tools (search logs) run unrestricted; write/action tools require the confidence-gate + human-approval flow (Phase 3/6) |
| MCP servers / MCP clients | A server exposes tools/resources over a standard protocol; a client (your orchestrator, or any other MCP-compatible agent) consumes them without custom integration code per tool | Lets tools be built once and reused across agent frameworks/vendors | Your `searchRunbooks`/`getRecentDeploys` tools exposed as an MCP server in Phase 10, consumable by your own orchestrator *or* a third-party MCP client |
| AI governance | Someone needs to be accountable for what an autonomous system is allowed to do, and there needs to be an audit trail and kill switch | Regulated/production AI systems increasingly require documented governance (who approved autonomy level, what's logged, how it's disabled) | The confidence-gating policy + feature flag kill switch + audit log *is* your governance model — document it explicitly as one (Phase 3/6/9) |
| Evaluation metrics | "It seems to work" isn't a metric; you need precision/recall-style numbers on triage quality to know if a change helped or hurt | Standard practice: accuracy against a golden set, false-positive rate on auto-actions, human-override rate | Track: triage accuracy vs golden set, % of auto-actions later reversed by a human, average confidence on correct vs incorrect triages (Phase 10) |
| Production AI failures | Real systems fail in specific, recurring ways: silent retrieval degradation, confidence miscalibration, prompt drift after a model version update, cost blowouts | Understanding these failure modes is what separates "built a demo" from "operated AI in production" | Document at least one *deliberately induced* failure of each type during Phase 10/11 testing, and how your guardrails caught (or missed) it — this is one of your best interview stories |

## B4. Backend Engineering Concept Map

| Concept | Where it lives |
|---|---|
| Clean Architecture / Hexagonal | Domain/Application/Infrastructure/Interface layering (Phase 1) |
| DDD | `Incident`, `Alert`, `Service` as entities with real invariants (Phase 1) |
| Repository Pattern | `IncidentRepository` interface + Postgres implementation (Phase 1) |
| Dependency Injection | NestJS providers throughout |
| SOLID | Dependency Inversion (repo interfaces), Single Responsibility (controllers vs services) |
| Modular Monolith vs Microservices | Start monolith (Phase 0-7), naturally split services once Kafka introduces real service boundaries (Phase 8+) |
| API Versioning | `/api/v1/` from day one (Phase 12) |
| Validation | `class-validator` DTOs on every endpoint |
| Authentication / RBAC | Phase 6 |
| Audit Logs | Append-only `audit_log` table (Phase 1 schema, Phase 6 middleware) |
| Optimistic / Pessimistic Locking | Version column for incidents; `SELECT FOR UPDATE` for action execution (Phase 11) |
| Transactions | Postgres transactional writes + outbox pattern (Phase 8) |
| Soft Deletes | Incidents/runbooks flagged not deleted (Phase 12) |
| Background Jobs / Scheduling | BullMQ (Phase 2), scheduled postmortem generation jobs |
| Streaming | WebSocket event streams (Phase 5) |
| Pagination / Search | Cursor-based pagination on incident list (Phase 12) |

## B5. Security Concept Map

| Concept | Implementation |
|---|---|
| JWT | Short-lived access token + httpOnly refresh cookie |
| RBAC | Role-gated endpoints and UI controls |
| API Keys | For external alert-source webhooks |
| Secrets management | Kubernetes Secrets (or Doppler), never committed to repo |
| Encryption | TLS everywhere (Ingress-terminated), encrypted secrets at rest |
| Rate limiting | Per-tenant token bucket on ingestion (Phase 11) |
| SQL injection prevention | Parameterized queries via ORM by construction |
| XSS / CSP / secure headers | `helmet` middleware, sanitized rendering in Next.js |
| CSRF | Mitigated by header-based JWT rather than cookie-based sessions, with tradeoffs explained (Phase 6) |
| Audit trails | Phase 1/6 |

## B6. API Engineering

| Concept | Where it belongs in this project |
|---|---|
| REST resource naming & URI conventions | `/api/v1/incidents/{id}/actions` — nouns not verbs, nesting reflects ownership (Phase 0/1) |
| OpenAPI / Swagger | NestJS's `@nestjs/swagger` generates this from your DTOs — treat it as a contract, not just documentation (Phase 1) |
| Error response standard (RFC 7807 "Problem Details") | Every error response returns `type`, `title`, `status`, `detail`, `instance` consistently, instead of ad-hoc error shapes per endpoint (Phase 1) |
| API versioning | `/api/v1/` from day one; discuss how you'd introduce `/v2` (URI versioning) vs header-based versioning tradeoffs (Phase 12) |
| Pagination: cursor vs offset | Cursor-based for the incident list (stable under concurrent writes); explain why offset would drift under high insert rate (Phase 12) |
| Filtering & sorting | Query params on `/incidents` (`?severity=P1&sort=-createdAt`) — validated against an allowlist, never raw SQL interpolation |
| PATCH vs PUT | `PATCH /incidents/{id}` for partial status updates (idempotent, not necessarily full-replace); `PUT` reserved for full resource replacement if ever needed |
| Idempotent APIs | The alert webhook (Phase 2) is your core idempotency example — same idempotency key, same result, no duplicate side effects |
| Rate limits | Per-tenant token bucket at the API Gateway/Ingress layer (Phase 11) |
| API caching / ETags | `GET /incidents/{id}` returns an `ETag`; conditional `If-None-Match` requests get a `304` instead of a full payload — useful for the dashboard's polling fallback |
| Compression | `gzip`/`brotli` on API responses via Ingress/NGINX (Phase 9) |
| Multipart uploads | If you add "attach a log file to an incident" — multipart form handling with size limits |
| Streaming responses | The agent's reasoning trace streamed over WebSocket (Phase 5) is your streaming example; also consider Server-Sent Events as a simpler one-directional alternative for the same data |
| Long polling | Explicitly *not* used here — a good talking point: WebSockets were chosen because updates are frequent and bidirectional (human chat + agent stream), where long polling would add latency and server load for no benefit |
| SSE vs WebSockets | Documented tradeoff: SSE for one-directional agent-trace streaming would be simpler infrastructure; WebSockets were chosen because the incident room also needs client→server messages (chat, approvals) on the same channel |
| GraphQL vs REST | Deliberately not used — REST fits this domain's resource-oriented shape well; GraphQL's value (client-specified queries, avoiding over-fetching) matters more for products with many heterogeneous frontend clients than for one dashboard — be ready to argue both sides |
| gRPC overview | Discussed as the likely choice *if* the Agent Orchestrator and Worker Pool were ever split into services calling each other at high frequency with strict latency needs — internal service-to-service, not public API — a good "what would you change at 10x scale" answer |

## B7. Database Engineering

| Concept | Why it exists | How companies use it | How/where you implement or observe it here |
|---|---|---|---|
| EXPLAIN ANALYZE | Shows the actual query plan and execution time, not a guess | Standard first step before any index/query optimization | Run on the incident-list query before and after adding a composite index (Phase 1 stretch goal) |
| Composite indexes | A query filtering/sorting on multiple columns needs an index covering all of them in the right order | Standard for any list/filter endpoint at scale | Index on `(service_id, status, created_at)` for the dashboard's filtered incident list |
| Covering indexes | An index that contains every column a query needs means the DB never touches the table itself | Used on hot read paths to cut I/O | Consider for the incident-list read model (Phase 8 CQRS) |
| Partial indexes | Indexing only rows matching a condition (e.g., `WHERE status != 'resolved'`) keeps the index small and fast | Common when most queries only care about "active" rows | Partial index on open incidents, since dashboards query open incidents far more than resolved ones |
| GIN index | Optimized for indexing composite/array/JSONB/full-text values | Used for searching JSONB alert payloads or full-text runbook search | GIN index on `alerts.raw_payload` (JSONB) and on `runbooks.content` (`tsvector`) for hybrid search (B3) |
| GiST index | Optimized for geometric/range/nearest-neighbor-style queries | Less common here, but relevant if you ever add geo or range-overlap queries | Mentioned for completeness — not used unless a real need arises (avoid needless complexity) |
| MVCC | Postgres's mechanism for readers not blocking writers (and vice versa) via row versioning | Explains why Postgres handles concurrent read/write well without heavy locking | Directly relevant to why your incident dashboard reads don't block the ingestion pipeline's writes |
| VACUUM | Reclaims space from MVCC's old row versions; without it, tables bloat | Every Postgres operator has to understand autovacuum tuning eventually | Watch `pg_stat_user_tables` under load-testing (Phase 11) and observe autovacuum behavior on the high-write `alerts` table |
| Query optimization | Systematic process of finding and fixing slow queries | Continuous practice at any company with a relational DB at scale | Practiced directly via EXPLAIN ANALYZE loop above |
| Connection pooling | Postgres has a real connection limit; each connection is expensive (memory, process overhead) | PgBouncer or similar is standard once you have more than a few service instances | Added in Phase 9 in front of Postgres, explicitly to prevent connection exhaustion under KEDA-driven autoscaling |
| Lock contention & deadlocks | Concurrent transactions competing for the same rows cause waits or, worse, circular waits (deadlocks) | Common at scale; requires understanding transaction isolation levels | Deliberately induce a deadlock in Phase 11 (two transactions updating the same incident and a related row in opposite order) and observe Postgres's deadlock detection |
| Materialized views | Precomputed, cached query results, refreshed on a schedule or trigger | Used for expensive aggregate dashboards that don't need to be real-time-fresh | Consider for the MTTR-trend dashboard panel (Phase 12) instead of computing it live on every page load |
| Normalization vs denormalization | Normalization avoids update anomalies; denormalization trades consistency risk for read speed | Real systems mix both deliberately by table | Core domain tables normalized (Phase 1); CQRS read model deliberately denormalized (Phase 8) — a direct, concrete example of both choices in one project |
| Read replicas / write replicas | Offload read-heavy traffic from the primary; only the primary accepts writes | Standard scaling pattern before reaching for sharding | Dashboard reads routed to a replica in Phase 9 |
| Partitioning | Splitting one large table into smaller physical pieces (e.g., by month) improves query and vacuum performance | Common for high-volume append-only tables like audit logs | Partition `audit_log` and `alerts` by month once volume is simulated at scale (stretch goal) |
| Sharding | Splitting data across multiple database instances by a shard key, for write throughput beyond one machine's limits | Reserved for scale this project won't actually reach — discussed as "the next step after partitioning and read replicas stop being enough," not implemented, to avoid needless complexity | Documented as a "future migration path" in the relevant ADR, not built |
| Zero-downtime / online schema migrations | Adding/changing columns on a live table without locking it for the duration | Standard practice (`CREATE INDEX CONCURRENTLY`, expand-contract migration pattern) | Practice the expand-contract pattern in Phase 8 when adding outbox-related columns to existing tables without downtime |

## B8. Performance Engineering

| Concept | Why it exists | Where to practice it in this project |
|---|---|---|
| Node.js Event Loop & libuv | Node is single-threaded for JS execution; understanding the event loop explains why a CPU-bound task blocks everything else | Directly relevant to why embedding generation or heavy JSON parsing shouldn't block the main thread (Phase 4) |
| Worker Threads | Offload genuinely CPU-bound work off the main event loop | Move embedding/chunking computation to a worker thread if profiling shows it blocking request handling (stretch goal, Phase 4) |
| Cluster mode | Run multiple Node processes to use multiple CPU cores, since one process only uses one | Relevant to how you'd run the NestJS API in production before/alongside Kubernetes horizontal scaling (Phase 9) |
| Memory leaks & heap snapshots | Long-running Node processes can leak memory (unclosed listeners, growing caches) causing eventual crashes | Take heap snapshots of the Agent Orchestrator under sustained load (Phase 11) and look for retained objects that shouldn't persist |
| Garbage collection | Understanding GC pauses explains latency spikes that aren't your code's "fault" in the obvious sense | Correlate a GC pause with a latency spike in your OpenTelemetry traces (Phase 7) |
| CPU profiling / flamegraphs | Visualizes where time is actually spent in a request, replacing guesswork | Profile the enrichment service under `autocannon` load and find the actual hot path before optimizing (Phase 11) |
| Benchmarking: Autocannon / k6 | Autocannon for quick HTTP load checks, k6 for scripted, repeatable load-test scenarios with assertions | Load-test the alert webhook (Phase 2) and the full pipeline end-to-end (Phase 11) |
| Streaming & compression | Avoids loading entire payloads into memory; reduces bytes over the wire | Streaming WebSocket agent-trace events (Phase 5); gzip/brotli on API responses (B6) |
| Lazy loading | Defer loading data/code until actually needed | Frontend route-based code splitting (B11); lazy-loading incident detail data only when a row is expanded |
| Caching layers | Avoid recomputing/refetching the same expensive thing repeatedly | Redis cache-aside for enrichment lookups (Phase 0-era concept, formalized here); semantic cache for near-duplicate triage queries (B3) |
| N+1 query problems | Fetching a list then querying per-item in a loop multiplies DB round trips | A classic bug to deliberately introduce and then fix in the incident-list-with-service-name query, using a join or DataLoader-style batching instead |
| Large dataset processing | Naively loading everything into memory fails past a certain size | Stream/paginate through large audit-log exports instead of loading the whole table (Phase 12 stretch goal) |
| Backpressure | A fast producer can overwhelm a slow consumer; systems need a way to signal "slow down" | Kafka consumer lag itself is a backpressure signal (Phase 8); bounded queues in the Worker Pool (original Phase 2 concept, revisited under load in Phase 11) |
| Performance budgets | Explicit, agreed thresholds (e.g., "P99 API latency < 300ms") that gate whether a change is acceptable | Define one for triage latency and one for dashboard load time; enforce via k6 assertions in CI (Phase 9/11) |

## B9. Testing Strategy (Expanded)

| Test type | What it catches | Where it belongs in this project |
|---|---|---|
| Unit tests | Logic errors in isolated functions/classes | Domain entities and use cases (Phase 1), confidence-scoring logic (Phase 3) |
| Integration tests | Bugs at the boundary between your code and a real dependency (DB, Redis, Kafka) | Repository implementations against a real Postgres via Testcontainers (Phase 1/2) |
| Contract tests | Whether a producer and consumer agree on a message/event shape, without a full end-to-end environment | Kafka topic schemas between the Enrichment service and Agent Orchestrator (Phase 8) |
| E2E tests | Whether the whole system works together from the outside in | One alert-webhook-to-resolved-incident E2E test run in CI |
| Mutation testing | Whether your tests would actually catch a real bug (mutates your code slightly and checks if a test fails) | Run against the confidence-scoring and dedupe logic — the two places a silent bug would be most dangerous |
| Property-based testing | Generates many random inputs to find edge cases you didn't think to write a test for | The idempotency/dedupe logic (Phase 2) is a great candidate — property: "no matter how many times this webhook fires, exactly one incident exists" |
| Snapshot testing | Catches unintended changes to structured output shape | The agent's structured triage JSON output shape (Phase 3) |
| Load testing | Whether the system holds up under expected traffic | k6 scripted scenarios against ingestion and the full pipeline (Phase 11) |
| Stress testing | Finds the actual breaking point, beyond expected load | Push k6 load past expected traffic until something fails, and confirm it fails *gracefully* (rate limiting/circuit breaker engages) rather than catastrophically |
| Chaos engineering | Verifies the system survives real failure conditions, not just happy-path load | Kill the Kafka broker, the outbox relay, or inject latency into the mocked LLM API mid-test and observe whether guardrails hold (Phase 11 stretch goal) |
| Testcontainers | Spins up real Postgres/Redis/Kafka in CI instead of mocking them, catching real integration bugs | Used throughout integration tests (Phase 1, 2, 8) |
| Mock servers | Simulate the Anthropic/OpenAI API and external "infra" APIs deterministically in CI, without real API cost/flakiness | Used for all agent tests except a small, deliberately-isolated set of "real API" smoke tests |
| Fake timers | Test retry/backoff/TTL logic without actually waiting in real time | BullMQ retry-delay tests (Phase 2), cache TTL tests |
| Golden dataset testing | A fixed, curated set of known-good input/output pairs used to detect regressions | The Phase 10 AI eval harness *is* this pattern, formalized |
| AI regression testing | Specifically catching a drop in AI output quality after a prompt/model/RAG change | Golden dataset run automatically whenever the prompt, model version, or RAG chunking strategy changes (Phase 10) |
| CI test strategy | Deciding what runs on every commit vs on merge vs nightly, to balance feedback speed against thoroughness | Unit + contract tests on every push; integration + E2E on merge to main; load/chaos tests nightly or pre-release |
| Code coverage | A blunt but useful signal for untested code paths — not a target to game | Track it, but treat 100% as a smell (over-testing trivial code) rather than a goal; focus coverage on domain logic and guardrail paths |

## B10. Frontend Engineering (Expanded)

| Concept | Why companies choose this | Where it belongs here |
|---|---|---|
| Feature-based architecture | Scales better than type-based folders (`components/`, `hooks/`) once an app has many distinct domains | `features/incidents`, `features/runbooks`, `features/org-management` as top-level Next.js app folders (Phase 12) |
| Component design | Composable, single-responsibility UI pieces are easier to test and reuse | `IncidentCard`, `AgentReasoningStep`, `ApprovalButton` as small composable pieces, not one giant page component |
| Accessibility (WCAG) | Legal requirement in many contexts and simply good engineering — a UI unusable by screen readers is a UI with bugs | Run an axe/Lighthouse audit on the dashboard (Phase 12 stretch goal) |
| TanStack Query (React Query) | Handles server-state caching, refetching, and loading/error states, which is a different problem than client UI state | Used for all REST data fetching (incident list, runbooks); *not* used for the WebSocket live stream, which is genuinely push-based (Phase 5/12) |
| State management | Client UI state (which tab is open, form input) is a different concern from server state (React Query) — conflating them causes bugs | Lightweight local/component state or Zustand for pure UI state; React Query owns everything server-derived |
| Optimistic updates | Makes the UI feel instant for actions likely to succeed (e.g., approving an action), while still reconciling with the real server response | Approve/reject buttons update the UI immediately, then reconcile or roll back if the request actually fails |
| Error boundaries | Prevents one broken component from crashing the entire page | Wrap the AI Reasoning panel specifically — it renders the least predictable data (agent output) |
| Suspense | Declarative loading states for async data, cleaner than manual `isLoading` flags scattered everywhere | Used for the incident detail page's initial data fetch |
| Virtualization | Rendering only visible rows of a long list avoids performance collapse on large datasets | The incident list and audit log view once you're testing with thousands of rows (Phase 12 stretch goal) |
| SSR / CSR / ISR / hydration | Different rendering strategies trade off freshness, SEO, and interactivity cost differently | Dashboard pages (behind auth, always fresh) are CSR; a public-facing "status page" variant, if added, would suit SSR or ISR — a good tradeoff discussion even if you don't build the public page |
| Performance optimization / code splitting / bundle analysis | Large JS bundles slow down initial load, especially on slower connections | Route-based code splitting by default in Next.js; run a bundle analyzer once the app has enough features to matter (Phase 12) |
| Image optimization | Unoptimized images are consistently the biggest bytes-on-the-wire cost on most pages | Next.js `<Image>` component for any icons/avatars in org/team management pages |
| Real-time UI patterns | Live-updating UI needs different patterns than fetch-once UI (reconciling incoming events with existing state, avoiding flicker) | The live agent-reasoning stream and incident-status updates (Phase 5) — reconcile WebSocket events into the React Query cache rather than maintaining a second parallel state source |

## B11. Cloud Engineering (AWS)

*Not required to use all of these — this project runs fine on `kind`/`k3s` locally or a single cheap VM. This section exists so you can discuss where each piece fits and what the "real cloud" version would look like, even if you only build a subset.*

| Service | Where it fits in this architecture |
|---|---|
| EC2 | Raw compute if not using containers/Kubernetes at all — mentioned for completeness, not the recommended path here |
| ECS | Simpler managed container orchestration alternative to EKS — a reasonable "if I didn't need full Kubernetes flexibility" alternative to discuss in Phase 9 |
| EKS | Managed Kubernetes — where Phase 9's Helm charts would actually deploy in a real AWS environment |
| S3 | Object storage for exported audit logs, attached incident files, or Loki's log storage backend |
| RDS | Managed Postgres — where your Phase 1 database would live, with automated backups/read replicas managed for you |
| ElastiCache | Managed Redis — where your Phase 2 BullMQ backend and cache would live |
| IAM | Least-privilege service roles per component (the cloud-native version of "least-privilege service accounts" from Phase 9) |
| CloudWatch | Alternative/complement to Prometheus+Grafana if running natively on AWS; good discussion point on managed vs self-hosted observability tradeoffs |
| Secrets Manager | Where API keys (Anthropic/OpenAI, DB credentials) would live instead of Kubernetes Secrets in a full AWS deployment |
| Route53 | DNS for the API/dashboard domains |
| ALB | Load balancer in front of your services — the AWS-native alternative to the NGINX Ingress used in Phase 9 |
| VPC / Subnets / NAT Gateway / Security Groups | Network isolation: private subnets for Postgres/Redis/Kafka, public subnets only for the load balancer, security groups scoping exactly which service can talk to which |
| CloudFront | CDN in front of the Next.js dashboard's static assets |
| Container Registry (ECR) | Where GitHub Actions (Phase 9) would push built images before EKS pulls them |
| Autoscaling Groups | The EC2-level analogue to KEDA's pod-level autoscaling (Phase 9), relevant if running on ECS/EC2 rather than fully on Kubernetes |

---

# PART C — RESUME & INTERVIEW MAPPING

## C1. Sample Resume Bullets (one per major phase)

- Designed and built a clean-architecture NestJS backend with strict domain/infrastructure separation, enabling a later migration from a modular monolith to an event-driven microservice architecture without rewriting business logic.
- Implemented an idempotent, retry-safe alert ingestion pipeline using BullMQ and Redis, with dead-letter queue handling for failed jobs.
- Built a tool-calling AI agent from first principles (no framework) that performs multi-step diagnostic reasoning, achieving structured, schema-validated outputs consumed directly by downstream services.
- Implemented a RAG system using PostgreSQL/pgvector with citation-aware retrieval, reducing hallucinated recommendations by grounding agent output in versioned runbook content.
- Migrated an alert-processing pipeline from a Redis-backed queue to Kafka using the outbox pattern and CQRS, enabling independent, replayable consumers and eliminating dual-write consistency issues.
- Deployed the platform to Kubernetes with Helm, KEDA-based autoscaling on Kafka consumer lag, and a canary rollout strategy specifically for AI-agent behavior changes.
- Built a CI-integrated AI evaluation harness with a golden dataset to catch triage-quality regressions before deployment.
- Instrumented the full system with OpenTelemetry, Prometheus, and Grafana, enabling distributed tracing of a single alert across five services.

## C2. Interview Question Bank by Topic

| Topic | Sample question | Where your answer comes from |
|---|---|---|
| Architecture | "How do you structure a backend service so it stays maintainable as it grows?" | Phase 1 |
| Messaging | "When would you choose Kafka over a simple queue?" | Phase 2 & 8 |
| Consistency | "How do you avoid dual-write inconsistency between a database and a message broker?" | Phase 8 (Outbox) |
| Real-time systems | "How would you scale WebSocket connections across multiple instances?" | Phase 5 |
| AI engineering | "How do you keep LLM output reliable enough to build software around it?" | Phase 3 |
| AI engineering | "How do you test a system with non-deterministic output?" | Phase 10 |
| Resilience | "How do you prevent a flaky dependency from cascading into an outage?" | Phase 11 |
| Deployment | "How do you safely deploy a change to AI-driven behavior?" | Phase 9 (canary + feature flags) |
| Observability | "How do you debug a production issue you can't reproduce locally?" | Phase 7 |
| Security | "Walk me through your auth model and how you prevent common web vulnerabilities." | Phase 6 |

---

## Final Note

Every phase above should get its own **ADR (Architecture Decision Record)** in `docs/decisions/` as you build — a short doc stating the decision, the context, the alternatives you considered, and why you chose what you chose. That folder, more than any single feature, is what will make this project defensible in a Staff-level interview: it's proof you made engineering decisions rather than followed a tutorial.

Suggested ADR template:
```
# ADR-00X: <Decision Title>
Date: 
Status: Accepted / Superseded by ADR-00Y

## Context
What problem were we solving? What constraints existed?

## Decision
What did we choose?

## Alternatives Considered
What else did we look at, and why did we reject it?

## Consequences
What do we gain? What do we give up? What would make us revisit this?
```

---

# PART D — JUDGMENT

This part is about the thinking *behind* the ADRs, not new features to build.

## D1. Technology Evolution & Migration Signals

For every major technology in this project, the honest question isn't "is this good" — it's "what signal tells me it's time to move to the next thing." Naming the signal in advance is what separates a real engineering decision from a preference.

| From | To | Alternatives considered | Scaling limit of the current choice | Concrete signal that tells you it's time to migrate |
|---|---|---|---|---|
| BullMQ | Kafka | Kafka from the start (rejected — no second consumer yet to justify it); SQS (rejected — less relevant to learning event-driven concepts deeply) | Single consumer group, no replay, throughput bound by Redis and one queue's semantics | A second, independent consumer needs the *same* event stream (e.g., an analytics service), or you need to replay history after a bug |
| Monolith (NestJS modules) | Split services | Microservices from day one (rejected — premature, no team-scaling pressure yet) | Deploys are coupled; a bug in one module can crash the whole process | A module's scaling/deploy needs diverge sharply from the rest (e.g., the Agent Orchestrator needs GPU-adjacent scaling patterns the API doesn't) |
| pgvector | Qdrant / dedicated vector DB | Qdrant from the start (rejected — one more service to operate before there's evidence of need) | ANN tuning is limited; performance degrades as vector count grows into the millions | p99 retrieval latency crosses your performance budget (B8), or you need filtered/hybrid search pgvector can't do efficiently |
| Single Postgres instance | Read replicas → partitioning → (documented, not built) sharding | Sharding from the start (rejected — solves a scale problem this project will never actually hit; premature complexity) | One primary's write throughput and connection count are finite | Write throughput or connection count on the primary becomes the bottleneck even after pooling and read-replica offload |
| Manual retry/backoff per service | A shared resilience library | A framework like `resilience4j`-equivalent from day one (rejected per Rule of Three — wait for real duplication first) | Copy-pasted retry logic drifts out of sync across services | You've implemented the same retry/backoff/circuit-breaker logic in three separate places (Phase 2, 8, 11) |
| Hand-rolled agent loop | LangGraph | LangGraph from Phase 3 (rejected — you can't explain what it's abstracting if you never built it yourself) | Coordinating more than ~2 agents by hand gets error-prone to reason about | You genuinely need multiple specialized agents with shared, branching state (Phase 10) — not before |
| Kubernetes on `kind`/`k3s` locally | Managed cloud Kubernetes (EKS) | Cloud from day one (rejected — real cost for a portfolio project with no real traffic) | No real HA, no managed control plane, single point of failure | You need to demonstrate real multi-AZ availability, or the project needs actual public uptime |

## D2. Decision Framework Template

Use this for any decision above "which library function to call" — it forces you to make the judgment explicit instead of leaving it implicit.

```
Decision: <e.g., "Redis Redlock vs Postgres advisory locks for remediation-action locking">

Why we chose this:
  <the option and the primary reason>

Why we rejected the alternative(s):
  <specific reason per alternative, not just "it's more complex">

Cost:            <infra cost, operational cost>
Complexity:      <how much harder to build/reason about>
Maintainability: <how hard to change later>
Scalability:     <where this specific choice starts to strain>
Developer experience: <how painful is this day-to-day to work with>
Operational cost:     <on-call burden, failure modes to monitor>
Learning value:       <what this teaches you, honestly assessed>
Resume value:         <does this map to a concept interviewers ask about>
Interview value:      <can you defend this in 60 seconds with a real tradeoff>
Future migration path: <the D1-style "signal that says move on">
```

Applying it once, concretely (Phase 11's lock choice):

```
Decision: Postgres advisory locks vs Redis Redlock for remediation-action locking

Why we chose this: Postgres advisory locks — no new failure mode/consensus
  algorithm to reason about; the lock lives in the same system that's
  already the source of truth for the incident record.

Why we rejected the alternative: Redlock requires multiple independent
  Redis instances to be meaningfully safe, and its correctness under
  network partitions is genuinely disputed (see Kleppmann's critique in
  B-Phase-11 reading) — added complexity without a scale requirement
  that demands it yet.

Cost:            Free (already running Postgres)
Complexity:      Low — one extra query
Maintainability: High — no new operational component
Scalability:     Fine until lock contention itself becomes the bottleneck
                 at very high remediation-action throughput
Developer experience: Simple to reason about, easy to test locally
Operational cost:     One more thing to monitor (lock wait times), but on
                 infrastructure you already operate
Learning value:  Forces you to actually read the distributed-locking
                 debate rather than default to "Redis has a lock library"
Resume value:    "Chose Postgres advisory locks over Redlock after
                 evaluating distributed-consensus tradeoffs" is a strong,
                 specific line
Interview value: You can defend both sides in under a minute
Future migration path: If remediation-action volume ever needs true
                 cross-region distributed locking independent of
                 Postgres's availability, revisit Redlock or a
                 purpose-built coordination service (e.g., etcd/ZooKeeper)
```

## D3. The Big-Company Lens

Applied here to the project's five hardest decisions — not to every decision, on purpose (see the scope note in Part 0's intro). The point isn't "which company is right" — it's that equally strong engineering organizations make different choices because their constraints differ, and naming *why* is the actual skill.

**1. How do you move events between services?**
- **Stripe** leans toward strong consistency and idempotency-key discipline everywhere, because a duplicated or lost event can mean real money moving incorrectly — they'd over-invest in the outbox pattern and idempotency relative to this project's stakes.
- **Uber** operates at a scale where Kafka (and their own internal variants) is non-negotiable from the start — replay and massive multi-consumer fan-out are day-one requirements, not something to grow into.
- **This project's choice (BullMQ → Kafka, Phase 2 → 8)** is closer to a mid-size SaaS team's actual path: correctness matters, but the scale to justify Kafka's operational cost doesn't exist on day one, so you earn your way into it.

**2. How autonomous should the AI agent be?**
- **Anthropic/OpenAI's own agent guidance** consistently pushes toward staged autonomy — read-only tools first, write actions behind explicit approval, expanding autonomy only with evidence (evals) that it's safe.
- **A fast-moving startup** might ship higher autonomy earlier to differentiate on "magic," accepting more risk of visible failures.
- **This project's choice (confidence-gating + human approval, Phase 3/10)** follows the more conservative, evidence-driven path — appropriate for anything touching production infrastructure, and the one that reads best in a Staff interview because it shows judgment about blast radius, not just capability.

**3. How do you deploy risky changes?**
- **Netflix** popularized canary + heavy automated metrics-based rollback, because their scale makes "watch it manually" infeasible — the system has to decide to roll back itself.
- **A smaller team (or this project)** uses canary for the highest-risk component specifically (the AI agent, Phase 9) and simpler rolling deploys elsewhere — full Netflix-style automated canary analysis is real complexity you'd only take on once you have the traffic volume to make manual review infeasible.

**4. How much observability infrastructure is enough?**
- **Datadog** (as a company whose product *is* observability) naturally over-indexes on rich, expensive-to-collect telemetry — that's their differentiator, not just their internal tooling.
- **This project (Prometheus/Grafana/Loki/Jaeger, Phase 7)** takes the self-hosted, "good enough for a mid-size team" path deliberately, and the tradeoff worth stating explicitly: you give up a fully managed, correlated UI (what a Datadog subscription buys you) in exchange for zero licensing cost and full control — a real tradeoff, not a strictly worse choice.

**5. How do you handle traffic at the edge?**
- **Cloudflare** solves ingestion-layer problems (rate limiting, DDoS protection, bot filtering) as far from your origin as possible, because their whole business is the edge.
- **This project** implements rate limiting at the Ingress/API Gateway layer (Phase 9/11) instead — the right relative choice for a project without Cloudflare's global edge network, but worth explicitly naming what you'd gain by pushing this further out (protection before traffic even reaches your infrastructure) if this were a real public-facing product.