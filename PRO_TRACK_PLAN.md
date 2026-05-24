# Professional Track — Integration Plan (Draft, awaiting review)

> Focused, decision-ready plan for shipping the **Java pilot** of the professional track.
> Read `PROFESSIONAL_TRACKS_BLUEPRINT.md` for the broader multi-track vision.
> This document is the **thing you review and approve before any code lands**.
>
> Status: DRAFT v1 — 2026-05-25
> Owner: TBD
> Reviewer: Najeeb / Salma

---

## 1. Goal of this plan

Ship a **2-day end-to-end pilot** that proves the platform can host a professional course. Specifically:

1. A logged-in user can navigate to `/pro/java`
2. See modules, pick `m1_fundamentals`, pick `t1_hello_world`
3. Read the teaching content (rendered from `topic.json`)
4. Open one exercise, write code in a real editor, click Run
5. Get pass/fail back from a sandboxed JVM
6. Earn XP, see progress reflected on dashboard

**If the pilot passes, we proceed to bulk import of 209 topics.**
**If the pilot fails, we re-architect — we do not import 209 broken topics.**

This plan covers ONLY the pilot. Bulk import is a separate plan written after pilot acceptance.

---

## 2. What's in / out of scope

### In scope (pilot)
- One ProTrack record: `pro_java`
- One ProModule: `m1_fundamentals`
- One ProTopic: `t1_hello_world` (full teaching content from source JSON)
- Three ProExercises from `exercises.json` (warmup, easy, medium)
- One ProProject: `Build Your Bio Page`
- Code execution sandbox for Java only (Judge0 self-hosted)
- Frontend pages: track picker, course landing, module view, topic view, exercise runner
- Track isolation enforced
- XP earned visible on dashboard

### Out of scope (deferred to bulk import)
- All other Java modules (m2–m46)
- All other languages (Python, JS, C++, Go, Rust)
- DSA visualizers (separate plan — `PROFESSIONAL_TRACKS_BLUEPRINT.md` §7)
- Spring Boot / microservices modules (need Docker-in-Docker — major infra)
- AI tutor scoped to pro tracks (Phase 6 — RAG indexing)
- Certificates
- Streaks / leaderboards
- Mentor / reviewer roles
- Pricing / payment gating

---

## 3. Pre-flight decisions — LOCKED 2026-05-25

All decisions approved by Najeeb on 2026-05-25. Recommended option taken in every row. No code may deviate from these without re-opening the decision.

| # | Decision                                              | LOCKED CHOICE                                            | Date       |
|---|-------------------------------------------------------|----------------------------------------------------------|------------|
| 1 | New `Pro*` models vs extend `Ncert*` models           | NEW `Pro*` models (`models/proModels.js`) — clean sep    | 2026-05-25 |
| 2 | Sandbox provider                                      | Self-host Judge0 on Oracle Cloud (`144.24.154.247:2358`) | 2026-05-25 |
| 3 | User schema: `tracks[]` array vs single field         | `tracks: [{ key, role, enrolledAt }]` array              | 2026-05-25 |
| 4 | Commit raw Java content into git vs external path     | Commit into repo at `ai-learning-backend/backend/content/pro/java/**` (git-lfs if >200MB) | 2026-05-25 |
| 5 | Pilot users — gated rollout or open to all?           | Internal only — feature flag `PRO_TRACKS_ENABLED_FOR_EMAILS` (Najeeb + Salma) | 2026-05-25 |
| 6 | Onboarding: where does pro-track picker appear?       | NEW `/welcome` audience picker step AFTER `/register` and BEFORE track-specific onboarding | 2026-05-25 |
| 7 | Strip grade + examDate from Register.jsx              | YES — move to school-specific onboarding only            | 2026-05-25 |
| 8 | Parent-vs-self model for pro tracks                   | Pro/competitive learner is ALWAYS `user`, never a `linkedStudent`. School track keeps parent→child model. | 2026-05-25 |
| 9 | Dashboard merge — single page vs split routes         | Single `Dashboard.jsx` with `<TrackTabs />` switcher (URL: `/?track=<key>`) | 2026-05-25 |

**Implementation may now begin (Day 1, §5).**

---

## 4. Architecture (pilot only)

