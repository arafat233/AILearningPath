# AI Learning Path — Multi-Board Exam Prep Platform (CBSE / ICSE / AP SSC)

An AI-powered exam preparation platform for students across CBSE, ICSE and AP SSC boards (Grades 1–10). Students practice adaptive questions, get personalised AI explanations, follow a smart study planner, compete live against each other, and receive lessons — all driven by a behavioural analysis engine that tracks HOW they think, not just whether they're right.

**Stack:** React (Vite) + Express + MongoDB + Claude Haiku 4.5 + Socket.IO

---

## Features

| Feature | Status |
|---|---|
| Auth (register / login / JWT + role-based) | Complete |
| Onboarding flow | Complete |
| Multi-subject: Math / Science / English / Social Science / Hindi | Complete |
| Adaptive practice engine (difficulty auto-adjusts) | Complete |
| Thinking behaviour analysis (Guesser, Deep Thinker, etc.) | Complete |
| Spaced repetition revision scheduler | Complete |
| 7-layer AI cost minimisation (static → cache → Claude) | Complete |
| AI explanations for mistakes | Complete |
| AI-generated questions & lessons (DB-first) | Complete |
| AI study advice & contextual teacher messages | Complete |
| Goal-based study planner | Complete |
| Exam engine with Z-score normalisation + ranking | Complete |
| Weekly leaderboard | Complete |
| Live competition rooms (Socket.IO) | Complete |
| Streak tracking + achievement badges | Complete |
| Analytics dashboard + thinking profile | Complete |
| Voice tutor (mic + TTS, subject-aware) | Complete |
| Multi-turn DoubtChat per question | Complete |
| Exam score prediction (weighted by topic marks × frequency) | Complete |
| CBSE grade prediction (A1–E) | Complete |
| CBSE textbook curriculum (104 chapters across 5 subjects) | Complete |
| Admin dashboard (CRUD for users / questions / topics / cache) | Complete |
| Parent / Teacher portal with student invite codes | Complete |
| Forgot password (email reset, 1h expiry) | Complete |
| Payment / Subscription (Razorpay — Pro ₹199/mo, Premium ₹499/mo) | Complete |
| PWA manifest + service worker (offline fallback + push shell) | Complete |
| 7-day free trial + annual plan options | Complete |
| Terms of Service + Privacy Policy pages | Complete |
| Dark mode support | Complete |
| Engagement-gated "Mark as studied" (5 min + 80% scroll + 2 sections + AI note ≥70/100) | Complete |
| Spaced mastery test (10 MCQs · 3E/4M/3H, 8/10 to pass → 3-day spacing → re-test confirms) | Complete |
| Server-side mastery test grading (anti-cheat: correct flag stripped, options shuffled) | Complete |
| Live per-topic / per-chapter status pills on /lessons (Not started / In progress / Due / Mastered) | Complete |
| CI/CD: GitHub Actions prod-deploy workflow (build → upload → SSH deploy → smoke test → auto-rollback) | Complete |
| Preflight check — blocks deploy if any tracked file is modified-not-committed or untracked at critical paths | Complete |
| Smoke-test script — 9 critical endpoints with expected status codes, exits non-zero on first failure | Complete |
| Auto-versioned service worker — postbuild hook bakes git short SHA + date into the SW cache name | Complete |
| Server-side deploy script — `git reset --hard` (not `pull`), tags previous image for rollback, polls API health | Complete |
| Refresh token family tracking (stolen-token detection) | Complete |
| Voice history persistence (Redis, 7-day TTL) | Complete |
| Push notifications (VAPID, Web Push — revision + study reminders) | Complete |
| NPS in-app survey (0–10, 30-day cooldown, 5+ attempts gate) | Complete |
| Error monitoring (Sentry — backend + frontend, no-op without DSN) | Complete |
| Database backup (mongodump + gzip, nightly GitHub Actions cron, optional S3) | Complete |
| Coupon system (percent / fixed discount, planFilter, atomic redemption) | Complete |
| Referral system (invite code, 30-day reward, double-reward guard) | Complete |
| Feature flags (env-var overrides, % rollout, `/api/flags`, `useFeatureFlags` hook) | Complete |
| NCERT chapter + topic content routes | Complete |
| PYQ (Past Year Questions) browse + filter routes | Complete |
| Admin analytics dashboard (DAU / MAU / revenue / 30-day charts) | Complete |
| Admin coupon CRUD | Complete |
| Question bookmarks | Complete |
| Placement quiz (20-question diagnostic, 4-label mastery seeding, one-time) | Complete |
| Fine-grained topic DAG recommender (43 nodes, routing tokens, fluke detection) | Complete |
| Placement quiz frontend (intro → quiz → results, global timer, Dashboard nudge) | Complete |
| Dynamic question variants (seeded per-student, 9 topics covered, infinite pool) | Complete |
| School group system (join code, variant_index, guaranteed unique homework per student) | Complete |
| RAG knowledge store (NCERT chunks injected as context into every Claude explanation) | Complete |
| AI failover (primary model → haiku fallback → friendly 503, never hard-crashes) | Complete |
| Output guardrails (prompt leakage + harmful content blocked before student sees response) | Complete |
| Per-user token limits (Redis-backed daily + monthly caps) | Complete |
| Global token budget (MONTHLY_TOKEN_BUDGET + 80% Resend alert email) | Complete |
| Student model injection (accuracy / thinkingProfile / weakAreas / streak per Claude call) | Complete |
| Conversation context (last explanation Redis 30 min, auto-injected into first chat turn) | Complete |
| Lesson cache dual-store (Redis + MongoDB — survives Redis restarts) | Complete |
| Answer verification for AI questions (PASS/FAIL second Claude call, discards bad Qs) | Complete |
| Thumbs up/down feedback on AI explanations (20/hour rate limit, stored per user) | Complete |
| Per-call AI metrics logging (AICallLog 90-day auto-purge) | Complete |
| Admin AI metrics dashboard widget (calls, tokens, cache/RAG hit rate, latency, feedback) | Complete |
| Jest backend test suite (285 tests — badge, prediction, coupon, admin, GDPR, middleware) | Complete |
| Vitest frontend test suite (56 tests — Practice, DoubtChat, Layout guards, useFeatureFlags) | Complete |
| k6 load tests (100 VU practice-session flow, p95 thresholds) | Complete |
| Docker + PM2 deployment configs | Complete |
| 880 adaptive questions (CBSE Class 10 Math — 43 fine-grained topics) | Complete |
| 14 chapter mock papers (CBSE-style, all sections A-D, ordered) | Complete |
| 40 board-style supplementary questions (2024/2025 paper patterns) | Complete |
| Placement quiz (20-question diagnostic — master/intermediate/novice scoring) | Complete |
| Fine-grained topic DAG (43 nodes, prerequisite graph, levels 0–7) | Complete |
| Adaptive recommender engine (mastery thresholds, fluke/stuck detection, routing) | Complete |
| Analytics event tracking (AnalyticsEvent, D1/D7/D30 retention, AI retry rate) | Complete |
| Admin Retention dashboard (conversion funnel, cohort retention, top topics) | Complete |
| SVG diagram library — 402 total entries across all boards (DiagramLibrary.jsx) | Complete |
| Multi-board content: CBSE Math Gr 1–10 · ICSE Math 9–10 · AP SSC Math 9–10 · CBSE Science/English/Hindi/SST Gr 10 | Complete |
| CBSE Math 8 — ALL PHASES: 56 topics, 627 Qs, 397 RAG chunks, 56 DAG nodes, 56 SVG diagrams (2026-05-24) | Complete |
| CBSE Math 9 — ALL PHASES: 32 topics, ~900 Qs, 301 RAG chunks, 32 DAG nodes, 32 SVG diagrams | Complete |
| ICSE Math 9 — ALL PHASES: 112 topics, 1792 Qs, 589 RAG chunks, 112 DAG nodes, 48 SVG diagrams | Complete |
| ICSE Math 10 — ALL PHASES: 100 topics, 1600 Qs, 60 SVG diagrams | Complete |
| AP SSC Math 9 — ALL PHASES: 35 topics, 560 Qs, 229 RAG chunks, 35 DAG nodes, 35/35 audit PASS | Complete |
| AP SSC Math 10 — ALL PHASES: 54 topics, 1140 Qs, 884 RAG chunks, 54 DAG nodes | Complete |
| CBSE Class 10 Social Science — 65 fine-grained topics, ~795 questions, 65 SVG diagrams | Complete |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  Port 5173  │  Zustand auth store  │  Axios API service      │
└────────────────────┬────────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Express + Node)                    │
│  Port 5001  │  JWT auth  │  Joi validation  │  Rate limiter  │
└───────┬───────────────┬────────────────────────────────────-┘
        │               │
