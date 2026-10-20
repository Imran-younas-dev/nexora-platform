# 30-day plan

Use this file as the only schedule until the MVP is done. Product scope stays in [`docs/product/MVP.md`](../product/MVP.md). What is already built stays in [`docs/architecture/current.md`](../architecture/current.md). The next architecture step stays in [`docs/architecture/target.md`](../architecture/target.md).

Work about **4 hours a day**. Each day below is split into three blocks. Finish the "Done when" line before you start the next day. If you only have two hours, do block 1 and block 2, and finish block 3 the next morning before any new day.

Today the app already creates and lists incidents. The API is NestJS in `apps/backend`. The dashboard is Next.js in `apps/frontend`. Postgres is the database. Redis is running in Docker and is not used yet. There is no resolve action, no alert webhook, no queue, no AI summary, no login, and no deploy beyond your machine.

The end of this file is the MVP done line in `docs/product/MVP.md`:

1. A stranger can follow the README and run the stack locally.
2. An alert webhook or a manual create becomes an incident, an AI summary is attached as a suggestion, a person reviews it, and the incident is resolved.
3. The API is deployed somewhere beyond localhost.
4. AI suggestions are labeled and never change incident status by themselves.

The long curriculum in `docs/learning/curriculum.md` (RAG runbooks, WebSockets, Kafka, Kubernetes, multi-agent) starts after Day 30. Those chapters are not this schedule.

## Before Day 1

Do this before you write product code. Budget two or three evenings. You are not behind if Day 1 starts after this.

### TypeScript you will type every day

- `import` / `export`, arrow functions, `async` / `await`, destructuring (`const { title, severity } = dto`)
- Classes, `this`, and Nest `@Injectable()` / `@Controller()`
- Array methods: `map`, `filter`, `find`
- A DTO is a class with `class-validator` decorators. The controller receives it. The service does not trust raw JSON.

### NestJS words already in this repo

Open `apps/backend/src` and point at a real file:

- A **module** groups a controller and its providers (`IncidentsModule`, `HealthModule`, `PrismaModule`)
- A **controller** is the HTTP route. `IncidentsController` has `GET /incidents` and `POST /incidents`
- A **service** holds the action. The controller calls `this.incidentsService`, which Nest injects. Do not `new` the service yourself
- **Prisma** is the only way the API talks to Postgres. `schema.prisma` is the schema. A migration is the file that changes the database. Do not call `db push` for a change you want to keep
- `organization_id` is already on `Incident`. New tenant-owned tables keep the same column. MVP uses `org_default`

### React

- A component returns JSX. The dashboard page is `apps/frontend/app/page.tsx`
- `useState` holds the incident list, the form fields, and the error string
- `useEffect` loads incidents after the first render
- The page calls the API with `fetch`. It does not decide status rules

### HTTP

- `GET` reads, `POST` creates, `PATCH` updates
- Status codes you will use: `200`, `201`, `202`, `400`, `401`, `404`, `409`, `422`
- JSON body. After Day 24, write routes also send `Authorization: Bearer <token>`
- Today the API returns the incident object directly. Keep that shape unless a day below says otherwise

### SQL, in one sitting

- A table, a primary key, a foreign key
- `INSERT`, `SELECT`, `UPDATE`
- `IncidentStatus` is already `OPEN`, `INVESTIGATING`, `RESOLVED`, `CLOSED`
- A unique constraint is how Day 12 stops the same alert from creating two incidents

### AI summary, before any model call

Say these out loud in your own words:

- The model writes a summary. It does not resolve the incident
- The summary is stored as data the person can read. It is labeled as a suggestion
- The model output is JSON with a fixed shape. If the JSON is invalid, the job fails. The app does not guess
- A missing API key must not stop local create, list, and resolve. Local mode can use a fake summary
- Text inside an alert is untrusted. It cannot change permissions or system instructions

### Tools

