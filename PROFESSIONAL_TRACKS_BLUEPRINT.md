# Professional & Advanced Tracks — Master Blueprint

> Single source of truth for expanding Stellar beyond K-12.
> Java is the pilot track. Python, System Design, DevOps, AWS, USMLE, GRE, TOEFL, UPSC, IIT, NEET all follow the same pipeline.
> Update this file in the same commit as any new track / new language seed.
> Created: 2026-05-25.

---

## 1. Vision

Stellar is no longer a K-12-only platform. It is a **three-track learning system**:

| Track key      | Audience                                | Content shape                              | Status      |
|----------------|-----------------------------------------|--------------------------------------------|-------------|
| `school`       | Class 1–12 (CBSE, ICSE, AP SSC, ...)   | NCERT topics, MCQ practice, AI tutor       | LIVE        |
| `professional` | Career switchers, working devs          | Modules → topics → exercises → projects    | LIVE (Java — 46 modules, 232 topics, 3311 exercises, 168,365 XP)|
| `competitive`  | IIT, NEET, UPSC, USMLE, GRE, TOEFL, ... | PYQ-heavy, timed mock papers, exam-mode UI | PLANNED     |

A user can be enrolled in multiple tracks. Stellar must enforce **track isolation** the same way it enforces **board isolation** today (`utils/boardFilter.js` pattern → `utils/trackFilter.js`).

---

## 2. Track Architecture (shared across all professional / competitive tracks)

### 2.1 User model changes (one-time, blocking)

- [x] Add `tracks: [{ key: String, role: String, enrolledAt: Date }]` to User schema
  - `key` examples: `"pro_java"`, `"pro_python"`, `"pro_aws"`, `"pro_devops"`, `"pro_system_design"`, `"comp_iit_jee"`, `"comp_neet"`, `"comp_upsc"`, `"comp_usmle"`, `"comp_gre"`, `"comp_toefl"`
  - `role` examples: `"learner"`, `"mentor"`, `"reviewer"`
- [x] Keep existing `examBoard` field — it scopes the `school` track only
- [x] Migration script: existing users get `tracks: [{ key: "school", role: "learner" }]`
- [x] Onboarding flow: ask "What are you here for?" → school grade picker OR professional track picker OR competitive exam picker

### 2.2 New / extended Mongoose models

| Model                    | Status      | Purpose                                                                |
|--------------------------|-------------|------------------------------------------------------------------------|
| `ProTrack`               | NEW         | Top-level container (java, python, aws). Has metadata, slug, icon.     |
| `ProModule`              | NEW         | Module within a track (m1_fundamentals). Parallel to `NcertChapter`.   |
| `ProTopic`               | NEW         | Single lesson. Parallel to `NcertTopicContent`. Stores full `topic.json`.|
| `ProExercise`            | NEW         | One exercise. Code/MCQ/fill-blank. Has `test_cases`, `xp_reward`.       |
| `ProProject`             | NEW         | Mini-project per topic. Weighted requirements.                         |
| `ProSubmission`          | NEW         | A learner's code submission + execution result + score.                |
| `ProProgress`            | NEW         | Per-user-per-track progress, XP, streak, completion %.                 |
| `CompetitiveExam`        | NEW (later) | IIT/NEET/UPSC/USMLE exam metadata + sections + syllabus.               |
| `CompetitivePYQPaper`    | NEW (later) | Past year paper (already exists as `pyqRoutes` — reuse).               |

**Reuse rule:** If `NcertChapter` / `NcertTopicContent` can be reused with a `track` discriminator field, prefer that over duplicate models. Decision pending (see §11.1).

### 2.3 Track isolation middleware

- [x] Create `utils/trackFilter.js` mirroring `utils/boardFilter.js`
- [x] Every pro/competitive endpoint MUST filter by `user.tracks[].key`
- [x] Never trust client-supplied `track` query params
- [ ] New script: `npm run validate:track-isolation` (mirror of `validate:board-isolation`)

### 2.4 API versioning

- [x] All new routes use `/api/v1/pro/...` and `/api/v1/competitive/...` prefixes
- [x] Existing K-12 routes keep `/api/...` (no breaking changes)

---

## 3. Per-Language Content Pipeline (mirror of CONTENT_PIPELINE.md 6-phase pattern)

