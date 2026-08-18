# Stellar

**AI-powered exam preparation for CBSE, ICSE and AP SSC, Grades 1–10.**

Students practise adaptive questions, get personalised AI explanations for the mistakes they actually make, follow a generated study plan, and compete live against each other. Underneath it all sits a behavioural analysis engine that models *how* a student thinks, not just whether they got the answer right.

**Stack:** React (Vite) · Express · MongoDB · Redis · Socket.IO · Flutter · Claude Haiku 4.5

---

## Engineering highlights

The parts of this codebase worth reading:

**7-layer AI cost pipeline.** LLM calls are the dominant cost in an education product, so most answers never reach the model. A request falls through correct-answer short-circuit → stored solution steps → static mistake-pattern map → Redis cache → cross-user MongoDB cache → per-tier daily quota, and only then calls Claude, writing the result back for every future student. Cache key is `MD5(questionText + "::" + mistakeType + "::" + subject)`, so the cache is shared across the whole user base rather than per-session.

**Adaptive recommender over a topic DAG.** 43 fine-grained topic nodes with a prerequisite graph (levels 0–7). The recommender tracks mastery thresholds and distinguishes a genuine gap from a fluke wrong answer or a stuck student, then routes the next question accordingly rather than walking a fixed syllabus order.

**Exam engine with Z-score normalisation.** Raw scores across papers of differing difficulty are normalised before ranking, so the leaderboard compares students rather than paper difficulty. Score prediction weights each topic by marks × historical frequency in past papers; grade prediction maps to the CBSE A1–E band.

**Server-side mastery grading with anti-cheat.** The `correct` flag is stripped from the payload and options are shuffled per student before a mastery test is served; grading happens server-side only. Paired with engagement gating (5 min dwell + 80% scroll + 2 sections + AI note ≥70/100) before a topic can be marked studied.

**Resilience around the model.** Every Claude call runs through failover (primary → Haiku fallback → friendly 503, never a hard crash), output guardrails that check for prompt leakage and harmful content before a student sees anything, Redis-backed per-user daily/monthly token caps plus a global monthly budget with an 80% alert, and a second PASS/FAIL verification call that discards bad AI-generated questions before they enter the pool.

**RAG over NCERT content.** The top 3 chapter chunks are retrieved and injected as context on every explanation, alongside a student model (accuracy, thinking profile, weak areas, streak) and the previous explanation from a 30-minute Redis window.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  Port 5173  │  Zustand auth store  │  Axios + CSRF service   │
└────────────────────┬────────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Express + Node)                    │
│  Port 5001  │  JWT auth  │  Joi validation  │  Rate limiter  │
└───────┬───────────────┬─────────────────────────────────────┘
        │               │
┌───────▼─────────┐  ┌──▼──────────────────────────────────────┐
│    MongoDB      │  │           Claude Haiku 4.5              │
│ 23 collections  │  │  7-layer cache, most calls never fire   │
└─────────────────┘  └─────────────────────────────────────────┘
```

---

## Features

**Learning.** Adaptive practice with difficulty auto-adjustment · thinking-behaviour analysis (Guesser, Deep Thinker, …) · spaced-repetition scheduler · AI explanations per mistake · multi-turn DoubtChat · voice tutor (mic + TTS, subject-aware) · goal-based study planner · placement quiz (20-question diagnostic, one-time)

**Assessment.** Exam engine with Z-score normalisation and ranking · score prediction weighted by topic marks × frequency · CBSE grade prediction (A1–E) · spaced mastery tests (8/10 to pass → 3-day spacing → re-test) · 14 chapter mock papers · past-year-question browse and filter

**Social.** Live Socket.IO competition rooms · weekly leaderboard · streaks and achievement badges · referral system with double-reward guard · school groups issuing per-student unique homework variants

**Content.** CBSE Math Grades 1–10 · ICSE Math 9–10 · AP SSC Math 9–10 · CBSE Science / English / Hindi / Social Science Grade 10 · 402 SVG diagrams · RAG chunks per topic · seeded topic DAGs per board

**Mobile.** A Flutter client (`ai-learning-mobile/`) sharing the same REST API as the web app.

**Platform.** JWT + refresh-token-family auth · parent/teacher portal with invite codes · admin dashboards (users, questions, topics, cache, analytics, coupons, retention) · Razorpay subscriptions with coupons and a 7-day trial · Web Push (VAPID) · PWA with offline fallback · feature flags with % rollout · Sentry monitoring · nightly mongodump backups

Per-area detail lives in [`docs/`](docs/); see [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) for the full system spec and [`docs/ROADMAP.md`](docs/ROADMAP.md) for what's next.

---

## Quick start

**Prerequisites:** Node.js 20+, MongoDB (local or Atlas), an Anthropic API key. Redis is optional; the app falls back to in-memory stores in development.

```bash
# Backend
cd ai-learning-backend/backend
npm install
cp .env.example .env        # set MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
node server.js              # http://localhost:5001

