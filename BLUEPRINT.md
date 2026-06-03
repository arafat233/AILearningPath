# AILearningPath — Complete Project Blueprint
> Paste this into Claude.ai so it has full context without needing the zip.
>
> **Track expansion:** Stellar now spans three tracks — `school` (K-12, LIVE), `professional` (Java **ALL 46 modules LIVE**: 232 topics / 3311 exercises / 232 projects / 168,365 XP), `competitive` (IIT/NEET/UPSC/USMLE/GRE/TOEFL, planned). See `PROFESSIONAL_TRACKS_BLUEPRINT.md` for the master multi-track checklist and `PRO_TRACK_PLAN.md` for the Java pilot integration plan (§9 build completion log).
>
> **Post-v2.1 feature roadmap:** see `ROADMAP.md` for Phase 1 (visualizer + AI Socratic tutor + pattern recognition), Phase 2 (complexity derivation, job market layer, spaced repetition, interview simulator), and Phase 3 (rolling deep visualizations + missing content). Update that doc after each completed task.
>
> Last updated: 2026-06-03 — **AP SSC Class 8 Mathematics ALL PHASES COMPLETE.** 16 NcertChapters, 56 topics (full 15-field content), 280 MCQ, 56-node topic DAG (acyclic, 0 dangling), 265 RAG chunks, 56/56 audit PASS — full parity with AP SSC Math 9/10. `ap_ssc_math8_*` prefix, board AP_SSC. Note: no `DiagramLibrary` collection exists in this app — every Math grade ships 1 in-content `svg_diagram` per topic (that IS Ph4). Previous: 2026-06-02 — **Pro Java Phase 1/2/3 capabilities shipped (verified).** Pattern Recognition (1.C), AI Socratic Tutor (1.B), Complexity Derivation (2.D), Spaced Repetition (2.F), Problem-First Reveal (2.G), Interview Simulator (H), Recursion-Tree visualizer (I1), Community Discussions (D5.3), Pattern Atlas (D3.4), free tier (D5.1); parity modules M47 Bitwise (D3.1), M48 Recursion Patterns (D3.2), M49–M51 (J1–J3). All round-trip-verified per `PRO_EXERCISE_TYPE_CHECKLIST.md` (born from the `_pm_` 422 incident — build+seed green ≠ route works). Tutor + Interview live-acceptance (B10/H9) pending a valid `ANTHROPIC_API_KEY`. Previous: 2026-06-01 — Content Status Audit; CBSE Math 1–7 at 8/15; CBSE 8–10/ICSE 9–10/AP SSC 9–10 ALL PHASES COMPLETE; Pro Java 46 modules ALL 9 PHASES.

---

## 1. WHAT THIS IS

An AI-powered exam preparation platform for Indian school students. Supports CBSE
(grades 1–10), ICSE (Classes 9–10), and AP SSC (Andhra Pradesh SSC, Classes 8–10) boards.
Students practice questions, get AI-generated explanations for mistakes, follow a
smart study planner, compete live against each other, and receive personalised
lessons — all driven by a behavioural analysis engine that tracks HOW they think,
not just whether they're right. Board isolation is enforced throughout: every content
endpoint filters by the student's `examBoard`, powered by `utils/boardFilter.js`.

**Supported boards and topicId prefixes:**
| Board    | topicId prefix    | Status                  |
|----------|-------------------|-------------------------|
| CBSE     | `cbse_*`, `math*_`, `sci_*`, `eng_*`, `hin_*`, `sst_*` | Grades 1–10, Math + Science + English + Hindi + SST |
| ICSE     | `icse_math10_*`, `icse_math9_*` | Class 10 Math ALL PHASES COMPLETE (25 ch, 100 topics, 1600 Qs, 60 SVG diagrams); Class 9 Math ALL PHASES COMPLETE (28 ch, 112 topics, 1792 Qs, 48 SVG diagrams) |
| AP_SSC   | `ap_ssc_math8_*`, `ap_ssc_math9_*`, `ap_ssc_math10_*` | Class 8 Math ALL PHASES COMPLETE (16 NcertChapters, 56 topics, 280 Qs, 56 SVG diagrams, 56-node DAG, 265 RAG chunks, 56/56 audit); Class 9 Math ALL PHASES COMPLETE (Ph1 12 NcertChapters, 35 topics, 560 Qs, 35 SVG diagrams, 229 RAG chunks, 35/35 audit); Class 10 Math ALL PHASES COMPLETE (Ph1 14 NcertChapters, 54 topics, 1140 Qs, 884 RAG chunks, 54/54 audit) |
| SSC      | `ssc_*`           | Planned |
| IB       | `ib_*`            | Planned |

Stack: React (Vite) + Express + MongoDB + Claude Haiku 4.5 + Socket.IO

### 1.1 Content Pipeline Status (2026-06-01)

**AUDIT SUMMARY** — Run `npm run audit:math --board=CBSE --grade=N` to verify any grade.

| Board  | Grade | Topics | Qs    | Ph0–Ph4 | Ph5   | Ph6   | Ph7 | Ph8      | Ph9 | Status |
|--------|-------|--------|-------|---------|-------|-------|-----|----------|-----|--------|
| CBSE   | 10    | 54     | 503   | ✅      | ✅    | ✅    | ✅  | ✅ 54/54 | ✅  | 🎉 COMPLETE |
| CBSE   | 9     | 30     | ~900  | ✅      | ✅    | ✅    | ✅  | ✅ 30/30 | ✅  | 🎉 COMPLETE |
| CBSE   | 8     | 56     | 627   | ✅      | ✅    | ✅    | ✅  | ✅ 56/56 | ✅  | 🎉 COMPLETE |
| CBSE   | 7     | 60     | ~810  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/60  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 6     | 40     | ~660  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/40  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 5     | 56     | ~600  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/56  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 4     | 56     | ~540  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/56  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 3     | 56     | ~480  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/56  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 2     | 60     | ~420  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/60  | ✅  | ⚠️ v2 format (8/15 checks) |
| CBSE   | 1     | 52     | ~360  | ✅      | ⚠️    | ✅    | ✅  | ❌ 0/52  | ✅  | ⚠️ v2 format (8/15 checks) |
| ICSE   | 10    | 100    | 1600  | ✅      | ✅    | ✅    | ✅  | ✅ 100/100 | ✅ | 🎉 COMPLETE |
| ICSE   | 9     | 112    | 1792  | ✅      | ✅    | ✅    | ✅  | ✅ 112/112 | ✅ | 🎉 COMPLETE |
| AP SSC | 10    | 54     | 1140  | ✅      | ✅    | ✅    | ✅  | ✅ 54/54 | ✅  | 🎉 COMPLETE |
| AP SSC | 9     | 35     | 560   | ✅      | ✅    | ✅    | ✅  | ✅ 35/35 | ✅  | 🎉 COMPLETE |
| AP SSC | 8     | 56     | 280   | ✅      | ✅    | ✅    | ✅  | ✅ 56/56 | ✅  | 🎉 COMPLETE |
| CBSE   | Sci 10 | 55    | 257   | ✅      | ✅    | ✅    | ✅  | ✅ 55/55 | ✅  | 🎉 COMPLETE |
| CBSE   | Eng 10 | 35    | 256   | ✅      | ✅    | ✅    | ✅  | ✅ 35/35 | ✅  | 🎉 COMPLETE |
| CBSE   | Hi 10  | 32    | 129   | ✅      | ✅    | ✅    | ✅  | ✅ 32/32 | ✅  | 🎉 COMPLETE |
| CBSE   | SST 10 | 61    | 359   | ✅      | ✅    | ✅    | ✅  | ✅ 61/61 | ✅  | 🎉 COMPLETE |

**Key notes:**
- **v2 format gap** (CBSE Math 1–7): Missing 7/15 content fields (key_formulas, prerequisite_knowledge, visual_description, svg_diagrams, when_to_use_this_method, edge_cases, video_script_hooks). Benchmark density = CBSE Math 10 (54/54 audit pass). Current: 8/15 checks pass. **Decision pending** — v3 enrichment or accept v2 as baseline for K-8.
- **Ph5 DAG status**: Classes 1–7 use chapter-level DAG nodes (math1_ch1, math1_ch2, etc.), not topic-level prerequisites. Adequate for recommendations but not full prerequisite chains.
- **Pro Java Pilot**: 46 modules, 232 topics, 3311 exercises, 168,365 XP — ALL 9 PHASES COMPLETE 2026-06-01. Ph5 DAG ✅ (232 nodes, 419 edges, 0 cycles). Ph6 RAG ✅ (911 chunks). Scripts: `npm run audit:pro-java-dag`, `npm run rag:build-pro-java`.
- **Pro Java — Phase 1/2 capabilities (verified, 2026-06-02):**
  - **Pattern Recognition** (Phase 1.C): `pattern_match` exercise type (no sandbox — pick the algorithm pattern), 20 seeded across M30/33/37/41, `PatternMatchRunner` + `PatternDrill` quick-fire. `npm run seed:pattern-match`, `npm run acceptance:pro-java-v3` (16/16).
  - **Complexity Derivation** (Phase 2.D): `complexity-plot` visualizer — measured ops-vs-n with reference-curve overlays + "guess the curve". Wired to M29-T1; embedded in SortingSandbox. `components/dsa/ComplexityPlot.jsx`.
  - **Spaced Repetition** (Phase 2.F): SM-2 lite (`1→3→7→14→30→90d`) via `ProProgress.topicReviews[]`; `GET /v1/pro/review/due` + `POST /v1/pro/review/:topicId`; `/pro/review` page + dashboard nudge. `npm run acceptance:pro-review` (16/16).
  - **Problem-First Reveal** (Phase 2.G): `ProTopic.revealStrategy`/`problemTitle`; 11 topics gate teaching behind a Reveal button; `POST /v1/pro/topics/:id/reveal` telemetry.
  - **AI Socratic Tutor** (Phase 1.B): `tutorService`/`tutorPrompts` + `TutorPanel`; `POST /v1/pro/tutor/ask`, session + rate routes. Unit-tested (`tutorService.test.js`). Live acceptance (B10) pending a valid `ANTHROPIC_API_KEY`.
  - **Interview Simulator** (Phase H): `ProInterviewSession` + `interviewService`/`interviewPrompts`; 25-problem bank (`data/interviewProblems.js`); routes under `/v1/pro/interview`; `InterviewLanding`/`InterviewSimulator`/`InterviewHistory` (45-min timer, scratchpad, AI interviewer, post-session rubric). Unit-tested (`interviewService.test.js`). Live acceptance (H9) pending a valid `ANTHROPIC_API_KEY`.
  - **Recursion-Tree visualizer** (Phase I1): `recursion-tree` kind — N-ary call tree with memo-hit/pruned states; 3 demos (naive fib, memoised fib, subsets backtracking). Wired to M40-T1 (subsets) + M41-T1 (fib_memo). `RecursionTreeVisualizer.jsx` + `recursionTree.js`. Browser-verified.
  - **Community Discussions** (D5.3): `ProTopicDiscussion` (threads + replies + upvotes, durable); `discussionService` + 5 routes under `/v1/pro`; `TopicDiscussion.jsx` on ProTopicView. Enrollment-gated, author-only delete. `npm run acceptance:pro-discussion` (full lifecycle + 403 + auth gate).
- **Pro Java — parity modules + pages (verified, 2026-06-02):** Bitwise M47 + `BitwiseVisualizer` (D3.1), Recursion Patterns M48 (D3.2), Pattern Atlas `/pro/java/patterns` (D3.4), free-tier 10 lighthouse topics + `/pro/preview/:topicId` public view (D5.1), Modern Java M49 / Engineering Hygiene M50 / Technical Communication M51 (J1–J3). All round-trip-verified per `PRO_EXERCISE_TYPE_CHECKLIST.md`.
- **DSA Animator gap-closure (2026-06-03):** 40 new exercises (`seedDsaAnimatorGapsA/B.js`) closing the dsaanimator.com problem set; new module **M41.5 "DSA: Greedy & Intervals"** (Gas Station, Candy, Insert/Non-overlapping/Min-Arrows). Validator regex broadened to `_m\d+(_\d+)?_t\d+` so decimal modules (`m30_5`, `m41_5`) are reachable. **Expansion (2026-06-03):** +6 beginner easies in M30 (`seedDsaAnimatorEasies.js`: #832/#1470/#1480/#1672/#1929/#2239) and M41.5 rounded out (`seedM415Extras.js`: Merge Intervals #56, Meeting Rooms II #253, Assign Cookies #455, Lemonade Change #860). See `DSA_ANIMATOR_GAP_CHECKLIST.md`.
- **Track-2 interview-prep metadata (2026-06-03):** `ProExercise.priority` (P1/P2/P3), `.pattern`, `.leetcodeId` backfilled across 767 DSA exercises by `config/seedProExerciseMetadata.js` (P1=193/P2=151/P3=423, 33 patterns); surfaced as badges on exercise rows. New **Must-Do / pattern filter** route `GET /v1/pro/tracks/:trackSlug/practice?priority=&pattern=` (`getPracticeList` svc, `practiceQuerySchema` + `validateQuery` middleware, `proGetPractice` api). Unit-tested (`proPractice.service.test.js`, 4/4).
- **Track-2 step-by-step animation player (2026-06-03):** `ProExercise.animation` (Mixed) + `components/pro/StepPlayer.jsx` (shared shell + per-`kind` stages) in `ProExerciseRunner`. 5 renderers — **array-pointers**, **stack**, **grid**, **linked-list**, **tree** (heap reuses tree, DP reuses grid). **100% coverage: all 598 animatable DSA problems** animated (`config/seedAnimationCoverage1..24.js`), audited by `config/auditAnimations.mjs` (0 broken). Play/pause/step/scrub.
- **Track-2 edge-case catalog (2026-06-04):** `ProExercise.edge_cases` (`[{case, handling}]`, Mixed) rendered as an "Edge cases" card in `ProExerciseRunner` (after Hints). Per-problem catalog across the same 598 animatable DSA problems; authored by `config/seedEdgeCases<N>.js`, audited by `config/auditEdgeCases.mjs` (done/total per pattern + 0 malformed; well-formed = array ≥2, each entry non-empty case+handling). No backend route change — `getExercise` passes the field through via `...safe`. Batch 1: two-pointers + sliding-window FULL.
- **Track-2 Pattern Quiz (2026-06-03):** "which pattern fits?" MCQ — `GET /v1/pro/tracks/:trackSlug/pattern-quiz?n=` (`getPatternQuiz` svc samples real LC-tagged problems, builds 4-choice questions from the `pattern` tags; `patternQuizQuerySchema`; `proGetPatternQuiz` api). `ProPatternQuiz` page at `/pro/:trackSlug/pattern-quiz` (instant feedback + score), linked from the Pattern Atlas header. Unit-tested (`proPractice.service.test.js` now 7/7).
- **Track-2 code-template library (2026-06-03):** `data/proCodeTemplates.js` — Java skeletons for 26 patterns (~34 templates) keyed by the `pattern` tag; `components/pro/TemplatePanel.jsx` (collapsible, Copy + Insert-into-editor) surfaced in `ProExerciseRunner` for the exercise's pattern. Frontend-only, no backend.
- **Track-2 Focus mode + status (2026-06-03):** distraction-free Focus toggle in `ProExerciseRunner` (hides the problem column, widens the editor); **Solved ✓** badges + "(x/N solved)" heading on `ProTopicView` via `proGetProgress`. Completes Track-2 (DSA Animator parity) — all 7 items done; see `DSA_ANIMATOR_GAP_CHECKLIST.md`.
- **Pro visual_aid renderer (2026-06-03):** `components/pro/VisualAid.jsx` turns `teaching.visual_aid` (previously rendered as the raw illustrator brief) into an actual visual — best-first: authored inline **`block.svg`** → auto-parsed **arrow-flow** pipeline (boxes + keyword icons, covers ~114 pro topics with no re-authoring) → styled fallback. **Every pro_java visual_aid (172) now renders as a visual: 114 auto-flow + 58 authored SVGs, 0 prose left.** SVGs seeded by `config/seedProVisualAidSvgs.js` (3 spatial: primitives/precedence/call-stack) + `config/seedProVisualAidSvgsBatch.js` (55 via reusable panels/grid/tree generators) + `seedProVisualAidSvgsBatch2.js` (31 structural: Throwable tree, decision/list traces). **Shape-faithful re-authoring (2026-06-03):** `seedProVisualAidFlowcharts.js` — 5 true **flowcharts with diamond decision boxes** (m1_t4 if/else/switch, m1_t5 for/while/do-while loops, m30_t5/m30_5_t5/m5_t5 decision cascades), fixing topics whose brief said "diamond" but rendered as rectangles. `seedProVisualAidShapes.js` — 8 literal-shape diagrams: **state machines** (m19_t1/m15_t4 circuit breaker, m10_t1 thread lifecycle, m24_t3 saga+compensation), **curve graphs** (m29_t1 six Big-O curves, m25_t4 load/stress/soak, m3_t5 O(N²) vs O(N)), **Venn** (m9_t3 Number ∩ Comparable). `seedProVisualAidScanner.js` — m1_t6 Scanner stdin→buffer→newline-bug→fix. **Full one-by-one audit (2026-06-03):** every Java visual_aid checked brief-vs-render (`JAVA_VISUAL_AID_AUDIT.md`); `seedProVisualAidBatch3.js` re-authors **all 59 remaining mismatches** as faithful diagrams (call-stacks, memory cells, hierarchy/recursion trees, state machines, decision flowcharts, grids/matrices, Big-O curves, bucket/heap/linked-list/queue structures) — each authored from its own brief, render-verified. **M34–M51 coverage (2026-06-03):** these modules were authored without a `visual_aid` (they have `concept_explanation` + `reflection`). `seedProVisualAidBatch4.js` now adds the full `teaching.visual_aid` object to all **73 diagram-worthy** topics (DSA: hash tables, trees/BST/trie, heaps, graphs, sorting, binary search, backtracking, DP, greedy, bitwise, recursion/D&C; plus system design, modern Java, engineering hygiene, and structural interview/communication topics). 19 pure-narrative topics (behavioral stories, mock-timing, company prep) intentionally skipped — see `JAVA_VISUAL_AID_AUDIT_M34.md`. Every pro_java topic that warrants a diagram now has one. **Panel→diagram fix (2026-06-03):** `seedProVisualAidBatch5.js` re-authors the **34** topics that had a generic early-batch "text-in-boxes" SVG even though their brief described a real diagram (flow/arrows/before-after) — e.g. m2_t1 method-call flow, m9_t1 generics, m10_t2 race/lock/volatile, m21_t1–t5 infra pipelines, m23_t1 JWT flow, m26_t2 RAG, m27_t3 DataLoader, m31_t5 LCS table. Root cause of the recurring miss: the audit had treated "has an svg" as "has a real diagram" and bulk-dismissed them; the real test is brief-vs-rendered-shape. **Audit rule going forward: a topic is only "done" if the SVG draws the shape the brief describes — not merely that an svg exists.** Extend via `$set teaching.visual_aid.svg`.

---

## 2. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  Port 5173  │  Zustand auth store  │  Axios API service      │
│                                                              │
│  Pages: Dashboard, Lessons, LessonView, Practice,            │
│         Analytics, Competition, LiveRoom, Planner,           │
│         ExamReview, VoiceTutor, Profile, Settings,           │
│         Onboarding, Login, Register, StartOnboarding,        │
│         Portal                                               │
│                                                              │
│  Admin: /admin → AdminLayout, AdminOverview, AdminUsers,     │
│         AdminQuestions, AdminTopics, AdminCacheStats         │
│                                                              │
│  Components: Layout, BadgeToast, DoubtChat                   │
└────────────────────┬────────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Express + Node)                    │
│  Port 5001  │  JWT auth middleware  │  Rate limiter (300/15m)│
│             │  adminAuth middleware (role === "admin")       │
│             │  validate middleware (Joi, 422 on fail)        │
│             │  errorHandler (AppError + Mongoose + JWT)      │
│             │  helmet (security headers) + morgan (logging)  │
│                                                              │
│  Routes: /api/auth  /api/practice  /api/analysis            │
│          /api/exam  /api/planner   /api/ai                  │
│          /api/user  /api/revision  /api/lessons             │
│          /api/topics  /api/competition  /api/admin          │
│          /api/badges  /api/doubt   /api/portal              │
│          /api/v1/placement-quiz  /api/v1/recommender        │
│          /api/v1/curriculum  /api/v1/ncert  /api/v1/pyq     │
│          /api/v1/bookmarks (collections, SM-2, share, AI)   │
│          /api/v1/profile (heatmap, level, mood, public)     │
│          /api/v1/lessons-v2 (dashboard, search, diagnostic) │
│          /api/v1/analytics-v2 (radar, persona, insights)    │
│          /api/v1/pro-analytics (dashboard, certificate)    │
│          /api/v1/dashboard-v2 (commit, snooze, peer, NBA)   │
│          /api/v1/competition-v2 (rooms, ELO, quests, match) │
│          /api/v1/live-room (theme, friends)                 │
│          /api/health                                         │
│                                                              │
│  Socket.IO: competition room events (join/start/score/end)  │
└───────┬───────────────┬────────────────────────────────────-┘
        │               │
┌───────▼──────┐  ┌─────▼──────────────────────────────────┐
│   MongoDB    │  │          Claude Haiku 4.5               │
│  23 collections│  │  Routed through 7-layer cache system    │
│              │  │  Subject-aware system prompts            │
│              │  │  (free: 10 calls/day, pro: 100/day)     │
└──────────────┘  └────────────────────────────────────────-┘
```

---

## 3. DATABASE — ALL 20 COLLECTIONS

### 3.1 User
```
_id, name, email, password (bcrypt)
examDate, subject, grade, goal
isPaid (bool), plan (free|pro|premium), planExpiry
trialUsed (bool), trialStart (Date)
aiCallsToday, aiCallsDate          ← daily AI quota tracking
role: student|admin|parent|teacher ← role-based access
linkedStudents: [String]           ← child sub-account ObjectIds (multi-child parent flow)
childName, examBoard, schoolName, location ← child profile (collected at onboarding)
  Child sub-accounts use synthetic email  child_<parentId>_<ts>@stellar.child
  Created via POST /api/user/children; excluded from admin stats via $not:/stellar\.child$/