Every new language / track follows this 9-phase pipeline. Same shape as Math, just different models.

| Phase | What                                                          | Artifact / Check                                            |
|-------|---------------------------------------------------------------|-------------------------------------------------------------|
| Ph0   | Scope + module map + EXPECTED entries in `auditProTrack.mjs`  | Doc commit                                                   |
| Ph1   | Track skeleton (`ProTrack` + `ProModule` seed)                | `seedXxxModules.js`                                          |
| Ph2   | Topic content (`ProTopic` from each `topic.json`)             | `seedXxxTopics.js`                                           |
| Ph3   | Exercises + projects (`ProExercise` + `ProProject`)           | `seedXxxExercises.js`                                        |
| Ph4   | Visual aids / diagrams / algorithm visualizers                | Components in `frontend/src/components/pro/visualizers/`     |
| Ph5   | Prerequisite DAG (from `topic.json.metadata.prerequisites`)   | DAG validation script                                        |
| Ph6   | RAG chunks for AI tutor                                       | `indexProTrack.mjs`                                          |
| Ph7   | Convenience runner (`seed:pro-<lang>-all` chains all phases)  | npm script                                                   |
| Ph8   | Audit (`npm run audit:pro --track=<key>` exits 0)             | Audit script                                                 |
| Ph9   | Frontend wiring (course page + topic view + exercise runner)  | `pages/professional/<Lang>Course.jsx` etc.                   |

---

## 4. Code Execution Sandbox (CRITICAL — blocks every pro track)

Without code execution, the entire professional track is just MCQs in a different folder. This must be decided first.

### 4.1 Options

| Option                | Cost            | Latency | Pros                                            | Cons                                          |
|-----------------------|-----------------|---------|-------------------------------------------------|-----------------------------------------------|
| **Self-host Judge0**  | Free (compute)  | 200ms   | No per-call cost, Oracle box already provisioned| Ops burden, Docker compose, security hardening|
| Piston (api2.piston)  | Free public API | 500ms   | Zero setup                                      | Rate limited, not reliable for production     |
| Judge0 CE (paid)      | $20/mo+ tiers   | 100ms   | Managed, scales                                 | Per-call cost                                 |
| Sphere Engine         | Enterprise      | 100ms   | Mature                                          | Expensive                                     |
| Custom Docker exec    | Free (compute)  | 300ms   | Full control                                    | Re-inventing Judge0                            |

**Recommendation:** Self-host Judge0 in Docker on the Oracle Cloud box (`144.24.154.247`). Same machine that runs nginx + backend today.

### 4.2 Sandbox checklist

- [ ] Decide: Judge0 self-hosted vs Piston for v1 (see §11.2)
- [ ] Provision Judge0 via `docker-compose.judge0.yml`
- [ ] Add `services/codeExecutionService.js` (wraps Judge0 REST API)
- [ ] Rate limit per user (e.g. 30 runs/hour, 100 runs/day)
- [ ] Per-language limits: Java 5s CPU / 256MB RAM; Python 3s / 128MB
- [ ] Disable network egress from inside sandbox
- [ ] Output truncation (first 8KB only)
- [ ] Result schema: `{ stdout, stderr, exitCode, timeMs, memoryKb, status }`
- [ ] Test-case runner: each `test_case.must_contain` / `must_compile` becomes a sandbox call

### 4.3 Supported languages roadmap

| Language    | Judge0 ID | Priority | Status   |
|-------------|-----------|----------|----------|
| Java 17     | 91        | P0       | LIVE (Hetzner CX23, acceptance 19/19 PASS 2026-05-26) |
| Python 3.11 | 71        | P1       | Pending  |
| JavaScript  | 93        | P1       | Pending  |
| C++17       | 76        | P2       | Pending  |
| Go          | 95        | P2       | Pending  |
| TypeScript  | 94        | P3       | Pending  |
| Rust        | 73        | P3       | Pending  |

---

## 5. Frontend Architecture

### 5.1 Routes