- `git status`, `git diff`, `git commit`
- `pnpm db:up` starts Postgres and Redis. `pnpm db:migrate` applies Prisma migrations. `pnpm dev` runs the API on port 5000 and the web app on port 3000
- Copy `.env.example` to `.env`. Never commit `.env`

### Check you are ready

You can explain the three backend modules (`health`, `incidents`, `prisma`) and the one screen: a form that creates an incident and a list that reads them back from Postgres.

## Rules for all 30 days

- Stay in this repo. API code is TypeScript under `apps/backend`. UI code is TypeScript under `apps/frontend`.
- Keep the backend a modular monolith. Do not add `packages/`, a second service, Kafka, or Kubernetes.
- Business rules live in the backend. The frontend renders and calls the API.
- Every new tenant-owned table has `organization_id`.
- Schema changes go through a Prisma migration.
- Redis and BullMQ appear on Day 10, when the webhook must return before the incident is saved. Do not add them earlier.
- The AI step suggests. It never sets `status` to `RESOLVED`.
- Update `docs/architecture/current.md` on any day that changes what is actually running.
- Add an ADR only when the day says to. Use `docs/decisions/`.

## Branch after each day

When that day's "Done when" line is true, put the work on its own branch before the next day. The suggested name is the **Branch** line under the day. Do not mix two days on one branch.

## Where the 30 days land

| Days | Milestone | You can demo |
| --- | --- | --- |
| 1–7 | M0 closed, plus resolve | Create, list, open, resolve |
| 8–14 | M1 | Webhook → queue → one incident |
| 15–21 | M2 | AI summary on the incident, still a suggestion |
| 22–30 | M3 | Login, a public URL, the full loop |

## Day 1 — Prove the local loop

**Branch:** `day-01-local-loop`

**Block 1 (80 min).** From a clean terminal, follow the README only: copy `.env.example`, `pnpm install`, `pnpm db:up`, `pnpm db:generate`, `pnpm db:migrate`, `pnpm dev`. Open `http://localhost:3000` and `http://localhost:5000/health`.

**Block 2 (90 min).** Create one incident in the form. Confirm it is in the list and in Postgres (`incidents` row, `organization_id = org_default`). Hit health again and confirm the database check is part of the response.

**Block 3 (70 min).** Write down every README step that failed or was ambiguous. Fix the README or `TROUBLESHOOTING.md` so the next run does not need memory. Tick the M0 README item in `docs/roadmap/product-milestones.md` only if you actually ran it clean.

**Done when:** a second run from the README creates an incident you can see in the browser and in the database.

**You can explain:** what `pnpm db:up` starts, and which process serves port 3000 versus port 5000.

## Day 2 — Resolve an incident

**Branch:** `day-02-resolve-incident`

**Block 1 (80 min).** Add `PATCH /incidents/:id/resolve`. It loads the row for `org_default`. Missing id returns 404.

**Block 2 (90 min).** Set `status` to `RESOLVED`. If it is already `RESOLVED` or `CLOSED`, return 409 and do not write again. Cover this with a service test.

**Block 3 (70 min).** Call the route with curl for an open incident and for a missing id. Check the row in Postgres.

**Done when:** one open incident can be resolved through the API, and a second resolve does not change the row.

**You can explain:** why resolve is a specific action and not a free-form status field from the client.

## Day 3 — Status on the dashboard

**Branch:** `day-03-dashboard-resolve`

**Block 1 (80 min).** Show `status` and `severity` on each row in `apps/frontend/app/page.tsx`.

**Block 2 (90 min).** Add a Resolve button that calls the Day 2 route, then reloads the list. Hide or disable it when the status is already `RESOLVED` or `CLOSED`.

**Block 3 (70 min).** In the browser: create an incident, resolve it, refresh the page, and confirm it stays resolved. Try the button on an already resolved row.

**Done when:** you can create and resolve an incident without curl, and a refresh shows the same status.

**You can explain:** which part of the click is UI state and which part is the backend rule.

## Day 4 — Incident detail