inviteCode: String (sparse unique) ← 8-char student invite code
npsLastShownAt: Date               ← NPS survey throttle (30-day cooldown)
placementCompletedAt: Date         ← set once after placement quiz scored (gates re-take)
studiedNcertTopics: [String]       ← topicIds the student has marked as studied (cross-device)
referredBy: ObjectId (ref: User)   ← referral system: who referred this user
referralCount: Number (default 0)  ← how many users this user has referred
referralRewarded: Boolean (false)  ← prevents double-reward for referrer
studyReminders: [{                 ← parent-set push reminders
  studentId: ObjectId, time: String (HH:MM), days: [Number]
}]
passwordResetToken:   String (SHA-256 hashed, null when not active)
passwordResetExpires: Date   (1h from request, null when not active)
trialExpirySoonSentAt: Date  ← NEW: dedup guard — trial-expiry-soon email sent once per trial
createdAt
```

### 3.23 UserTopicMastery  ← NEW (adaptive recommender state)
```
userId, topicId (e.g. "ch1_s1_c1_t1")
chapterNumber: Number
currentDifficulty: easy | medium | hard
mastery: { easy: Boolean, medium: Boolean, hard: Boolean }
secondsOnTopic: Number (total time spent)
attempts: [{
  questionId, correct, timeTakenSec, difficulty,
  hintsUsed, flukeDetected, misconceptionId, createdAt
}]
updatedAt
Unique index: { userId, topicId }

Mastery rules (from recommender_config.json):
  easy:   4 of last 5 correct
  medium: 5 of last 7 correct AND no misconception in last 3
  hard:   3 of last 5 correct AND ≥8 min on topic AND no fluke in last 3
Fluke: answered correctly but time < guess_below OR correct after 3 consecutive wrongs
```

### 3.22 Coupon  ← NEW
```
code:          String (required, unique, uppercase, trimmed)
discountType:  "percent" | "fixed"
discountValue: Number (min 1)
planFilter:    [String]   ← restrict to specific plan keys; empty = all plans
validUntil:    Date | null
maxUses:       Number (0 = unlimited)
usedCount:     Number (default 0)
isActive:      Boolean (default true)
createdAt:     Date
```

### 3.2 Topic
```
_id, name, subject, grade
prerequisites [String]
examFrequency (0-1), estimatedHours, examMarks
realWorldUse, whyMatters
topicId: String (sparse, e.g. "ch1_s1_c1_t1") ← fine-grained DAG key
level:   Number (0-7) ← DAG depth (0 = no prerequisites)

Subjects seeded: Math, Science, English, Social Science, Hindi (50+ broad topics)
Fine-grained Math topics seeded: 52 nodes (seedTopicDAG.js + seedDesktopContent.js)
  Level 0: Euclid's Lemma, Prime Factorisation, Polynomial basics, AP basics, Similar triangles, Stats/Probability
  Level 7: Two-triangle elevation, Volume of composites
```

### 3.3 Question
```
_id, topic, subtopic, questionText
questionType: mcq | case_based | assertion_reason | pyq | free_text | numeric | numeric_range | fill_blank
difficulty: easy | medium | hard
difficultyScore (0-1), expectedTime (seconds)
conceptTested, prerequisites [String]
isAIGenerated (bool), isFlagged, isPYQ, pyqYear
options: [{ text, type, logicTag }]
  ↳ option types: correct | concept_error | calculation_error |
                  partial_logic | guessing | misinterpretation
solutionSteps [String], shortcut, caseContext
marks, negativeMarks, createdAt

── Adaptive algorithm fields (seeded from JSON question banks) ──
questionId:    String (unique sparse) ← dedup key matching JSON bank ID
topicId:       String ← fine-grained topic e.g. "ch1_s1_c1_t1"
chapterNumber: Number 1-14
bloomLevel:    String (recall|understand|apply|analyse|evaluate|create)
correctAnswer: String ← for numeric/free_text/fill_blank
mixingType:    String (single_topic|within_chapter|cross_chapter)
approachTags:  [String]
hintLevels:    [String] ← 3 progressive hints
timeThresholds: { guessBelow, expectedMin, expectedMax, stuckAbove }
stepByStep:    [{ stepNumber, clean, voice }] ← enriched solutions
routing:       { ifCorrect, ifWrong, ifStuck, ifFlukeDetected } ← routing tokens
flukeCheckQuestionId: String ← paired fluke-check question
placementRole: "primary" | "secondary" ← placement quiz only

Seeded content:
  880 questions  — 43 topic banks (seedQuestionsAndMockPapers.js)
  162 questions  — 9 new topic banks ch1§4,ch2§4,ch3§4,ch4§4,ch6§5,ch8§4,ch11§2,ch12§3,ch13§5 (seedDesktopContent.js)
   40 questions  — CBSE board-style 2024/2025 (seedBoardStyleQuestions.js)
   20 questions  — Placement quiz diagnostic (seedPlacementQuiz.js)
  152 questions  — answer-key solution steps enriched (seedMockPaperAnswerKeys.js)
```

### 3.4 Attempt
```
userId, questionId, topic
isCorrect, selectedType, timeTaken, confidence (low|medium|high)
difficulty, examId, createdAt
```

### 3.5 SeenQuestion  (exposure control)
```
userId, questionId, topic, seenAt
Unique index: { userId, questionId }
```

### 3.6 Streak
```
userId (unique), currentStreak, longestStreak
lastActiveDate (YYYY-MM-DD), updatedAt
graceUsedWeek: String (ISO week string e.g. "2026-W19")  ← NEW: one grace skip per week
```

### 3.7 UserProfile  (core analytics brain)
```
userId (unique)
accuracy, avgTime, totalAttempts
thinkingProfile: Guesser | Surface Learner | Overthinker |
                 Pattern Recognizer | Deep Thinker
weakAreas [String], strongAreas [String]
behaviorStats: { guessing, concept_error, calculation_error,
                 partial_logic, misinterpretation }
confidenceAccuracy: { highConfidenceWrong, lowConfidenceRight }
topicProgress: [{
  topic, accuracy, attempts, lastAttempted, nextRevision,
  revisionStage (0-4 spaced repetition), difficulty
}]
difficultyLevels: Map<topic, 1-4>
updatedAt
```

### 3.8 QuestionStats
```
questionId (unique), attempts, correct, avgTime
errorDistribution: { concept_error, calculation_error,
                     partial_logic, guessing, misinterpretation }
computedDifficulty (0-1), isBadQuestion (bool), updatedAt
```

### 3.9 Exam
```
title, topic, subject, totalQuestions, duration (minutes)
negativeMarking (bool), negativeValue
questionDistribution: { easy, medium, hard }
isActive, createdAt
isMockPaper:     Boolean ← chapter-level mock with pre-defined question order
isPlacementQuiz: Boolean ← diagnostic placement quiz (one in DB)
chapterNumber:   Number  ← 1-14 for mock papers
questionIds:     [ObjectId] ← ordered question set for mock/placement exams

Seeded: 14 chapter mock papers (Ch1-Ch14) + 1 placement quiz Exam doc
```

### 3.10 ExamAttempt
```
userId, examId
answers: [{ questionId, questionText, isCorrect, difficulty,
            selectedType, selectedText, correctText,
            solutionSteps, timeTaken, marksAwarded }]
rawScore, normalizedScore (Z-score), rank, percentile, createdAt
```

### 3.11 StudyPlan
```
userId, name, subjects [String], grade, goal, examDate
hoursPerDay, offDays [Date], topicFilter [String]
isActive (Boolean) — only one active plan per user
shareToken (String, sparse index) — public share link token
dailyPlan: [{ day, date, topics [String], estimatedHours, completed,
              isMockTest, phase (foundation|practice|revision|mock), note }]