```
/learn                        → existing school dashboard
/pro                          → professional track picker
/pro/<track-slug>             → course landing (e.g. /pro/java)
/pro/<track-slug>/m<n>        → module overview
/pro/<track-slug>/m<n>/t<n>   → topic view (teaching content)
/pro/<track-slug>/exercise/<id> → Monaco editor + Run button
/pro/<track-slug>/project/<id>  → project view + submission
/competitive                  → competitive exam picker (later)
/competitive/<exam>           → exam landing (later)
```

### 5.2 Pages to add (per track, reusable shell)

- [x] `pages/professional/ProTrackPicker.jsx`
- [x] `pages/professional/ProCourseLanding.jsx` (modules grid)
- [x] `pages/professional/ProModuleView.jsx` (topics list)
- [x] `pages/professional/ProTopicView.jsx` (rendered `topic.json`)
- [x] `pages/professional/ProExerciseRunner.jsx` (Monaco + sandbox)
- [ ] `pages/professional/ProProjectView.jsx`
- [x] `pages/professional/ProDashboard.jsx` (XP, streak, progress per track) — as `ProDashboardSnapshot` in Dashboard + `DashboardSwitch.jsx`

### 5.3 Components

- [x] `components/pro/CodeEditor.jsx` (Monaco wrapper)
- [x] `components/pro/TestRunner.jsx` (runs tests, shows pass/fail)
- [x] `components/pro/SyntaxBreakdown.jsx` (renders annotated code from `topic.json`)
- [x] `components/pro/HintBox.jsx` (progressive hints)
- [x] `components/dsa/` (DSA visualizers — 45 sandbox kinds, see §7 + ROADMAP.md Phase 1.A)

### 5.4 Design constraints (from existing memory)

- Must match `Dashboard.jsx` style — same cards, typography, spacing
- No max-w-* / mx-auto on page roots (27-inch monitor user)
- Fluid grids + responsive padding only

---

## 6. Java Track — Concrete Rollout Checklist (PILOT)

Source content lives at `C:\Users\LENOVO\Downloads\codequest_java_curriculum_M1_M46\codequest_content\java\modules`.

**46 modules / 209+ topics / 3,135+ exercises / 4 tracks (Core, Spring/Cloud, DSA, Interview Prep).**

### 6.1 Pilot (2-day end-to-end proof)

- [x] Pick one topic — `m1_fundamentals/t1_hello_world`
- [x] Seed it into `ProTrack` + `ProModule` + `ProTopic` + `ProExercise`
- [x] Stand up Judge0 in Docker (Hetzner CX23 VM, acceptance 19/19 PASS 2026-05-26)
- [x] Wire `/api/v1/pro/java` GET endpoint returning the topic
- [x] Build `ProTopicView.jsx` and `ProExerciseRunner.jsx`
- [x] User can: open topic → read teaching → solve exercise → see green check
- [x] **Gate passed — proceeded to full import (ALL 46 modules LIVE 2026-05-26)**

### 6.2 Full Java import (after pilot passes)

- [x] Ph0: write `auditProJavaChecklist.mjs` with EXPECTED 46 modules / 232 topics
- [x] Ph1: `seedJavaModules.js` — walks `m*/` folders → ProModule (46 modules)
- [x] Ph2: `seedJavaTopics.js` — walks `m*/topics/t*/topic.json` → ProTopic (232 topics)
- [x] Ph3: `seedJavaExercises.js` — walks `m*/topics/t*/exercises.json` → ProExercise (3311); walks `project.json` → ProProject (232)
- [x] Ph4: visualizers built — 45 sandbox kinds wired to M30–M41 DSA + M2/M4 JVM/recursion via `VisualizerShell.jsx` in `components/dsa/`
- [x] Ph5: build DAG from `metadata.prerequisites` in each `topic.json` — `config/seedJavaTopicDAG.mjs` (232 nodes, 419 edges, 0 cycles, 0 dangling refs; 2026-06-01)
- [x] Ph6: RAG index — chunk teaching content + exercises for AI tutor — `scripts/buildRagFromProTrack.js` (232 topics → 911 chunks: 232 overview + 679 concept; subject="Java", grade="pro"; 2026-06-01)
- [x] Ph7: `npm run seed:pro-java-all` (idempotent, walks all 46 module folders)
- [x] Ph8: `npm run audit:pro --track=pro_java` exits 0 (232/232 topics, exercises have non-empty testCases[])
- [x] Ph9: `/pro/java` route fully navigable (all pages + DashboardSwitch/PracticeSwitch/BookmarksSwitch wired)