### 4.1 Data layer

Five new models. All live in `ai-learning-backend/backend/models/proModels.js` (single file for now — split later).

```
ProTrack {
  key: String (unique)        // "pro_java"
  slug: String (unique)        // "java"
  name: String                // "Java — From Zero to Job-Ready"
  description: String
  language: String             // "java"
  iconUrl, coverUrl
  totalModules: Number
  totalTopics: Number
  totalExercises: Number
  totalXp: Number
  status: "draft" | "live"
  createdAt, updatedAt
}

ProModule {
  trackKey: String (ref ProTrack.key)
  moduleId: String              // "java_m1"
  moduleNumber: Number          // 1
  name, slug, description
  estimatedHours: Number
  prerequisites: [String]       // moduleIds
  status: "draft" | "live"
}

ProTopic {
  trackKey: String
  moduleId: String
  topicId: String (unique)      // "java_m1_t1"
  topicNumber: Number
  name, slug
  metadata: Mixed               // from topic.json metadata block
  hook: Mixed                   // from topic.json hook block
  teaching: Mixed               // from topic.json teaching block (concept, syntax, visual aid)
  industryApplications: Mixed
  interviewRelevance: Mixed
  commonGaps: Mixed
  prerequisites: [String]       // topicIds
  estimatedMinutes: Number
  difficulty: Number
  xpReward: Number
}

ProExercise {
  trackKey, moduleId, topicId
  exerciseId: String (unique)   // "java_m1_t1_ex_1"
  level: "warmup" | "easy" | "medium" | "hard"
  type: "fill_blank" | "code_analysis" | "free_code" | "mcq"
  title, scenario, instructions
  starterCode: String
  expectedSolution: String
  blanks: [Mixed]
  testCases: [Mixed]            // { type, must_contain, must_compile, ... }
  hints: [String]
  xpReward: Number
  difficulty: Number
}

ProProject {
  trackKey, moduleId, topicId
  projectId: String (unique)
  name, scenario, description
  requirements: [{ id, description, weight }]
  estimatedMinutes: Number
  difficulty: Number
}

ProSubmission {
  userId, trackKey, exerciseId  (or projectId)
  code: String
  language: String
  sandboxResult: { stdout, stderr, exitCode, timeMs, memoryKb, status }
  testResults: [{ caseId, passed, message }]
  passed: Boolean
  xpAwarded: Number
  createdAt
}

ProProgress {
  userId, trackKey
  completedTopics: [String]
  completedExercises: [String]
  totalXp: Number
  currentStreak: Number
  lastActivityAt
}
```

### 4.2 User schema change

Add to existing User model:
```
tracks: [{
  key: String,                  // "school" | "pro_java" | ...
  role: { type: String, default: "learner" },
  enrolledAt: { type: Date, default: Date.now }
}]
```

Migration: `migrateUsersAddTracks.mjs` — every existing user gets `tracks: [{ key: "school", role: "learner" }]`.

### 4.3 Sandbox service

Self-host Judge0 via Docker Compose on the existing Oracle box (`144.24.154.247`). Single `docker-compose.judge0.yml`. Backend talks to it over localhost:2358.

```
services/codeExecutionService.js
  - runCode({ source, language, stdin, timeLimitMs, memoryLimitKb })
  - runTestCases({ source, language, testCases })
  - rate-limited per userId via Redis
```

### 4.4 API routes (under `/api/v1/pro/...`)

```
GET    /api/v1/pro/tracks                              → list all live tracks (user sees those they're enrolled in)
GET    /api/v1/pro/tracks/:trackSlug                   → track landing data (modules list)
GET    /api/v1/pro/tracks/:trackSlug/modules/:moduleId → module + topics list
GET    /api/v1/pro/topics/:topicId                     → full topic content
GET    /api/v1/pro/topics/:topicId/exercises           → exercises for topic
GET    /api/v1/pro/exercises/:exerciseId               → single exercise
POST   /api/v1/pro/exercises/:exerciseId/submit        → run code in sandbox + grade + record submission
GET    /api/v1/pro/progress/:trackKey                  → user progress for track
POST   /api/v1/pro/enroll                              → enroll current user in a track
```