**Branch:** `day-04-incident-detail`

**Block 1 (80 min).** Add `GET /incidents/:id`. Same org scope as list. Unknown id returns 404.

**Block 2 (90 min).** Add `apps/frontend/app/incidents/[id]/page.tsx`. The list title links here. The page shows title, description, severity, status, and timestamps.

**Block 3 (70 min).** Open a real id, a bad id, and the list after you resolve from the detail page. The list and the detail page must show the same status.

**Done when:** every list row opens a detail page backed by the API, and a bad id shows a not-found state.

**You can explain:** why the detail page fetches one incident instead of searching the list in the browser.

## Day 5 — Validation and tests

**Branch:** `day-05-validation-tests`

**Block 1 (80 min).** Reject create when `title` is empty or `severity` is not one of the enum values. Return 400. Keep the existing DTO as the place those rules live.

**Block 2 (90 min).** Add tests for create validation, list order (newest first), get-by-id, and resolve. Use the test style already in `incidents.service.spec.ts`.

**Block 3 (70 min).** Run `pnpm test` and `pnpm lint` from the repo root. Fix failures from this week only.

**Done when:** `pnpm test` passes, and a manual POST with an empty title returns 400.

**You can explain:** what a DTO checks versus what the service checks.

## Day 6 — Status rules in one place

**Branch:** `day-06-status-rules`

**Block 1 (80 min).** Write a small pure function for allowed moves: `OPEN` or `INVESTIGATING` may become `RESOLVED`. `RESOLVED` and `CLOSED` may not go back to `OPEN`. The resolve service calls this function.

**Block 2 (90 min).** Add `PATCH /incidents/:id` that can set `INVESTIGATING` only when the current status is `OPEN`. Any other requested status returns 409.

**Block 3 (70 min).** Unit-test the function without Prisma. Then hit both routes and confirm the database matches the function.

**Done when:** an illegal status change is rejected by the same rule the tests cover, whether the caller is resolve or the status patch.

**You can explain:** what would go wrong if the controller and the future worker each invented their own status rules.

## Day 7 — Record the domain decision

**Branch:** `day-07-domain-adr`

**Block 1 (80 min).** Read `docs/decisions/ADR_TEMPLATE.md`. Write an ADR: Incident status changes go through one rule, Prisma stays the persistence tool, and you are not splitting a domain package yet.

**Block 2 (90 min).** Update `docs/architecture/current.md` so it mentions resolve, detail fetch, and the status rule. Leave `target.md` for the queue and the summary, which are not built yet.

**Block 3 (70 min).** Re-read the ADR the next hour and delete any sentence that describes a layer you did not build.

**Done when:** a reader can see the status rule in code and the reason it lives in one place in the ADR.

**You can explain:** what you refused to abstract on this day, and why.

## Day 8 — Alert table and dedupe key

**Branch:** `day-08-alert-table`

**Block 1 (80 min).** Add an `Alert` model in `schema.prisma`: id, `organization_id`, `dedupe_key`, title, body, a link to the incident id once one exists, timestamps. Unique on `(organization_id, dedupe_key)`.

**Block 2 (90 min).** Create the migration with Prisma. Apply it locally. Do not edit old migration SQL by hand.

**Block 3 (70 min).** Insert two rows with the same dedupe key in a SQL client or a tiny script and confirm the second insert fails.

**Done when:** the unique constraint rejects a duplicate `(organization_id, dedupe_key)` and the migration is in git.

**You can explain:** why the duplicate check lives in the database and not only in an `if` before insert.

## Day 9 — Webhook that writes one incident

**Branch:** `day-09-webhook-sync`

**Block 1 (80 min).** Add `POST /alerts/webhook` with a DTO: `dedupeKey`, `title`, optional `body`, optional `severity`. Validate missing `dedupeKey` with 400.

**Block 2 (90 min).** In one Prisma transaction, create the alert and the incident, and store the incident id on the alert. Use the Day 6 status default `OPEN`.