### 6.3 Track-level features

- [x] XP system (each exercise has `xp_reward` — 168,365 XP across 46 modules)
- [x] Streak system (daily activity) — `ProProgress.currentStreak/longestStreak`, advanced in `submitExercise` (2026-05-30); spaced-repetition review queue added (Phase 2.F, 2026-06-02)
- [x] Certificate on track completion — track-branched: pro gets purple XP/exercises cert (2026-05-30)
- [x] Progress visible on main dashboard — ProDashboardSnapshot + DashboardSwitch + review-due nudge (2026-06-02)
- [x] AI tutor scoped to Java track context — **DONE** (Phase 1.B): `tutorService.js` + `tutorPrompts.js` + `TutorPanel.jsx`; `POST /v1/pro/tutor/ask` (Socratic, never gives the answer)
- [x] Pattern Recognition (Phase 1.C) — `pattern_match` type + `PatternDrill`; 20 exercises; `acceptance:pro-java-v3` 16/16
- [x] Complexity Derivation (Phase 2.D) — `complexity-plot` visualizer on M29-T1 + SortingSandbox
- [x] Spaced Repetition (Phase 2.F) — SM-2 lite, `/pro/review`; `acceptance:pro-review` 16/16
- [x] Problem-First Reveal (Phase 2.G) — `revealStrategy`/`problemTitle`, 11 topics gated
- [~] Bitwise (D3.1) / Recursion Patterns (D3.2) / Pattern Atlas (D3.4) / Free tier (D5.1) — parallel session, files present + compiling, **pending round-trip verification** per `PRO_EXERCISE_TYPE_CHECKLIST.md`

---

## 7. DSA Visualizer Sub-Track (log2base2 style)

The `Downloads/dsa` folder contains a **vision document** (not built code). It lists 28 features (12 phases + 16 missing tasks like Debugging Visualizer, Spaced Repetition, VS Code Extension, Algorithm Genealogy Map, Recursion Unroller, "What If" Edge Case Explorer, Forgetting Curve, Worked→Faded→Independent Progression, Real-World Application Layer, Anti-Pattern Library, etc.).

**Decision: ship in phases, not all-at-once.**

### 7.1 Phase A — Static DSA content (ships first)

- [ ] Seed Java M29–M41 (DSA1–DSA13) as part of the Java pro track
- [ ] No visualizers yet, just text + exercises
- [ ] Validates the platform works for DSA content at all

### 7.2 Phase B — Reusable algorithm visualizers (the log2base2 moat)

Build one React component per algorithm family. SVG + state. Each takes `{ input, speed }` props.

- [x] `<SortingVisualizer algo="bubble|merge|quick|heap" />` — `SortingSandbox.jsx` (sorting-sandbox kind)
- [x] `<SearchVisualizer algo="linear|binary" />` — `BinarySearchSandbox.jsx`, `RotatedSearchSandbox.jsx`, `SearchOnAnswerSandbox.jsx`
- [x] `<LinkedListVisualizer ops={...} />` — `LinkedListSandbox`, `DoublyLLSandbox`, `CircularLLSandbox`, `FloydCycleSandbox`, `MergeLLSandbox`
- [x] `<TreeVisualizer type="bst|trie" />` — `TreeSandbox`, `TreeTraversalSandbox`, `TrieSandbox`, `LCASandbox`, `TreePathSandbox`
- [x] `<HeapVisualizer type="min|max" />` — `HeapSandbox`, `KLargestSandbox`, `PQLazySandbox`, `KWayMergeSandbox`
- [x] `<GraphVisualizer algo="bfs|dfs|dijkstra|topo|union-find" />` — `GraphSandbox`, `GraphDijkstraSandbox`, `GraphTopoSandbox`, `UnionFindSandbox`, `IslandsSandbox`
- [x] `<StackQueueVisualizer />` — `StackSandbox`, `QueueSandbox`, `MonotonicStackSandbox`, `SlidingWindowMaxSandbox`
- [x] `<HashTableVisualizer />` — `HashTableSandbox`, `HashGroupingSandbox`, `HashDedupSandbox`, `CustomHashSandbox`, `LRUSandbox`
- [x] `<RecursionTreeVisualizer />` — `RecursionSandbox` (CallStackVisualizer — D1.2); `MemoryModelSandbox` (JVMMemoryVisualizer — D1.1)
- [x] `<DPGridVisualizer />` — `LCSGridSandbox`
- [x] Each topic that has a visualizer in `topic.json.visualizer` references the kind string; wired via `seedJavaPilot.js` TOPIC_VISUALIZERS map; dispatched by `VisualizerShell.jsx`
- [x] **45 sandbox kinds LIVE** across 47 DSA + JVM topics. All sandboxes lazy-loaded in VisualizerShell. All 36 algorithm-driven sandboxes have live HighlightedCode line stepping (D1.3b + D1.3c). Additional primitives: ArrayInsertSandbox (array-insert), sliding-window family, dp/string/array pattern sandboxes.

