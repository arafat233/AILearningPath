# Contributing to AI Learning Path

## Prerequisites
- Node.js 20+
- MongoDB 7 (local or Atlas)
- Redis 7

## Local setup

```bash
# Backend
cd ai-learning-backend/backend
cp .env.example .env          # fill in required vars
npm install
npm run dev

# Frontend (separate terminal)
cd ai-learning-frontend/frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5001`.

## Folder conventions

```
backend/
  controllers/   HTTP handlers only — no business logic
  services/      all business logic
  routes/        route + middleware wiring
  models/        Mongoose schemas
  middleware/    auth, validate, errorHandler
  utils/         stateless helpers
  __tests__/     Jest tests

frontend/src/
  pages/         one file per route
  components/    reusable UI
  services/      api.js only
  store/         Zustand stores
```

## Coding rules

1. **Validate all inputs** — use Joi + `validate` middleware before every controller.
2. **No business logic in controllers** — controllers call services and return `res.json()`.
3. **Standard error responses** — `next(new AppError("msg", 404))` for errors; `res.json({ data })` for success.
4. **Every new service function needs a test** — add to `__tests__/`.
5. **Update BLUEPRINT.md** in the same commit as any new route, schema, or page.

## Running tests

```bash
# Backend (Jest + MongoDB in-process)
cd ai-learning-backend/backend && npm test

# Frontend (Vitest)
cd ai-learning-frontend/frontend && npm run test -- --run
```

## Pull request checklist

- [ ] `npm test` passes locally
- [ ] New service functions have tests
- [ ] BLUEPRINT.md updated if routes/schemas changed
- [ ] No secrets or hardcoded URLs committed
- [ ] Ran `npm audit --audit-level=high` and resolved any new HIGH/CRITICAL findings

## Commit style

```
<type>: <short summary>

Types: feat | fix | perf | refactor | test | docs | chore
```