**Block 3 (70 min).** Send one webhook with curl. Confirm one alert row and one incident row. Send a second webhook with the same key and confirm you get 409, not a second incident.

**Done when:** a valid webhook creates exactly one incident, and the same key does not create another.

**You can explain:** what this route still does inside the HTTP request, which Day 11 will move out.

## Day 10 — BullMQ on Redis

**Branch:** `day-10-queue`

**Block 1 (80 min).** Add BullMQ and a queue module in `apps/backend`. The queue name is `alerts`. Connection comes from the Redis URL already in `.env.example`.

**Block 2 (90 min).** Start a worker in the same Nest process. The job payload is `{ alertId }` only. Log when a job starts and finishes. Do not call the model and do not change the webhook yet.

**Block 3 (70 min).** Enqueue a fake job from a test or a temporary script. Confirm Redis accepts it and the worker log line appears. Stop the API and confirm a waiting job is still in Redis.

**Done when:** a job survives an API restart and a worker in this codebase logs that it ran.

**You can explain:** why the job stores an alert id and not a copy of the whole alert body.

## Day 11 — Webhook only enqueues

**Branch:** `day-11-webhook-enqueue`

**Block 1 (80 min).** Change `POST /alerts/webhook` so it inserts the alert row and returns `202` with the alert id. It must not create the incident inside the request.

**Block 2 (90 min).** The worker loads the alert, creates the incident in a transaction, and saves the incident id on the alert. Use the same status rule as manual create.

**Block 3 (70 min).** Send a webhook, see `202` before the incident exists, then refresh until the incident is listed. Confirm the dashboard shows it without a special UI path.

**Done when:** the HTTP handler returns before the incident row exists, and the worker creates that row.

**You can explain:** why the webhook sender should not wait for incident creation.

## Day 12 — Same alert twice, one incident

**Branch:** `day-12-idempotent-ingest`

**Block 1 (80 min).** If an alert with that `dedupe_key` already exists, return `202` again with the original alert id and do not enqueue a second create.

**Block 2 (90 min).** Make the worker safe if it runs twice: if the alert already has an incident id, finish the job without inserting. The unique key remains the hard stop.

**Block 3 (70 min).** Send the same webhook ten times. Count incidents with that title. The count is 1. Re-run the job payload once by hand if you can, and confirm the count stays 1.

**Done when:** repeating the same webhook leaves one alert and one incident.

**You can explain:** what "idempotent ingest" means on this project: the same external alert always maps to one incident, even when the sender or the job retries.

## Day 13 — Retries and a failed job

**Branch:** `day-13-retries`

**Block 1 (80 min).** Set a small attempt count and exponential backoff on the `alerts` queue.

**Block 2 (90 min).** Force the worker to throw (temporary bad code path or a missing alert id). Watch the job retry. After the last attempt, the job is failed and visible. The alert row stays. No partial incident is left behind.

**Block 3 (70 min).** Remove the forced failure. Send a good webhook and confirm it still becomes one incident. Write one paragraph in `TROUBLESHOOTING.md` on how you see a failed job.

**Done when:** a broken job retries, then stops in a failed state, and a good webhook still creates one incident.

**You can explain:** why an immediate retry loop makes an outage worse, and why a failed job is kept instead of deleted.

## Day 14 — Logs you can follow

**Branch:** `day-14-request-logs`

**Block 1 (80 min).** Add one structured log line on webhook accept: alert id, dedupe key, organization id. No alert body.

**Block 2 (90 min).** Add one log line when the worker creates the incident, and one when it skips because the incident already exists. Use the same alert id in every line.

**Block 3 (70 min).** Send one new webhook and one duplicate. You can point at the log lines and tell the story without reading the database first.

**Done when:** one alert id ties together the `202`, the worker success, and a duplicate skip.

**You can explain:** which fields you refused to log, and why.

## Day 15 — Show where an incident came from

**Branch:** `day-15-incident-source`