All routes pass through:
- `auth` middleware (existing)
- `trackFilter` middleware (new — mirrors `boardFilter`)
- `validate` middleware (Joi schema per route)

### 4.5 Frontend (pilot pages only)

```
/pro                                          → ProTrackPicker.jsx (just shows Java for now)
/pro/java                                     → ProCourseLanding.jsx (modules grid)
/pro/java/m1_fundamentals                     → ProModuleView.jsx (topics list)
/pro/java/m1_fundamentals/t1_hello_world      → ProTopicView.jsx
/pro/java/exercise/java_m1_t1_ex_1            → ProExerciseRunner.jsx (Monaco + Run)
```

Reused components:
- `Layout` (already wraps everything)
- Dashboard-style cards / typography / spacing (memory: dashboard UI is the design standard)

New components:
- `CodeEditor` (Monaco)
- `TestRunner` (renders pass/fail)
- `SyntaxBreakdown` (renders annotated code blocks from `topic.json.teaching.syntax_breakdown`)
- `HintBox` (progressive disclosure)

---

## 5. Step-by-step execution sequence

Day-by-day. Each step has an explicit acceptance check.

### Day 1 — Backend + sandbox

**Step 1 — Sandbox up (90 min)**
- `docker-compose.judge0.yml` provisioned on Oracle box
- Smoke test: POST `/submissions?wait=true` with Java Hello World returns `Hello, World!\n`
- Acceptance: `curl` from backend host gets clean response

**Step 2 — Models (60 min)**
- `models/proModels.js` with the 7 schemas above
- Indexes: `ProTopic.topicId` unique, `ProModule.moduleId` unique, `ProSubmission.userId+createdAt`
- Acceptance: `node -e "require('./models/proModels')"` loads with no errors

**Step 3 — User schema migration (30 min)**
- Add `tracks[]` field to User model
- `migrateUsersAddTracks.mjs` backfills existing users
- Acceptance: run migration on local Mongo; verify all users have `tracks: [{ key: "school" }]`

**Step 4 — Seed the pilot topic (45 min)**
- `config/seedJavaPilot.js` — reads exactly ONE topic from source folder, writes ProTrack + ProModule + ProTopic + 3 ProExercises + 1 ProProject
- npm script: `seed:pro-java-pilot`
- Acceptance: querying ProTopic where `topicId="java_m1_t1"` returns full content

**Step 5 — Sandbox service (90 min)**
- `services/codeExecutionService.js`
- Rate limit: 30 runs/hour/user via Redis
- Acceptance: Jest test runs Hello World, returns expected stdout

**Step 6 — API routes (120 min)**
- `routes/proRoutes.js` with the endpoints in §4.4
- `controllers/proController.js` (thin)
- `services/proService.js` (business logic)
- `middleware/trackFilter.js`
- Validation schemas in `validators/proValidator.js`
- Acceptance: Postman/curl hits each route with correct response

**End of Day 1 acceptance:**
- A test user can be enrolled in `pro_java`
- GET on every route returns expected JSON
- POST to `/exercises/:id/submit` with Hello World code returns `passed: true`

### Day 2 — Frontend

**Step 7 — Routing + track picker (45 min)**
- Add routes in `App.jsx`
- `pages/professional/ProTrackPicker.jsx`
- Acceptance: `/pro` renders, shows Java card, click goes to `/pro/java`

**Step 8 — Course landing + module view (60 min)**
- `ProCourseLanding.jsx` (1 module visible)
- `ProModuleView.jsx` (1 topic visible)
- Acceptance: navigation works, Dashboard-style cards

**Step 9 — Topic view (90 min)**
- `ProTopicView.jsx` renders:
  - Hook section
  - Concept explanation
  - SyntaxBreakdown (the annotated code block)
  - Worked example
  - "Start exercises" CTA
- Acceptance: matches dashboard typography / spacing

**Step 10 — Exercise runner (120 min)**
- `ProExerciseRunner.jsx`:
  - Monaco editor with starterCode pre-loaded
  - Run button → POST to submit endpoint
  - TestRunner component shows pass/fail per test case
  - HintBox progressive disclosure
  - On all-pass: confetti / XP toast / mark complete
- Acceptance: full happy path from topic → exercise → green check

