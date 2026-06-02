# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2026-06-02] — Pro-track v3: pedagogy features, parity modules, prod hardening

### Added
- **AI Socratic Tutor** (Phase 1.B): `tutorService.js` + `tutorPrompts.js` + `TutorPanel.jsx`; `POST /v1/pro/tutor/ask` (+ session/rate routes), Redis-rate-limited, never gives the answer
- **Pattern Recognition** (Phase 1.C): `pattern_match` exercise type, `PatternMatchRunner.jsx` + `PatternDrill.jsx`, 20 seeded exercises
- **Complexity Derivation** (Phase 2.D): `ComplexityPlot.jsx` ops-vs-n plot with reference curves + "guess the curve"
- **Spaced Repetition** (Phase 2.F): SM-2 lite on `ProProgress.topicReviews[]`, `/pro/review` page + dashboard nudge
- **Problem-First Reveal** (Phase 2.G): `ProTopic.revealStrategy`/`problemTitle`, 11 topics gated; standalone `seedRevealTopics.js`
- **Interview Simulator** (Phase H): `ProInterviewSession` + `interviewService.js`, 25-problem bank, 3 pages (Landing/Simulator/History), 45-min timer + AI interviewer + rubric
- **Recursion-Tree visualizer** (I1): `recursion-tree` kind on M40/M41 (memo-hit + pruned states)
- **Community Discussions** (D5.3): `ProTopicDiscussion` model + `discussionService.js` + `TopicDiscussion.jsx`, threads/replies/upvotes
- **Free-tier preview** (D5.1): `ProTopic.freeAccess`, 10 lighthouse topics, `/pro/preview/:topicId` public view
- **Pattern Atlas** (D3.4): `/pro/:trackSlug/patterns` indexing 15 patterns → exercises
- **Content modules**: M47 Bitwise (D3.1) + `BitwiseVisualizer`, M48 Recursion Patterns (D3.2), M49 Modern Java (J1), M50 Engineering Hygiene (J2), M51 Technical Communication (J3) — now 51 modules / 247 topics
- `ProProjectView.jsx`: self-assessed mini-project runner
- Unit tests: `tutorService.test.js`, `interviewService.test.js` (backend now 467 tests)

### Fixed (production hardening, 2026-06-02)
- **CI prod-deploy build** never green (15/15 red): backend `npm ci` ERESOLVE (rate-limit-redis@5 vs express-rate-limit@7) → `--legacy-peer-deps`; frontend `npm test` ran Playwright e2e specs → new `test:ci` excludes them
- **Oracle swap** — a 2 GB swapfile created May 3 was never `swapon`'d or in fstab (root cause of the OOM reboot); now enabled + persisted, swappiness=10
- **Judge0 unconfigured in prod** — `JUDGE0_URL`/`JUDGE0_AUTH_TOKEN` were never in the compose env, so all "Run & submit" coding exercises failed; now wired (verified: authed Judge0 call returns 47 languages)

### Deployed
- Pro-track v3 live on `stellaredu.in` (Oracle Cloud) — backend image pulled from GHCR, 8 content seeds applied, frontend rebuilt + shipped, all smoke tests green. Tagged `pilot-pro-java-v3.0-phase1` + `-phase2`.

## [2026-05-30] — Pro-track UX polish, performance, and track switching

### Added
- `DashboardSwitch.jsx`, `PracticeSwitch.jsx`, `BookmarksSwitch.jsx`: route-level switches that render the pro or school variant of each page based on `activeTrack` in `trackStore`
- `TrackSwitcher.jsx` + `TrackTabs.jsx`: sidebar and dashboard UI for switching between enrolled tracks
- `trackStore.js`: hydration flag, `refreshNav` guard, `setActiveTrack` action that calls `PATCH /api/user/active-track`
- `SortingSandbox.jsx` extracted from `VisualizerShell.jsx` into its own lazy-loaded file
- All 45 DSA sandbox components are now individually lazy-loaded in `VisualizerShell.jsx` — Monaco only downloads for sorting topics

### Changed
- `Certificate.jsx`: track-branched — pro users get purple XP/exercises certificate; school users get gold grade/accuracy certificate
- `Analytics.jsx`: pro-track aware — branches to pro analytics endpoint when `activeTrack` is `pro_*`
- `Layout.jsx`: sidebar subtitle shows "Set up your profile" when grade/board unset; shows "Java · Professional" for pro track users
- `Profile.jsx`: pro users see "Java · Professional" label; school-specific fields hidden in settings for pro users; "Complete your profile →" prompt for new users
- `Planner.jsx`: create-plan modal is track-aware — pro users get Java focus areas and coding sprint templates
- `App.jsx`: `BoardGated` guard skips grade/examBoard check for pro-track users
- `ProTopicView.jsx`: prefetches `VisualizerShell` in parallel with the topic API call on mount
- `vite.config.js`: added `server.warmup` to pre-compile hot paths; `optimizeDeps.include` pre-bundles `framer-motion`, Monaco, and `recharts` at dev-server startup