**Block 1 (80 min).** Add a `source` on the incident: `MANUAL` or `ALERT`. Migration backfills existing rows to `MANUAL`. Manual create sets `MANUAL`. The worker sets `ALERT`.

**Block 2 (90 min).** Return `source` from list and detail. Show it on the list and the detail page.

**Block 3 (70 min).** Create one incident in the form and one through the webhook. The screen labels them differently. Refresh and the labels stay.

**Done when:** you can tell a manual incident from a webhook incident in the UI without opening the database.

**You can explain:** why source is stored on the incident instead of inferred in the browser.

## Day 16 — LLM client with a fake mode

**Branch:** `day-16-llm-client`

**Block 1 (80 min).** Add a small client module with one method: given title, description, and severity, return `{ summary, suggestedSeverity }`. Read the model name and API key from env.

**Block 2 (90 min).** If the key is missing, return a fixed fake summary and do not call the network. If the key is present, call one chat-completions endpoint and read the text. Timeouts become a thrown error.

**Block 3 (70 min).** Unit-test the fake path with no key. With a key, one manual call returns text. The incidents API behavior is unchanged today.

**Done when:** local create and list still work with no API key, and the client has a tested fake summary.

**You can explain:** why the rest of the app depends on your client method and not on a vendor SDK spread through the controllers.

## Day 17 — Versioned prompt

**Branch:** `day-17-prompt-version`

**Block 1 (80 min).** Put the system prompt in one file, with a version string such as `incident-summary-v1`. The prompt asks for JSON only: `summary` (string) and `suggestedSeverity` (`LOW` | `MEDIUM` | `HIGH` | `CRITICAL`).

**Block 2 (90 min).** The prompt says the alert text is untrusted data, not instructions. It also says the model must not claim the incident is resolved.

**Block 3 (70 min).** A test locks the version string and checks the prompt includes the JSON keys. Changing the wording means bumping the version in the same commit.

**Done when:** the prompt the client sends is the versioned file, and a test fails if the version is missing.

**You can explain:** why a prompt change is treated like a deploy you may need to roll back.

## Day 18 — Summary job

**Branch:** `day-18-summary-job`

**Block 1 (80 min).** Add a `incident_summaries` table: incident id, organization id, prompt version, summary text, suggested severity, `created_at`. One summary row per generation. Do not overwrite history.

**Block 2 (90 min).** After the worker creates an incident, enqueue a `summaries` job with `{ incidentId }`. A second worker loads the incident, calls the Day 16 client, and inserts the summary row.

**Block 3 (70 min).** Send a webhook in fake mode. The incident appears first. The summary row appears after. Manual create does not need a summary today.

**Done when:** a webhook incident gets one summary row, and the HTTP webhook still returns `202` before that row exists.

**You can explain:** why summary generation is a second job and not part of the webhook transaction.

## Day 19 — Reject bad model JSON

**Branch:** `day-19-summary-schema`

**Block 1 (80 min).** Parse the model text as JSON. Accept only the two fields from Day 17. Anything else throws.

**Block 2 (90 min).** On a parse failure, retry the summary job with the same attempt limit as alerts. Do not insert a summary row for the bad payload.

**Block 3 (70 min).** Unit-test three inputs: valid JSON, prose, and JSON with an extra instruction-like field. Only the valid object is stored. A forced bad response ends as a failed job, and the incident stays `OPEN`.

**Done when:** invalid model output never becomes a summary row and never changes incident status.

**You can explain:** why you validate model output the same way you validate a webhook body.

## Day 20 — Suggestion cannot resolve

**Branch:** `day-20-suggest-only`

**Block 1 (80 min).** Search the summary worker for any write to `Incident.status`. Remove it. The worker may insert into `incident_summaries` only.

**Block 2 (90 min).** Add a test that runs the worker against an `OPEN` incident and asserts the status is still `OPEN` afterward, including when `suggestedSeverity` differs from the stored severity.

