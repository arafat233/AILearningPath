# AI Learning Path — CBSE Class 10 Exam Prep Platform

An AI-powered exam preparation platform for CBSE Class 10 students. Students practice adaptive questions, get personalised AI explanations, follow a smart study planner, compete live against each other, and receive lessons — all driven by a behavioural analysis engine that tracks HOW they think, not just whether they're right.

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
| Jest test suite (22 unit tests) | Complete |
| Docker + PM2 deployment configs | Complete |

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
│  20+ collections│  │  7-layer cache — most calls are free    │
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
```

### 4. Run Tests

```bash
cd ai-learning-backend/backend
npm test
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
| `REDIS_URL` | No | Redis for session store; falls back to in-memory in dev |
| `RAZORPAY_KEY_ID` | No | Payment integration |
| `RAZORPAY_KEY_SECRET` | No | Payment integration |
| `VAPID_PUBLIC_KEY` | No | PWA push notifications (not yet wired) |
| `VAPID_PRIVATE_KEY` | No | PWA push notifications |
| `VAPID_EMAIL` | No | PWA push notifications |

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
| `/` | Dashboard — streak, AI teacher message, revision due |
| `/lessons` | Lessons — CBSE textbook chapters + AI lessons |
| `/chapters/:n` | Chapter detail — sections, formulas, theorems, exercises |
| `/practice` | Adaptive quiz with confidence tracking and DoubtChat |
| `/analytics` | Thinking profile, behaviour stats, score prediction |
| `/competition` | Weekly leaderboard + create / join live rooms |
| `/live` | Real-time Socket.IO quiz room |
| `/planner` | Goal-based study calendar |
| `/exam-review` | Past exams with per-question AI review |
| `/voice-tutor` | Mic + TTS subject-aware tutor |
| `/profile` | Badges, invite code generator |
| `/settings` | Subject / grade / goal / exam date + subscription status |
| `/portal` | Parent / teacher — link students, view analytics |
| `/pricing` | Plan cards + Razorpay checkout |
| `/admin` | Admin dashboard (role-gated) |

---

## AI Cost Architecture

Most answers are served at zero cost:

1. Correct answer → return immediately (no call)
2. Question has solution steps → serve steps (no call)
3. Known mistake pattern → static response map (no call)
4. In-memory cache hit → RAM lookup, 24h TTL (no call)
5. DB cache hit → cross-user `AIResponseCache` collection (no call)
6. Daily limit check → free 10/day, pro 100/day
7. Call Claude → save to DB + RAM for all future users

Cache key: `MD5(questionText + "::" + mistakeType + "::" + subject)`

---

## Project Structure

```
AILearningPath/
├── ai-learning-backend/backend/
│   ├── server.js
│   ├── controllers/        # HTTP handlers only
│   ├── services/           # all business logic
│   ├── routes/             # route definitions + middleware wiring
│   ├── models/             # Mongoose schemas (20+ collections)
│   ├── middleware/         # auth, adminAuth, validate, errorHandler
│   ├── utils/              # AppError, logger, redisClient, cache
│   ├── config/             # seed scripts
│   └── __tests__/          # Jest unit tests
│
├── ai-learning-frontend/frontend/
│   └── src/
│       ├── pages/          # one file per route
│       ├── pages/admin/    # admin-only pages
│       ├── components/     # Layout, BadgeToast, DoubtChat
│       ├── services/       # api.js (axios)
│       └── store/          # Zustand auth store
│
└── docker-compose.yml
```

---

## License

Private project. All rights reserved.