### Fixed
- `proAnalyticsService.js`: removed `.toObject()` call on `lean()` result — was crashing pro analytics for all users
- `authController.js`: `register()` now passes `grade` and `examBoard` as `null` to skip Mongoose schema defaults — pro users no longer get a default school grade on sign-up
- `userRoutes.js`: `GET /user/me` and `GET /user/nav` now Redis-cached (30s and 60s TTL respectively) with parallel query execution; cache invalidated on writes — reduces cold-path DB round-trips
- `proService.js`: `getTopic` and `listExercises` now Redis-cached (5 min TTL) — warm reads drop from ~200ms to ~5ms

## [Unreleased]

### Added
- Annual plan support (`pro_annual`, `premium_annual`) in plan limits and User schema
- 7-day free trial + annual billing options on Pricing page
- Terms of Service and Privacy Policy pages
- Dark mode with persistence across sessions
- Razorpay payment integration with idempotent order creation
- Refresh token family tracking for stolen-token detection
- Google OAuth via passport-google-oauth20
- Exam timer sync, weak-topics UI, admin analytics dashboard
- Voice Tutor page with animated waveform indicator
- Competition countdown before exam starts
- Keyboard shortcuts (A/B/C/D) for practice answer options
- DoubtChat auto-scroll to newest message
- Badge grid with hover descriptions on Profile page
- Responsive mobile sidebar with hamburger menu
- Skeleton loaders and empty-state illustrations
- NPS survey with grace period (shown after 7 attempts, not 5)
- GDPR account-delete confirmation modal in Settings
- robots.txt and sitemap.xml for public pages
- Multi-stage Docker builds for frontend (Nginx) and backend (Node)
- GitHub Actions CI with backend tests, frontend Vitest, and SSH deploy stage
- PM2 ecosystem config with correct entry path
- gzip compression middleware
- HSTS preload directive
- CSP `report-uri` in helmet config
- `__Host-` / `__Secure-` cookie name prefixes in production
- `COOKIE_DOMAIN` env var support for refresh cookie
- Rate limiting on `/auth/login`, `/register`, `/forgot-password`
- bcrypt cost factor raised to 12 (OWASP 2024)
- Access token TTL reduced from 24 h to 15 min
- Redis-backed practice sessions (replaces in-memory `sessions = {}`)
- Soft-delete on Question model (`deletedAt`)
- MongoDB transactions wrapping payment record + user upgrade
- Distributed lock on single-use coupon redemption
- SHA-256 hashing for password-reset tokens
- Request correlation / trace ID in log lines
- TTL index on SeenQuestion, sparse index on pushSubscription
- Compound indexes on Attempt.(userId, createdAt) and Attempt.topic
- Connection pool config (`maxPoolSize: 20`)
- SIGTERM graceful-shutdown handler
- Log-level env var (`LOG_LEVEL`)
- Health check endpoint verifies both MongoDB and Redis
- `npm audit` step in CI for backend and frontend
- k6 load test with error-rate, latency, and session-error thresholds
- Integration tests for authController, paymentService, couponService, portalController

### Changed
- `baseURL` reads from `VITE_API_URL` env var (was hardcoded to `localhost:5001`)
- `morgan("dev")` replaced with env-aware log format
- CORS origin reads from `FRONTEND_URL` (was hardcoded LAN IP)
- `totalRevenue` and `revenueTrend` converted from paise to rupees in admin stats
- AI temperature set to 0.4 for deterministic explanations
- Token usage tracking fixed in AIUsageStats (was always 0)
- DAU/MAU query uses actual login events (not AI call proxy)
- Spaced repetition now demotes on repeated failure
- `submitAnswer` parallelised with `Promise.all` (was 12–15 sequential DB calls)
- Push notifications batched and parallelised (was O(N×M) sequential loop)
- Prediction service documented with formula, confidence tiers, and limitations
- `analysisService` requires ≥ 3 attempts before classifying thinking profile
- `predictionService` documented with calibration caveat
- `aiRouter` PLAN_LIMITS includes annual plan keys

### Fixed
- OAuth users could not POST (missing CSRF cookie in `googleAuthCallback`)
- Clerk stub `verifyToken` / `createClerkClient` caused ReferenceError at runtime
- `finish()` in Onboarding now saves `weakTopics` and `goal`
- Annual plan subscribers no longer fall back to free-tier quota
- `totalRevenue` was shown as ×100 (returned in paise, not rupees)
- Free-plan check now reads `plan` field (not `isPaid`) to handle expiry edge case
- `linkedStudents` uses `[ObjectId]` with referential integrity (was `[String]`)
- `aiCallsDate` stored as `Date` (was `String`) to avoid midnight timezone issues
- PM2 config entry path corrected
- Docker port mapping corrected (5001:5001)
- MongoDB and Redis ports no longer exposed publicly in docker-compose
