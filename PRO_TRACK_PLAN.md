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

## 10. References

- Full multi-track vision: `PROFESSIONAL_TRACKS_BLUEPRINT.md`
- K-12 content pipeline pattern: `CONTENT_PIPELINE.md`
- Project blueprint: `BLUEPRINT.md`
- Content status tracker: `CONTENT_STATUS.md`
- Source content for pilot: `C:\Users\LENOVO\Downloads\codequest_java_curriculum_M1_M46\codequest_content\java\modules\m1_fundamentals\topics\t1_hello_world`