**Block 3 (70 min).** Add one sentence to the API response or to the summary record shape later days will show: this text is a suggestion. Do not add an "apply suggestion" button.

**Done when:** a completed summary job leaves status untouched, and a test fails if a future edit resolves the incident inside that worker.

**You can explain:** what "suggest-only" means: the model can propose, and a person still resolves.

## Day 21 — Summary on the detail page

**Branch:** `day-21-summary-ui`

**Block 1 (80 min).** Include the latest summary on `GET /incidents/:id`. Incidents with no summary return `summary: null`.

**Block 2 (90 min).** On the detail page, render a section titled as a suggestion, plus the prompt version. If `summary` is null, say that no suggestion has been generated.

**Block 3 (70 min).** Browser: open a manual incident (empty state) and a webhook incident (suggestion visible). Resolve the incident. The suggestion remains visible and the status becomes `RESOLVED` only because you clicked Resolve.

**Done when:** the detail page shows the stored suggestion, and resolving still requires the Resolve action.

**You can explain:** why the page shows the stored row and does not call the model on page load.

## Day 22 — Review the suggestion

**Branch:** `day-22-review-suggestion`

**Block 1 (80 min).** Add `reviewed_at` on the latest-summary flow: `POST /incidents/:id/summary/review` sets `reviewed_at` on the newest summary. It does not change status or severity.

**Block 2 (90 min).** On the detail page, add a button "Mark suggestion reviewed". After it succeeds, show the time. The Resolve button stays separate.

**Block 3 (70 min).** In the browser, mark reviewed, refresh, and confirm the time sticks. Resolve before and after review and confirm both orders work.

**Done when:** a person can record that they read the suggestion, and that action is not a resolve.

**You can explain:** the difference between reviewing a suggestion and resolving an incident.

## Day 23 — Token log and cost ceiling

**Branch:** `day-23-cost-ceiling`

**Block 1 (80 min).** Persist input token count, output token count, and model name on the summary row when the real client returns them. Fake mode stores zeros and the model name `fake`.

**Block 2 (90 min).** Write a short note in `docs/product/MVP.md` or a few lines under the existing cost expectation: max calls per incident (one summary job plus its retries), and the rule that a missing key uses fake mode.

**Block 3 (70 min).** Generate one fake summary and, if you have a key, one real summary. Confirm the token columns match the mode you used.

**Done when:** every summary row records model and token counts, and the repo states a ceiling you can point at.

**You can explain:** which number you would watch first if the summary job started looping.

## Day 24 — One login before deploy

**Branch:** `day-24-thin-auth`

**Block 1 (80 min).** Add a single dev user from env: email and password. `POST /auth/login` checks them and returns a signed JWT. Wrong password returns 401.

**Block 2 (90 min).** Put `sub` and a fixed organization id `org_default` in the token. Document the env vars in `.env.example`. Do not build signup, teams, or roles.

**Block 3 (70 min).** Login with curl. Tamper the token or omit it and confirm you can detect that in a guard you will attach tomorrow. Write the ADR: thin auth exists so a shared URL is not an open write API. Full RBAC is later.

**Done when:** a correct password returns a token, a wrong password returns 401, and the ADR says why this is not a user admin system.

**You can explain:** what the token proves, and what it does not prove yet.

## Day 25 — Lock write routes

**Branch:** `day-25-protect-writes`

**Block 1 (80 min).** Require the bearer token on create, resolve, status patch, webhook, and summary review. `GET /health` stays public.

**Block 2 (90 min).** `GET /incidents` and `GET /incidents/:id` require the token too, so a public deploy does not list another org's rows. The guard reads `org_default` from the token and the services keep filtering on `organization_id`.

**Block 3 (70 min).** Call each route with no token (401), with a bad token (401), and with a good token (the Day 2–22 behavior).

**Done when:** every incident and alert route rejects a missing token, and a valid token still completes the old happy path.

**You can explain:** why the guard checks the token, and why the query still filters by `organization_id`.