┌───────▼──────┐  ┌─────▼──────────────────────────────────┐
│   MongoDB    │  │          Claude Haiku 4.5               │
│  23 collections │  │  7-layer cache — most calls are free    │
└──────────────┘  └────────────────────────────────────────-┘
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas URI)
- Anthropic API key

### 1. Backend

```bash
cd ai-learning-backend/backend
npm install
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
node server.js              # http://localhost:5001
```

### 2. Frontend

```bash
cd ai-learning-frontend/frontend
npm install
npm run dev                 # http://localhost:5173
```

### 3. Seed the Database (run once, in order)

```bash
cd ai-learning-backend/backend
npm run seed                           # Math topics + questions
npm run seed:lessons                   # initial lessons
npm run seed:subjects                  # Science / English / Social Science / Hindi topics
npm run seed:curriculum                # CBSE Class 10 Math — 14 chapters
npm run seed:science-curriculum        # CBSE Class 10 Science — 13 chapters
npm run seed:english-curriculum        # CBSE Class 10 English — 23 chapters
npm run seed:hindi-curriculum          # CBSE Class 10 Hindi — 32 chapters
npm run seed:social-science-curriculum # CBSE Class 10 Social Science — 22 chapters

# Fine-grained topic content + questions (Science + SST)
npm run seed:science-chemistry-content  # Science Chemistry NcertTopicContent (16 topics)
npm run seed:science-biology-content    # Science Biology NcertTopicContent (19 topics)
npm run seed:science-physics-content    # Science Physics NcertTopicContent (15 topics)
npm run seed:science-chemistry-questions
npm run seed:science-biology-questions
npm run seed:science-physics-questions
npm run seed:sst-content               # SST NcertTopicContent — 65 topics (History/Geo/Eco/PolSci)
npm run seed:sst-questions-a           # SST questions — History + Geography (~435 Qs)
npm run seed:sst-questions-b           # SST questions — Economics + Political Science (~360 Qs)
# or run all SST in one shot:
npm run seed:sst-all

# Coverage audit
npm run audit:coverage                 # all subjects
npm run audit:coverage Mathematics     # Math only
npm run audit:coverage Science         # Science only
npm run audit:coverage:sst             # Social Science only

# Adaptive question system (run AFTER seed above)
npm run seed:questions         # 880 CBSE Class 10 Math questions + 14 mock papers
npm run seed:board-questions   # 40 board-style questions (2024/2025 patterns)
npm run seed:placement-quiz    # 20-question diagnostic placement quiz
npm run seed:topic-dag         # 43 fine-grained topic nodes with prerequisite DAG
npm run seed:answer-keys       # Enrich mock paper questions with detailed solutions
```

