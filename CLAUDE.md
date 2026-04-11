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

4. **Sessions must not use in-memory object** — practiceController
   `sessions = {}` must be replaced with DB or Redis before any
   multi-instance deployment. Flag this risk when touching practiceController.

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