priorityTopics: [{ topic, priority, isWeak, reason }]
skipSuggestions: [{ topic, effort, marksLost, reason }]
customTopicOrder [String]
createdAt
Indexes: { userId }, { shareToken } sparse
```

### 3.12 WeeklyLeaderboard
```
userId, topic, week ("2025-W20")
score, accuracy, rank, percentile, createdAt
Index: { week, score -1 }
```

### 3.13 AIResponseCache  (permanent cross-user cache)
```
cacheKey (MD5 hash of questionText+mistakeType+subject) — unique
questionSnippet, mistakeType, response (Claude's text)
hitCount, savedCalls
createdAt, lastHitAt, expiresAt (90 days, auto-purge via TTL index)
```

### 3.14 ErrorMemory
```
userId, topic, mistakeType, count, lastSeen
questionSnippets [String]
Unique index: { userId, topic, mistakeType }
```

### 3.15 AIUsageStats
```
userId, date (YYYY-MM-DD), callsMade, callsSaved, tokensUsed
Unique index: { userId, date }
```

### 3.16 Lesson  (lessonModel.js)
```
topic, subject, grade, title, tagline
shortLesson: { estimatedMinutes, keyIdea, slides [...] }
longLesson:  { estimatedMinutes, slides [...] }
prerequisites [String]
```

### 3.17 LessonProgress  (lessonModel.js)
```
userId, topic, completed (bool), completedAt, timeSpent, notes
```

### 3.18 Badge  ← NEW
```
userId, badgeType, awardedAt, meta (Mixed)
Unique index: { userId, badgeType } — prevents double-awarding

Badge types:
  streak_7 | streak_30 | streak_100
  first_perfect_exam | questions_100 | questions_500
  top10_leaderboard | concept_master_{topic}
```

### 3.19 DoubtThread  ← NEW
```
userId, questionId, topic, subject
messages: [{ role (user|assistant), content, createdAt }]
  ↳ capped at 20 messages (oldest trimmed)
createdAt, updatedAt
Index: { userId, questionId }
```

### 3.20 PushSubscription  ← NEW
```
userId, subscription (Mixed — Web Push API object)
createdAt
Index: { userId }
```

### 3.21 Chapter  ← NEW (CBSE Textbook Curriculum)
```
chapterNumber, title, subject, grade, board
unit (e.g. "Algebra", "Geometry", "Chemistry", "Physics", "Biology")
examMarks, estimatedWeeks, overview
sections: [{ sectionNumber, title, microConcepts: [{ title, explanation }] }]
theorems:    [{ name, statement }]
keyFormulas: [String]
examTips:    [String]
exercises:   [{ exerciseNumber, questionCount, types [String] }]
Unique index: { subject, grade, board, chapterNumber }

Seeded subjects:
  Mathematics : 14 chapters (unit = Algebra/Geometry/Trigonometry/etc.)
  Science     : 13 chapters (unit = Chemistry [1-4] / Biology [5-8,13] / Physics [9-12])
```

### 3.22 NcertTopicContent  (ncertTopicContentModel.js)
```
topicId:                String (unique) — e.g. "ch1_s4_c1_t1"
chapterNumber:          Number 1-14
name:                   String
prerequisite_knowledge: [String]
key_formulas:           [Mixed]
teaching_content:       Mixed — { intuition, derivation, worked_example, common_misconceptions,
                                  shortcuts_and_tricks, edge_cases, key_takeaway, ... }
timestamps: createdAt, updatedAt

Seeded via:
- seedDesktopContent.js — 42 Math topics (ch2-4,6,8,11-13), importNcert.js (ch1)
- seedScienceChemistryContent.js — 16 Science Chemistry topics (sci_ch1–4, Ch1–4)
- seedScienceBiologyContent.js — 19 Science Biology topics (sci_ch5–8,13, Ch5–8,13)
- seedSciencePhysicsContent.js — 15 Science Physics topics (sci_ch9–12, Ch9–12)
Science topicId format: "sci_ch{N}_{descriptor}" e.g. "sci_ch9_mirror_formula"
```

### 3.23 NcertNote
```
userId:    String (required)
topicId:   String (required)
text:      String (max 5000 chars, default "")
updatedAt: Date
Unique index: { userId, topicId }
Routes: GET/PUT /api/v1/ncert/notes/:topicId (auth required)
```

### 3.24 AICallLog  ← NEW (per-call metrics, 90-day auto-purge)
```
userId:    ObjectId (ref: User)
aiType:    String (explanation|hint|lesson|advice|chat|question)
subject:   String
model:     String (claude model ID used)
tokens:    Number
latencyMs: Number
cached:    Boolean (was this served from cache?)
hitRAG:    Boolean (did this call use NCERT RAG context?)
success:   Boolean
createdAt: Date (TTL index — expires after 90 days)

Purpose: fire-and-forget logging for admin AI metrics dashboard
```

### 3.25 AIFeedback  ← NEW (thumbs up/down per response)
```
userId:   ObjectId (ref: User)
cacheKey: String (MD5 of questionText+mistakeType+subject)
aiType:   String
rating:   Number (1 = thumbs up, -1 = thumbs down)
subject:  String
createdAt: Date
Unique index: { userId, cacheKey } — one rating per user per response
```

### 3.27 BookmarkCollection  ← NEW (custom user folders for saved items)
```
userId:      String
name, emoji, color, order
memberRefs:  [{ kind: "question"|"topic"|"section", refId, addedAt }]
shareToken:  String (sparse, for /c/:token public read-only view)
sharedAt:    Date
aiSummary:   String (cached 24h)
aiSummaryAt: Date

Indexes: { userId, order }, { shareToken } sparse
```

### 3.28 BookmarkReview  ← NEW (SM-2 spaced repetition state)
```
userId, questionId (Mongo _id of Question, as string)
easeFactor:    Number (SM-2 EF, default 2.5, min 1.3)
intervalDays:  Number
repetitions:   Number
lastReviewedAt, dueAt
lastRating:    0=again | 1=hard | 2=good | 3=easy
reviewCount, wrongCount
mastered, masteredAt
note:          String (max 280, "why I saved this")

Indexes: { userId, questionId } unique, { userId, dueAt }, { userId, mastered }
```

### 3.29 TopicBookmark / SectionBookmark  ← NEW
```
TopicBookmark   — server-side mirror of stellar_topic_bookmarks LS
SectionBookmark — server-side mirror of stellar_section_bookmarks LS
Both auto-migrate from localStorage on first visit to /bookmarks
```

### 3.31 Profile v2 fields & models  ← NEW
```
User schema additions:
  avatarDataUrl       — base64 image, ≤100KB (no S3 dependency)
  manifesto           — student "why I learn" line, max 200
  locale              — "en" | "hi"
  timezone            — IANA tz string, default "Asia/Kolkata"
  theme               — "light" | "dark" | "system"
  density             — "comfortable" | "compact"
  notifPrefs          — { push, email, streak, exam } booleans
  twoFactorEnabled    — boolean (UI placeholder)
  publicProfileEnabled, publicSlug — opt-in /u/:slug page
  parentVisibility    — Map<parentId, { scores, streak, chats }> per-parent privacy

profileV2Models.js (new file):
  MoodCheckin   — daily { userId, date, mood: great|ok|low, note } unique per day
  ActiveSession — best-effort login session log, 30-day TTL, sign-out by id
  Certificate   — issued certificates surfaced on profile (admin-managed)
```

### 3.30 Practice feedback models  ← NEW (practiceFeedbackModels.js)
```
QuestionReport — user-reported issues (wrong_answer | confusing_wording | broken_image |
                 off_syllabus | duplicate | other) + optional note. Status: open|resolved|rejected.
                 Distinct from Question.isFlagged (boolean only).
SkipReason     — captures why a user skipped (dont_know | too_easy | confusing | bad_question | no_time).
                 90-day TTL.
ErrorLabel     — user self-labels their error after seeing the answer
                 (misread | calc_slip | concept_gap | stuck_step | guessed | other).
                 180-day TTL. Richer than auto-classified Attempt.selectedType.
```

### 3.26 NcertChunk  ← NEW (RAG knowledge store)
```
chapterId:     String (e.g. "ch1")
chapterNumber: Number
chapterTitle:  String
section:       String
text:          String (knowledge chunk for injection into Claude context)
createdAt:     Date

Full-text index on text field — $text search used by RAG retrieval
437 Math chunks seeded via ragStore.js indexChapters() (reads NcertChapter model)
Science/English/Hindi/Social Science chunks: built via scripts/buildRagFromCurriculum.js ← NEW
  Reads Chapter model (from curriculum seeds) → creates NcertChunk documents
  npm run rag:build-curriculum (all 4 subjects) or --subject=Science for one subject
  Chunk types: overview | concept (sections+microConcepts) | formula | qa (exam tips)
  Admin RAG Health page shows per-subject chunk counts + coverage %
```

---

## 4. BACKEND SERVICES

### 4.1 aiService.js — Claude API Calls
```
SUBJECT-AWARE SYSTEM PROMPTS:
  getSystemPrompt(subject) → subject-specific Claude persona
  Subjects: Math | Science | English | Social Science | Hindi
  Each prompt cached by Claude (90% token discount on repeats)

AI RELIABILITY LAYER (callClaude internal):
  1. Global monthly token budget check (MONTHLY_TOKEN_BUDGET env)
  2. Per-user token budget check (PER_USER_DAILY/MONTHLY_TOKEN_LIMIT env)
  3. Primary model call → on failure → claude-haiku-4-5-20251001 fallback → 503 if both fail
  4. max_tokens truncation detection (stop_reason === "max_tokens") → appends notice
  5. Output guardrail check (outputGuard.js) before returning to caller
  6. logAICall() fire-and-forget metrics logging (AICallLog model)

STUDENT MODEL INJECTION:
  buildStudentContext(userId) → pulls UserProfile (accuracy, thinkingProfile, weakAreas)
    + Streak → injects as system prompt prefix on every explanation/hint/chat call

CONVERSATION CONTEXT (tutor chat):
  storeLastExplanation(userId, question, explanation) → Redis 30-min key
  getLastExplanation(userId) → auto-injected as prior context on first chat turn

LESSON CACHE — DUAL STORE:
  lessonCacheKey = MD5(topic.toLowerCase().trim() + "::" + subject + "::" + grade)
  Checks Redis → MongoDB AIResponseCache → calls Claude → stores in both
  Lesson cache survives Redis restarts (DB layer is permanent)

ANSWER VERIFICATION:
  verifyAIQuestion(question, userId) → second minimal Claude call: "Is [correctAnswer]
    correct? Reply PASS or FAIL" → discards generated question on FAIL

RAG CONTEXT:
  queryRAG(questionText, subject) → NcertChunk full-text search → top 3 chunks
  Injected as <context> block into getAIExplanation system prompt

Functions:
- getAIExplanation(question, mistakeType, correctAnswer, subject, userId) → 320 tokens
- generateAIQuestion(topic, weakness, subject, userId) → MCQ + verification pass
- generateLesson(topic, subject, grade) → Redis+DB cached structured lesson
- getStudyAdvice(profile, subject, userId) → personalised study tip
- generateHint(questionText, topic, subject) → 120 tokens, no answer given
- getChatResponse(history, userMessage, topic, subject, userId) → 400 tokens, multi-turn
    first turn auto-injects last explanation context if available
```

### 4.2 aiRouter.js — 7-Layer Cost Minimisation
```
Layer 1: isCorrect answer        → return null (0 cost)
Layer 2: Has solutionSteps       → return steps + static tip (0 cost)
Layer 3: Simple mistake pattern  → return STATIC_RESPONSES map (0 cost)
Layer 4: Redis cache hit         → shared across all instances, 24h TTL (0 cost)
Layer 5: DB cache hit            → AIResponseCache permanent store (0 cost, all users)
Layer 6: Daily limit check       → free=10/day, pro=100/day, premium=500/day
Layer 7: Call Claude             → save to DB + Redis for all future users

Cache key = MD5(questionText.lower() + "::" + mistakeType + "::" + subject)
Subject included in key so Math/Science don't collide

Exports: smartAIExplanation, smartStudyAdvice, getUsageCount, getCacheStats
         checkAndIncrementUsage (exported — used by doubtRoutes)
```

### 4.1b ragStore.js — NCERT RAG Knowledge Store  ← NEW
```
indexChapters() → iterates NcertChapter.find(), chunks text by section,
  bulk-upserts NcertChunk documents, builds MongoDB $text index
  437 Math chunks indexed; run once per subject on first deploy

queryRAG(questionText, subject) → $text search on NcertChunk (subject filter),
  returns top 3 chunk texts (best-effort, does not throw on failure)
  Used by getAIExplanation to inject context before Claude call

Route: GET /api/ai/cache-stats checks RAG chunk count (via NcertChunk.countDocuments)
```

### 4.1c outputGuard.js  ← NEW (utils/outputGuard.js)
```
checkOutput(text, context) → { safe: bool, reason: string }
  Checks:
    - empty / too-short (<15 chars) → reason: "empty_response"
    - prompt leakage patterns (system prompt fragments in response) → "prompt_leakage"
    - harmful content (self-harm, weapons, explicit) → "harmful_content"
  Called on every Claude response before it reaches the student
  On unsafe: caller substitutes a safe fallback message
```

### 4.1d aiMetrics.js  ← NEW (utils/aiMetrics.js)
```
logAICall({ userId, aiType, subject, model, tokens, latencyMs, cached, hitRAG, success })
  → AICallLog.create() fire-and-forget (never throws, errors swallowed)
  Called at end of every aiService function

Used by GET /api/ai/metrics (adminAuth) to power the admin dashboard widget:
  - 7-day aggregation: totalCalls, totalTokens, avgLatency, cacheHits, failedCalls, ragHits
  - Breakdown by aiType and by subject
  - AIFeedback thumbs count (helpful vs not-helpful)
```

### 4.3 adaptiveService.js — Smart Question Selection (broad topic)
```
1. Read UserProfile: accuracy → target difficulty (0.25/0.5/0.75)
2. If concept_error > 5 → try DB-first AI question
   Only call Claude if no unseen AI question exists for this topic
3. Filter seen questions (SeenQuestion collection)
4. Find DB question closest to target difficulty
```

### 4.3b adaptiveRecommenderService.js — Fine-Grained Mastery Engine  ← NEW
```
Port of Python recommender_engine.py using topicId-level state (UserTopicMastery).

checkMastery(attemptsAtDiff, difficulty, secondsOnTopic)
  → pure function, applies MASTERY_CFG thresholds

detectFluke(question, correct, timeSec, priorAttemptsAtDiff)
  → time < guessBelow OR correct after 3 consecutive wrongs

recordAttempt(userId, topicId, questionId, correct, timeSec, selectedOptionIndex, hintsUsed)
  → detects fluke + misconception, updates UserTopicMastery, advances currentDifficulty

nextQuestion(userId, topicId)
  → Priority: fluke detected → stuck → correct → wrong → fallback
  → Resolves routing tokens: next_difficulty_up | topic_mastery_check |
    next_hard_different_subtype | q_<id> | <topicId:teaching_ref>
  → Returns: { action: serve_question|serve_teaching|topic_mastered|no_questions }

nextTopic(userId)
  → 1. Continue in-progress (any mastery true, not all true) — lowest level first
  → 2. Recommend eligible (all prerequisites mastered, not started) — lowest level first
  → 3. Fallback to level-0 foundational topic
  → 4. all_complete

applyPlacementResults(userId, placementByTopic)
  → placementByTopic: { topicId → label }
  → 4 labels: mastered_through_medium (easy+medium→hard) |
               mastered_easy (easy→medium) | partial_familiarity | novice
  → Bulk-initialises UserTopicMastery from placement quiz results
```

### 4.4 analysisService.js — Thinking Behaviour Detector
```
Override: fast + wrong → reclassify as "guessing" regardless of option type
Speed profiles: mastery | guessing | deep_thinker | concept_unclear | normal
Confidence mismatches:
  high confidence + wrong → "dangerous_misconception"
  low confidence + right  → "unstable_knowledge"
Returns: { isCorrect, behavior, speedProfile, confidenceInsight, message }
```

### 4.5 plannerService.js — Study Plan Generator
```
Goal-based priority weights:
  pass:        freq=0.65, weak=0.25, accuracy=0.10
  distinction: freq=0.50, weak=0.30, accuracy=0.20
  top:         freq=0.30, weak=0.30, accuracy=0.40
  scholarship: freq=0.20, weak=0.40, accuracy=0.40

Filters: Topic.find({ subject, grade }) — subject-aware (default "Math", grade "10")
Output: dailyPlan + priorityTopics + skipSuggestions + revisionDue (from revisionService)
  revisionDue: up to 8 topics with stage/urgency for display in Planner page
```

### 4.6 revisionService.js — Spaced Repetition
```
Intervals: [1, 3, 7, 15, 30] days
revisionStage per topic in UserProfile.topicProgress
Priority = daysSince / expectedInterval
```

### 4.7 scoringService.js — Exam Scoring
```
timeFactor = min(1.5, max(0.5, expectedTime/timeTaken))
score += difficultyScore × timeFactor  (correct answers only)
normalizeScores: Z-score across all exam attempts → rank + percentile
```

### 4.8 badgeService.js — Achievement Awards  ← NEW
```
checkAndAwardBadges(userId, context) → string[] of newly awarded badge types
Uses $setOnInsert upsert — unique index prevents double-award

Badge conditions:
  streak >= 7/30/100           → streak_7 / streak_30 / streak_100
  examScore === 100            → first_perfect_exam
  totalAttempts >= 100/500     → questions_100 / questions_500
  rank <= 10                   → top10_leaderboard
  topicAccuracy >= 0.9 + 20+   → concept_master_{topic}

Called from: practiceController.submitAnswer (after every submit)
```

### 4.9 predictionService.js — Exam Score Prediction  ← NEW
```
For each topic in UserProfile.topicProgress:
  weight = Topic.examMarks × Topic.examFrequency
  contribution = topic.accuracy × weight

weightedAccuracy = sum(contributions) / sum(weights)
base = weightedAccuracy × 80 (CBSE written paper marks)
timeAdjustment: daysLeft > 60 → +5, daysLeft < 7 → -5
range = [base - 8, base + 8] clamped to [0, 80]

Returns: { predictedMin, predictedMax, predictedGrade (A1-E),
           predictedGPA, confidence (low/medium/high),
           daysLeft, pctMin, pctMax, breakdown[], message }
```

### 4.10 profileService.js — Thinking Profile
```
5 profiles: Guesser | Surface Learner | Overthinker |
            Pattern Recognizer | Deep Thinker
```

### 4.11 streakService.js — Daily Streaks
```
Updates Streak on any practice/exam attempt
Tracks currentStreak, longestStreak, lastActiveDate

Grace period (NEW): one missed day per ISO week gets a free pass
  - Missed exactly 1 day AND graceUsedWeek !== currentWeek → extend streak + set graceUsedWeek
  - Missed 1 day AND grace already used this week → break streak (currentStreak = 1)
  - Missed 2+ days → break streak normally

getStreakStatus(userId) → { streak, longestStreak, graceAvailable: bool, graceUsedWeek }
Route: GET /api/user/streak-status
```

### 4.12 aiTeacherService.js — Contextual Guidance
```
- totalAttempts < 5         → welcome + start_easy
- guessing > 40% of answers → warning + slow_down
- concept_error > 35%       → targeted topic drill
- accuracy > 0.8            → goal-specific push message
```

### 4.13 selfLearningService.js / autoDoubtService.js / foundationService.js
```
selfLearning: detects foundation gaps from error patterns
autoDoubt: surfaces recurring mistakes from ErrorMemory
foundation: checks Topic.prerequisites against UserProfile.weakAreas
```

### 4.14g Live Room v2/v3 (Socket.IO extensions)  ← NEW
```
Extended utils/socket.js with new events:
  room_chat        — text chat (200 char cap, 1/s throttle)
  room_reaction    — emoji floating (2/s throttle)
  player_pulse     — every 5s; updates {status, lastSeen} → presence_update broadcast
  power_up         — fifty_fifty | freeze | double; freeze targets opponents
  answer_timing    — server flags 3-in-a-row <2s answers as anti_cheat_flag
  list_public_rooms→ public_rooms broadcast for lobby browser
  on disconnect    — auto sets status="disconnected" in all rooms

  v3 additions:
  submit_score     — accepts {qIdx, optionLetter}; broadcasts opponent_answered + first_answer
  chat_typing      — typing indicator broadcast
  chat_reaction    — emoji on chat message broadcast
  rematch_offer    — result-screen rematch invite broadcast
  spectate_room    — joins socket room as spectator (not added to players)

In-memory activeRooms Map<roomId, info> for public lobby browser, pruned every 5 min.

routes/liveRoomV2Routes.js:
  GET /v1/live-room/theme   — daily theme topic (rotates by day-of-week)
  GET /v1/live-room/friends — linkedStudents picker for invites
```

### 4.14f competitionV2Service.js  ← NEW (Arena, ELO, rooms, quests)
```
Models added (competitionV2Models.js):
  ArenaRating  — ELO rating + weekly points + win streak + tier (Bronze→Master)
  Room         — lobby/live multiplayer room (code-based, capacity 2-8)
  Match        — finished match history with rank changes
  DailyQuest   — 3 daily competition quests (win1, play3, hard_topic)
  MatchReport  — opponent reports (cheating, bad_sport, afk, other)

Service helpers:
  getArena             — rating + tier + rank + weekly points + win streak
  getWeeklyLeaderboard — class-grade scoped, with rank deltas vs last snapshot
  listOpenRooms / createRoom / joinRoom / leaveRoom / readyUp / startMatch
  recordAnswer         — live score updates per-question
  finishMatch          — pairwise ELO update (K=16/N), rank, history persist
  quickMatch           — auto-join similar-rated lobby OR create new
  getMatchHistory / getDailyQuests / bumpQuest / getChampion / reportOpponent

Routes: GET /dashboard (one-shot), POST /rooms, POST /rooms/:code/{join,leave,ready,start,answer,finish},
        POST /quick-match, GET /history, GET /quests, POST /report
```

### 4.14e dashboardV2Service.js  ← NEW (Home dashboard aggregator)
```
12 helpers:
  getStreakStrip      — last 7 days with isToday flag for hero strip
  getCommitment       — DailyCommitment + live doneMinutes from today's attempts
  setCommitment       — pledge N min today (5–480 range)
  getStreakRisk       — afternoon banner: "Practice in N hrs to keep streak alive"
  getPeerActivity     — anonymized count of grade-peers active in last 30 min + class avg accuracy 7d
  getRankWidget       — your rank + percentile across all profiles ≥5 attempts
  getFriendActivity   — recent badges from linked users
  getRecentSessions   — last 3 hour-grouped sessions
  getNextBadgePreview — closest unearned badge with N-to-go progress
  getTomorrowPreview  — top-3 weak areas as likely tomorrow focus
  snoozeTask / listActiveSnoozes — TaskSnooze CRUD
  getWidgetOrder / setWidgetOrder — per-user dashboard layout + density
  getNBA              — next-best-action one-liner ("drill X for 10 min — your weakest")

Models added: DailyCommitment (90d TTL), TaskSnooze (30d TTL), WidgetOrder.
Routes: GET /dashboard, POST /commitment, POST /snooze, PATCH /widget
```

### 4.14d analyticsV2Service.js  ← NEW (Analytics dashboard aggregator)
```
14 helpers, all subject- and range-aware:
  getPersona              — named persona ("The Deep Thinker") + tagline based on UserProfile
  getRadar                — 5-axis (Depth/Speed/Pattern/Recall/Calibration) + peer-median ghost
  getPredictedBreakdown   — per-chapter +/- marks contribution + counterfactual ("if mastered top 3 → +N")
  getMistakeByTopic       — per-topic stacked breakdown (concept/calc/partial_logic/guess/misread)
  getTimeOfDayCorrelation — accuracy by 3-hour bucket
  getCalibrationCurve     — stated confidence vs actual accuracy (perfect = diagonal)
  getThisWeek             — 7-day bar chart + active-days + total minutes + WoW %
  getTopicHeatmap         — per-topic mastery state from UserTopicMastery
  getQuestionTypeBreakdown- accuracy per MCQ/AssertionReason/CaseBased/etc.
  getDifficultyDistribution- accuracy per easy/medium/hard (last 30d)
  getRetestRecs           — SM-2 due bookmarks for re-testing
  getMockPaperReadiness   — per-section readiness % (VSA/SA-I/SA-II/LA/Case) + history sparkline
  getAnomalies            — slow-session, low-accuracy, repeat-wrong intervention triggers
  getInsights             — Aria-style narrated bullets (time-of-day, long-question accuracy, calibration, skip patterns, bookmark review rate)
  getBehaviourFingerprint — avg time, consistency, overconfidence %, underconfidence %

Routes: GET /dashboard?subject=X — one-shot returns all 14 sections in parallel.
```

### 4.14c lessonsV2Service.js  ← NEW (Learn dashboard aggregator)
```
getContinueCard       — last LessonProgress + mode + slideIndex + percent
getRecentTopics       — last 5 distinct topics studied
getTopicMasteryMap    — { topicId: "mastered"|"in_progress"|"wrong_repeat"|"not_started" }
getRecommendedTopics  — wrong-repeat first, then next not-started
getChaptersMeta       — per-chapter rollup: topicCount, mastered, progressPct,
                        estimatedMinutes, difficulty, examWeight (CBSE table),
                        pyqCount (from Question.isPYQ), hasVideo/Diagram/Formula,
                        prereqs, isNew (last 30d updatedAt)
getDiagnostic         — 3 quick questions for the "Skip if I know" pre-lesson check
searchTopics          — fuzzy regex search across NcertTopicContent.name
createCoStudyLink     — in-memory token, 1h TTL, returns shareable URL

Routes: GET /dashboard, /search, /diagnostic/:topicId, POST /co-study, GET /co-study/:token
EXAM_WEIGHTS table hardcoded for CBSE Class-10 Math/Science/SST. Other grades fall back to 100/N.
```

### 4.14b bookmarkService.js  ← NEW (SM-2 spaced repetition + collections)
```
sm2Next(prev, rating)  — SuperMemo 2 algorithm; returns {easeFactor, intervalDays, repetitions, dueAt}
rateReview(userId, qid, rating)  — updates BookmarkReview, marks mastered after 3 "easy" in a row
getDueQuestions(userId, limit)   — Due Today queue (mastered excluded)
computeSmartCollections(userId)  — server-side filter buckets:
  due, forgotten (>14d, never reviewed), frequentlyWrong (wrongCount≥2), thisWeek, mastered
listCollections / createCollection / updateCollection / addToCollection / bulkAdd
generateCollectionShareToken / getSharedCollection (public, no auth)
exportCollection(format=md|anki) — Markdown or Anki CSV (Front,Back,Tags)
generateAiSummary — heuristic 3-bullet study insight, cached 24h on collection doc

Routes mounted at /api/v1/bookmarks/*  (bookmarkRoutes.js + bookmarkController.js)
Public route: GET /api/v1/bookmarks/share/:token → SharedCollection page at /c/:token
Practice handoff: POST /api/practice/start-bookmarks now accepts { collectionId } too
```

### 4.14 couponService.js  ← NEW
```
validateCoupon(code, planKey) → checks isActive, validUntil, maxUses, planFilter → Coupon doc
computeDiscount(coupon, basePrice) → { discountAmount, finalPrice, discountLabel }
redeemCoupon(couponId) → atomic $inc on usedCount (race-condition safe)
```

### 4.15 paymentService.js  ← NEW
```
createOrder(userId, planKey, couponCode=null)
  - validates coupon via validateCoupon
  - applies discount; stores order_coupon:<orderId> in Redis
  - creates Razorpay order with (discounted) amount
  - stores order_plan:<orderId> in Redis (TTL 1h)

verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
  - verifies HMAC signature
  - reads plan + coupon from Redis; calls redeemCoupon if coupon present
  - upgrades User: isPaid=true, plan, planExpiry
  - referral reward: if referredBy && !referralRewarded → 30 days to referrer + mark referralRewarded

Plans: pro (₹199/mo, 100 AI/day), premium (₹499/mo, 500 AI/day),
       pro_annual (₹1499/yr), premium_annual (₹3999/yr)
Env required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
```

### 4.16 onboardingEmailService.js / weeklyParentEmailService.js / pushService.js  ← NEW
```
onboardingEmailService: drip sequence (day 0/3/7) via nodemailer
  sendTrialExpiringSoonEmails() ← NEW: finds users where trialExpiry is 20–26h away,
    isPaid: false, trialExpirySoonSentAt: null → sends "upgrade to keep your progress" email
    linking to /pricing; sets trialExpirySoonSentAt to prevent re-send
  runTrialExpirySoonEmails() — exported, called via POST /admin/run-trial-expiry-soon-emails
weeklyParentEmailService: Monday 8am digest email to parents (portal users)
pushService:
  sendRevisionReminders() — daily: push to users with topics due today
  sendStudyReminders()    — every minute: fires push at parent-set HH:MM
```

---

## 5. BACKEND ROUTES — ALL ENDPOINTS

### Existing
```
POST   /api/auth/register             → 409 if email already exists
POST   /api/auth/login               → 404 if email not found, 401 if wrong password
POST   /api/auth/forgot-password     → sends reset link by email (1h expiry); console-logs in dev
POST   /api/auth/reset-password/:token → verifies hashed token, updates password

POST   /api/practice/start          → foundation check → AI teacher msg → first question
                                      options returned WITHOUT type field (correct answer hidden)
POST   /api/practice/submit         → body: { selectedOptionIndex, timeTaken, confidence }
                                      server derives selectedType from session question options
                                      response includes: newBadges[], correctOptionIndex, selectedOptionIndex
                                      solutionSteps only included when answer is wrong

GET    /api/analysis/report
GET    /api/analysis/errors
GET    /api/analysis/weekly-leaderboard
GET    /api/analysis/predict        ← NEW: exam score prediction

GET    /api/lessons
GET    /api/lessons/:topic          → DB-first, AI generates if missing
POST   /api/lessons/progress

GET    /api/topics
GET    /api/topics/meta             → unique subjects + grades

GET    /api/exam/list
POST   /api/exam/generate-mock      ← AI mock paper: selects from weak areas; body: { questionCount, duration, subject }
                                      Returns live exam session (same submit flow as /exam/submit)
POST   /api/exam/start              → returns startedAt (epoch ms) + durationSeconds for
                                      server-side timer sync; option `type` field stripped
POST   /api/exam/submit             → server validates elapsed time (30s grace); auto-fills
                                      blank for unanswered if time expired
GET    /api/exam/history
GET    /api/exam/review/:attemptId

GET    /api/planner                         ← active plan (or most recent)
POST   /api/planner                         ← create plan (deactivates others)
GET    /api/planner/all                     ← list all plans (summaries)
GET    /api/planner/:planId                 ← specific plan by id
PUT    /api/planner/:planId/settings        ← update plan settings
PUT    /api/planner/:planId/activate        ← set active plan
DELETE /api/planner/:planId                 ← delete plan
POST   /api/planner/reschedule              ← catch-up: redistribute missed topics
POST   /api/planner/share                   ← generate share token (auth)
GET    /api/planner/share/:token            ← public shared plan view (no auth)
POST   /api/planner/complete                ← mark day complete
PATCH  /api/planner/reorder                 ← save custom topic order
PATCH  /api/planner/note                    ← save per-day note

GET    /api/revision/due
POST   /api/revision/mark
GET    /api/revision/last-day

GET    /api/ai/advice
GET    /api/ai/usage
GET    /api/ai/cache-stats     → admin only (adminAuth)
GET    /api/ai/metrics         → admin only: 7-day AICallLog aggregation + AIFeedback counts ← NEW
POST   /api/ai/chat                 → multi-turn tutor chat
POST   /api/ai/evaluate-explanation
POST   /api/ai/hint
POST   /api/ai/voice-answer         ← VoiceTutor; persists history in Redis (7d TTL, 50-msg cap)
GET    /api/ai/voice-history        ← load persisted voice conversation
DELETE /api/ai/voice-history        ← clear voice history
POST   /api/ai/feedback             ← thumbs up/down rating (rate limit: 20/hour per user) ← NEW
                                       body: { questionText, mistakeType, subject, rating: 1|-1 }
                                       upserts AIFeedback (one rating per user per cacheKey)

GET    /api/public/stats         ← homepage stats (totalUsers, aiHints, avgGrade); 5-min cache; no auth

GET    /api/user/me
PUT    /api/user/me            → rate-limited (20 updates/hour per user)
DELETE /api/user/me            ← GDPR/PDPB: deletes User + all personal data
POST   /api/user/children      ← create child sub-account + link to parent
GET    /api/user/children      ← list parent's linked children
DELETE /api/user/children/:id  ← unlink child account
GET    /api/user/bookmarks
POST   /api/user/bookmarks/:questionId ← toggle bookmark

GET    /api/competition/leaderboard
POST   /api/competition/room-questions

POST   /api/practice/mixed          ← mixed-topic practice session
POST   /api/practice/flag           ← student flags a question for review (boolean only)
POST   /api/practice/report          ← user reports a question with reason + note → QuestionReport ← NEW
POST   /api/practice/skip-reason     ← captures why a question was skipped → SkipReason ← NEW
POST   /api/practice/error-label     ← user self-labels their error after wrong answer → ErrorLabel ← NEW
GET    /api/practice/question-stats/:questionId ← attempts/accuracy/avgTime for "i" popover ← NEW
GET    /api/practice/peer-time/:questionId      ← my avg vs peer avg time on a question ← NEW
GET    /api/practice/lineage/:questionId        ← prerequisite topic chain for concept-gap drill ← NEW
POST   /api/practice/start-bookmarks ← start practice from bookmarks; optional body { questionIds }
                                       if questionIds provided: uses those IDs as pool (retry-wrong flow)
                                       if not provided: falls back to user's savedQuestions
                                       returns fromBookmarks / fromRetry flags; stores retryPool in session
GET    /api/user/streak-status       ← { streak, longestStreak, graceAvailable, graceUsedWeek } ← NEW
GET    /api/admin/rag-health         ← chunk counts per subject, chapters covered, lastIndexed ← NEW
POST   /api/admin/send-test-email    ← body: { to } → sends timestamped SMTP test email ← NEW
POST   /api/admin/run-trial-expiry-soon-emails ← triggers trial-expiry-soon email batch ← NEW
```

### New routes
```
GET    /api/badges                  ← all badges for logged-in user

GET    /api/doubt/:questionId       ← get/create doubt thread
POST   /api/doubt/:questionId/message ← send message (counts AI quota)
DELETE /api/doubt/:questionId       ← clear thread

GET    /api/portal/search           ← search students by name/email
POST   /api/portal/link-direct      ← link student by userId
DELETE /api/portal/students/:id     ← unlink student
GET    /api/portal/students         ← list linked students + basic stats
GET    /api/portal/students/:id/analytics ← read-only student view
GET    /api/portal/students/:id/dashboard ← student dashboard snapshot
GET    /api/portal/requests         ← pending link requests
POST   /api/portal/requests/:id/respond  ← accept/reject link request
GET    /api/portal/class-stats      ← aggregate stats across all linked students
GET    /api/portal/students/:id/attempts ← paginated attempt history for a student
GET    /api/portal/reminders        ← get parent-set study reminders
POST   /api/portal/reminders        ← set study reminder (time + days for a student)
DELETE /api/portal/reminders/:studentId  ← remove reminder

GET    /api/admin/stats             ← requires admin role
GET    /api/admin/analytics         ← DAU/MAU/revenue/conversion/retention + 30-day trends
GET    /api/admin/users             ← paginated, searchable
PUT    /api/admin/users/:id/role
GET    /api/admin/questions         ← paginated, filterable
GET    /api/admin/questions/flagged
POST   /api/admin/questions
PUT    /api/admin/questions/:id
DELETE /api/admin/questions/:id
PUT    /api/admin/questions/:id/unflag
GET    /api/admin/topics
POST   /api/admin/topics
PUT    /api/admin/topics/:id
DELETE /api/admin/topics/:id
GET    /api/admin/certificates      ← users who have earned a certificate (minAttempts, minAccuracy filters)
GET    /api/admin/coupons           ← admin coupon CRUD
POST   /api/admin/coupons
PUT    /api/admin/coupons/:id
DELETE /api/admin/coupons/:id

GET    /api/v1/curriculum/subjects     ← distinct subject+grade combos in DB
GET    /api/v1/curriculum              ← all chapters (?subject=&grade=&board=)
GET    /api/v1/curriculum/:chapterNumber ← full chapter detail + sections + formulas

GET    /api/v1/ncert/chapters          ← NCERT chapter list (?subject=&grade=)
GET    /api/v1/ncert/chapters/:id      ← single NCERT chapter detail
GET    /api/v1/ncert/topics            ← topic stubs (?chapterNumber= or all)
GET    /api/v1/ncert/topics/:id        ← single NCERT topic content (full teaching data)
GET    /api/v1/ncert/studied           ← [auth] list topicIds the user has marked studied
POST   /api/v1/ncert/studied/:topicId  ← [auth] toggle studied on/off for a topic
GET    /api/v1/ncert/notes/:topicId    ← [auth] get saved note text for a topic
PUT    /api/v1/ncert/notes/:topicId    ← [auth] upsert note text (max 5000 chars)

GET    /api/v1/pyq/topics              ← distinct topics that have PYQs
GET    /api/v1/pyq/years               ← distinct years available
GET    /api/v1/pyq                     ← paginated PYQs (?topic=&year=&subject=&grade=)
GET    /api/v1/pyq/:id                 ← single PYQ

GET    /api/v1/payment/plans           ← all plan definitions with pricing
GET    /api/v1/payment/subscription    ← current user's subscription status
POST   /api/v1/payment/create-order    ← create Razorpay order (body: planKey, couponCode?)
POST   /api/v1/payment/verify          ← verify Razorpay payment signature + activate plan
POST   /api/v1/payment/validate-coupon ← preview discount without creating order

POST   /api/webhooks/razorpay          ← Razorpay webhook: payment.captured (idempotent upgrade backup)
                                         payment.failed (log only), refund.processed (downgrade)

GET    /api/push/vapid-public-key      ← returns VAPID_PUBLIC_KEY for SW subscription
POST   /api/push/subscribe             ← save Web Push subscription object
DELETE /api/push/subscribe             ← unsubscribe

GET    /api/flags                      ← user-aware feature flag map; decodes cookie token if present

POST   /api/feedback                ← submit NPS score (0-10) + optional comment; sets npsLastShownAt
GET    /api/feedback/nps-eligible   ← returns { eligible: bool } — true if 20+ attempts AND 7-day account age AND 30-day cooldown
GET    /api/feedback                ← admin only: NPS score (% promoters minus % detractors), avg, raw items

PATCH  /api/planner/reorder         ← save drag-reordered topic order
GET    /api/exam/leaderboard/:examId ← top scores for a specific exam

GET    /api/v1/placement-quiz             ← 20 diagnostic questions (ordered)
GET    /api/v1/placement-quiz/status      ← { taken: bool, takenAt }
POST   /api/v1/placement-quiz/score       ← score answers; returns placementByTopic
                                             + summary (chaptersAced/started/novice)
                                             + sets UserTopicMastery via applyPlacementResults
                                             + sets User.placementCompletedAt (one-shot)

GET    /api/v1/recommender/next-topic              ← DAG-gated topic recommendation
GET    /api/v1/recommender/next-question/:topicId  ← routing-based next question
                                                     (prefers dynamic variant if template exists)
GET    /api/v1/recommender/mastery/:topicId        ← mastery state for a topic
POST   /api/v1/recommender/record-attempt          ← body: { topicId, questionId,
                                                     correct, timeSec, selectedOptionIndex?, hintsUsed? }

POST   /api/v1/schools                             ← create school group (teacher/admin)
GET    /api/v1/schools                             ← list my school groups
GET    /api/v1/schools/dynamic-topics              ← which topics have dynamic templates
GET    /api/v1/schools/my-enrollment               ← student's variant_index + school name
POST   /api/v1/schools/join                        ← student self-enroll via join code
GET    /api/v1/schools/homework                    ← ?topicId=&difficulty=&assessmentId=&slotId=
                                                     returns unique question for this student
POST   /api/v1/schools/homework-set                ← body: { assessmentId, slots:[{topicId,difficulty,slotId}] }
                                                     returns full homework set, one unique Q per slot
GET    /api/v1/schools/:schoolGroupId              ← school roster + variant indices
POST   /api/v1/schools/:schoolGroupId/enroll       ← enroll student by userId (teacher/admin)
```

### Socket.IO Events (port 5001)
```
Client → Server:
  join_room    { roomId, userId, userName }
  start_room   { roomId, questions }
  submit_score { roomId, userId, score }
  end_game     { roomId }

Server → Client:
  room_update  { players, status, questions }
  game_started { questions }
  score_update { players map }
  game_ended   { players, winner }
```

---

## 6. FRONTEND — ALL PAGES + COMPONENTS

### Student Pages (inside Layout, protected)
```
/child-picker  → ChildPicker    — post-login router: 0 children → /onboarding,
                                   1 child → auto-select + Dashboard, 2+ → grid picker
/onboarding    → Onboarding     — single-page child details form (name, class, board,
                                   school, location); creates child sub-account via POST /user/children
/mock-paper    → MockPaper      — AI-generated mock paper: pick subject/count/duration,
                                   generates questions from weak areas, timed exam + review
/              → Dashboard      — streak, AI teacher msg, revision due, quick links
                                  Subject tabs (Maths/Science/English/Social/Hindi) in Topics
                                  Science sub-tabs (All/Physics/Chemistry/Biology)
/forgot-password → ForgotPassword — email input → "check your email" success state ← NEW
/reset-password/:token → ResetPassword — new password + confirm + strength bar ← NEW
/lessons       → Lessons        — Subject tabs + Science sub-tabs (All/Physics/Chemistry/Biology)
                                  Textbook Chapters tab (CBSE curriculum) + AI Lessons tab
                                  Each tab fetches chapters/lessons for that subject only
/lessons/:t    → LessonView     — short/long lesson, mark complete
/chapters/:n   → ChapterView    — full chapter: sections, formulas, theorems, tips, exercises ← NEW
/placement-quiz → PlacementQuiz — one-time 20-question diagnostic; intro screen → timed quiz
                                  (global countdown, per-question timer); MCQ + text answer;
                                  skip + next controls; results screen (score ring, chapter
                                  breakdown: aced/practise/novice, recommended first topic);
                                  sets UserTopicMastery via 4-label system; Dashboard shows
                                  nudge banner until placementCompletedAt is set; once-only guard
/practice      → Practice       — Subject tabs + Science sub-tabs; adaptive quiz per subject
                                  confidence, AI explain, DoubtChat; End Session button after
                                  first answer; session summary screen (score, accuracy bar,
                                  missed-question review with correct option + AI explanation)
                                  Retry-wrong mode: if location.state.retryWrongIds is set,
                                  auto-starts using those questionIds via startRetryPractice() ← NEW
/analytics     → Analytics      — thinking profile, behavior stats, topic progress, prediction
/competition   → Competition    — weekly leaderboard, create/join room
/live          → LiveRoom       — real-time Socket.IO quiz
/planner       → Planner        — multiple plans (PlanSwitcher); create/edit/delete plans
                                  PlanForm: name, grade, subjects (multi-select pills), exam date,
                                  goal, hours/day slider, off-days date picker, topic filter checklist
                                  Phase markers (Foundation→Practice→Revision→Mock), mock test days
                                  every 14 days; topic accuracy % chips; per-day notes (DayNote);
                                  catch-up banner (shows for 1–2 missed days) + manual reschedule;
                                  Auto-reschedule: if missed ≥ 3 days on load → reschedulePlan() fires
                                  silently + green "Your plan was auto-rescheduled" toast shows ← NEW
                                  share link; topic order editor; Daily/Weekly/Monthly views;
                                  NCERT chapter progress; Revision Due
/shared-plan/:token → SharedPlan — public read-only view of a shared plan (no auth required)
/exam-review   → ExamReview     — past exams, per-question AI review
                                  "Retry N wrong questions" button navigates to /practice
                                  with state.retryWrongIds (wrong questionIds from that attempt) ← NEW
/voice-tutor   → VoiceTutor     — mic + text chat, subject-aware, TTS playback ← NOW FUNCTIONAL
/profile       → Profile        — user info, badges grid, invite code generator
/settings      → Settings       — update name/grade/subjects (multi-select pills)/weak topics;
                                  exam date + goal moved to Planner; all 5 CBSE subjects
                                  weak topics tag-editor (type+Enter → red pill tags → synced
                                  to UserProfile.weakAreas via PUT /user/me);
                                  subscription card; Delete Account (GDPR — double-confirm)
/portal        → Portal         — student: generate invite code
                                  parent/teacher: link students, view analytics
                                  Subject Mastery bars always shown (4 CBSE subjects pre-seeded at 0%)
/pricing       → Pricing        — plan cards (Free/Pro/Premium/Annual), Razorpay checkout
/tos           → TermsOfService — static legal page
/privacy       → PrivacyPolicy  — static legal page
```

### Admin Pages (inside AdminLayout, admin role required)
```
/admin                 → AdminOverview      — user counts, plan breakdown, AI cache stats
/admin/questions       → AdminQuestions     — CRUD + flag/unflag, filter by topic/subject
/admin/topics          → AdminTopics        — CRUD for all topics
/admin/users           → AdminUsers         — paginated list; child accounts filtered out;
                                               parentInfo shown next to child-linked users
/admin/cache           → AdminCacheStats    — cache hit rates, Claude calls saved, cost estimate
/admin/analytics       → AdminAnalytics     — DAU, MAU, paid conversion %, 7-day retention,
                                               total revenue, 30-day bar charts
/admin/coupons         → AdminCoupons       — coupon CRUD (code, type, value, planFilter, maxUses, expiry)
/admin/payments        → AdminPayments      — payment audit log with plan/date filters + CSV export
/admin/nps             → AdminNPS           — NPS score (promoters - detractors), raw responses, CSV export
/admin/certificates    → AdminCertificates  — students who have earned certificates; filter by
                                               min accuracy % and min attempts; shows grade, topics mastered
/admin/rag-health      → AdminRagHealth    ← NEW: chunk counts per subject (table + cards),
                                               coverage %, lastIndexed timestamp, "Send Test Email" form
```

### Key page updates
```
Dashboard.jsx   — NPSSurveyBanner (0-10 score, 30-day cooldown, 20+ attempts + 7-day account age)
                  LinkRequestsCard (pending parent/teacher link requests)
Settings.jsx    — CouponInput (validate + apply coupon before checkout)
                  ReferralCard (shareable /register?ref=<inviteCode>, shows referralCount)
                  Subscription card with upgrade CTA for free users
VoiceTutor.jsx  — Loads + displays persisted voice history on mount; clear history button
Practice.jsx    — FeedbackWidget shown after session (rate question quality)
```

### Components
```
Layout.jsx           — sidebar nav + outlet; fixed drawer on mobile (hamburger opens,
                        backdrop closes, auto-closes on route change); static on sm+
                        Certificate link in sidebar nav (after Analytics) ← NEW
                        Notification bell icon (header mobile + sidebar desktop) with red dot
                        badge; dropdown shows "No new notifications" placeholder ← NEW
BadgeToast.jsx       — floating toast when newBadges[] returned from practice submit
DoubtChat.jsx        — expandable multi-turn chat below wrong answers in Practice
FeedbackWidget.jsx   — inline 1-5 star + comment widget (used after practice sessions)
OfflineBanner.jsx    — shows when navigator.onLine is false
SearchOverlay.jsx    — ⌘K global search
Skeleton.jsx         — shimmer skeleton components: DashboardSkeleton, AnalyticsSkeleton,
                        LessonsSkeleton, ProfileSkeleton, SkeletonCard, SkeletonStat
DiagramLibrary.jsx   — SVG diagram components mapped to topicId via DIAGRAM_MAP
                        Science: 55/55 topics covered (Biology, Chemistry, Physics)
                        Math:    54/54 topics covered (Ch1–Ch14, 895 questions)
                        SST:     65/65 topics covered (History/Geo/Eco/PolSci, Ch1–Ch22)
                        Total:   174 SVG components
                        Export: <Diagram topicId="ch1_s1_c1_t1" /> renders SVG + label bar
```

### Frontend test suite (Vitest 2.x + jsdom@24)
```
Location: src/__tests__/
Runner:   vitest (npm test in frontend dir)
Coverage: @vitest/coverage-v8

src/__tests__/setup.js                    — @testing-library/jest-dom + scrollIntoView stub
src/__tests__/authStore.test.js           — 4 tests: initial state, setAuth, logout, re-auth
src/__tests__/api.interceptors.test.js    — 7 tests: CSRF cookie, method filter, 401 logout
src/__tests__/NPSSurveyBanner.test.jsx    — 5 tests: eligibility, score select, submit, dismiss
src/__tests__/useFeatureFlags.test.js     — 6 tests: fetch, unknown flag, error fallback, caching
src/__tests__/DoubtChat.test.jsx          — 18 tests: render guard, toggle, thread fetch, send, clear
src/__tests__/Layout.test.jsx             — 7 tests: Protected/AdminOnly/PublicOnly guards
src/__tests__/Practice.test.jsx           — 9 tests: topic load, session start, MCQ submit, summary
src/__tests__/Pricing.test.jsx            — 13 tests: loading, error, plan render, upgrade flow, Razorpay, current plan
src/__tests__/VoiceTutor.test.jsx         — 20 tests: render, mic transitions, voice→TTS flow, text input, clear history
```

---

## 7. AUTH + MIDDLEWARE

```
JWT payload: { id, name, role }   ← role added
JWT expiry: 7 days

middleware/auth.js       — verifies token, attaches req.user.
                            View-as-child swap (2026-05-25):
                              when req.headers["x-child-id"] is set AND the
                              parent owns that child (linkedStudents check,
                              cached 60s), req.user.id is swapped to the
                              child's id; original parent id saved at
                              req.parentUserId. Skip list protects routes
                              that need parent context: /api/portal/*,
                              /api/admin/*, /api/auth/*, /api/webhooks/*,
                              /api/public/*, /api/feedback/*, /api/push/*,
                              /api/v1/parent/*, /api/payment/*, /api/v1/payment/*,
                              /api/user/children, /api/user/me.
                            Frontend axios interceptor (services/api.js)
                              automatically attaches x-child-id when the
                              Zustand auth store's activeChild is set.
middleware/adminAuth.js  — requires role === "admin" in JWT
middleware/validate.js   — Joi schema validation; 422 on invalid input ← NEW
middleware/errorHandler.js — centralised error handler (AppError,
                              Mongoose validation, duplicate key, JWT) ← NEW

utils/AppError.js        — operational error class with statusCode
utils/email.js           — nodemailer wrapper; logs to console when SMTP not set
utils/logger.js          — structured logger (pretty dev / JSON prod)
utils/swagger.js         — OpenAPI 3.0 spec + setupSwagger(app); served at /api-docs
utils/cookieNames.js     — __Host-token / __Secure-refreshToken / __Host-csrf in prod
                           COOKIE_DOMAIN env var supported on refresh cookie
utils/validateEnv.js     — crashes on startup if required env vars missing
utils/redisClient.js     — ioredis singleton with in-memory fallback for dev
utils/sentry.js          — Sentry init wrapper; no-op when SENTRY_DSN not set; exports Sentry for captureException
utils/featureFlags.js    — flag registry with env-var overrides + rollout %; getFlagsForUser(user) for /api/flags endpoint
  Rollout flags: new_ai_model (0%), new_practice_ui (0%)
  Boolean flags: nps_survey, coupon_codes, voice_tutor, competition_rooms, parent_portal,
                 weekly_digest_email, push_notifications (all default true)
utils/outputGuard.js     ← NEW: pre-send safety check on every Claude response
  checkOutput(text) → { safe, reason } — blocks prompt leakage + harmful content
utils/aiMetrics.js       ← NEW: fire-and-forget per-call logging
  logAICall({ userId, aiType, subject, model, tokens, latencyMs, cached, hitRAG, success })
  → AICallLog.create() — powers admin AI metrics dashboard
utils/tokenBudget.js     ← UPDATED: per-user + global budget functions
  checkTokenBudget()            — global monthly cap (MONTHLY_TOKEN_BUDGET)
  incrementTokenBudget(tokens)  — global monthly counter
  checkUserTokenBudget(userId)  — per-user daily + monthly caps
  incrementUserTokenBudget(userId, tokens) — per-user counters
  checkAndAlertBudget()         — hourly cron: Resend email at 80% consumed (once/month)
  getTokenBudgetStats()         — used by admin cache-stats widget
scripts/backup.js        — mongodump → gzip archive → optional S3 upload; prunes old local backups; npm run backup
scripts/restore.js       — mongorestore from local file or S3 path; 5s abort window; npm run restore
.github/workflows/backup.yml — nightly cron 02:00 UTC; only runs if vars.BACKUP_ENABLED == 'true'

Frontend (main.jsx): Sentry browser SDK init with VITE_SENTRY_DSN + browserTracingIntegration
Frontend hooks/useFeatureFlags.js: fetches /api/flags once per page load; isEnabled(name)

Security hardening:
  helmet      — HTTP security headers (CSP, HSTS, etc.)
  morgan      — HTTP request logging (dev format)
  CORS origin — read from process.env.FRONTEND_URL (never hardcoded)
  planExpiry check in auth.js — fire-and-forget downgrade when plan expires
  Socket host guard — only room creator (hostId) can start_room/end_game
  Admin soft-delete — Questions/Topics use deletedAt flag, never hard-delete
  ReDoS prevention — escapeRegex() on all user-supplied regex inputs
  safeUser() — login/register returns all fields frontend needs (no extra /me call)

Rate limit: 300 req / 15 min (global)

Session stores (Redis, TTL-backed):
  practice:userId  — 2h TTL  (replaces in-memory sessions = {})
  exam:userId      — 3h TTL  (replaces in-memory activeExams = {})
  Set REDIS_URL in .env; falls back to in-memory Map in dev if absent

All controllers use: next(new AppError("msg", statusCode)) for 4xx
                     next(err) in catch blocks for 5xx (errorHandler logs)

Required env vars (server exits on startup if missing):
  MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY
  See backend/.env.example for full list

To make first admin:
  db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
  then re-login to get new JWT with role: "admin"
```

---

## 7b. TRACKS — multi-curriculum (added 2026-05-25)

Stellar now exposes three parallel learning tracks. Each is a self-contained
content + UI flow; the auth/profile layer is shared. PRO_TRACK_PLAN.md is the
canonical reference for the Java pilot.

| Track key      | Audience          | Status (2026-05-25) | Where it lives                       |
|----------------|-------------------|---------------------|--------------------------------------|
| `school`       | K-12 (CBSE/ICSE/AP_SSC/...) | LIVE     | NcertChapter / NcertTopicContent / Question + Lessons, Practice, Analytics … |
| `pro_java`     | Adult professional | 🎉 **ALL 9 PHASES COMPLETE** (46 mod / 232 topics / 3311 ex / 232 proj / 168,365 XP / 419-edge DAG / 911 RAG chunks) | ProTrack/ProModule/ProTopic/ProExercise/ProProject/ProSubmission/ProProgress + `/api/v1/pro/*` + `/pro/*` frontend |
| `pro_<lang>`   | Future languages   | not yet built       | Same shape as pro_java               |
| `competitive`  | JEE/NEET/UPSC/…    | not yet built       | TBD                                  |

User multi-track enrolment lives on `User.tracks: [{ key, role, enrolledAt }]`.
`requireEmailAllowlist("PRO_TRACKS_ENABLED_FOR_EMAILS")` gates the pilot to an
explicit allowlist of internal emails during ramp.

**Active-track sidebar (added 2026-05-26).** `User.activeTrack: String` stores
the user's currently-active track; the sidebar nav is resolved per track by
`services/navService.js` (`NAV_CONFIG = { school: [...], pro_java: [...] }`).
Switching is one click via `<TrackSwitcher />` in the sidebar header, which
calls `PATCH /api/user/active-track` (auth + Joi-validated, enrolment-gated).
`GET /api/user/nav` returns `{ activeTrack, tracks, items }` for the current
user. Items flagged `crossMode: true` (only `/pro` today) are stripped from
the school nav unless the user is also enrolled in a `pro_*` track — pure
school students don't see the upsell. `proService.enroll` writes
`activeTrack = trackKey` on a user's *first* enrolment so first-time pro
signups land in the pro shell automatically. Migration
`migrations/2026-05-26_users_add_active_track.mjs` backfills existing rows
(`activeTrack = tracks[0]?.key ?? "school"`). Boards-countdown badge in the
sidebar is hidden in pro mode. Layout refetches nav whenever the effective
actor changes (`user._id` *or* `activeChild._id`) so parent-as-child views
render the child's nav, not the parent's. Follow-up: Voice Tutor system-
prompt switching per `activeTrack`; aggregated Certificates wall across
tracks.

**Track discovery / add (added 2026-05-26).** `/tracks` page lists the
user's enrolled tracks plus available pro tracks (via `proListTracks`);
each card shows Active/Switch/Enrol depending on state. Linked from the
TrackSwitcher dropdown footer ("+ Add another track" — renders even for
single-track users) and from the top-right user dropdown ("My tracks").
When `proListTracks` 403s for non-allowlisted users, the page shows a
private-pilot waitlist card instead of hiding Pro entirely.

**Pro-track per-page shell + polymorphic bookmarks (2026-05-27).** `/`
(Dashboard), `/practice`, and `/bookmarks` are now route-level switches
that render pro-specific components when `activeTrack` is `pro_*`:
`pages/DashboardSwitch.jsx`, `pages/PracticeSwitch.jsx`,
`pages/BookmarksSwitch.jsx`. Each picks between the existing school page
and a `components/pro/Pro<Name>.jsx` variant — keeps the school surface
untouched and avoids rules-of-hooks issues from conditional rendering
inside the 1245-line Dashboard. New `ProBookmark` model on `proModels.js`
is polymorphic over `kind: "exercise" | "topic" | "project"` with
`refId: String`; unique index on `(userId, kind, refId)`. Service
functions `toggleBookmark(userId, kind, refId)` and `listBookmarks` do
per-kind joins so list rows arrive with the right metadata. Routes:
`POST /api/v1/pro/exercises/:exerciseId/bookmark`, `POST
/api/v1/pro/topics/:topicId/bookmark` (project route deferred until the
project UI exists; service + model already accept `kind: "project"`).
Bookmark icon on `ProExerciseRunner.jsx` and `ProTopicView.jsx`. List
view at `/bookmarks` groups Saved exercises / Saved topics / Saved
projects with kind-appropriate metadata and links. Tests: 10 integration
tests in `proBookmark.integration.test.js`.

**PRO_TRACK_PLAN decision #8 reversed (2026-05-26).** Pro-track learner is
no longer required to be the parent. `/api/v1/pro` was removed from
`CHILD_SWAP_SKIP_PREFIXES` in `middleware/auth.js` so when a parent is
viewing-as-child, all pro actions (enrol, progress, submissions) are
scoped to the child. The pilot email allowlist still checks the parent's
email via `featureFlag.js`'s `req.parentUserId` fallback, so the gate
isn't widened — only the *owner* of each enrolment changes. Rationale:
school students with parent-managed accounts must be able to have their
own Java journey without sharing the parent's account state.

### Pro-track architecture cheatsheet

```
Backend
  models/proModels.js                         8 schemas (added ProTutorSession 2026-06-01)
                                              ProTopic.visualizer (Mixed, default null) —
                                              optional interactive widget config, wired
                                              by seedJavaPilot's TOPIC_VISUALIZERS map
                                              (integration concern, not in topic.json)
                                              ProTutorSession — per-exercise Socratic
                                              tutor chat; 30-day TTL; messages[].rating
  middleware/featureFlag.js                   email-allowlist gate
  middleware/trackFilter.js                   User.tracks-based enrolment check
  services/codeExecutionService.js            Judge0 wrapper + rate limit
                                              (30/hr, 100/day per user via Redis)
  services/proService.js                      listTracks/getTrack/getModule/getTopic/
                                              listExercises/getExercise/submitExercise/
                                              getProgress/enroll
                                              Redis cache: getTopic + listExercises
                                              (5 min TTL) — warm reads ~5ms vs ~200ms
  services/tutorService.js                    AI Socratic Tutor — ask/getSession/
                                              rateMessage; claude-sonnet-4-6; 10 q/hr
                                              per user via Redis; code length guard 8kB
  services/tutorPrompts.js                    Socratic system prompt + hint escalation
  services/proAnalyticsService.js             Fixed: .toObject() removed from lean()
                                              result (was crashing pro analytics)
  controllers/proController.js                thin HTTP delegators (+ tutorAsk,
                                              tutorGetSession, tutorRateMessage)
  validators/proValidator.js                  Joi schemas (strict snake_case IDs +
                                              tutorAskBodySchema, tutorRateBodySchema)
  routes/proRoutes.js                         /api/v1/pro/* — mounted in server.js
                                              POST /tutor/ask (rate-limited)
                                              GET  /tutor/session/:exerciseId
                                              POST /tutor/session/:sessionId/rate
  routes/userRoutes.js                        Redis cache: GET /user/me (30s TTL) +
                                              GET /user/nav (60s TTL) with parallel
                                              queries; cache invalidated on writes
  config/seedJavaPilot.js                     idempotent seed — walks content/pro/java/m*/topics/t*/
  content/pro/java/m{1..46}_*/topics/t*/      source-of-truth JSONs (ALL 46 MODULES LIVE 2026-05-26)
    └── topic.json + exercises.json + project.json per topic
    └── m1 fundamentals has 6 topics incl. authored M1-T6 Scanner Basics (closes Module 1 beginner-input gap)
    └── m7 exception_handling: try/catch, exception types, custom exceptions, defensive programming, try-with-resources
    └── m8 lambdas_streams: lambda expressions, functional interfaces, Stream API, Collectors, Optional
    └── m9 generics: generic classes, generic methods, bounded type params, wildcards (PECS), generic interfaces
    └── m10 concurrency: thread basics, synchronization, ExecutorService, concurrent collections, CompletableFuture
    └── m11 io_files: NIO file API, buffered I/O, CSV/JSON, HttpClient, async HTTP+CompletableFuture
    └── m12 testing: JUnit 5 basics, parameterized tests, Mockito, testing I/O+HTTP, TDD (Red/Green/Refactor)
    └── m13 spring_boot: Spring Boot intro, REST controllers, Spring Data JPA, validation/exceptions, Spring Boot testing
  controllers/authController.js               register() now passes grade/examBoard
                                              as null to skip schema defaults — pro
                                              users don't need a grade on sign-up
  infra/judge0/                                Docker Compose + judge0.conf.example
                                                + README runbook

Frontend
  src/services/api.js                         9 pro* HTTP wrappers
  src/pages/Welcome.jsx                       /welcome audience picker
  src/pages/onboarding/Pro.jsx                /onboarding/pro
  src/pages/professional/ProTrackPicker.jsx   /pro
  src/pages/professional/ProCourseLanding.jsx /pro/:trackSlug
  src/pages/professional/ProModuleView.jsx    /pro/:trackSlug/:moduleId
  src/pages/professional/ProTopicView.jsx     /pro/:trackSlug/:moduleId/:topicId
                                                + lazy-renders <VisualizerShell/> when
                                                  topic.visualizer.kind is set
                                                + prefetches VisualizerShell in parallel
                                                  with topic API call on mount
  src/pages/professional/ProExerciseRunner.jsx /pro/exercise/:exerciseId
  src/pages/Analytics.jsx                     Pro-track aware: branches to pro analytics
                                                when activeTrack is pro_*
  src/pages/Certificate.jsx                   Track-branched: pro → purple XP/exercises
                                                certificate; school → gold grade/accuracy
  src/pages/Profile.jsx                       Pro users see "Java · Professional" not
                                                "Class 10 · CBSE"; school fields hidden
                                                for pro; "Complete your profile →" prompt
  src/pages/Planner.jsx                       Track-aware create-plan modal: pro users
                                                get Java focus areas + coding sprint
                                                templates
  src/pages/DashboardSwitch.jsx               Route-level switch: renders ProDashboard
                                                or school Dashboard based on activeTrack
  src/pages/PracticeSwitch.jsx                Route-level switch: pro vs school Practice
  src/pages/BookmarksSwitch.jsx               Route-level switch: pro vs school Bookmarks
  src/components/TrackSwitcher.jsx            Sidebar track switcher (calls PATCH
                                                /api/user/active-track)
  src/components/TrackTabs.jsx                Dashboard track switcher (?track=)
  src/components/Layout.jsx                   Sidebar subtitle: "Set up your profile"
                                                when grade/board unset; "Java ·
                                                Professional" for pro track
  src/components/pro/ProDashboardSnapshot.jsx Pro view on Dashboard
  src/components/pro/CodeEditor.jsx           Monaco wrapper (lazy chunk)
  src/store/trackStore.js                     hydration flag, refreshNav guard,
                                                setActiveTrack via API
  src/App.jsx                                 BoardGated skips grade/examBoard check
                                                for pro-track users
  vite.config.js                              server.warmup pre-compiles hot paths;
                                                optimizeDeps.include pre-bundles
                                                framer-motion, Monaco, recharts
  src/components/dsa/                         Interactive DSA visualizer toolkit (v3 Phase 1.A)
    VisualizerShell.jsx                       Dispatcher on `kind`. 45 kinds (all
                                                sandboxes lazy-loaded — Monaco only
                                                downloads for sorting topics):
                                                sorting-sandbox · binary-search ·
                                                linked-list · stack · tree ·
                                                array-pointers · heap · hash-table ·
                                                string-matching · graph ·
                                                sliding-window · dutch-flag ·
                                                palindrome · dp-grid ·
                                                linked-list-cycle · monotonic-stack ·
                                                tree-traversal · trie · k-largest ·
                                                graph-topo · graph-dijkstra ·
                                                prefix-sums · queue ·
                                                sliding-window-max · lca ·
                                                counting-sort · rotated-search ·
                                                union-find · k-way-merge · lru ·
                                                anagram · merge-ll · custom-hash ·
                                                tree-path · pq-lazy · islands ·
                                                search-on-answer · matrix-search ·
                                                hash-grouping · hash-dedup ·
                                                interval-merge · memory-model ·
                                                recursion · doubly-ll ·
                                                circular-ll · array-insert
    modes/                                    Per-kind orchestrators (T1 + T2-T5)
      SortingSandbox.jsx                        M38-T1 sorts + student mode
                                                (extracted from VisualizerShell —
                                                now its own lazy-loaded file)
      BinarySearchSandbox.jsx                   M39-T1 binary search
      LinkedListSandbox.jsx                     M32-T1, T3 linked list ops
      StackSandbox.jsx                          M33-T1 LIFO push/pop/peek
      TreeSandbox.jsx                           M35-T3 BST insert + search
      ArrayPointersSandbox.jsx                  M30-T1 two-pointer 2-sum
      HeapSandbox.jsx                           M36-T1 heap ops (array+tree paired)
      HashTableSandbox.jsx                      M34-T1 separate-chaining put/get
      StringMatchSandbox.jsx                    M31-T2 KMP w/ failure table
      GraphSandbox.jsx                          M37-T1 BFS/DFS
      SlidingWindowSandbox.jsx                  M30-T2 fixed-size window
      DutchFlagSandbox.jsx                      M30-T4 3-way partition
      PalindromeSandbox.jsx                     M31-T3 expand-around-center
      LCSGridSandbox.jsx                        M31-T5 LCS DP grid
      FloydCycleSandbox.jsx                     M32-T2, T4 tortoise & hare
      MonotonicStackSandbox.jsx                 M33-T2 next-greater-element
      TreeTraversalSandbox.jsx                  M35-T1 in/pre/post/level/zigzag
      TrieSandbox.jsx                           M35-T5 prefix tree insert+search
      KLargestSandbox.jsx                       M36-T2 streaming K-largest
      GraphTopoSandbox.jsx                      M37-T3 Kahn's topological sort
      GraphDijkstraSandbox.jsx                  M37-T4 Dijkstra SSSP
      PrefixSumsSandbox.jsx                     M30-T3 build + O(1) range query
      QueueSandbox.jsx                          M33-T3 FIFO enq/deq/peek
      SlidingWindowMaxSandbox.jsx               M33-T4 monotonic deque
      LCASandbox.jsx                            M35-T2 recursive LCA
      CountingSortSandbox.jsx                   M38-T2 count / cumulative / place
      RotatedSearchSandbox.jsx                  M39-T3 BS w/ sorted-half decision
      UnionFindSandbox.jsx                      M37-T5 DSU + path compression
      KWayMergeSandbox.jsx                      M36-T4 k sorted lists + min-heap
      LRUSandbox.jsx                            M34-T5 HashMap + DLL paired
      AnagramSandbox.jsx                        M31-T4 freq inc/dec check
      MergeLLSandbox.jsx                        M32-T5 two-pointer LL merge
      CustomHashSandbox.jsx                     M34-T4 naive vs composite hash
      TreePathSandbox.jsx                       M35-T4 root-to-leaf DFS
      PQLazySandbox.jsx                         M36-T3 lazy-deletion heap
      IslandsSandbox.jsx                        M37-T2 grid BFS component count
      SearchOnAnswerSandbox.jsx                 M39-T2 BS on answer space (Koko)
      MatrixSearchSandbox.jsx                   M39-T4 staircase walk
      HashGroupingSandbox.jsx                   M34-T2 group anagrams
      HashDedupSandbox.jsx                      M34-T3 dedup w/ HashSet
      IntervalMergeSandbox.jsx                  M38-T3 merge overlapping intervals
      MemoryModelSandbox.jsx                    M4-T1 JVM stack/heap/refs (D1.1)
      RecursionSandbox.jsx                      M2-T5 call-stack frames (D1.2)
      DoublyLLSandbox.jsx                       M32-T1 doubly linked list (D2.1)
      CircularLLSandbox.jsx                     M32-T2 circular linked list (D2.2)
      ArrayInsertSandbox.jsx                    M30-T3 array insert-at-index (D2.3)
    algorithms/                               Step generators: 5 sorts, binary/
                                                linear search, linked-list ops,
                                                heap, hashTable, kmp, graph (BFS/
                                                DFS), slidingWindow, dutchFlag,
                                                palindrome, lcs, floydCycle,
                                                monotonicStack, treeTraversals,
                                                trie, kLargest, graphTopo, dijkstra,
                                                prefixSums, slidingWindowMax, lca,
                                                countingSort, rotatedSearch,
                                                unionFind, kWayMerge, lru, anagram,
                                                mergeLL, customHash, treePath,
                                                pqLazy, islands, searchOnAnswer,
                                                matrixSearch, hashGrouping,
                                                hashDedup, intervalMerge
    runners/studentRunner.js                  JS code tracer (50k-step loop guard)
    Render primitives (framer-motion)         ArrayBars · ArrayVisualizer ·
                                                LinkedListVisualizer ·
                                                StackVisualizer · TreeVisualizer ·
                                                HashTableVisualizer ·
                                                StringMatchVisualizer ·
                                                GraphVisualizer (directed +
                                                  edge weights + node labels) ·
                                                DPGridVisualizer ·
                                                CycleListVisualizer ·
                                                TrieVisualizer ·
                                                UnionFindVisualizer (parent forest) ·
                                                LRUVisualizer (HashMap + DLL paired) ·
                                                GridVisualizer (2D cells w/ states —
                                                  used by Islands + Matrix Search) ·
                                                IntervalVisualizer (timeline bars
                                                  with input + result rows) ·
                                                JVMMemoryVisualizer (stack/heap +
                                                  reference arrows — D1.1) ·
                                                CallStackVisualizer (recursion
                                                  frame cards — D1.2) ·
                                                HighlightedCode (line-by-line code
                                                  with active-line highlight — D1.3) ·
                                                VariablePanel (name→value table
                                                  with per-row state — D1.4) ·
                                                DoublyLinkedListVisualizer (horizontal
                                                  nodes + bidirectional arrows — D2.1) ·
                                                CircularLinkedListVisualizer (SVG arc
                                                  from tail back to head — D2.2)
    Controls / ExplanationPanel /             Playback toolbar + status panels +
      StatsPanel / DSACodeEditor                Monaco "Try It Yourself" mode

Analytics events (AnalyticsEvent, 90-day TTL)
  pro.enrolled · pro.topic_viewed · pro.exercise_started ·
  pro.code_submitted · pro.exercise_passed · pro.exercise_failed ·
  pro.sandbox.latency · pro.sandbox.rate_limited
```

---

## 8. DEPLOYMENT

```
Docker (full stack):
  docker-compose.yml at repo root spins up:
    mongo:5000  — MongoDB 7 with persistent volume
    redis:6379  — Redis 7 with AOF persistence
    api:5000    — Backend (node:20-alpine, non-root user)

  docker compose up -d
  Secrets: set JWT_SECRET + ANTHROPIC_API_KEY in environment or .env

PM2 (single VM, no Docker):
  cd ai-learning-backend
  pm2 start ecosystem.config.cjs --env production
  pm2 save && pm2 startup

  Cluster mode: one worker per CPU core (OS load-balances)
  Requires REDIS_URL so all workers share session state
  max_memory_restart: 500M, graceful shutdown: 30s kill_timeout

Files:
  ai-learning-backend/Dockerfile
  ai-learning-backend/.dockerignore
  ai-learning-backend/ecosystem.config.cjs
  docker-compose.yml
  backend/.env.example

CI/CD (.github/workflows/ci.yml):
  Triggers: push to main or cursor/** branches, PRs to main
  Jobs:
    backend-test   — Jest unit tests + integration tests against real MongoDB service
    frontend-build — Vitest + Vite build
    e2e            — Playwright (Chromium) against vite preview + test backend
    deploy         — SSH deploy to production (main branch only)

Backup (.github/workflows/backup.yml):
  Trigger: nightly cron 0 2 * * * (02:00 UTC) + workflow_dispatch
  Guard: only runs when vars.BACKUP_ENABLED == 'true'
  Installs mongodb-database-tools, runs node scripts/backup.js
  Annotates the workflow run on failure
  S3 upload optional: set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + BACKUP_S3_BUCKET

Flutter CI (.github/workflows/flutter-ci.yml) ← NEW:
  Triggers: push/PR to main — only when ai-learning-mobile/** files change
  Jobs: Flutter 3.19.0 setup, pub get, dart format check, flutter analyze,
        flutter test, flutter build apk --debug
```

---

## 9. FRONTEND STATE + API

```
authStore (Zustand + persist):
  token, user → { id, name, email, subject, grade, goal,
                  examDate, isPaid, plan, role }  ← role added
  activeChild → { _id, name, grade, examBoard, … } ← selected child sub-account (null for admin)
  setActiveChild(child), logout() (clears both user + activeChild)

api.js (axios, baseURL: http://localhost:5001/api):
  CSRF: reads csrf= cookie, sends x-csrf-token header on POST/PUT/PATCH/DELETE
  On 401 (except /user/me) → logout()

Complete api.js exports:
  Auth:     register, login, logoutApi, forgotPassword, resetPassword
  User:     getMe, updateMe, deleteMe, toggleBookmark, getBookmarks
  Topics:   getTopics, getTopicsMeta, searchTopics
  Lessons:  listLessons, getLesson, saveProgress
  Practice: startTopic, submitAnswer, startMixedPractice, flagQuestion,
            startBookmarkPractice, startRetryPractice(questionIds) ← NEW
  User:     getMe, updateMe, deleteMe, toggleBookmark, getBookmarks,
            getDailyBrief, getStreakStatus ← NEW
  Analysis: getReport, getErrorMemory, getWeeklyLeaderboard, getPrediction
  Revision: getRevisionDue, markRevised, getLastDayRevision
  Exams:    listExams, startExam, submitExam, getLeaderboard(examId)
  Planner:  getPlan, markDayComplete, saveTopicOrder
  AI:       getAIAdvice, getAIUsage, getAICacheStats, getAIMetrics,
            askTutor, evaluateExplanation, getHint,
            voiceAnswer, getVoiceHistory, clearVoiceHistory,
            rateAIResponse(questionText, mistakeType, subject, rating)
  Badges:   getBadges
  Feedback: submitFeedback, getNpsEligibility
  Doubt:    getDoubtThread, sendDoubtMessage, clearDoubtThread
  Portal:   searchStudents, linkStudentDirect, removeLinkedStudent,
            getLinkedStudents, getStudentAnalytics, getStudentDashboard,
            getLinkRequests, respondToLinkRequest, getClassStats,
            getStudentAttempts, getStudyReminders, setStudyReminder, deleteStudyReminder
  Competition: getRoomQuestions
  Curriculum: getCurriculumSubjects, listCurriculumChapters, getCurriculumChapter
  NCERT:    listNcertChapters, getNcertChapter, listNcertTopics, getNcertTopicContent,
            getStudiedTopics, toggleNcertStudied
  PYQ:      getPYQTopics, getPYQYears, getPYQs, getPYQById
  Payment:  getPlans, getSubscription, createOrder(planKey, couponCode?),
            verifyPayment, validateCoupon
  Push:     getVapidKey, subscribePush, unsubscribePush
  Flags:    getFlags
  Children: createChild, getChildren, deleteChild
  Exams:    listExams, startExam, submitExam, getLeaderboard(examId), generateMock
  Public:   getPublicStats
  Admin:    adminGetStats, adminGetAnalytics, adminGetUsers, adminUpdateRole,
            adminGetQuestions, adminGetFlagged, adminCreateQuestion,
            adminUpdateQuestion, adminDeleteQuestion, adminUnflagQuestion,
            adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
            adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon,
            adminGetCertificates,
            adminGetRagHealth, adminSendTestEmail(to), adminRunTrialEmails ← NEW
            adminGetPayments, adminUpdateUserPlan, adminDeleteUser, adminGetUserDetail
            adminGetCouponRedemptions(id), adminRunOnboardingEmails, adminRunWeeklyParentEmails
            adminGetFeedback
```

---

## 10. AI COST ARCHITECTURE

```
CACHE KEY:
  cacheKey = MD5(questionText.lower().trim() + "::" + mistakeType + "::" + subject)
  Topic normalisation (toLowerCase + trim) prevents duplicate cache misses

5 SUBJECT-SPECIFIC SYSTEM PROMPTS — each cached by Claude (90% token discount):
  Math          → CBSE Math teacher
  Science       → Physics/Chemistry/Biology teacher
  English       → First Flight + grammar teacher
  Social Science → History/Geography/Civics/Economics teacher
  Hindi         → Hindi grammar + prose teacher (prompt in Hindi)

RELIABILITY:
  Primary model (CLAUDE_MODEL env) → claude-haiku-4-5-20251001 fallback → 503 if both fail
  max_tokens truncation → appended notice: "My answer was cut short — ask me to continue"
  Output guardrails → prompt leakage + harmful content blocked before reaching student

PERSONALISATION:
  Student model injected per request: accuracy %, thinkingProfile, weakAreas, streak days
  Conversation context: last explanation stored 30 min in Redis, auto-injected into first chat turn
  RAG: top 3 NCERT chunks injected into explanation system prompt for relevant context

LESSON CACHE — DUAL STORE (survives Redis restart):
  Check Redis (24h TTL) → check MongoDB AIResponseCache → call Claude → store in both

DAILY LIMITS (per plan): free=10/day, pro=100/day, premium=500/day
  Enforced via atomic MongoDB $cond pipeline — race-condition safe
  DoubtChat messages count against the same daily quota

GLOBAL BUDGET:
  MONTHLY_TOKEN_BUDGET env → blocks calls when exhausted
  80% threshold → single Resend email alert per month (Redis dedup key)
  PER_USER_DAILY/MONTHLY_TOKEN_LIMIT → optional per-user Redis caps

VOICE TUTOR LANG:
  Hindi subject → SpeechRecognition.lang = "hi-IN"
  all others    → "en-IN"

FEEDBACK LOOP:
  Thumbs up/down on every AI explanation (POST /api/ai/feedback)
  Rate limited: 20 ratings/hour per user
  Stored in AIFeedback (one per user per cacheKey) — visible in admin metrics

METRICS:
  Every Claude call logged to AICallLog (90-day TTL auto-purge)
  Admin dashboard widget: 7-day totals, cache hit rate, RAG hit rate, avg latency,
    guardrail blocks, token cost, breakdown by aiType and subject
```

---

## 11. SEED DATA

```
config/seed.js                  — Math topics + questions
config/seedLessons.js           — initial lesson content
config/seedSubjects.js          — Science, English, Social Science, Hindi topics (50+ topics)
config/seedMathCurriculum.js    — CBSE Class 10 Math — 14 chapters, all sections, formulas, theorems, tips
config/seedScienceCurriculum.js  — CBSE Class 10 Science — 13 chapters
                                    Chemistry (Ch 1-4), Biology (Ch 5-8, 13), Physics (Ch 9-12)
                                    Source: C:\Users\LENOVO\Downloads\CBSE_10_Science
                                      ├── Chemistry\ (jesc101–104)
                                      ├── Biology\   (jesc105–108, jesc113)
                                      └── Physics\   (jesc109–112)
config/seedEnglishCurriculum.js  ← NEW: CBSE Class 10 English — 23 chapters
                                    First Flight (Ch 1-9), Footprints Without Feet (Ch 10-18),
                                    Words and Expressions 2 (Ch 19-23)
                                    Source: C:\Users\LENOVO\Downloads\CBSE_10_English
                                      ├── First_Flight\           (jeff101–109)
                                      ├── Footprints_Without_Feet\ (jefp101–109)
                                      └── Words_and_Expressions_2\ (jewe201–209)
config/seedHindiCurriculum.js    ← NEW: CBSE Class 10 Hindi — 32 chapters
                                    Kshitij Bhaag 2 (Ch 1-12), Sparsh Bhaag 2 (Ch 13-26),
                                    Kritika Bhaag 2 (Ch 27-29), Sanchayan Bhaag 2 (Ch 30-32)
                                    Source: C:\Users\LENOVO\Downloads\CBSE_10_Hindi
                                      ├── Kshitij_Bhaag_2\  (jhks101–112)
                                      ├── Sparsh_Bhaag_2\   (jhsp101–114)
                                      ├── Kritika_Bhaag_2\  (jhkr101–103)
                                      └── Sanchayan_Bhaag_2\ (jhsy101–103)
config/seedSocialScienceCurriculum.js ← NEW: CBSE Class 10 Social Science — 22 chapters
                                    History (Ch 1-5), Geography (Ch 6-12),
                                    Economics (Ch 13-17), Political Science (Ch 18-22)
                                    Source: C:\Users\LENOVO\Downloads\CBSE_10_Social_Science
                                      ├── History\           (jess301–305)
                                      ├── Geography\         (jess101–107)
                                      ├── Economics\         (jess201–205)
                                      └── Political_Science\ (jess401–405)

Total DB chapters: 104
  Math: 14 | Science: 13 | English: 23 | Hindi: 32 | Social Science: 22
```

Run order:
```bash
npm run seed
npm run seed:lessons
npm run seed:subjects                    ← Science/English/SocSci/Hindi topics
npm run seed:curriculum                  ← CBSE Class 10 Math textbook chapters
npm run seed:science-curriculum          ← CBSE Class 10 Science textbook chapters
npm run seed:english-curriculum          ← NEW: CBSE Class 10 English textbook chapters
npm run seed:hindi-curriculum            ← NEW: CBSE Class 10 Hindi textbook chapters
npm run seed:social-science-curriculum   ← NEW: CBSE Class 10 Social Science textbook chapters
npm run seed:ncert-content              ← NCERT chapter content (self-contained, no external files)
npm run seed:pyq                        ← 30+ real CBSE board exam PYQ MCQs (2020-2024)
npm run seed:science-questions          ← 30 CBSE MCQ practice questions for Science (seed 1)
npm run seed:science-chemistry-questions ← 60 Chemistry MCQs Ch1-4 (seed 2)
npm run seed:science-biology-questions   ← 75 Biology MCQs Ch5-8,13 (seed 3)
npm run seed:science-physics-questions   ← 60 Physics MCQs Ch9-12 (seed 4)
npm run seed:english-questions          ← 30 CBSE MCQ practice questions for English
npm run seed:hindi-questions            ← 30 CBSE MCQ practice questions for Hindi
npm run seed:social-questions           ← 30 CBSE MCQ practice questions for Social Science (legacy)
npm run seed:sst-history-content       ← SST NcertTopicContent — History Ch1–5 (12 topics)
npm run seed:sst-geography-content     ← SST NcertTopicContent — Geography Ch6–12 (17 topics)
npm run seed:sst-economics-content     ← SST NcertTopicContent — Economics Ch13–17 (14 topics)
npm run seed:sst-polsci-content        ← SST NcertTopicContent — Political Science Ch18–22 (12 topics)
npm run seed:sst-questions-a           ← SST questions History + Geography (~435 Qs, 15 per topic)
npm run seed:sst-questions-b           ← SST questions Economics Ch13–14 (~112 Qs)
npm run seed:sst-questions-c           ← SST questions Economics Ch15–17 + PolSci Ch18–22 (168 Qs, 8 per topic)
npm run seed:sst-topic-dag             ← Social Science Topic prerequisite DAG (55 nodes, Ch1–22)
npm run seed:sst-ncert-chapters        ← Bridge Chapter→NcertChapter for SST (powers /api/v1/ncert/chapters)
npm run seed:sst-all                   ← convenience: curriculum + NcertChapters + content + questions + DAG
npm run seed:science-chemistry-content  ← Science Chemistry NcertTopicContent (17 topics, Ch1-4 incl. carbon allotropes)
npm run seed:science-biology-content    ← Science Biology NcertTopicContent (23 topics, Ch5-8,13 incl. endocrine, reproductive health, variation)
npm run seed:science-physics-content    ← Science Physics NcertTopicContent (16 topics, Ch9-12 incl. domestic circuits)
npm run seed:science-topic-dag          ← Science Topic prerequisite DAG (50 nodes)
npm run seed:english-ncert-chapters    ← Bridge Chapter→NcertChapter for English (23 chapters, powers /api/v1/ncert/chapters)
npm run seed:english-content           ← English NcertTopicContent — 35 topics (FF Prose/Poems + FW + Grammar)
npm run seed:english-questions-a       ← English questions — First Flight Prose Ch1–9 (68 Qs)
npm run seed:english-questions-b       ← English questions — First Flight Poems Ch1–8 (53 Qs)
npm run seed:english-questions-c       ← English questions — Footprints Without Feet Ch1–9 (63 Qs)
npm run seed:english-questions-d       ← English questions — Workbook Grammar Units 1–9 (72 Qs)
npm run seed:english-topic-dag         ← English Topic prerequisite DAG (35 nodes, levels 0–3)
npm run seed:english-all               ← convenience: curriculum + NcertChapters + content + questions A/B/C/D + DAG
npm run seed:hindi-ncert-chapters      ← Bridge Chapter→NcertChapter for Hindi (32 chapters, powers /api/v1/ncert/chapters)
npm run seed:hindi-content-a           ← Hindi NcertTopicContent — Kshitij Bhaag 2 Ch1–12 (12 topics, in Hindi)
npm run seed:hindi-content-b           ← Hindi NcertTopicContent — Sparsh Bhaag 2 Ch13–26 (14 topics, in Hindi)
npm run seed:hindi-content-c           ← Hindi NcertTopicContent — Kritika Ch27–29 + Sanchayan Ch30–32 (6 topics, in Hindi)
npm run seed:hindi-questions-a         ← Hindi questions — Kshitij Ch1–12 (32 Qs, in Hindi)
npm run seed:hindi-questions-b         ← Hindi questions — Sparsh Ch13–26 (34 Qs, in Hindi)
npm run seed:hindi-questions-c         ← Hindi questions — Kritika Ch27–29 + Sanchayan Ch30–32 (21 Qs, in Hindi)
npm run seed:hindi-questions-d         ← Hindi questions — top-up to ≥4 Qs/chapter (42 Qs; total 129 Qs)
npm run seed:hindi-topic-dag           ← Hindi Topic prerequisite DAG (32 nodes, all level 0)
npm run seed:hindi-all                 ← convenience: curriculum + NcertChapters + content A/B/C + questions A/B/C/D + DAG
npm run seed:cbse-math9-cleanup        ← delete legacy math9_* docs (v1 + v2) — run once before the standardized seeds
npm run seed:cbse-math9-content        ← Class 9 Math NcertTopicContent — standardized (32 sub-topics, 14-point bar, cbse_math9_* IDs)
npm run seed:cbse-math9-questions-a    ← Class 9 Math Layer A — standard MCQs (320 questions, 10/sub-topic)
npm run seed:cbse-math9-questions-b    ← Class 9 Math Layer B — board-style MCQs (128 questions, 4/sub-topic)
npm run seed:cbse-math9-questions-c    ← Class 9 Math Layer C — PYQ/exemplar (64 questions, 2/sub-topic)
npm run seed:cbse-math9-topic-dag      ← Class 9 Math Topic DAG (32 nodes, within-chapter prerequisite chains)
npm run seed:cbse-math9-all            ← convenience: content + questions A/B/C + TopicDAG (512 questions, 32 DAG nodes)
npm run rag:build-topic-content        ← index standardized NcertTopicContent → NcertChunk (RAG; cbse_math9_* → 301 chunks)
npm run audit:math:cbse9               ← audit Class 9 Math against the 14-point checklist (must show 32/32 PASS)
npm run migrate:cbse-math10-rekey      ← re-key CBSE Class 10 Math topicIds ch{N}_s{S}_c{C}_t{T} → cbse_math10_* (pass --dry to preview)
npm run finalize:cbse-math10-rekey     ← finalize re-key: merge stray topics + re-key ch* ids in services/seeds/tests (--dry to preview)
npm run audit:math:cbse10              ← audit CBSE Class 10 Math against the 14-point checklist (must show 54/54 PASS)
npm run seed:icse-math10-all           ← Ph7 runner: content → QuestionsA/B/C → TopicDAG → RAG (full re-seed from scratch)
npm run seed:icse-math10-topic-dag     ← Ph5 only: seed Topic DAG (100 nodes, linear chain per chapter, examBoard ICSE)
npm run rag:build-icse-math10          ← Ph6 only: build RAG chunks (100 topics → 623 NcertChunk docs)
npm run audit:math:icse10              ← Ph8: audit ICSE Class 10 Math against the 14-point checklist (100/100 PASS)
npm run seed:icse-math9-all            ← Ph7 runner: curriculum → content → QuestionsA/B/C → TopicDAG → RAG (ICSE Class 9)
npm run seed:icse-math9-topic-dag      ← Ph5 only: seed Topic DAG (112 nodes, 24 cross-chapter edges, examBoard ICSE)
npm run rag:build-icse-math9           ← Ph6 only: build RAG chunks (112 topics, --prefix=icse_math9_)
npm run audit:math:icse9               ← Ph8: audit ICSE Class 9 Math against the 15-point checklist
npm run audit:coverage:math9           ← audit Math9 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math7-curriculum          ← Class 7 Math Chapter model (15 chapters, Ganita Prakash Grade 7 NCERT 2026)
npm run seed:math7-ncert-chapters      ← Class 7 Math NcertChapters bridge (15 chapters, chapterId: math7_ch1…)
npm run seed:math7-content             ← Class 7 Math NcertTopicContent (15 topics, flat format)
npm run seed:math7-questions-a         ← Class 7 Math MCQs ch1–ch8 (40 questions)
npm run seed:math7-questions-b         ← Class 7 Math MCQs ch9–ch15 (35 questions)
npm run seed:math7-topic-dag           ← Class 7 Math Topic DAG (15 nodes, prerequisite links)
npm run seed:math7-all                 ← convenience: all 6 Math7 seeds in sequence
npm run audit:coverage:math7           ← audit Math7 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math8-curriculum          ← Class 8 Math Chapter model (14 chapters, Ganita Prakash Grade 8 NCERT 2026) [legacy v2]
npm run seed:math8-ncert-chapters      ← Class 8 Math NcertChapters bridge (14 chapters, chapterId: math8_ch1…) [legacy v2]
npm run seed:math8-content             ← Class 8 Math NcertTopicContent (14 topics, flat format) [legacy v2]
npm run seed:math8-questions-a         ← Class 8 Math MCQs ch1–ch7 (35 questions) [legacy v2]
npm run seed:math8-questions-b         ← Class 8 Math MCQs ch8–ch14 (35 questions) [legacy v2]
npm run seed:math8-topic-dag           ← Class 8 Math Topic DAG (14 nodes, prerequisite links) [legacy v2]
npm run seed:math8-all                 ← convenience: all 6 Math8 seeds in sequence [legacy v2]
npm run audit:coverage:math8           ← audit Math8 coverage (Mathematics filter; must show ✅ FULLY COVERED)
# CBSE Math 8 — v3 Standardized (topicId: cbse_math8_*, 56 topics × 15/15 audit checks, 2026-05-24)
npm run seed:cbse-math8-cleanup        ← delete legacy math8_* docs before v3 re-seed
npm run seed:cbse-math8-content        ← 56 topics (14 ch × 4) with all 13 content fields + inline SVG
npm run seed:cbse-math8-questions-a    ← Layer A: 360 MCQs (10/topic) with {text,type,logicTag} options
npm run seed:cbse-math8-questions-b    ← Layer B: 155 free_text board-style questions (4/topic)
npm run seed:cbse-math8-questions-c    ← Layer C: 112 PYQ questions (2/topic) with pyqYear
npm run seed:cbse-math8-topic-dag      ← 56 Topic DAG nodes (linear chain within each chapter)
npm run seed:cbse-math8-all            ← convenience: cleanup → content → A/B/C → DAG in sequence
npm run rag:build-cbse-math8           ← build 397 RAG chunks (buildRagFromTopicContent --prefix=cbse_math8_)
npm run audit:math:cbse8               ← 15-check completeness gate; must exit 0 (56/56 ✅ as of 2026-05-24)
npm run seed:ap-ssc-math10             ← AP SSC Math 10: clone 54 NcertTopicContent + 1140 Questions from cbse_math10_* → ap_ssc_math10_*, examBoard=AP_SSC
npm run seed:ap-ssc-math10-dag         ← AP SSC Math 10 Topic DAG: 54 nodes (14 ch), linear chain + cross-chapter prereqs
npm run seed:ap-ssc-math10-all         ← convenience: content clone + DAG in sequence
npm run rag:build-ap-ssc-math10        ← build 884 RAG chunks (buildRagFromTopicContent --prefix=ap_ssc_math10_)
npm run audit:math:ap-ssc-10           ← 15-check completeness gate; must exit 0 (54/54 ✅ as of 2026-05-24)
npm run audit:coverage:ap-ssc-math     ← coverage audit for AP SSC Mathematics only
npm run audit:coverage:ap-ssc-all      ← coverage audit for all AP SSC subjects
# AP SSC Math 8 — original content (topicId: ap_ssc_math8_*, 16 ch, 56 topics × 15/15 audit, 2026-06-03)
npm run seed:ap-ssc-math8-chapters     ← 16 NcertChapter skeletons (ap_ssc_math8_ch1–ch16, board=AP_SSC, grade=8)
npm run seed:ap-ssc-math8-content-ch01 … -ch16  ← 56 topics, full 15-field v3 content (one script per chapter)
npm run seed:ap-ssc-math8-questions-ch01 … -ch16 ← 280 MCQ total (~5/topic) with {text,type,logicTag} options
npm run seed:ap-ssc-math8-dag          ← 56-node topic DAG (1 node/sub-topic, acyclic, 0 dangling, 4 roots)
npm run rag:build-ap-ssc-math8         ← build 265 RAG chunks (buildRagFromTopicContent --prefix=ap_ssc_math8_)
# audit: npm run audit:math -- --prefix=ap_ssc_math8_   (no board/grade mapping; MUST use --prefix). 56/56 ✅
npm run seed:math6-curriculum          ← Class 6 Math Chapter model (10 chapters, Ganita Prakash Grade 6 NCERT 2026)
npm run seed:math6-ncert-chapters      ← Class 6 Math NcertChapters bridge (10 chapters, chapterId: math6_ch1…)
npm run seed:math6-content             ← Class 6 Math NcertTopicContent (10 topics, flat format)
npm run seed:math6-questions-a         ← Class 6 Math MCQs ch1–ch5 (25 questions)
npm run seed:math6-questions-b         ← Class 6 Math MCQs ch6–ch10 (25 questions)
npm run seed:math6-topic-dag           ← Class 6 Math Topic DAG (10 nodes, prerequisite links)
npm run seed:math6-all                 ← convenience: all 6 Math6 seeds in sequence
npm run audit:coverage:math6           ← audit Math6 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math5-curriculum          ← Class 5 Math Chapter model (14 chapters, Maths Magic NCERT)
npm run seed:math5-ncert-chapters      ← Class 5 Math NcertChapters bridge (14 chapters, chapterId: math5_ch1…)
npm run seed:math5-content             ← Class 5 Math NcertTopicContent (14 topics, flat format)
npm run seed:math5-questions-a         ← Class 5 Math MCQs ch1–ch7 (35 questions)
npm run seed:math5-questions-b         ← Class 5 Math MCQs ch8–ch14 (35 questions)
npm run seed:math5-topic-dag           ← Class 5 Math Topic DAG (14 nodes, prerequisite links)
npm run seed:math5-all                 ← convenience: all 6 Math5 seeds in sequence
npm run audit:coverage:math5           ← audit Math5 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math4-curriculum          ← Class 4 Math Chapter model (14 chapters, Math Magic NCERT)
npm run seed:math4-ncert-chapters      ← Class 4 Math NcertChapters bridge (14 chapters, chapterId: math4_ch1…)
npm run seed:math4-content             ← Class 4 Math NcertTopicContent (14 topics, flat format)
npm run seed:math4-questions-a         ← Class 4 Math MCQs ch1–ch7 (35 questions)
npm run seed:math4-questions-b         ← Class 4 Math MCQs ch8–ch14 (35 questions)
npm run seed:math4-topic-dag           ← Class 4 Math Topic DAG (14 nodes, prerequisite links)
npm run seed:math4-all                 ← convenience: all 6 Math4 seeds in sequence
npm run audit:coverage:math4           ← audit Math4 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math3-curriculum          ← Class 3 Math Chapter model (14 chapters, Math Magic NCERT)
npm run seed:math3-ncert-chapters      ← Class 3 Math NcertChapters bridge (14 chapters, chapterId: math3_ch1…)
npm run seed:math3-content             ← Class 3 Math NcertTopicContent (14 topics, flat format)
npm run seed:math3-questions-a         ← Class 3 Math MCQs ch1–ch7 (35 questions)
npm run seed:math3-questions-b         ← Class 3 Math MCQs ch8–ch14 (35 questions)
npm run seed:math3-topic-dag           ← Class 3 Math Topic DAG (14 nodes, prerequisite links)
npm run seed:math3-all                 ← convenience: all 6 Math3 seeds in sequence
npm run audit:coverage:math3           ← audit Math3 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math2-curriculum          ← Class 2 Math Chapter model (15 chapters, Math Magic NCERT)
npm run seed:math2-ncert-chapters      ← Class 2 Math NcertChapters bridge (15 chapters, chapterId: math2_ch1…)
npm run seed:math2-content             ← Class 2 Math NcertTopicContent (15 topics, flat format)
npm run seed:math2-questions-a         ← Class 2 Math MCQs ch1–ch8 (40 questions)
npm run seed:math2-questions-b         ← Class 2 Math MCQs ch9–ch15 (35 questions)
npm run seed:math2-topic-dag           ← Class 2 Math Topic DAG (15 nodes, prerequisite links)
npm run seed:math2-all                 ← convenience: all 6 Math2 seeds in sequence
npm run audit:coverage:math2           ← audit Math2 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run seed:math1-curriculum          ← Class 1 Math Chapter model (13 chapters, Math Magic NCERT)
npm run seed:math1-ncert-chapters      ← Class 1 Math NcertChapters bridge (13 chapters, chapterId: math1_ch1…)
npm run seed:math1-content             ← Class 1 Math NcertTopicContent v1 [superseded by v2]
npm run seed:math1-questions-a         ← Class 1 Math MCQs v1 [superseded by v2]
npm run seed:math1-questions-b         ← Class 1 Math MCQs v1 [superseded by v2]
npm run seed:math1-topic-dag           ← Class 1 Math Topic DAG (13 nodes, prerequisite links)
npm run seed:math1-all                 ← convenience: all 6 Math1 v1 seeds [use v2 instead]
npm run seed:math1-cleanup-v1          ← delete old v1 single-topic entries (13 deleted)
npm run seed:math1-v2-content          ← Class 1 Math v2 NcertTopicContent (52 sub-topics, 4/chapter)
npm run seed:math1-v2-questions-a      ← Class 1 Math v2 MCQs Ch1–Ch2 (64 questions)
npm run seed:math1-v2-questions-b      ← Class 1 Math v2 MCQs Ch3–Ch4 (64 questions)
npm run seed:math1-v2-questions-c      ← Class 1 Math v2 MCQs Ch5–Ch6 (64 questions)
npm run seed:math1-v2-questions-d      ← Class 1 Math v2 MCQs Ch7–Ch8 (64 questions)
npm run seed:math1-v2-questions-e      ← Class 1 Math v2 MCQs Ch9–Ch10 (64 questions)
npm run seed:math1-v2-questions-f      ← Class 1 Math v2 MCQs Ch11–Ch12 (64 questions)
npm run seed:math1-v2-questions-g      ← Class 1 Math v2 MCQs Ch13 (32 questions)
npm run seed:math1-v2-all              ← convenience: cleanup + content + all 7 question files
npm run audit:coverage:math1           ← audit Math1 coverage (Mathematics filter; must show ✅ FULLY COVERED)
npm run rag:build-curriculum            ← build RAG chunks from Chapter docs (Science/English/Hindi/SocSci)
npm run rag:build-science               ← RAG chunks for Science only
npm run migrate                         ← run pending DB migrations (migrate-mongo)
```

---

## 12. TEST SUITE

### Backend (Jest ESM)
```
Location: backend/__tests__/
Runner:   node --experimental-vm-modules ./node_modules/jest-cli/bin/jest.js
Command:  npm test              (unit tests, ignores integration/)
          npm run test:integration  (integration tests against real DB)

Unit tests (30 files): analysisService, scoringService, plannerService, aiRouter,
  auth.middleware, adminAuth.middleware, validate.middleware, practice.controller,
  exam.controller, payment.service, portal.controller, adaptive.service,
  revision.service, streak.service, autoDoubt.service, aiTeacher.service,
  ai.service (20 tests: getSystemPrompt subjects/fallback, getAIExplanation, generateAIQuestion, getStudyAdvice, generateHint, getChatResponse history cap),
  profile.service (18 tests: accuracy avg, avgTime, weakAreas, strongAreas, thinkingProfile, difficultyLevels),
  selfLearning.service (12 tests: attempts/correct increment, rolling avgTime, error distribution, bad-question flag, difficulty sync),
  foundation.service (9 tests: unknown topic, null profile, empty weakAreas, no overlap, prereq match redirect),
  push.service (14 tests: sendPush, sendRevisionReminders 410 cleanup, sendStudyReminders time filter, notifyParentsOfMilestone),
  weeklyParentEmailService (10 tests: per-parent email, subject/HTML content, updatedAt, inactive fallback, error resilience),
  competition.controller (13 tests: Joi schema boundary, aggregate query, topic filter, default count, $map projection, next(err)),
  badgeService (17 tests), predictionService (13 tests), couponService (19 tests),
  onboardingEmailService (9 tests), adminStats.controller (6 tests),
  admin.routes (10 tests: adminAuth + validate), user.controller (4 tests: GDPR + updateMe)

Integration tests (backend/__tests__/integration/):
  _setup.js — connects to MONGO_URI if set (CI real DB), else MongoMemoryServer
  auth.integration.test.js   — register, login lockout, password update, soft-delete
  aiQuota.integration.test.js — daily quota tracking, plan limits
```

### E2E Tests (Playwright)
```
Location: ai-learning-frontend/frontend/e2e/
Config:   playwright.config.js  (Chromium, baseURL from PLAYWRIGHT_BASE_URL)
Command:  npm run test:e2e  (in frontend dir)

e2e/auth.spec.js     — landing page CTA, register, login, wrong password, forgot link,
                        pricing page, terms page, privacy page
e2e/practice.spec.js — authenticated: practice page, dashboard stats, analytics,
                        settings, sidebar nav links, sign-out
```

### Frontend (Vitest 2.x + jsdom@24)
```
Location: src/__tests__/
Runner:   vitest  (npm test in ai-learning-frontend/frontend/)
Coverage: @vitest/coverage-v8
Node version requirement: ≥20.11.1 (pinned vitest@2 for Node 20.11.1 compatibility)

src/__tests__/setup.js                    — @testing-library/jest-dom import
src/__tests__/authStore.test.js           — 4 tests
  ✅ initial state is null
  ✅ setAuth stores user (ignores token)
  ✅ logout clears state
  ✅ re-auth replaces previous user
src/__tests__/api.interceptors.test.js    — 7 tests
  ✅ CSRF token extracted from cookie
  ✅ POST/PUT/DELETE get x-csrf-token header
  ✅ GET/HEAD/OPTIONS do not get header
  ✅ 401 triggers logout
  ✅ 401 on /user/me does NOT trigger logout
  ✅ non-401 error does not trigger logout
  ✅ successful response passes through
src/__tests__/NPSSurveyBanner.test.jsx    — 5 tests
  ✅ renders nothing when not eligible
  ✅ shows survey when eligible
  ✅ submit disabled until score selected
  ✅ shows thanks after successful submission
  ✅ dismiss hides banner
src/__tests__/useFeatureFlags.test.js     — 6 tests
  ✅ fetches flags on mount, isEnabled returns correct bool
  ✅ unknown flag defaults to false
  ✅ graceful fallback when /api/flags fails
  ✅ does not re-fetch when already loaded (caching)
src/__tests__/DoubtChat.test.jsx          — 18 tests
  ✅ render guard, toggle open/close, thread fetch, send message, auto-scroll, clear
src/__tests__/Layout.test.jsx             — 7 tests
  ✅ Protected guard: unauthenticated → /login
  ✅ AdminOnly guard: student role → /
  ✅ PublicOnly guard: authenticated → /dashboard
src/__tests__/Practice.test.jsx           — 9 tests
  ✅ topic load, session start, MCQ submit, confidence slider, summary screen
src/__tests__/Pricing.test.jsx            — 13 tests
  ✅ loading spinner, error state, plan render (₹0/₹499/₹999), upgrade flow,
     createOrder called with planId, Razorpay constructor+open, prefill name+email,
     Processing spinner, script-load failure, current-plan button disabled
src/__tests__/VoiceTutor.test.jsx         — 20 tests
  ✅ initial render + history load + empty state
  ✅ mic start→Listening…, stop, onerror message
  ✅ voice flow: onresult→voiceAnswer API→reply+TTS, AI is speaking state
  ✅ text input: Ask button, Enter, disabled on empty, whitespace guard
  ✅ error handling, clear history, quick-prompt buttons
Total: 89 frontend tests
```

### Load Tests (k6)
```
Location: load-tests/practice-session.js
Runner:   k6 run load-tests/practice-session.js
  (requires k6 installed: https://k6.io/docs/get-started/installation/)

Flow: login → GET /topics → POST /practice/start → 5× POST /practice/submit
Stages: 15s→20VU ramp, 30s→100VU ramp, 60s sustain, 15s ramp-down
Custom metrics: loginDuration, startDuration, submitDuration (Trend), sessionErrors (Counter)
Thresholds: http_req_failed < 2%, p(95) < 2000ms
```

---

## 13. PWA  ← NEW

```
public/manifest.json   — name, icons, theme_color (#007AFF), display: standalone
public/sw.js           — service worker:
  - caches /index.html for offline fallback
  - handles push events → showNotification
  - handles notificationclick → focus/open app

index.html             — <link rel="manifest">, theme-color meta tag

Push notification triggers (backend shell ready, VAPID keys needed):
  - Revision due today
  - Streak at risk (no activity by 8pm)
  - Competition starting

To activate push (not yet wired):
  1. Generate VAPID keys: npx web-push generate-vapid-keys
  2. Add to .env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL
  3. Install: npm install web-push
  4. Register sw.js from frontend + POST /api/notifications/subscribe
```

---

## 14. CURRENT STATE — WHAT IS BUILT ✅

| Feature | Status |
|---|---|
| Auth (register/login/JWT + role) | ✅ Complete |
| Onboarding flow | ✅ Complete |
| Dynamic topics from DB | ✅ Complete |
| Multi-subject: Math/Science/English/Social Science/Hindi | ✅ Complete |
| Adaptive practice engine | ✅ Complete |
| Thinking behaviour analysis | ✅ Complete |
| Spaced repetition revision | ✅ Complete |
| 7-layer AI cost minimisation | ✅ Complete |
| Subject-aware AI cache keys | ✅ Complete |
| AI-generated questions (DB-first) | ✅ Complete |
| AI-generated lessons (DB-first) | ✅ Complete |
| AI explanations for mistakes | ✅ Complete |
| AI study advice | ✅ Complete |
| AI Teacher contextual messages | ✅ Complete |
| Study planner (goal-based) | ✅ Complete |
| Exam engine (scored + normalised) | ✅ Complete |
| ExamReview with AI explanations | ✅ Complete |
| Weekly leaderboard | ✅ Complete |
| Live competition rooms (Socket.IO) | ✅ Complete |
| Streak tracking | ✅ Complete |
| UserProfile (thinking profile) | ✅ Complete |
| Analytics dashboard | ✅ Complete |
| AI daily quota enforcement | ✅ Complete |
| Apple design system on all pages | ✅ Complete |
| Error memory tracking | ✅ Complete |
| Foundation gap detection | ✅ Complete |
| VoiceTutor (mic + TTS + subject-aware) | ✅ Complete |
| Admin dashboard (/admin route) | ✅ Complete |
| Admin question/topic/user CRUD | ✅ Complete |
| Achievement badge system | ✅ Complete |
| BadgeToast component | ✅ Complete |
| PWA manifest + service worker | ✅ Complete |
| Parent/Teacher portal | ✅ Complete |
| Student invite code system | ✅ Complete |
| Multi-turn DoubtChat per question | ✅ Complete |
| Exam score prediction (weighted) | ✅ Complete |
| CBSE grade prediction (A1–E) | ✅ Complete |
| Test suite (Jest ESM, 30 files — services, controllers, middleware) | ✅ Complete |
| Forgot password (email reset link, 1h expiry, console fallback in dev) | ✅ Complete |
| Password show/hide toggle on Login + Register | ✅ Complete |
| Password strength indicator on Register + ResetPassword | ✅ Complete |
| CBSE Class 10 Math textbook curriculum (14 chapters, Chapter model, seed, API) | ✅ Complete |
| CBSE Class 10 Science curriculum (13 chapters — Chemistry/Biology/Physics, seed, API) | ✅ Complete |
| CBSE Class 10 English curriculum (23 chapters — First Flight/Footprints/Words & Expr, seed) | ✅ Complete |
| CBSE Class 10 Hindi curriculum (32 chapters — Kshitij/Sparsh/Kritika/Sanchayan, seed) | ✅ Complete |
| Hindi full content pipeline — NcertChapters + NcertTopicContent (32 topics, in Hindi) + 129 MCQs + TopicDAG (32 nodes) | ✅ Complete |
| Hindi UI — HindiSubBar (4 textbook tabs), HindiChapterCard, NcertTopicView Hindi routing (isSciLike pattern) | ✅ Complete |
| CBSE Class 9 Mathematics — standardized pilot ("Ganita Manjari" NCERT 2026, 8 chapters / 32 sub-topics) — passes 14-point checklist (32/32) | ✅ Complete |
| Math9 content — NcertTopicContent (32 sub-topics, Class-10-density teaching content + inline SVG) + 512 questions (Layer A/B/C = 320/128/64); legacy math9_* v1+v2 docs cleaned up | ✅ Complete |
| Math9 wiring — Lessons.jsx + NcertTopicView cbse_math9 routing (rich Class-10 renderer), auditCoverage EXPECTED, TopicDAG (32 nodes), RAG index via buildRagFromTopicContent (301 chunks). Ph9 complete (2026-05-23): CBSE_MATH9_CHAPTER_TITLES added to NcertTopicView (8 chapters), chapter titles in Lessons.jsx cleaned up to match seeded content. All 11 phases ✅ | ✅ Complete |
| CBSE Class 9 Mathematics — Ph4 SVG diagrams (2026-05-24): 32 DIAGRAM_MAP entries (8 reused ICSE 9 components + 24 new SVG fns covering Ch1 coords, Ch2 polynomials, Ch3 number systems, Ch4 identities, Ch5 circles, Ch6 area, Ch7 probability, Ch8 sequences). All 11 phases now complete. | ✅ Complete |
| CBSE Class 10 Mathematics — re-keyed to standardized cbse_math10_* IDs (54 sub-topics): migrateCbseMath10TopicIds.mjs (DB) + finalizeCbseMath10Rekey.mjs (2 stray topics merged + 193 hard-coded ch* ids re-keyed in questionTemplateService/seeds/tests); audit/coverage/Lessons.jsx updated; 54/54 PASS | ✅ Complete |
| ICSE Class 10 Mathematics — standardized board-prefixed pipeline (icse_math10_ch{N}_* IDs, Selina/Concise syllabus, all 25 chapters complete). 100 sub-topics, 1600 questions (Layer A/B/C = 1000/400/200, +2 patch ch18); audit:math:icse10 → 100/100 PASS; Ph4 60 SVG diagrams (Ch4+Ch10–Ch23); Ph5 TopicDAG 100 nodes (seedIcseMath10TopicDAG.js, 28 name-overrides, examBoard ICSE); Ph6 RAG 623 chunks (buildRagFromTopicContent.js --prefix=icse_math10_, nameMap fallback added); NcertTopicView.jsx family()/chapter-title fixed for icse_math10_* prefix. All 9 phases complete. | ✅ Complete |
| ICSE Class 9 Mathematics — standardized board-prefixed pipeline (icse_math9_ch{N}_* IDs, Selina Concise Class 9 syllabus, all 28 chapters). 112 sub-topics (4/chapter), 1792 questions (Layer A 1120 MCQ + B 448 short + C 224 long-answer PYQ); Ph4 48 SVG diagrams (Ch9–Ch17, Ch20–Ch21, Ch26 — 12 chapters × 4 diagrams); Ph5 TopicDAG 112 nodes + 24 cross-chapter edges; Ph6 RAG 589 chunks; Ph8 audit 112/112 PASS (patchIcseMath9Content.mjs migrated legacy field names + added svg_diagrams for 100 topics); Lessons.jsx ICSE grade-9 branch; NcertTopicView.jsx isIcseMath9TopicId + ICSE_MATH9_CHAPTER_TITLES (28 chapters). All 11 phases complete. | ✅ Complete |
| ICSE Class 9 Mathematics — Ph1 NcertChapter docs (2026-05-24): seedIcseMath9NcertChapters.js — 28 NcertChapter docs (icse_math9_ch1–ch28, board=ICSE, grade=9, Selina Concise Class 9 syllabus). npm script: seed:icse-math9-chapters. Prepended to seed:icse-math9-all. ALL 11 PHASES COMPLETE. | ✅ Complete |
| ICSE Class 10 Mathematics — Ph1 NcertChapter docs (2026-05-24): seedIcseMath10NcertChapters.js — 25 NcertChapter docs (icse_math10_ch1–ch25, board=ICSE, grade=10, Selina Concise Class 10 syllabus). npm script: seed:icse-math10-chapters. Prepended to seed:icse-math10-all. ALL 9 PHASES COMPLETE. | ✅ Complete |
| AP SSC board — new board added (Andhra Pradesh State Secondary Certificate). Board identifier: AP_SSC. boardFilter.js rule: /^ap_ssc_/ → AP_SSC. auditMathChecklist.mjs + auditCoverage.mjs updated. Onboarding.jsx + StartOnboarding.jsx BOARDS arrays include AP_SSC. | ✅ Complete |
| AP SSC Class 10 Mathematics — content cloned from CBSE Math 10 (curriculum confirmed identical — NCERT textbook with Telugu translation, verified by PDF cross-check of Ch1/Ch4/Ch8/Ch13). 54 topics, 1140 questions (examBoard: AP_SSC), 884 RAG chunks, 54 DAG nodes. audit:math:ap-ssc-10 → 54/54 PASS (100%). Lessons.jsx wired: ap_ssc_math10_* filter + MATH_CHAPTER_TITLES_AP_SSC. seed:ap-ssc-math10-all runner in package.json. | ✅ Complete |
| AP SSC Class 10 Mathematics — Ph1 NcertChapter docs (2026-05-24): seedApSscMath10NcertChapters.js — 14 NcertChapter docs (ap_ssc_math10_ch1–ch14, board=AP_SSC, grade=10). npm script: seed:ap-ssc-math10-chapters. Prepended to seed:ap-ssc-math10-all. ALL PHASES COMPLETE. | ✅ Complete |
| AP SSC Class 8 Mathematics — full pipeline (2026-06-03): 16 NcertChapters (ap_ssc_math8_ch1–ch16, board=AP_SSC, grade=8), 56 topics (ap_ssc_math8_* IDs, original content — NOT cloned from CBSE), 280 MCQ (~5/topic), 56-node Topic DAG (acyclic, 0 dangling, 4 roots), 265 RAG chunks, 56 in-content SVG diagrams (1/topic = Ph4, no DiagramLibrary collection exists in app). audit `npm run audit:math -- --prefix=ap_ssc_math8_` → 56/56 PASS (100%). Lessons.jsx wired: grade-8 AP_SSC → ap_ssc_math8_* filter + MATH_CHAPTER_TITLES_AP_SSC["8"] (16 chapters). seedApSscMath8*.js scripts + npm runners. Full parity with AP SSC Math 9/10. ALL PHASES COMPLETE. | ✅ Complete |
| AP SSC Class 9 Mathematics — full pipeline (2026-05-24): 12 chapters (NCERT Class 9 rationalized), 35 topics (ap_ssc_math9_* IDs), 560 Qs (Layer A 350 MCQ + B 140 + C 70 PYQ), TopicDAG 35 nodes, RAG 229 chunks, 35/35 audit PASS, Lessons.jsx + NcertTopicView.jsx wired. Ph1: seedApSscMath9NcertChapters.js (12 docs, ap_ssc_math9_ch1–ch12, board=AP_SSC). Ph4: 35 DIAGRAM_MAP entries (27 reused CBSE Math 9/ICSE 9/ICSE 10 + 8 new SVG fns for Ch4 linear equations, Ch5 Euclid's geometry, Ch6 lines & angles). ALL 11 PHASES COMPLETE. | ✅ Complete |
| CBSE Class 7 Mathematics — "Ganita Prakash Grade 7" (NCERT 2026) — 15 chapters, seed pipeline complete | ✅ Complete |
| Math7 content pipeline — Chapter model + NcertChapters + NcertTopicContent (15 topics) + 75 MCQs + TopicDAG (15 nodes) | ✅ Complete |
| Math7 UI — grade "7" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath7 routing (isSciLike) | ✅ Complete |
| CBSE Class 8 Mathematics — "Ganita Prakash Grade 8" (NCERT 2026) — 14 chapters, seed pipeline complete (legacy v2) | ✅ Complete |
| Math8 content pipeline (legacy v2) — Chapter model + NcertChapters + NcertTopicContent (14 topics) + 70 MCQs + TopicDAG (14 nodes) | ✅ Complete |
| Math8 UI — grade "8" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath8 routing (isSciLike) | ✅ Complete |
| CBSE Class 8 Mathematics — v3 standardization (cbse_math8_* IDs, 56 topics × 4 sub-topics across 14 chapters, all 15/15 audit checks pass). 627 questions (Layer A 360 MCQ + B 155 free_text + C 112 PYQ), 397 RAG chunks, 56 DAG nodes. seed:cbse-math8-all runner. audit:math:cbse8 → 56/56 PASS. | ✅ Complete |
| CBSE Class 8 Mathematics — Ph4 SVG diagrams (2026-05-24): 56 component functions (Ch1–Ch14, 4 per chapter) + 56 DIAGRAM_MAP entries added to DiagramLibrary.jsx. DiagramLibrary total: 402 entries across all boards. All 11 phases complete. | ✅ Complete |
| CBSE Class 6 Mathematics — "Ganita Prakash Grade 6" (NCERT 2026) — 10 chapters, seed pipeline complete | ✅ Complete |
| Math6 content pipeline — Chapter model + NcertChapters + NcertTopicContent (10 topics) + 50 MCQs + TopicDAG (10 nodes) | ✅ Complete |
| Math6 UI — grade "6" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath6 routing (isSciLike) | ✅ Complete |
| CBSE Class 5 Mathematics — "Maths Magic" (NCERT) — 14 chapters, seed pipeline complete | ✅ Complete |
| Math5 content pipeline — Chapter model + NcertChapters + NcertTopicContent (14 topics) + 70 MCQs + TopicDAG (14 nodes) | ✅ Complete |
| Math5 UI — grade "5" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath5 routing (isSciLike) | ✅ Complete |
| CBSE Class 4 Mathematics — "Math Magic" (NCERT) — 14 chapters, seed pipeline complete | ✅ Complete |
| Math4 content pipeline — Chapter model + NcertChapters + NcertTopicContent (14 topics) + 70 MCQs + TopicDAG (14 nodes) | ✅ Complete |
| Math4 UI — grade "4" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath4 routing (isSciLike) | ✅ Complete |
| CBSE Class 3 Mathematics — "Math Magic" (NCERT) — 14 chapters, seed pipeline complete | ✅ Complete |
| Math3 content pipeline — Chapter model + NcertChapters + NcertTopicContent (14 topics) + 70 MCQs + TopicDAG (14 nodes) | ✅ Complete |
| Math3 UI — grade "3" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath3 routing (isSciLike) | ✅ Complete |
| CBSE Class 2 Mathematics — "Math Magic" (NCERT) — 15 chapters, seed pipeline complete | ✅ Complete |
| Math2 content pipeline — Chapter model + NcertChapters + NcertTopicContent (15 topics) + 75 MCQs + TopicDAG (15 nodes) | ✅ Complete |
| Math2 UI — grade "2" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath2 routing (isSciLike) | ✅ Complete |
| CBSE Class 1 Mathematics — "Math Magic" (NCERT) — 13 chapters, seed pipeline complete | ✅ Complete |
| Math1 content pipeline v2 — 52 sub-topics (4/chapter) + 416 MCQs; v1 single-topics cleaned up | ✅ Complete |
| Math1 UI — grade "1" filter in Lessons.jsx mathChapterGroups, NcertTopicView isMath1 routing (isSciLike) | ✅ Complete |
| CBSE Class 10 Social Science curriculum (22 chapters — History/Geo/Eco/PolSci, seed) | ✅ Complete |
| ChapterView page (sections, formulas, theorems, tips, exercises) | ✅ Complete |
| Lessons page — Textbook Chapters tab + AI Lessons tab | ✅ Complete |
| Payment / Subscription system (Razorpay — Pro ₹199/mo, Premium ₹499/mo, annual plans) | ✅ Complete |
| Pricing page (/pricing) with plan cards and Razorpay checkout | ✅ Complete |
| Settings page subscription status card with Upgrade CTA | ✅ Complete |
| 7-day free trial + annual plan options | ✅ Complete |
| Terms of Service + Privacy Policy pages | ✅ Complete |
| Dark mode support | ✅ Complete |
| Refresh token family tracking (stolen-token detection) | ✅ Complete |
| Exam timer server-side sync + weak topics UI in exams | ✅ Complete |
| Voice history persistence (Redis 7-day TTL, 50-msg cap) | ✅ Complete |
| Push notifications (VAPID, Web Push API, revision + study reminders) | ✅ Complete |
| NPS in-app survey (0-10, 30-day cooldown, 5+ attempts gate) | ✅ Complete |
| Error monitoring (Sentry — backend + frontend, no-op when DSN not set) | ✅ Complete |
| Database backup (mongodump + gzip, nightly GitHub Actions cron, optional S3) | ✅ Complete |
| Coupon system (percent/fixed discount, planFilter, maxUses, atomic redemption) | ✅ Complete |
| Referral system (inviteCode, referredBy, 30-day reward, double-reward guard) | ✅ Complete |
| Frontend test suite (Vitest 2.x, 89 tests — 9 files: stores, interceptors, NPS, feature flags, DoubtChat, Layout, Practice, Pricing, VoiceTutor) | ✅ Complete |
| k6 load tests (100VU practice-session flow, p95 thresholds) | ✅ Complete |
| Feature flags (env-var overrides, % rollout, /api/flags, useFeatureFlags hook) | ✅ Complete |
| NCERT chapter + topic content routes | ✅ Complete |
| NcertTopicView Quick/Deep mode (timer, formula quiz, error hunt, video player, topic nav, studied sync) | ✅ Complete |
| NCERT studied sync — backend (User.studiedNcertTopics, toggle API) | ✅ Complete |
| NCERT prerequisite links — resolved from all-topics list, clickable → topic page | ✅ Complete |
| Engagement-gated "Mark as studied" — 5min active + 80% scroll + 2 sections viewed + AI note ≥70/100 (localStorage per topic, custom event for note-approved bus) | ✅ Complete |
| Spaced mastery test — GET /v1/ncert/topics/:topicId/mastery-test ($sample 3E/4M/3H, strips correct-flag, shuffles server-side, excludeIds rotation) + POST .../submit (server-side grading); 8/10 pass, 30-min cooldown, 3-day spacing to confirm | ✅ Complete |
| MasteryBanner — state-aware (not_passed / pending / ready_to_confirm / mastered) + MasteryTestModal (10-Q flow, prev/next, server-graded result, spaced-mastery messaging) | ✅ Complete |
| Per-chapter & per-topic status pills on /lessons (effectiveMastery merges practice mastery + studied set + localStorage engagement scan → Mastered/Due/In progress/Not started) | ✅ Complete |
| lessonsV2Service.getChaptersMeta — studied topics now count as mastered for chapter aggregate | ✅ Complete |
| getStudiedTopics cache-bust (?_=Date.now()) — bypasses 304 stale-empty-response trap | ✅ Complete |
| Lessons/Chapter/Topic focus + visibilitychange listeners — auto re-fetch studied + dashboard when user returns to tab | ✅ Complete |
| Rate limiter dev exception — NODE_ENV !== production skips 127.0.0.1/::1; non-localhost dev cap bumped 300 → 5000 per 15-min | ✅ Complete |
| CI/CD: `.github/workflows/prod-deploy.yml` (workflow_dispatch only initially) — preflight → build frontend in CI → rsync dist → SSH deploy → smoke test → auto-rollback. Requires PROD_SSH_KEY/PROD_USER/PROD_HOST GitHub secrets | ✅ Complete |
| `scripts/preflight-check.sh` — blocks deploy if any critical file (routes/controllers/services/models/src/) is modified-not-committed or untracked; also warns on un-pushed commits | ✅ Complete |
| `scripts/smoke-test.sh` — curls 9 endpoints with expected HTTP codes; exits non-zero if any mismatch (triggers auto-rollback) | ✅ Complete |
| `scripts/prod-deploy.sh` — server-side script: `git reset --hard origin/main` (not pull), tags previous docker image, builds + restarts, polls API health 6×, then deploys dist + reloads nginx | ✅ Complete |
| `scripts/prod-rollback.sh` — re-tags ailearningpath-api:previous as :latest, force-recreates container, called automatically on smoke-test failure | ✅ Complete |
| Auto-versioned service worker — `frontend/scripts/bump-sw-cache.mjs` runs as npm postbuild hook, replaces CACHE constant with `stellar-<short-sha>-<YYYY-MM-DD>` so every build invalidates stale browser caches | ✅ Complete |
| `.gitignore` cleanup — excludes graphify-out/, *.output, .vite/, coverage/, editor metadata; removes ~hundreds of auto-generated noise files from `git status` | ✅ Complete |
| PYQ (Past Year Questions) browse + filter routes | ✅ Complete |
| Admin analytics dashboard (DAU/MAU/revenue/30-day charts) | ✅ Complete |
| Admin coupon CRUD | ✅ Complete |
| Question bookmarks (toggle + list) | ✅ Complete |
| Multi-child accounts (parent creates child sub-accounts via /onboarding + /settings) | ✅ Complete |
| ChildPicker (post-login routing for 0/1/2+ children) | ✅ Complete |
| Homepage live stats (totalUsers, aiHints, avgGrade via public /api/public/stats, 5-min cache) | ✅ Complete |
| Admin: @stellar.child accounts filtered from Users list + totalUsers stats | ✅ Complete |
| Admin: parentInfo shown next to child accounts in Users list | ✅ Complete |
| Razorpay payment.captured webhook backup (idempotent upgrade when client tab closes) | ✅ Complete |
| Admin Certificates page (/admin/certificates — users by accuracy, attempts, grade) | ✅ Complete |
| AI Mock Paper (/mock-paper — generates exam from weak areas, timed, full review) | ✅ Complete |
| RAG knowledge store (NcertChunk — NCERT context injected into Claude explanations) | ✅ Complete |
| AI failover (primary model → haiku fallback → 503, never crashes) | ✅ Complete |
| Output guardrails (prompt leakage + harmful content blocked before student sees response) | ✅ Complete |
| Per-user token limits (Redis-backed daily + monthly caps via PER_USER_*_TOKEN_LIMIT env) | ✅ Complete |
| Global token budget (MONTHLY_TOKEN_BUDGET + 80% Resend alert email, hourly cron) | ✅ Complete |
| Student model injection (accuracy/thinkingProfile/weakAreas/streak per Claude call) | ✅ Complete |
| Conversation context (last explanation stored Redis 30min, auto-injected on first chat turn) | ✅ Complete |
| Lesson cache dual-store (Redis + MongoDB AIResponseCache — survives Redis restarts) | ✅ Complete |
| Answer verification (PASS/FAIL second Claude call before serving AI-generated questions) | ✅ Complete |
| max_tokens truncation handling (stop_reason check + user-visible continue prompt) | ✅ Complete |
| Thumbs up/down feedback on AI explanations (AIFeedback model, 20/hour rate limit) | ✅ Complete |
| Per-call AI metrics logging (AICallLog model, 90-day auto-purge TTL index) | ✅ Complete |
| Admin AI metrics dashboard widget (7-day: calls, tokens, cache/RAG hit rate, latency, feedback) | ✅ Complete |
| Analytics event tracking (AnalyticsEvent model, 90-day TTL, fire-and-forget trackEvent util) | ✅ Complete |
| Admin Retention dashboard (D1/D7/D30 cohort retention, conversion funnel, AI retry rate, top topics) | ✅ Complete |
| SVG diagram components — Science: 55/55, Math: 54/54, SST: 55/55 (1690+ questions total) | ✅ Complete |
| CBSE Class 10 Social Science — 55 fine-grained topics, ~715 questions, 55 SVG diagrams | ✅ Complete |
| SST NcertTopicContent (55 records: History/Geography/Economics/Political Science — 4 subject files) | ✅ Complete |
| SST Topic DAG (55 nodes, prerequisite graph Ch1–22, seedSocialScienceTopicDAG.js) | ✅ Complete |
| auditCoverage.mjs supports Social Science with topicIds across 22 chapters | ✅ Complete |
| CBSE Class 10 English — 35 fine-grained topics, 256 questions, no diagrams (literature subject) | ✅ Complete |
| English NcertTopicContent (35 records: FF Prose/Poems + Footprints + Workbook Grammar — seedEnglishContent.js) | ✅ Complete |
| English Topic DAG (35 nodes, prerequisite graph FF/FW/Grammar, seedEnglishTopicDAG.js) | ✅ Complete |
| auditCoverage.mjs supports English with skipDiagram flag (shows N/A instead of 0/missing) | ✅ Complete |
| English RAG index (156 chunks via buildRagFromCurriculum.js --subject=English) | ✅ Complete |

---

## 15. WHAT STILL NEEDS TO BE BUILT 🔨

### Priority 1 — Payment [DONE ✅]
~~Payment / Subscription System~~
Built: services/paymentService.js, controllers/paymentController.js, routes/paymentRoutes.js
Routes: GET /api/v1/payment/plans, GET /api/v1/payment/subscription,
        POST /api/v1/payment/create-order, POST /api/v1/payment/verify
Plans: Pro ₹199/mo (100 AI calls/day), Premium ₹499/mo (500 AI calls/day)
Env required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

### Priority 2 — Engagement
**Push Notifications** ✅ DONE — VAPID keys wired, /api/push/subscribe active,
  revision + study reminders fire via pushService.js

**Personalised Daily Brief** ✅ DONE
- GET /api/user/daily-brief — aggregates weakTopics, revisionDue, planProgress
- DailyBriefCard on Dashboard: top 3 weak topics, top 3 revision due, active plan progress
- Files: services/dailyBriefService.js, routes/userRoutes.js, pages/Dashboard.jsx

**Offline Mode** ✅ DONE
- IndexedDB queue (src/utils/offlineQueue.js) for submitAnswer failures
- Answers queued when offline, auto-flushed on reconnect
- OfflineBanner inline in Practice.jsx shows offline/queued/syncing state
- Service worker (public/sw.js) — network-first cache for all non-API GET assets
- SW registered in main.jsx on load

**Code Splitting** ✅ DONE
- All 34 page components converted to React.lazy() in App.jsx
- Suspense with spinner fallback wraps Routes — each page is a separate JS chunk
- Estimated bundle reduction: ~70% of initial JS deferred

### Priority 3 — Scale + Quality
**Refresh Token System**
- Current: 7-day JWT, no refresh
- Add: httpOnly cookie refresh token, /api/auth/refresh endpoint

**Per-user API Rate Limit**
- Current: 300 req/15min global
- Need: per-userId rate limit on AI endpoints

**Email Notifications (nodemailer)**
- Weekly digest to parents/teachers (linked students' progress)
- Revision reminder email fallback when push not available

**Question Flagging UI**
- Student-facing "Report this question" button in Practice
- Routes already exist (adminGetFlagged, adminUnflagQuestion)

---

## 15. ENV VARIABLES

```
# Required (server exits on startup if missing)
MONGO_URI=
JWT_SECRET=
ANTHROPIC_API_KEY=

# Optional — defaults shown
CLAUDE_MODEL=claude-haiku-4-5-20251001
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Razorpay payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Push notifications (Web Push)
VAPID_PUBLIC_KEY=    # npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=
VAPID_EMAIL=

# Error monitoring
SENTRY_DSN=                    # backend
VITE_SENTRY_DSN=               # frontend (in frontend .env)

# Email (nodemailer — console-logs in dev if not set)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Redis (falls back to in-memory Map in dev if not set)
REDIS_URL=

# AI token budgets (leave at 0 to disable)
MONTHLY_TOKEN_BUDGET=0              # global monthly cap (e.g. 10000000 = 10M tokens)
PER_USER_DAILY_TOKEN_LIMIT=0        # per-user daily token cap
PER_USER_MONTHLY_TOKEN_LIMIT=0      # per-user monthly token cap
ERROR_ALERT_EMAIL=                  # receives 80% budget alert email (falls back to COMPANY_ADMIN_EMAIL)
RESEND_API_KEY=                     # Resend API key for budget alert emails
RESEND_FROM=alerts@stellaredu.in    # From address for alert emails

# Database backup
BACKUP_DIR=./backups
BACKUP_RETAIN_DAYS=7
AWS_ACCESS_KEY_ID=             # optional S3 upload
AWS_SECRET_ACCESS_KEY=
BACKUP_S3_BUCKET=
```

---

## 16. HOW TO RUN LOCALLY

```bash
# Backend
cd ai-learning-backend/backend
npm install
node server.js               # port 5001

# Frontend
cd ai-learning-frontend/frontend
npm install
npm run dev                  # port 5173

# Seed DB (run once in order)
cd ai-learning-backend/backend
npm run seed                          # Math topics + questions
npm run seed:lessons                  # initial lessons
npm run seed:subjects                 # Science/English/Social Science/Hindi topics
npm run seed:curriculum               # CBSE Class 10 Math — 14 chapters
npm run seed:science-curriculum       # CBSE Class 10 Science — 13 chapters
npm run seed:english-curriculum       # CBSE Class 10 English — 23 chapters
npm run seed:hindi-curriculum         # CBSE Class 10 Hindi — 32 chapters
npm run seed:social-science-curriculum # CBSE Class 10 Social Science — 22 chapters

# Backend tests
cd ai-learning-backend/backend
npm test

# Frontend tests
cd ai-learning-frontend/frontend
npm test

# Load tests (requires k6)
k6 run load-tests/practice-session.js

# Database backup
cd ai-learning-backend/backend
npm run backup             # create backup
npm run restore            # restore latest backup

# Make yourself admin (run in MongoDB shell or Compass)
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
# Then re-login in the app to get updated JWT
```

---

## 17. COMPLETE FILE STRUCTURE

```
AILearningPath/
├── BLUEPRINT.md               ← this file — always up to date
├── AUDIT_CHECKLIST.md         ← 113/113 items fixed
├── CONTRIBUTING.md            ← setup, folder rules, PR checklist, commit style
├── CHANGELOG.md               ← full change history
├── docker-compose.yml         ← mongo + redis + api services
├── load-tests/practice-session.js ← k6 100VU load test
├── .github/workflows/
│   ├── ci.yml                 ← backend-test, frontend-build, e2e, deploy
│   └── backup.yml             ← nightly mongodump to gzip + optional S3
│
├── ai-learning-backend/backend/
│   ├── server.js              ← Express + Socket.IO + all routes mounted
│   │
│   ├── models/
│   │   ├── index.js           ← 26 Mongoose schemas (all collections incl. AICallLog, AIFeedback, NcertChunk)
│   │   ├── lessonModel.js     ← Lesson + LessonProgress
│   │   └── chapterModel.js    ← NEW: Chapter (textbook curriculum, subject-agnostic)
│   │
│   ├── controllers/
│   │   ├── admin/                ← split by domain (never grows into a monolith)
│   │   │   ├── adminStatsController.js
│   │   │   ├── adminUserController.js
│   │   │   ├── adminQuestionController.js
│   │   │   └── adminTopicController.js
│   │   ├── aiController.js
│   │   ├── analysisController.js
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── curriculumController.js ← NEW: listChapters, getChapter, listSubjects
│   │   ├── lessonController.js
│   │   ├── plannerController.js
│   │   ├── portalController.js
│   │   └── practiceController.js
│   │
│   ├── services/
│   │   ├── aiService.js                ← failover + guardrails + student model + RAG + lesson DB cache
│   │   ├── aiRouter.js                 ← 7-layer cache, subject in key, checkAndIncrementUsage
│   │   ├── ragStore.js                 ← indexChapters() + queryRAG() (NcertChunk full-text search)
│   │   ├── adaptiveService.js
│   │   ├── analysisService.js
│   │   ├── aiTeacherService.js
│   │   ├── autoDoubtService.js
│   │   ├── badgeService.js             ← checkAndAwardBadges, getUserBadges
│   │   ├── couponService.js            ← validateCoupon, computeDiscount, redeemCoupon
│   │   ├── foundationService.js
│   │   ├── onboardingEmailService.js   ← drip email sequence (day 0/3/7)
│   │   ├── paymentService.js           ← Razorpay order + verify + referral reward
│   │   ├── plannerService.js
│   │   ├── predictionService.js        ← predictExamScore (weighted by marks×freq)
│   │   ├── profileService.js
│   │   ├── pushService.js              ← sendRevisionReminders, sendStudyReminders
│   │   ├── revisionService.js
│   │   ├── scoringService.js
│   │   ├── selfLearningService.js
│   │   ├── streakService.js
│   │   └── weeklyParentEmailService.js ← Monday digest email to parents
│   │
│   ├── routes/
│   │   ├── adminRoutes.js        ← /api/admin/* (stats, users, questions, topics, coupons)
│   │   ├── aiRoutes.js           ← + /voice-answer, /voice-history
│   │   ├── analysisRoutes.js     ← + /predict
│   │   ├── authRoutes.js
│   │   ├── badgeRoutes.js        ← GET /api/badges
│   │   ├── competitionRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── curriculumRoutes.js   ← /api/v1/curriculum/*
│   │   ├── doubtRoutes.js        ← /api/doubt/:questionId (GET/POST/DELETE)
│   │   ├── examRoutes.js
│   │   ├── feedbackRoutes.js     ← /api/feedback (NPS submit + eligibility + admin view)
│   │   ├── lessonRoutes.js
│   │   ├── ncertRoutes.js        ← /api/v1/ncert/chapters + /topics
│   │   ├── paymentRoutes.js      ← /api/v1/payment/* (plans/subscription/create-order/verify/validate-coupon)
│   │   ├── plannerRoutes.js      ← + PATCH /reorder
│   │   ├── portalRoutes.js       ← /api/portal/* (full set: search, link, students, analytics, reminders)
│   │   ├── practiceRoutes.js     ← + /mixed, /flag
│   │   ├── pushRoutes.js         ← /api/push/vapid-public-key + subscribe (POST/DELETE)
│   │   ├── pyqRoutes.js          ← /api/v1/pyq/* (topics/years/list/detail)
│   │   ├── revisionRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── userRoutes.js         ← + /bookmarks
│   │   └── webhookRoutes.js      ← POST /api/webhooks/razorpay (raw body)
│   │
│   ├── middleware/
│   │   ├── auth.js              ← JWT verify → req.user
│   │   ├── adminAuth.js         ← NEW: requires role === "admin"
│   │   ├── validate.js          ← NEW: Joi schema validation, 422 on fail
│   │   └── errorHandler.js      ← NEW: centralised error handler
│   │
│   ├── utils/
│   │   ├── AppError.js          ← operational error class
│   │   ├── aiMetrics.js         ← NEW: logAICall() fire-and-forget → AICallLog model
│   │   ├── cache.js             ← in-memory LRU (24h TTL)
│   │   ├── cookieNames.js       ← __Host-token / __Secure-refreshToken / __Host-csrf (env-aware)
│   │   ├── email.js             ← nodemailer wrapper (console fallback)
│   │   ├── featureFlags.js      ← flag registry, env overrides, rollout %, getFlagsForUser
│   │   ├── logger.js            ← structured logger (pretty dev / JSON prod)
│   │   ├── outputGuard.js       ← NEW: checkOutput() — prompt leakage + harmful content filter
│   │   ├── questionGenerator.js
│   │   ├── redisClient.js       ← ioredis singleton + in-memory fallback
│   │   ├── sentry.js            ← Sentry init, no-op without DSN
│   │   ├── socket.js            ← Socket.IO rooms + per-IP conn limit + per-user submit throttle
│   │   ├── swagger.js           ← OpenAPI 3.0 spec + setupSwagger(app) → /api-docs
│   │   ├── tokenBudget.js       ← UPDATED: global + per-user token budgets + 80% alert email
│   │   └── validateEnv.js       ← startup crash if required env vars missing
│   │
│   ├── config/
│   │   ├── seed.js
│   │   ├── seedLessons.js
│   │   ├── seedSubjects.js        ← 50+ Science/English/SocSci/Hindi topics
│   │   ├── seedMathCurriculum.js  ← 14 CBSE Class 10 Math chapters
│   │   ├── seedNcertContent.js    ← NCERT chapter content (all 14 Math chapters, ch1-4 detailed)
│   │   └── seedPYQ.js             ← 38 CBSE board exam PYQ MCQs (2020-2024, 9 topics)
│   │
│   ├── migrations/
│   │   └── 20260503000000-add-indexes-and-soft-delete.js ← TTL/compound indexes + question soft-delete
│   │
│   ├── migrate-mongo-config.js  ← ESM migrate-mongo config (MONGO_URI, migrationsDir: "migrations")
│   │
│   ├── __tests__/               ← Jest ESM test suite (30 unit test files)
│   │   ├── analysisService.test.js          (7 tests)
│   │   ├── scoringService.test.js           (6 tests)
│   │   ├── plannerService.test.js           (4 tests)
│   │   ├── aiRouter.test.js                 (5 tests)
│   │   ├── auth.middleware.test.js
│   │   ├── adminAuth.middleware.test.js
│   │   ├── validate.middleware.test.js
│   │   ├── practice.controller.test.js
│   │   ├── exam.controller.test.js
│   │   ├── payment.service.test.js
│   │   ├── portal.controller.test.js
│   │   ├── adaptive.service.test.js
│   │   ├── revision.service.test.js
│   │   ├── streak.service.test.js
│   │   ├── autoDoubt.service.test.js
│   │   ├── aiTeacher.service.test.js
│   │   ├── ai.service.test.js               (20 tests)
│   │   ├── profile.service.test.js          (18 tests)
│   │   ├── selfLearning.service.test.js     (12 tests)
│   │   ├── foundation.service.test.js       (9 tests)
│   │   ├── push.service.test.js             (14 tests)
│   │   ├── weeklyParentEmailService.test.js (10 tests)
│   │   ├── competition.controller.test.js   (13 tests)
│   │   ├── badge.service.test.js            (17 tests)
│   │   ├── prediction.service.test.js       (13 tests)
│   │   ├── coupon.service.test.js           (19 tests)
│   │   ├── onboardingEmailService.test.js   (9 tests)
│   │   ├── adminStats.controller.test.js    (6 tests)
│   │   ├── admin.routes.test.js             (10 tests)
│   │   ├── user.controller.test.js          (4 tests)
│   │   └── integration/
│   │       ├── _setup.js             ← real DB (MONGO_URI) or MongoMemoryServer fallback
│   │       ├── auth.integration.test.js
│   │       └── aiQuota.integration.test.js
│   │
│   ├── scripts/
│   │   ├── backup.js            ← mongodump + gzip + optional S3 + prune
│   │   └── restore.js           ← mongorestore from local or S3, 5s abort window
│   │
│   └── package.json             ← jest config + npm test / test:integration + backup/restore
│
└── ai-learning-frontend/frontend/
    ├── index.html               ← UPDATED: manifest link + theme-color meta
    ├── public/
    │   ├── manifest.json        ← NEW: PWA manifest
    │   ├── sw.js                ← NEW: service worker (offline + push)
    │   ├── icon-192.png         ← needed: add manually
    │   └── icon-512.png         ← needed: add manually
    │
    └── src/
        ├── App.jsx              ← UPDATED: admin routes + Portal route
        ├── main.jsx
        ├── index.css
        ├── store/authStore.js   ← user now has role field
        ├── services/api.js      ← UPDATED: port 5001, all new functions
        │
        ├── playwright.config.js ← Chromium, PLAYWRIGHT_BASE_URL, 2 retries in CI
        ├── e2e/
        │   ├── auth.spec.js         ← landing CTA, register, login, forgot-password, pricing, TOS
        │   └── practice.spec.js     ← authenticated: practice, dashboard, analytics, settings, nav, sign-out
        │
        ├── components/
        │   ├── Layout.jsx           ← mobile drawer (hamburger + backdrop + auto-close on nav)
        │   ├── BadgeToast.jsx       ← toast when badge awarded
        │   ├── DoubtChat.jsx        ← multi-turn chat below wrong answers
        │   ├── FeedbackWidget.jsx   ← 1-5 star + comment (after practice sessions)
        │   ├── OfflineBanner.jsx    ← shows when navigator.onLine is false
        │   ├── SearchOverlay.jsx    ← ⌘K global search
        │   └── Skeleton.jsx         ← DashboardSkeleton, AnalyticsSkeleton, LessonsSkeleton, etc.
        │
        ├── hooks/
        │   └── useFeatureFlags.js   ← fetches /api/flags once per page load
        │
        ├── __tests__/               ← Vitest 2.x test suite (89 tests, 9 files)
        │   ├── setup.js
        │   ├── authStore.test.js              (4 tests)
        │   ├── api.interceptors.test.js       (7 tests)
        │   ├── NPSSurveyBanner.test.jsx       (5 tests)
        │   ├── useFeatureFlags.test.js        (6 tests)
        │   ├── DoubtChat.test.jsx             (18 tests)
        │   ├── Layout.test.jsx                (7 tests)
        │   ├── Practice.test.jsx              (9 tests)
        │   ├── Pricing.test.jsx               (13 tests)
        │   └── VoiceTutor.test.jsx            (20 tests)
        │
        └── pages/
            ├── Dashboard.jsx        ← + NPSSurveyBanner, LinkRequestsCard
            ├── Lessons.jsx
            ├── LessonView.jsx
            ├── Practice.jsx         ← + FeedbackWidget after session
            ├── Analytics.jsx
            ├── Competition.jsx
            ├── LiveRoom.jsx
            ├── Planner.jsx
            ├── ExamReview.jsx
            ├── VoiceTutor.jsx       ← + persisted history, clear button
            ├── Profile.jsx
            ├── Settings.jsx         ← + CouponInput, ReferralCard
            ├── Onboarding.jsx
            ├── StartOnboarding.jsx
            ├── Login.jsx
            ├── Register.jsx         ← + referral code (?ref=) pre-fill
            ├── Portal.jsx           ← invite code + parent/teacher portal
            ├── ChapterView.jsx      ← chapter detail (sections/formulas/theorems/tips)
            ├── Pricing.jsx          ← plan cards + Razorpay checkout + annual options
            ├── TermsOfService.jsx
            ├── PrivacyPolicy.jsx
            ├── MockPaper.jsx            ← AI-generated timed mock exam from weak areas
            ├── ChildPicker.jsx          ← post-login child selector (0/1/2+ children)
            └── admin/
                ├── AdminLayout.jsx
                ├── AdminOverview.jsx
                ├── AdminUsers.jsx
                ├── AdminQuestions.jsx
                ├── AdminTopics.jsx
                ├── AdminCacheStats.jsx
                ├── AdminAnalytics.jsx      ← DAU/MAU/revenue/30-day charts
                ├── AdminCoupons.jsx        ← coupon CRUD
                ├── AdminPayments.jsx       ← payment audit log
                ├── AdminNPS.jsx            ← NPS scores + export
                └── AdminCertificates.jsx   ← users who earned certificates
```