### 4. Run Tests

```bash
# Backend (Jest)
cd ai-learning-backend/backend
npm test

# Frontend (Vitest)
cd ai-learning-frontend/frontend
npm test

# Load tests (requires k6 — https://k6.io/docs/get-started/installation/)
k6 run load-tests/practice-session.js
```

### 5. Database Backup (optional)

```bash
cd ai-learning-backend/backend
npm run backup    # creates gzip snapshot in ./backups/
npm run restore   # restores latest local backup (5-second abort window)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `CLAUDE_MODEL` | No | Default: `claude-haiku-4-5-20251001` |
| `PORT` | No | Default: `5001` |
| `FRONTEND_URL` | No | CORS origin — default `http://localhost:5173` |
| `REDIS_URL` | No | Redis for session/cache store; falls back to in-memory in dev |
| `RAZORPAY_KEY_ID` | No | Razorpay payment integration |
| `RAZORPAY_KEY_SECRET` | No | Razorpay payment integration |
| `VAPID_PUBLIC_KEY` | No | Web Push — generate with `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | No | Web Push private key |
| `VAPID_EMAIL` | No | Web Push contact email |
| `SENTRY_DSN` | No | Backend error monitoring (Sentry) |
| `VITE_SENTRY_DSN` | No | Frontend error monitoring (Sentry) — set in frontend `.env` |
| `SMTP_HOST` | No | Email — nodemailer; console-logs in dev if not set |
| `SMTP_PORT` | No | Email SMTP port |
| `SMTP_USER` | No | Email SMTP username |
| `SMTP_PASS` | No | Email SMTP password |
| `EMAIL_FROM` | No | From address for outgoing emails |
| `MONTHLY_TOKEN_BUDGET` | No | Global monthly Claude token cap (0 = unlimited) |
| `PER_USER_DAILY_TOKEN_LIMIT` | No | Per-user daily token cap via Redis (0 = disabled) |
| `PER_USER_MONTHLY_TOKEN_LIMIT` | No | Per-user monthly token cap via Redis (0 = disabled) |
| `ERROR_ALERT_EMAIL` | No | Receives 80% budget alert email (falls back to `COMPANY_ADMIN_EMAIL`) |
| `RESEND_API_KEY` | No | Resend API key for budget alert and onboarding emails |
| `BACKUP_DIR` | No | Local backup directory — default `./backups` |
| `BACKUP_RETAIN_DAYS` | No | Days to keep local backups — default `7` |
| `AWS_ACCESS_KEY_ID` | No | Optional S3 upload for backups |
| `AWS_SECRET_ACCESS_KEY` | No | Optional S3 upload for backups |
| `BACKUP_S3_BUCKET` | No | S3 bucket name for backup uploads |

---

## Deployment

### Docker (full stack)

```bash
docker compose up -d
```

Spins up MongoDB, Redis, and the API server. Set `JWT_SECRET` and `ANTHROPIC_API_KEY` in your environment before running.

### PM2 (single VM)

```bash
cd ai-learning-backend
pm2 start ecosystem.config.cjs --env production
pm2 save && pm2 startup
```

Runs in cluster mode (one worker per CPU core). Requires `REDIS_URL` so all workers share session state.

---

## Making the First Admin

```js
// Run in MongoDB shell or Compass
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
// Then re-login in the app to receive an updated JWT
```

---

## Pages

| Route | Page |
|---|---|
| `/` | Dashboard — streak, AI teacher message, revision due, NPS survey |
| `/lessons` | Lessons — CBSE textbook chapters + AI lessons |
| `/chapters/:n` | Chapter detail — sections, formulas, theorems, exercises |
| `/practice` | Adaptive quiz with confidence tracking and DoubtChat |
| `/analytics` | Thinking profile, behaviour stats, score prediction |
| `/competition` | Weekly leaderboard + create / join live rooms |
| `/live` | Real-time Socket.IO quiz room |
| `/planner` | Goal-based study calendar |
| `/exam-review` | Past exams with per-question AI review |
| `/voice-tutor` | Mic + TTS subject-aware tutor with persistent history |
| `/profile` | Badges, invite code generator |
| `/settings` | Subject / grade / goal / exam date + coupon input + referral card |
| `/portal` | Parent / teacher — link students, view analytics, set study reminders |
| `/pricing` | Plan cards + Razorpay checkout (monthly + annual) |
| `/forgot-password` | Request password reset email |
| `/reset-password/:token` | Set new password with strength indicator |
| `/tos` | Terms of Service |
| `/privacy` | Privacy Policy |
| `/admin` | Admin overview (role-gated) |
| `/admin/questions` | Question CRUD + flag queue |
| `/admin/topics` | Topic CRUD |
| `/admin/users` | User list + role management |
| `/admin/cache` | AI cache hit rates + cost estimate |
| `/admin/analytics` | DAU / MAU / revenue / 30-day charts |
| `/admin/coupons` | Coupon CRUD |
| `/placement-quiz` | 20-question diagnostic — intro, timed quiz, results + chapter breakdown |
| `/school` | School Groups — join via code, get unique homework questions, manage groups |

---

## AI Cost Architecture

Most answers are served at zero cost:

1. Correct answer → return immediately (no call)
2. Question has solution steps → serve steps (no call)
3. Known mistake pattern → static response map (no call)
4. Redis cache hit → shared 24h TTL (no call)
5. DB cache hit → cross-user `AIResponseCache` collection (no call)
6. Daily limit check → free 10/day, pro 100/day, premium 500/day
7. Call Claude → save to DB + Redis for all future users

Cache key: `MD5(questionText.toLowerCase().trim() + "::" + mistakeType + "::" + subject)`

Every Claude call is enhanced with:
- **RAG**: top 3 NCERT chapter chunks injected as context
- **Student model**: accuracy %, thinking profile, weak areas, streak days
- **Conversation context**: last explanation auto-injected on first chat turn

Every Claude call is protected by:
- **Failover**: primary model → haiku fallback → 503 (never crashes)
- **Output guardrails**: prompt leakage + harmful content checked before response reaches student
- **Budget caps**: global monthly limit + per-user daily/monthly limits (all Redis-backed)
- **Answer verification**: AI-generated questions verified with PASS/FAIL call before serving

---

## Project Structure

```
AILearningPath/
├── ai-learning-backend/backend/
│   ├── server.js
│   ├── controllers/        # HTTP handlers only — no business logic
│   ├── services/           # all business logic (AI, payment, coupons, push, etc.)
│   ├── routes/             # route definitions + middleware wiring
│   ├── models/             # Mongoose schemas (22+ collections)
│   ├── middleware/         # auth, adminAuth, validate, errorHandler, csrf
│   ├── utils/              # AppError, logger, redisClient, outputGuard, aiMetrics, tokenBudget
│   ├── config/             # seed scripts (topics, lessons, CBSE curriculum)
│   ├── scripts/            # backup.js, restore.js
│   └── __tests__/          # Jest unit tests (285 tests across 29 suites)
│
├── ai-learning-frontend/frontend/
│   └── src/
│       ├── pages/          # one file per route (incl. SchoolGroups)
│       ├── pages/admin/    # admin-only pages (role-guarded, incl. AdminRetention)
│       ├── components/     # Layout, BadgeToast, DoubtChat, DiagramLibrary (402 DIAGRAM_MAP entries)
│       ├── hooks/          # useFeatureFlags
│       ├── services/       # api.js (axios + CSRF + 401 handler)
│       ├── store/          # Zustand auth store
│       └── __tests__/      # Vitest unit tests (56 tests across 7 suites)
│
├── load-tests/             # k6 load test scripts
│   └── practice-session.js
│
├── .github/workflows/
│   ├── ci.yml              # backend Jest + frontend Vite build
│   └── backup.yml          # nightly mongodump cron
│
└── docker-compose.yml
```

---

## Security

| Feature | Detail |
|---|---|
| JWT + refresh token family | 7-day access token; stolen-token detection via family tracking |
| CSRF protection | Double-submit cookie (`csrf=` cookie + `x-csrf-token` header) |
| Helmet | CSP, HSTS, and other HTTP security headers |
| Rate limiting | 300 req / 15 min global; 20 profile updates / hour per user |
| Input validation | Joi schemas on every mutating endpoint (422 on failure) |
| Bcrypt passwords | Cost factor 12 |
| Admin role guard | `adminAuth` middleware — JWT `role === "admin"` required |
| ReDoS prevention | `escapeRegex()` on all user-supplied search inputs |
| CORS | Origin whitelist from `FRONTEND_URL` env var — never hardcoded |
| Error monitoring | Sentry captures unhandled errors (no-op without `SENTRY_DSN`) |

---

## License

Private project. All rights reserved.