**Step 11 — Progress wiring (30 min)**
- Dashboard shows `pro_java` XP and completion %
- Acceptance: completing the exercise updates dashboard number

**Step 12 — Smoke test as fresh user (30 min)**
- Create new test account
- Enroll in `pro_java`
- Walk through topic → exercise → success
- Confirm XP reflected on dashboard

**End of Day 2 acceptance:**
- Pilot acceptance criteria (§1, items 1–6) all satisfied
- No regressions to existing K-12 flows (run K-12 smoke test)
- Track isolation: school-only users do NOT see `/pro/*` routes

---

## 6. Risks + mitigations

| Risk                                                  | Likelihood | Impact | Mitigation                                                    |
|-------------------------------------------------------|------------|--------|---------------------------------------------------------------|
| Judge0 self-host is brittle / hard to harden          | M          | H      | Have Piston as fallback for v1; harden Judge0 over weeks 2–4  |
| Monaco bundle adds 2MB to frontend                    | H          | L      | Lazy-load only on `/pro/*` routes                             |
| Source `topic.json` schema variations across modules  | M          | M      | Pilot tests parser on one topic; bulk import adds tolerance   |
| Track isolation regression breaks K-12 board filter   | L          | H      | Add explicit Jest tests; trackFilter is additive, not invasive|
| User confused by both K-12 and Pro in same UI         | M          | M      | Track picker on login; pro lives at `/pro/*` not `/learn`     |
| Java content takes 50MB in git                        | M          | L      | Use git-lfs OR keep external; pilot doesn't decide bulk yet   |
| Sandbox timeout misconfigured → CPU spikes            | L          | H      | Hard 5s CPU, 256MB RAM per call; rate limit; alerts on Oracle |
| Code submissions store user code in DB → privacy      | L          | M      | TTL on ProSubmission (30 days); never log raw code            |

---

## 7. Acceptance criteria (Definition of Done for pilot)

Pilot is DONE when:

- [ ] A fresh test user can sign up, enroll in `pro_java`, navigate to `/pro/java/m1_fundamentals/t1_hello_world`, read content, solve 3 exercises with the Run button, and see XP on dashboard
- [ ] Track isolation: a school-only user cannot access `/api/v1/pro/*` (returns 403)
- [ ] All Jest tests pass — including new tests for proService, codeExecutionService, trackFilter
- [ ] No regression in K-12 flows — existing `npm run audit:coverage` exits 0
- [ ] Judge0 sandbox handles 100 sequential Hello World submissions without crashing
- [ ] BLUEPRINT.md updated to reflect pro track existence
- [ ] CONTENT_STATUS.md updated with a `pro_java` row
- [ ] PRO_TRACK_PLAN.md (this file) updated with actual elapsed time + lessons learned

---

## 8. Post-pilot decisions (we'll revisit after pilot acceptance)

These don't block the pilot, but we'll need to decide before bulk import:

- Bulk import strategy (one big seed script vs incremental per module)
- Where does raw content live in git
- AI tutor RAG indexing approach (per topic, per module, or per track)
- DSA visualizer prioritization (which 13 algos ship first)
- Pricing model (free pilot vs paid tier)
- Marketing: when do we tell non-K-12 users about this?
- Mentor / reviewer role flow
- Certificate issuance flow

---

## 9. Sign-off

| Reviewer | Decision | Date       | Notes                                                                |
|----------|----------|------------|----------------------------------------------------------------------|
| Najeeb   | APPROVED | 2026-05-25 | All 9 recommendations accepted as-is. Implementation cleared to start.|
| Salma    | pending  |            |                                                                      |

---

## 10. MASTER CHECKLIST — Pilot Runbook

> Tick each box as you complete it. Phases are sequential within a day; tasks within a phase can mostly run in parallel.
> If a check is `[~]` it means "skipped intentionally — document why in §9 notes".
> Time estimates are rough — measure actual time and update §9.

### Phase 0 — Prerequisites (BEFORE Day 1 starts — ~45 min)