### 7.3 Phase C — Advanced (deferred)

- [ ] Step-debugger (paste code → instrumented trace → animation)
- [ ] Recursion Unroller (recursive ↔ iterative side-by-side)
- [ ] "What If" Edge Case Explorer (buttons: sorted, duplicates, empty, single)
- [ ] Anti-Pattern Library (animated wrong approaches)
- [ ] Algorithm Genealogy Map (relationships between algos)

### 7.4 Phase D — Out of scope for v1 (park in docs)

- VS Code extension
- Certification system with peer review
- Spaced repetition forgetting curve UI
- Algorithm Horror Stories (Knight Capital, NASA, Heartbleed)
- 100 Days Challenge + shareable mechanics
- Complexity Budget Tool
- Domain-Specific Tracks (ML / game dev / DB / security)

---

## 8. Reusable Per-Track Checklist Template

> Copy this section verbatim into a new `PRO_<TRACK>_CHECKLIST.md` when starting any new track (Python, AWS, DevOps, System Design, USMLE, GRE, TOEFL, UPSC, IIT, NEET).

```
## Track: <NAME>  (track key: <pro_xxx | comp_xxx>)

### Pre-flight
- [ ] Source content folder identified and audited
- [ ] Content quality check: every topic has teaching + exercises + (optional) project
- [ ] Schema mapping documented: source JSON → ProTopic fields
- [ ] Decision: reuse existing models OR new discriminator

### Phase 0 — Scope
- [ ] auditPro<Track>Checklist.mjs with EXPECTED module count, topic count, exercise count
- [ ] Module map written to docs

### Phase 1 — Modules
- [ ] seed<Track>Modules.js
- [ ] npm script: seed:pro-<track>-modules
- [ ] Run + verify count in DB

### Phase 2 — Topics
- [ ] seed<Track>Topics.js
- [ ] Run + verify count

### Phase 3 — Exercises + Projects
- [ ] seed<Track>Exercises.js
- [ ] Each exercise validated against test schema
- [ ] Run + verify count

### Phase 4 — Visual aids
- [ ] Identify topics needing diagrams / visualizers
- [ ] Reuse existing components where possible

### Phase 5 — DAG
- [ ] Build prerequisite DAG
- [ ] No cycles, no orphan topics

### Phase 6 — RAG
- [ ] indexPro<Track>.mjs
- [ ] AI tutor scoped correctly

### Phase 7 — Convenience runner
- [ ] npm run seed:pro-<track>-all

### Phase 8 — Audit
- [ ] npm run audit:pro --track=pro_<track> exits 0
- [ ] Track isolation: validate:track-isolation exits 0

### Phase 9 — Frontend
- [ ] /pro/<track-slug> route wired
- [ ] Topic view renders teaching content correctly
- [ ] Exercise runner works against sandbox
- [ ] Project view renders requirements

### Sign-off
- [ ] Manual QA: complete one topic end-to-end as a fresh user
- [ ] Update CONTENT_STATUS.md
- [ ] Update BLUEPRINT.md
- [ ] Update PROFESSIONAL_TRACKS_BLUEPRINT.md (this file) — mark track as LIVE
```

---

## 9. Future Tracks Queue

Order is suggestion, not commitment. Reorder based on demand.