## Day 26 — Sign in on the dashboard

**Branch:** `day-26-dashboard-login`

**Block 1 (80 min).** Add a login form. Store the token in memory for the session. Send it as `Authorization: Bearer` on every API call the pages already make.

**Block 2 (90 min).** If a call returns 401, clear the token and show the login form again. Do not invent a refresh token.

**Block 3 (70 min).** Browser: sign in, create, open detail, mark the suggestion reviewed, resolve, refresh, sign in again. Wrong password shows an error and no incident list.

**Done when:** the full click-path works only after login, and a 401 returns you to the login form.

**You can explain:** where the token lives during this MVP, and the risk you accepted until a later auth chapter.

## Day 27 — API on a public URL

**Branch:** `day-27-deploy-api`

**Block 1 (80 min).** Pick one host that can run the Nest app plus Postgres and Redis (a small PaaS or a single VM with the existing Compose file). Set the production env from `.env.example`. Do not commit secrets.

**Block 2 (90 min).** Run the migration against that database. Deploy the API. `GET /health` on the public URL reports the database as up.

**Block 3 (70 min).** From your laptop, login and create one incident against that URL. Confirm the row is in the hosted database, not only in local Docker.

**Done when:** a health URL that is not `localhost` returns success, and a create against that host persists.

**You can explain:** which process you deployed, and which data store it uses.

## Day 28 — Dashboard on a public URL

**Branch:** `day-28-deploy-web`

**Block 1 (80 min).** Point the frontend build at the public API URL. Deploy the Next.js app.

**Block 2 (90 min).** Open the public site in a browser. Sign in. Create an incident. Resolve it.

**Block 3 (70 min).** Send a webhook with the bearer token to the public API. Confirm the incident shows up on the public site with source `ALERT`. If the worker is a separate start command, deploy that too and write the command in the README.

**Done when:** someone else can open the site, sign in with the shared dev user, and see an incident you created on the hosted API.

**You can explain:** how the browser finds the API, and where the worker runs.

## Day 29 — Stranger script

**Branch:** `day-29-demo-script`

**Block 1 (80 min).** Add a "Demo" section to the README with two paths: local (README commands) and hosted (the two URLs, no secrets).

**Block 2 (90 min).** Walk the hosted path yourself as if you did not build it: login, manual incident, resolve, webhook, wait for the suggestion, mark it reviewed, resolve. Write the exact requests.

**Block 3 (70 min).** Fix only the breaks you hit. Update `docs/architecture/current.md` so the diagram includes the queue, the summary job, auth, and the hosted pieces that are real.

**Done when:** the README demo matches a path you just ran on the hosted URLs.

**You can explain:** the primary workflow in order: webhook or manual create, persist, suggest, human review, resolve.

## Day 30 — Close the MVP

**Branch:** `day-30-mvp-done`

**Block 1 (80 min).** Re-check every box in the "Done criteria" section of `docs/product/MVP.md` by running it, not by memory. Tick only the ones you proved.

**Block 2 (90 min).** Fix the one gap that blocks a box. If more than one box fails, fix the README or the broken path, and leave a note at the top of this file naming the day you must repeat. Do not start M4 work inside this day.

**Block 3 (70 min).** In `docs/roadmap/product-milestones.md`, mark M0–M3 items that the demo proved. Leave M4 unchecked. Add one ADR if deploy or auth choices are still only in your head.

**Done when:** the four MVP done criteria are checked because you ran them, and this file has no remaining day.

**You can explain:** what the MVP is, in one minute, and which ideas you left for a later schedule on purpose.

## After Day 30

Stop this file. The next product slice is M4 in `docs/roadmap/product-milestones.md`: org and team UI, optional runbooks, realtime updates, stronger RBAC. The learning chapters for RAG, WebSockets, Kafka, and Kubernetes stay in `docs/learning/curriculum.md` and start only when that milestone needs them.

If you want a second schedule, start a new file then. Do not extend this one mid-day.