- [ ] SSH access to Oracle box `144.24.154.247` verified
- [ ] Docker installed on Oracle (`docker --version` ≥ 20.x)
- [ ] Free disk space on Oracle ≥ 5 GB (`df -h`)
- [ ] Free RAM headroom on Oracle ≥ 1 GB (`free -h`)
- [ ] Local Mongo dev instance reachable (`mongosh` connects)
- [ ] Local Redis dev instance reachable (`redis-cli ping`)
- [ ] Backend `.env` baseline boots without errors
- [ ] Frontend dev server boots (`npm run dev` in frontend)
- [ ] All existing Jest tests passing locally
- [ ] **Production MongoDB backup taken** (mongodump) — before any user migration
- [ ] Source content folder accessible: `C:\Users\LENOVO\Downloads\codequest_java_curriculum_M1_M46\codequest_content\java\modules\m1_fundamentals\topics\t1_hello_world`
- [ ] `.env` new keys queued: `JUDGE0_URL`, `JUDGE0_AUTH_TOKEN`, `PRO_TRACKS_ENABLED_FOR_EMAILS`, `SANDBOX_MAX_RUNS_PER_HOUR`, `SANDBOX_MAX_RUNS_PER_DAY`
- [ ] Working branch confirmed: `main` per project memory (no feature branch)

### Phase 1 — Judge0 sandbox infrastructure (Day 1, ~90 min)

- [ ] Create `infra/judge0/docker-compose.judge0.yml`
- [ ] Create `infra/judge0/judge0.conf` (hardened — no network egress, no privileged)
- [ ] Pin Judge0 image to a fixed version tag (never `:latest`)
- [ ] Local spin-up first: `docker compose up -d` succeeds
- [ ] Smoke: `curl localhost:2358/about` returns 200
- [ ] Smoke: POST Java Hello World, response stdout = `Hello, World!\n`
- [ ] Configured: CPU limit 5s, memory 256 MB, max output 8 KB
- [ ] Auth token set (do not run open to the network)
- [ ] Deploy compose to Oracle box
- [ ] Firewall: port 2358 internal-only (no public ingress)
- [ ] Backend `GET /healthz` extended to include Judge0 reachability check
- [ ] `infra/judge0/README.md` runbook: start, stop, logs, restart, rotate token

### Phase 2 — Data models & user migration (Day 1, ~90 min)

- [ ] `models/proModels.js` created with all 7 schemas (ProTrack, ProModule, ProTopic, ProExercise, ProProject, ProSubmission, ProProgress)
- [ ] Unique indexes verified: `trackKey`, `moduleId`, `topicId`, `exerciseId`, `projectId`
- [ ] `ProSubmission` has 30-day TTL index
- [ ] `models/index.js` re-exports the new models
- [ ] User schema: add `tracks: [{ key, role, enrolledAt }]`
- [ ] Migration script `migrations/2026-05-25_users_add_tracks.mjs` backfills existing users to `tracks: [{ key: "school", role: "learner" }]`
- [ ] Migration tested on local dev DB
- [ ] Existing User-related Jest tests still pass
- [ ] Migration documented in `migrations/README.md`

### Phase 3 — Backend services, middleware, and API (Day 1, ~180 min)

- [ ] `utils/trackFilter.js` middleware (mirror of `boardFilter.js`)
- [ ] `middleware/featureFlag.js` reading `PRO_TRACKS_ENABLED_FOR_EMAILS` (comma-separated allowlist)
- [ ] `services/codeExecutionService.js`:
  - [ ] `runCode({ source, language, stdin, timeLimitMs, memoryLimitKb })`
  - [ ] `runTestCases({ source, language, testCases })`
  - [ ] Redis-backed per-user rate limit (30/hr, 100/day)
  - [ ] Output truncated to 8 KB
  - [ ] Standard result shape returned
  - [ ] **PII guard:** raw user code never logged at any log level
- [ ] `services/proService.js`:
  - [ ] `listTracks(userId)`
  - [ ] `getTrack(trackSlug, userId)`
  - [ ] `getModule(trackKey, moduleId, userId)`
  - [ ] `getTopic(topicId, userId)`
  - [ ] `getExercise(exerciseId, userId)`
  - [ ] `submitExercise({ userId, exerciseId, code })`
  - [ ] `getProgress(userId, trackKey)`
  - [ ] `enroll(userId, trackKey)`
