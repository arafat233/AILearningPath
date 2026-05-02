# Multi-Role Audit Issues Checklist

Generated from the full multi-role audit (CEO · CTO · CMO · Sr. Developer · UI/UX · DevOps · Security · Data Scientist · AI/ML · Tester · BI).
**113 total findings** — 16 CRITICAL · 35 HIGH · 40 MEDIUM · 22 LOW

Check off each item as it is fixed and committed.

---

## CRITICAL — Fix before any public launch

- [x] **[SEC] api.js:5** — `baseURL` hardcoded to `localhost:5001` — entire frontend breaks on any real deployment
- [x] **[ARCH] models/index.js:16** — `User.plan` enum missing `"pro_annual"` / `"premium_annual"` — annual purchases fail silently
- [x] **[ARCH] aiRouter.js:28** — `PLAN_LIMITS` missing annual plan keys — annual subscribers get free-tier quota (10 calls/day)
- [x] **[BUG] Onboarding.jsx:37** — `finish()` never saves `weakTopics` or `goal`; Step 2 of onboarding is cosmetic
- [x] **[SEC] authController.js:418** — `setCsrfCookie` missing in `googleAuthCallback` — OAuth users fail every POST (403)
- [x] **[SEC] docker-compose.yml:13,28** — MongoDB `27017:27017` and Redis `6379:6379` exposed publicly with no auth
- [x] **[OPS] server.js:71** — `morgan("dev")` hardcoded — verbose colorised logs in production
- [x] **[SEC] server.js:81** — `192.168.29.223` hardcoded in CORS — private LAN IP leaks to production
- [x] **[BUG] adminStatsController.js:110** — `totalRevenue` returned in paise — Rs.199 payment shown as Rs.19900 in dashboard
- [x] **[SEC] ci.yml** — No `npm audit` step — known CVEs ship undetected
- [x] **[OPS] docker-compose.yml:45** — API container mapped as `5000:5000` but app listens on `5001`
- [x] **[OPS] server.js** — `setInterval` crons run inside web process — with 2+ pods every cron fires N times (N times emails, N times push)
- [x] **[ARCH] paymentService.js** — Order state only in Redis — Redis restart between create-order and verify = user charged, not upgraded
- [x] **[BUG] authController.js:430+** — Clerk stub calls `verifyToken` / `createClerkClient` never imported — ReferenceError at runtime
- [x] **[PERF] pushService.js** — O(N x M) DB queries every 60 s + sequential push loop blocks the event loop
- [x] **[ARCH] practiceController.js** — `sessions = {}` in-memory — lost on restart; unsafe for PM2 cluster (already uses Redis)

---

## HIGH — Fix within Week 2