| Order | Track key            | Type          | Source content     | Notes                                              |
|-------|----------------------|---------------|--------------------|----------------------------------------------------|
| 1     | `pro_java`           | professional  | CodeQuest 46 mods  | PILOT — see §6                                     |
| 2     | `pro_python`         | professional  | TBD                | Easiest second language to add (same shape)        |
| 3     | `pro_dsa_visual`     | professional  | DSA vision .rtf    | The visualizer-first DSA course (§7)               |
| 4     | `pro_system_design`  | professional  | TBD                | No code execution needed — diagram + writeup       |
| 5     | `pro_aws`            | professional  | TBD                | Console sandbox tricky — lean on quizzes + labs    |
| 6     | `pro_devops`         | professional  | TBD                | Docker / K8s / CI-CD; need terminal sandbox        |
| 7     | `pro_web_dev`        | professional  | TBD                | JS / React / Node — preview iframes                |
| 8     | `comp_iit_jee`       | competitive   | PYQ bank           | Reuse PYQ routes; add timed mock paper UI          |
| 9     | `comp_neet`          | competitive   | PYQ bank           | Same as JEE                                        |
| 10    | `comp_upsc`          | competitive   | PYQ bank           | Essay grading is a wildcard — defer or LLM-grade   |
| 11    | `comp_usmle`         | competitive   | TBD                | International — needs medical-grade content review |
| 12    | `comp_gre`           | competitive   | TBD                | Reuse adaptive engine                              |
| 13    | `comp_toefl`         | competitive   | TBD                | Speaking section needs audio capture               |
| 14    | `pro_ml`             | professional  | TBD                | Notebook execution sandbox (Jupyter kernel)        |

---

## 10. Track-Wise UX Differences

Not every track has the same shape. Document upfront so we don't over-fit on Java.

| Track type        | Has code exec | Has timed exam | Has projects | Has visualizers | Has video |
|-------------------|---------------|----------------|--------------|-----------------|-----------|
| pro_java          | YES           | optional       | YES          | YES (DSA only)  | optional  |
| pro_python        | YES           | optional       | YES          | YES (DSA only)  | optional  |
| pro_dsa_visual    | YES           | optional       | NO           | YES (core)      | optional  |
| pro_system_design | NO            | NO             | YES (writeup)| YES (diagrams)  | YES       |
| pro_aws           | YES (CLI sim) | optional       | YES (labs)   | YES (arch)      | YES       |
| pro_devops        | YES (terminal)| NO             | YES (labs)   | YES (arch)      | YES       |
| comp_iit_jee      | NO            | YES (core)     | NO           | YES (physics)   | optional  |
| comp_neet         | NO            | YES (core)     | NO           | YES (biology)   | optional  |
| comp_upsc         | NO            | YES (core)     | YES (essays) | NO              | YES       |
| comp_usmle        | NO            | YES (core)     | NO           | YES (anatomy)   | YES       |

---

## 11. Decisions — LOCKED 2026-05-25