- [ ] `controllers/proController.js` — thin handlers, no business logic
- [ ] `validators/proValidator.js` — Joi schemas per endpoint
- [ ] `routes/proRoutes.js` mounted under `/api/v1/pro`
- [ ] Route stack: `auth → featureFlag → validate → trackFilter → controller`
- [ ] Submit endpoint has additional per-route rate limiter
- [ ] CORS confirmed — pro routes inherit existing config from `FRONTEND_URL`
- [ ] All errors flow through global `AppError` handler

### Phase 4 — Pilot content seed (Day 1, ~60 min)

- [ ] Copy source content folder to repo: `ai-learning-backend/backend/content/pro/java/m1_fundamentals/topics/t1_hello_world/` (all 4 files: topic.json, exercises.json, project.json, README.md)
- [ ] `config/seedJavaPilot.js`:
  - [ ] Idempotent upserts on all 7 models
  - [ ] Schema-mapping table at top of file as comment
  - [ ] Logs counts of inserted/updated docs at end
- [ ] npm script `seed:pro-java-pilot` added
- [ ] Seed runs cleanly against local DB
- [ ] Verified in DB: 1 ProTrack, 1 ProModule, 1 ProTopic, 3 ProExercises, 1 ProProject
- [ ] Each exercise has non-empty `testCases[]`

### Phase 5 — Backend tests (Day 1, ~90 min)

- [ ] `__tests__/proService.test.js` — every service function happy + error paths
- [ ] `__tests__/codeExecutionService.test.js` — happy path, compile error, timeout, OOM, rate-limit hit
- [ ] `__tests__/trackFilter.test.js` — school-only user → 403 on pro routes
- [ ] `__tests__/featureFlag.test.js` — non-allowlisted email → 403
- [ ] `__tests__/proRoutes.integration.test.js` — full route table with mocked sandbox
- [ ] Existing K-12 tests still pass (`npm test` exit 0)
- [ ] Coverage for new pro modules ≥ 80%
- [ ] `npm run validate:track-isolation` script added (analogous to `validate:board-isolation`) and exits 0

### Phase 6 — Frontend infra & routing (Day 2, ~60 min)

- [ ] Install `@monaco-editor/react` at a pinned version
- [ ] Vite config: lazy-load Monaco only on `/pro/*` routes (dynamic import)
- [ ] Base bundle size verified — no regression on K-12 routes (Lighthouse before/after)
- [ ] New routes added in `App.jsx`:
  - [ ] `/welcome`
  - [ ] `/onboarding/school` (canonical) + `/onboarding` redirect for back-compat
  - [ ] `/onboarding/pro`
  - [ ] `/pro`
  - [ ] `/pro/:trackSlug`
  - [ ] `/pro/:trackSlug/:moduleId`
  - [ ] `/pro/:trackSlug/:moduleId/:topicId`
  - [ ] `/pro/exercise/:exerciseId`
- [ ] All `/pro/*` routes wrapped in AuthGuard + FeatureFlagGuard
- [ ] Error boundary mounted at `/pro/*` root
- [ ] 404 handler for unknown pro routes

### Phase 7 — Signup, Welcome, and onboarding (Day 2, ~120 min)

- [ ] `Register.jsx` — remove `grade` and `examDate` inputs
- [ ] `Register.jsx` — after register, navigate to `/welcome` (not `/onboarding`)
- [ ] `services/api.js` `register()` payload no longer sends grade/examDate
- [ ] Backend `authController.register` tolerates missing grade/examDate (back-compat)
- [ ] `pages/Welcome.jsx` created:
  - [ ] Hero: "Welcome to Stellar — what are you here for?"
  - [ ] Three cards: School (live) / Professional (live) / Competitive (Coming soon, disabled)
  - [ ] Card click sets intended track in session storage, navigates accordingly
  - [ ] Matches Dashboard.jsx design tokens
- [ ] `pages/onboarding/School.jsx` (renamed from `Onboarding.jsx`):
  - [ ] Same fields as before
  - [ ] On submit also pushes `{ key: "school" }` to `user.tracks[]`
- [ ] `pages/onboarding/Pro.jsx` created:
  - [ ] Language picker (Java live, Python/JS/C++ visually present but disabled)
  - [ ] Experience: Beginner / Some coding / Experienced
  - [ ] Goal: First job / Switch jobs / Hobby / Personal project
  - [ ] Optional: current role
  - [ ] On submit: POST `/api/v1/pro/enroll` → navigate `/?track=pro_java`