# Frontend (new terminal)
cd ai-learning-frontend/frontend
npm install
npm run dev                 # http://localhost:5173
```

**Seed the database** (once, in order, since the adaptive question system depends on the curriculum seeds):

```bash
cd ai-learning-backend/backend
npm run seed                    # Math topics + questions
npm run seed:lessons
npm run seed:subjects           # Science / English / Social Science / Hindi
npm run seed:curriculum         # CBSE Class 10 Math, 14 chapters
npm run seed:sst-all            # Social Science content + questions
npm run seed:questions          # 880 adaptive Math questions + 14 mock papers
npm run seed:topic-dag          # 43 topic nodes + prerequisite DAG
npm run seed:placement-quiz
npm run audit:coverage          # verify what landed
```

The full seed list, including per-subject content scripts, is in [`docs/CONTENT_PIPELINE.md`](docs/CONTENT_PIPELINE.md).

**Promote yourself to admin:**

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
// then re-login to pick up the new JWT
```

---

## Tests

```bash
cd ai-learning-backend/backend && npm test     # Jest: 285 tests, 29 suites
cd ai-learning-frontend/frontend && npm test   # Vitest: 56 tests, 7 suites
k6 run load-tests/practice-session.js          # 100 VU practice flow, p95 thresholds
```

---

## Configuration

Required:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `ANTHROPIC_API_KEY` | Claude API key |

Everything else is optional and degrades gracefully: Redis falls back to in-memory, Sentry no-ops without a DSN, email console-logs without SMTP, payments are inert without Razorpay keys. Notable ones:

| Variable | Description |
|---|---|
| `CLAUDE_MODEL` | Default `claude-haiku-4-5-20251001` |
| `REDIS_URL` | Session, cache, token-limit and voice-history store |
| `MONTHLY_TOKEN_BUDGET` | Global monthly token cap (0 = unlimited) |
| `PER_USER_DAILY_TOKEN_LIMIT` | Per-user daily cap via Redis (0 = disabled) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Subscription checkout |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | Web Push; `npx web-push generate-vapid-keys` |
| `SENTRY_DSN` / `VITE_SENTRY_DSN` | Error monitoring |
| `SMTP_*` / `EMAIL_FROM` | Transactional email |

The complete table is in [`docs/STAGING.md`](docs/STAGING.md).

---

## Deployment

```bash
docker compose up -d      # MongoDB + Redis + API
```

Or PM2 on a single VM, cluster mode with one worker per core (requires `REDIS_URL` so workers share session state):

```bash
cd ai-learning-backend
pm2 start ecosystem.config.cjs --env production
pm2 save && pm2 startup
```

Production deploys run through `scripts/prod-deploy.sh`: a preflight that blocks on uncommitted or untracked files at critical paths, `git reset --hard` on the server rather than `pull`, the previous image tagged for rollback, a 9-endpoint smoke test that exits non-zero on first failure, and automatic rollback if health checks don't come back. `scripts/prod-rollback.sh` reverses it manually.

---

## Security

| Area | Implementation |
|---|---|
| Auth | JWT with 7-day access token; refresh-token *family* tracking for stolen-token detection |
| CSRF | Double-submit cookie (`csrf=` cookie + `x-csrf-token` header) |
| Headers | Helmet: CSP, HSTS |
| Rate limiting | 300 req / 15 min global; 20 profile updates / hour per user |
| Validation | Joi schemas on every mutating endpoint, 422 on failure |
| Passwords | bcrypt, cost factor 12 |
| Authorisation | `adminAuth` middleware; JWT `role === "admin"` |
| ReDoS | `escapeRegex()` on all user-supplied search input |
| CORS | Origin whitelist from `FRONTEND_URL`, never hardcoded |
| AI output | Prompt-leakage and harmful-content guardrails before any response reaches a student |

---

## Project structure

```
.
├── ai-learning-backend/backend/
│   ├── controllers/     # HTTP handlers only, no business logic
│   ├── services/        # all business logic (AI, payments, coupons, push)
│   ├── routes/          # route definitions + middleware wiring
│   ├── models/          # Mongoose schemas, 23 collections
│   ├── middleware/      # auth, adminAuth, validate, errorHandler, csrf
│   ├── utils/           # logger, redisClient, outputGuard, aiMetrics, tokenBudget
│   ├── config/          # seed scripts (topics, lessons, curricula)
│   ├── scripts/         # backup.js, restore.js
│   └── __tests__/       # Jest, 285 tests
│
├── ai-learning-frontend/frontend/src/
│   ├── pages/           # one file per route
│   ├── pages/admin/     # role-guarded admin pages
│   ├── components/      # Layout, DoubtChat, DiagramLibrary (402 entries)
│   ├── hooks/           # useFeatureFlags
│   ├── services/        # api.js: axios + CSRF + 401 handling
│   ├── store/           # Zustand auth store
│   └── __tests__/       # Vitest, 56 tests
│
├── ai-learning-mobile/  # Flutter client, shares the REST API
├── load-tests/          # k6 scripts
├── scripts/             # prod-deploy.sh, prod-rollback.sh
├── docs/                # specs, audits, roadmap, content pipeline
└── docker-compose.yml
```

---

## License

Private project. All rights reserved.