All blocker decisions approved by Najeeb 2026-05-25. See `PRO_TRACK_PLAN.md` §3 for the full nine-row decision table including UX-flow items (#7–#9). Summary below:

### 11.1 Reuse `NcertChapter` / `NcertTopicContent` vs new `Pro*` models
- **LOCKED: B — new `Pro*` models** in `models/proModels.js`. Clean separation from K-12.

### 11.2 Code execution sandbox provider
- **LOCKED: Self-host Judge0** on Oracle Cloud (`144.24.154.247:2358`) via Docker Compose.

### 11.3 User model — `tracks[]` array vs single `currentTrack`
- **LOCKED: `tracks: [{ key, role, enrolledAt }]` array.** Users may be enrolled in multiple tracks simultaneously.

### 11.4 Pricing model for professional tracks
- **Still PENDING** — out of scope of pilot. Defer to a separate pricing decision.

### 11.5 Where does the Java content live in git?
- **LOCKED: A — commit into repo** at `ai-learning-backend/backend/content/pro/java/**`. Use git-lfs if size exceeds 200MB.

### 11.6 Pilot rollout gating
- **LOCKED: Internal only.** Feature flag `PRO_TRACKS_ENABLED_FOR_EMAILS` (env-var allowlist; Najeeb + Salma only) gates `/api/v1/pro/*` and `/pro/*` routes during pilot.

### 11.7 Onboarding flow
- **LOCKED: New `/welcome` audience picker** after `/register`, before track-specific onboarding. Three audience cards: School / Professional / Competitive.

### 11.8 Register form
- **LOCKED: Strip grade + examDate** from `Register.jsx`. Those fields move into school-specific onboarding only.

### 11.9 Parent-vs-self model for pro tracks
- **LOCKED: Pro/competitive learner is always `user` themselves.** Never a `linkedStudent`. School track keeps the existing parent → child model.

### 11.10 Dashboard merge
- **LOCKED: Single `Dashboard.jsx` with `<TrackTabs />` switcher.** Active track persisted via `?track=<key>` URL param.

---

## 12. Cross-Cutting Concerns

### 12.1 Security
- [ ] Code execution sandbox: no network, no filesystem write outside `/tmp`, no fork bombs (process limit), no infinite loops (CPU timeout)
- [ ] Rate limit per user across all sandbox calls
- [ ] User code never logged in plaintext (PII risk)
- [ ] Track isolation enforced on every endpoint (analogue of board isolation)

### 12.2 Performance
- [ ] Topic content cached (Redis, 1h TTL) — already proven with K-12
- [ ] Module list cached
- [ ] Sandbox responses NEVER cached (always fresh)
- [ ] Pagination on long module lists (46 modules for Java)

### 12.3 Testing
- [ ] Each new service function gets a Jest test in `__tests__/`
- [ ] Sandbox integration test against a known-good Hello World per language
- [ ] Track isolation tests (user enrolled in `pro_java` cannot see `pro_python` content)

### 12.4 Analytics
- [ ] Per-topic completion rates
- [ ] Per-exercise pass/fail/skip rates → flag broken exercises
- [ ] Per-user XP / streak / time-spent
- [ ] Cohort retention by track

---

## 13. References

- Existing K-12 content pipeline: `CONTENT_PIPELINE.md`
- Existing board isolation pattern: `utils/boardFilter.js`
- Existing schemas to model after: `ncertChapterModel.js`, `ncertTopicContentModel.js`
- Java source content (external, to be imported): `C:\Users\LENOVO\Downloads\codequest_java_curriculum_M1_M46\codequest_content\java\modules`
- DSA vision document (external, archived): `C:\Users\LENOVO\Downloads\dsa\dsa\Untitled.rtf`
- Project blueprint: `BLUEPRINT.md`
- Content status tracker: `CONTENT_STATUS.md`

---

## 14. Changelog

| Date       | Change                                                                 |
|------------|------------------------------------------------------------------------|
| 2026-05-25 | Initial draft. Java pilot, DSA visualizer sub-track, future track queue, open decisions documented. |
| 2026-05-25 | All 9 pre-flight decisions LOCKED (#11.1–#11.10, except #11.4 pricing which is deferred). Implementation cleared to begin Day 1 of pilot. |
| 2026-05-25 | **Java pilot — code complete.** Phases 1–10 shipped in 8 commits (43219723 → 7b896a52). 1 ProTrack (pro_java), 1 module, 1 topic (java_m1_t1 Hello World & Setup), 15 exercises, 1 project. Backend: 9 endpoints under /api/v1/pro/* with auth + email-allowlist + per-user Redis rate limit. Sandbox: local Judge0 via docker compose, isolated to 127.0.0.1. Frontend: 5 pages, Monaco editor lazy-chunked, TrackTabs in Dashboard, Welcome + ProOnboarding signup flow. Tests: 32 new (430/430 total). Phase 11 acceptance + tag pending Docker install. |
| 2026-05-30 | **Pro-track UX polish + performance (commits a69abd08 + 9d44bc65).** Backend: proAnalyticsService .toObject() crash fixed; authController register with grade/examBoard null; userRoutes Redis cache /user/me (30s) + /user/nav (60s); proService Redis cache topic + exercises (5 min TTL). Frontend: Analytics/Certificate/Layout/Profile/Planner all pro-track aware; VisualizerShell all 45 sandboxes lazy-loaded with SortingSandbox extracted; ProTopicView prefetches VisualizerShell; vite.config warmup + optimizeDeps. TrackSwitcher + TrackTabs + DashboardSwitch + PracticeSwitch + BookmarksSwitch shipped; trackStore with hydration flag + refreshNav guard. |