### Phase 8 — Pro track UI (Day 2, ~180 min)

- [ ] `pages/professional/ProTrackPicker.jsx`
- [ ] `pages/professional/ProCourseLanding.jsx`
- [ ] `pages/professional/ProModuleView.jsx`
- [ ] `pages/professional/ProTopicView.jsx`
- [ ] `pages/professional/ProExerciseRunner.jsx`
- [ ] `components/pro/CodeEditor.jsx` (Monaco wrapper)
- [ ] `components/pro/TestRunner.jsx`
- [ ] `components/pro/SyntaxBreakdown.jsx`
- [ ] `components/pro/HintBox.jsx`
- [ ] Every async fetch has explicit loading + error UI
- [ ] Error states implemented: sandbox down (503), rate limited (429), compile error, test failure
- [ ] Empty states: no progress yet, no submissions yet
- [ ] Keyboard accessibility (tab order, ARIA on tabs, focus rings)
- [ ] Dark mode parity verified
- [ ] All pages match Dashboard.jsx style (no max-w on page roots, fluid grids)
- [ ] Mobile graceful degradation: Monaco hidden or read-only on `<640px` viewport, fall back to a "best viewed on desktop" notice for v1

### Phase 9 — Dashboard merge & settings (Day 2, ~60 min)

- [ ] `Dashboard.jsx` reads `user.tracks[]`
- [ ] `components/TrackTabs.jsx` — renders tabs from enrolled tracks, syncs to `?track=` URL param
- [ ] `components/dashboard/SchoolDashboardCards.jsx` — existing cards extracted
- [ ] `components/dashboard/ProDashboardCards.jsx`:
  - [ ] Continue learning card (last topic visited via localStorage)
  - [ ] Total XP card
  - [ ] Streak card
  - [ ] Today's exercise card
  - [ ] Browse modules CTA
- [ ] Dashboard renders correct cards based on active track param
- [ ] `Settings.jsx` — new "My tracks" section listing enrolled tracks
- [ ] Settings — "Add another track" button → `/welcome`

### Phase 10 — Analytics & telemetry (Day 2, ~30 min)

- [ ] Events emitted (use existing analytics service, else log to backend):
  - [ ] `pro.enrolled` { trackKey }
  - [ ] `pro.topic_viewed` { topicId }
  - [ ] `pro.exercise_started` { exerciseId }
  - [ ] `pro.code_submitted` { exerciseId, language, durationMs }
  - [ ] `pro.exercise_passed` { exerciseId, attempts }
  - [ ] `pro.exercise_failed` { exerciseId, reason }
- [ ] Sandbox latency tracked in logs (p50, p95)
- [ ] Rate-limit-hit counter incremented per user

### Phase 11 — Acceptance / smoke (Day 2, ~60 min)

- [ ] **Happy path walkthrough** with a fresh email on the allowlist:
  - [ ] Sign up
  - [ ] Land on `/welcome`, pick Professional
  - [ ] Complete pro onboarding
  - [ ] Land on Dashboard with `pro_java` track active
  - [ ] Click into Java → Module 1 → Topic 1
  - [ ] Read teaching content
  - [ ] Solve Exercise 1 (warmup) → green pass
  - [ ] Solve Exercise 2 (easy) → green pass
  - [ ] Solve Exercise 3 (medium) → green pass
  - [ ] XP reflected on dashboard
- [ ] **Regression**: existing K-12 user signs in, no broken flows, board isolation intact
- [ ] **Isolation**: school-only user hits `/api/v1/pro/tracks` → 403
- [ ] **Feature flag**: user NOT on allowlist hits `/api/v1/pro/*` → 403
- [ ] **Load**: 100 sequential Hello World submissions, sandbox does not crash
- [ ] **Audit scripts**: `audit:coverage`, `validate:board-isolation`, `validate:track-isolation` all exit 0
- [ ] **Lighthouse**: pro topic page score ≥ baseline; K-12 pages no regression

### Phase 12 — Documentation & memory (Day 2, ~45 min)

