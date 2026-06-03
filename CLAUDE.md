<!-- ============================================================ -->
<!-- BEHAVIOUR RULES — enforced in every session                -->
<!-- ============================================================ -->

## Behaviour Rules (from claude-doctor audit)

1. **Read before editing** — read the full file before making any changes. Plan all edits mentally first, then make ONE complete edit per file. If you've touched the same file 3+ times in a turn, stop and re-read the original requirements.

2. **Confirm when corrected** — when the user corrects you, stop immediately. Quote back what they asked for and confirm your understanding before doing anything.

3. **Stay on target** — every few turns, re-read the original request to check you haven't drifted from the goal.

4. **Ask when stuck** — if the same approach has failed twice, stop retrying. Summarise what you've tried and ask the user for direction.

5. **Audit-first — COMPULSORY, project-wide. Never claim "done" from memory; prove it from ground truth.** EVERYTHING built from now on — in any layer — ships with a **runnable, repeatable audit** that an independent run can use to cross-verify the work. No task is "done", and nothing is committed/deployed, until its audit passes (local AND prod where applicable). The audit's output — not a hand-written tally or a screenshot from memory — is the source of truth. Register every audit in `AUDITS.md`. This rule exists because hand-estimated status has repeatedly drifted ("has-svg = done"; zero-coverage patterns hidden; 117 untagged items invisible) and a one-line check always caught it.

   **The audit must enumerate EVERY unit (including untagged/unlabelled) and report `done/total` + an integrity check** — never a sample. Pick the verification method by build type:
   - **Content / seeds / migrations / backfills** → `config/audit<Thing>.mjs` querying the DB: counts per unit, 0 malformed/missing, idempotency (re-run = no change).
   - **Backend route / service** → a live HTTP round-trip (the proven enrolled-user token flow) asserting status + shape, plus the Jest test the architecture rules already require.
   - **Frontend page / component** → a scripted render (Playwright) that loads the real surface and asserts the change is visible; for data-driven UI, a DB-derived check that every record renders (e.g. `auditVisualAids.mjs`).
   - **Schema / model change** → a script that scans existing docs for conformance (required fields present, enums valid) across the whole collection.

   Existing audits: `ai-learning-backend/backend/config/audit*.mjs` — see **`AUDITS.md`** (the project-wide audit registry). When starting any new build, write/extend its audit FIRST, then gate "done" on a clean run.

<!-- ============================================================ -->
<!-- ARCHITECTURE STANDARDS — enforced in every session         -->
<!-- ============================================================ -->

## Architecture Rules — Follow These Strictly

### Folder Structure (do not deviate)
```
ai-learning-backend/backend/
  controllers/   ← HTTP handlers only — no business logic
  services/      ← all business logic lives here
  routes/        ← route definitions + middleware wiring only
  models/        ← Mongoose schemas only
  middleware/    ← auth, adminAuth, validate, errorHandler
  utils/         ← stateless helpers (cache, socket, etc.)
  config/        ← seed scripts only
  __tests__/     ← Jest test files

ai-learning-frontend/frontend/src/
  pages/         ← one file per route
  pages/admin/   ← admin-only pages (role guarded in AdminLayout)
  components/    ← reusable UI
  services/      ← api.js only (axios calls)
  store/         ← Zustand stores only
```

Admin routes/controllers STAY in the backend folder. They are
role-protected API routes, not a separate service. This is correct.

### Rules for Every New Feature

1. **Always validate inputs** — use the `validate` middleware with Joi
   before any controller runs. Never trust raw req.body.
   ```js
   r.post("/route", auth, validate(schema), controller);
   ```

2. **Never put business logic in controllers** — controllers call
   services and return res.json(). Services do the work.

3. **Always use standardised error responses**:
   ```js
   // success
   res.json({ data: result })
   // error — use the global error handler
   next(new AppError("message", 404))
   ```

4. **Sessions are Redis-backed** — practiceController uses `sessionGet`/`sessionSet`
   from `utils/redisClient.js` (ioredis, 2h TTL). The old `sessions = {}` concern
   is resolved. Safe for multi-instance deployment as long as Redis is shared.

5. **Never hardcode origins** — use `process.env.FRONTEND_URL`.

6. **New routes must have a test** — add to __tests__/ when adding
   a new service function.

7. **Update BLUEPRINT.md before committing** — every new feature,
   route, schema, or page must be reflected in BLUEPRINT.md in the
   same commit.

8. **API versioning** — all new route groups use /api/v1/ prefix
   going forward. Existing routes keep /api/ to avoid breaking changes.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