- [x] **[ARCH] adminRoutes.js** — Coupon CRUD has business logic + raw Mongoose inside route file; no validation middleware
- [x] **[PERF] practiceController.js** — `submitAnswer` runs 12-15 sequential DB calls; use Promise.all for independent reads
- [x] **[PERF] examController.js** — N+1 bulkWrite inside loop; Exam.find() unbounded
- [x] **[SEC] aiService.js** — Raw `userExplanation` / `transcript` interpolated into Claude prompts — prompt injection risk
- [x] **[BUG] Competition.jsx** — Client sends `selectedType` unchecked; double-submit race on rapid clicks
- [x] **[BUG] Practice.jsx** — alert() for errors; stale closure in timer useEffect; "New Session" leaves stale state
- [x] **[ARCH] models/index.js** — Inconsistent userId types (String vs ObjectId) across schemas — breaks lookup / populate
- [x] **[ARCH] models/index.js** — PaymentRecord.amount stored in paise with no code comment
- [x] **[PERF] profileService.js** — Attempt.find({ userId }) fetches full attempt history on every answer
- [x] **[PERF] adaptiveService.js** — $nin exclusion list grows to 500+ ObjectIds — forces collection scan
- [x] **[ARCH] aiRouter.js** — tokensUsed always 0 in AIUsageStats — token cost tracking broken
- [x] **[ARCH] aiRouter.js** — Cached AI responses can never be invalidated without direct DB access
- [x] **[BUG] revisionService.js** — Spaced repetition only promotes; never demotes on repeated failure
- [x] **[PERF] middleware/auth.js** — Extra DB call on every authenticated request for pwdChangedAt; add to JWT payload
- [x] **[ARCH] aiService.js** — temperature not set — Claude defaults to 1.0; explanations are non-deterministic
- [x] **[ANALYTICS] adminStatsController.js** — DAU / MAU use aiCallsDate proxy; users who log in without AI are invisible
- [x] **[PERF] models/index.js** — Missing TTL index on SeenQuestion.seenAt — collection grows forever
- [x] **[PERF] models/index.js** — Missing sparse index on pushSubscription.endpoint
- [x] **[PERF] models/index.js** — Missing compound index on Attempt.(userId, createdAt) and Attempt.topic
- [x] **[SEC] authRoutes.js** — No rate limiting on /login, /register, /forgot-password — brute-force unchecked
- [x] **[ARCH] predictionService.js** — Uncalibrated linear formula presented as ML score — misleads students
- [x] **[BUG] analysisService.js** — Thinking profile classifier labels user after only 1 attempt
- [x] **[PERF] practiceController.js** — sessions = {} never pruned — memory leak on long-running process
- [x] **[SEC] cors** — If FRONTEND_URL unset, no-origin branch returns true — all server requests allowed
- [x] **[PERF] MongoDB** — No connection pool config (maxPoolSize) — bottlenecks under load
- [x] **[OPS] server.js** — No SIGTERM graceful-shutdown handler — in-flight requests dropped on deploy
- [x] **[SEC] authController.js** — bcrypt cost factor 10; OWASP 2024 recommends 12
- [x] **[INFRA] docker-compose.yml** — No memory limits — one runaway process OOMs the host
- [ ] **[TEST] __tests__/** — No integration tests with real DB; mock/prod divergence risk
- [x] **[OPS] logger.js** — No log-level env var — cannot tune verbosity without code change
- [x] **[SEC] JWT** — Access token TTL 1d — stolen token valid 24 h; reduce to 15-60 min
- [x] **[BUG] aiRouter.js** — Free-plan check reads isPaid not plan — edge case after expiry bypasses limit
- [x] **[OPS] ci.yml** — Frontend Vitest suite not run in CI — test regressions ship silently
- [ ] **[OPS] ci.yml** — No deploy stage — CD is fully manual
- [x] **[SEC] models/index.js** — linkedStudents: [String] — no referential integrity; orphan IDs accumulate

---

## MEDIUM — Fix in Week 3-4

- [ ] **[UX] Onboarding.jsx** — goal field shown but separate capture path never wired up
- [x] **[UX] Practice.jsx** — DoubtChat does not auto-scroll to newest message
- [x] **[UX] Practice.jsx** — No keyboard shortcuts (A/B/C/D) for answer options
- [x] **[UX] VoiceTutor.jsx** — No visual waveform / speaking animation while mic is active
- [x] **[UX] Competition.jsx** — No countdown before room starts; players join mid-question
- [x] **[UX] Analytics.jsx** — Thinking profile shown after only 1 attempt
- [ ] **[UX] Dashboard.jsx** — NPS survey shown at exactly 5 attempts with no grace period
- [x] **[UX] Settings.jsx** — No confirmation modal before GDPR account delete
- [x] **[UX] Lessons.jsx / Practice.jsx** — No empty-state illustrations when data is absent
- [ ] **[UX] All pages** — No skeleton loaders — blank screens during data fetch
- [x] **[PERF] Lessons.jsx** — No React.memo on list items — full re-render on search keystroke
- [x] **[PERF] AdminUsers.jsx** — No pagination — entire user collection loaded into DOM
- [x] **[PERF] AdminQuestions.jsx** — No server-side pagination
- [x] **[PERF] revisionRoutes.js** — /revision/due returns all overdue items without limit
- [x] **[ARCH] logger.js** — No request correlation / trace ID in log lines
- [ ] **[ARCH] paymentService.js** — No DB transaction wrapping payment record + user upgrade — partial write risk
- [x] **[ARCH] couponService.js** — No distributed lock on single-use coupon redemption — concurrent redemptions can both succeed
- [x] **[ARCH] models/index.js** — No soft-delete on Question — deleted questions break ExamReview history
- [x] **[SEC] authController.js** — passwordResetToken stored as plain text; should be SHA-256 hashed
- [x] **[SEC] helmet** — No report-uri in CSP — violations go unreported
- [x] **[SEC] cookies** — No __Host- prefix on session/CSRF cookies — cookie tossing on subdomains
- [x] **[OPS] /api/health** — Does not check Redis — degraded Redis state invisible to load balancer
- [x] **[OPS] server.js** — App accepts traffic before MongoDB connect() resolves — early requests hit unhandled rejections
- [x] **[OPS] ci.yml** — Frontend Vitest not run in CI pipeline
- [ ] **[OPS] docker/** — No Dockerfile for frontend
- [x] **[OPS] docker/** — No .dockerignore — node_modules copied into build context
- [ ] **[TEST] __tests__/** — No E2E tests (Playwright / Cypress) for critical flows
- [ ] **[TEST] __tests__/** — No tests for authController
- [ ] **[TEST] __tests__/** — No tests for paymentService or couponService
- [ ] **[TEST] __tests__/** — No tests for portalController
- [x] **[DATA] models/index.js** — No max-length validation on weakTopics array
- [x] **[DATA] models/index.js** — aiCallsDate is a String not a Date — timezone edge cases at midnight
- [x] **[DATA] models/index.js** — No compound index on (userId, topic) for Attempt
- [x] **[DATA] models/index.js** — No index on Attempt.topic for aggregate queries
- [x] **[ANALYTICS] adminStatsController.js** — revenueTrend chart values in paise; label says Rs.
- [ ] **[ANALYTICS] predictionService.js** — No documentation, confidence interval, or historical validation
- [ ] **[CONTENT] ncertRoutes.js** — NCERT content is placeholder text; not real CBSE content
- [ ] **[CONTENT] pyqRoutes.js** — PYQ routes exist but no seed data — always returns empty arrays

---

## LOW — Fix in Month 2

- [ ] **[CODE] Competition.jsx** — console.log statements in production code
- [ ] **[CODE] authController.js:430+** — Dead Clerk stub (~80 lines) should be removed
- [ ] **[CODE] codebase-wide** — Multiple // TODO: comments with no linked tickets
- [ ] **[UX] Login.jsx** — No visible "Forgot password?" link on login page
- [ ] **[UX] Settings.jsx** — Dark mode toggle state not persisted across sessions
- [ ] **[UX] Layout.jsx** — Sidebar overlaps content on screens < 375 px
- [ ] **[UX] App.jsx** — No full-page spinner on initial bundle load
- [ ] **[UX] Profile.jsx** — Badge grid shows no description on hover
- [ ] **[UX] Practice.jsx** — Confidence slider label too small to read on mobile
- [ ] **[OPS] server.js** — No gzip / brotli compression middleware
- [ ] **[OPS] public/** — No robots.txt
- [ ] **[OPS] public/** — No sitemap.xml
- [ ] **[OPS] ecosystem.config.cjs** — PM2 config references wrong app entry path
- [ ] **[OPS] Dockerfile** — No multi-stage build — dev node_modules in production image
- [ ] **[SEC] helmet** — No HSTS preload directive
- [ ] **[SEC] cookies** — Cookie domain not set — breaks subdomains
- [ ] **[DOCS] API** — No Swagger / OpenAPI spec
- [ ] **[DOCS] repo root** — No CONTRIBUTING.md
- [ ] **[DOCS] repo root** — No CHANGELOG.md
- [ ] **[DATA] migrations/** — No DB migration tooling (e.g. migrate-mongo)
- [ ] **[TEST] load-tests/practice-session.js** — k6 tests have no error-rate assertions
- [ ] **[CODE] tailwind.config.js** — Unused custom classes defined but never referenced

---

## Progress

| Severity | Total | Fixed | Remaining |
|----------|-------|-------|-----------|
| CRITICAL | 16 | 16 | 0 |
| HIGH | 35 | 33 | 2 |
| MEDIUM | 40 | 26 | 14 |
| LOW | 22 | 0 | 22 |
| **Total** | **113** | **75** | **38** |

*Last updated: 2026-05-03*