- [ ] `BLUEPRINT.md` — add Tracks table (school/professional/competitive) and pro_java entry
- [ ] `CONTENT_STATUS.md` — add `pro_java` row
- [ ] `PROFESSIONAL_TRACKS_BLUEPRINT.md` changelog — pilot shipped entry
- [ ] `PRO_TRACK_PLAN.md` §9 sign-off — fill in actual elapsed time + lessons learned
- [ ] Memory file `project_pro_java_pilot.md` written
- [ ] `MEMORY.md` index updated
- [ ] `infra/judge0/README.md` runbook reviewed
- [ ] `migrations/README.md` updated with user-tracks migration entry

### Phase 13 — Commit, tag, push (Day 2, ~15 min)

- [ ] All changes committed to `main` in small, logical commits (no big-bang)
- [ ] Tag `pilot-pro-java-v1` on the final commit
- [ ] `git push origin main` and tag pushed
- [ ] Graphify hook ran successfully on commit
- [ ] `graphify update .` run manually (project rule)
- [ ] PR review (self) on GitHub — diff sanity check

### Phase 14 — Post-pilot follow-ups (NOT in 2 days — separate plan)

- [ ] Bulk-import remaining 208 Java topics (M1 rest + M2–M46)
- [ ] Decide: weeks 2–3 priority — Python OR DSA visualizers
- [ ] Open pro track to public (remove feature flag)
- [ ] Pricing model decision (`PROFESSIONAL_TRACKS_BLUEPRINT.md` §11.4 still PENDING)
- [ ] Marketing announcement
- [ ] Certificate issuance flow
- [ ] Mentor / reviewer role flow
- [ ] AI tutor scoped to pro track context (Phase 6 RAG)

---

### Total estimate

| Day | Phases    | Estimated time |
|-----|-----------|----------------|
| 0   | 0         | 45 min         |
| 1   | 1, 2, 3, 4, 5 | ~8.5 hours |
| 2   | 6, 7, 8, 9, 10, 11, 12, 13 | ~9.5 hours |

**Honest:** Day 2 is tight. If Phase 8 or 11 overflows, defer Phase 10 analytics to a Day 3 polish pass — analytics is not Definition of Done.

### Items I deliberately considered and rejected for v1

| Item                                       | Why deferred                                             |
|--------------------------------------------|----------------------------------------------------------|
| E2E browser tests (Playwright/Cypress)     | Internal pilot, manual smoke is enough                  |
| Visual regression tests                    | No baseline yet; defer                                   |
| i18n / translated strings                  | Pro track is English-only for v1                         |
| Spaced repetition / forgetting curve UI    | DSA visualizer plan §7.4                                 |
| Certificate generation                     | Post-pilot                                               |
| Public landing page rework (`Landing.jsx`) | Audience picker happens AFTER register; v2              |
| Mobile Monaco                              | Code editor is desktop-first; mobile shows fallback     |
| SEO for `/pro/*`                           | Routes are gated; no public discovery needed yet         |
| Email notifications (welcome, streak)      | Stretch; not blocking pilot                              |
| Submission code export / "download my code"| Not v1                                                   |
| Pro track admin tooling                    | Content seeded from JSON; admin UI can wait              |
| Terms of Service update for code subs      | Pilot is internal; revisit before public open            |

---

## 11. References

- Full multi-track vision: `PROFESSIONAL_TRACKS_BLUEPRINT.md`
- K-12 content pipeline pattern: `CONTENT_PIPELINE.md`
- Project blueprint: `BLUEPRINT.md`
- Content status tracker: `CONTENT_STATUS.md`
- Existing board isolation pattern (model for `trackFilter.js`): `ai-learning-backend/backend/utils/boardFilter.js`
- Existing schemas to model after: `models/ncertChapterModel.js`, `models/ncertTopicContentModel.js`
- Existing signup flow files: `pages/Register.jsx`, `pages/Onboarding.jsx`, `pages/StartOnboarding.jsx`
- Source content for pilot: `C:\Users\LENOVO\Downloads\codequest_java_curriculum_M1_M46\codequest_content\java\modules\m1_fundamentals\topics\t1_hello_world`
- Judge0 docs: `https://judge0.com` (self-hosted edition)
- Monaco editor: `@monaco-editor/react`
