# AILearningPath — Full Audit Checklist
> Generated: May 2026 | Covers: Security · Bugs · Tests · Student UX · Parent UX · Business
> Status key: ❌ Not done · ⚠️ Partial · ✅ Done

---

## 🔴 CRITICAL — Security Vulnerabilities

- [x] **REGEX INJECTION** `portalController.js:17` — `{ $regex: q }` runs user input as a MongoDB regex. A query like `.*` or `(a+)+` can DoS the database. Fix: escape the string or use `$text` index. ✅ Fixed: `escapeRegex()` applied to search query.
- [x] **NO ROLE CHECK on linkStudentDirect** `portalController.js:32` — Any authenticated user (including students) can link another student to themselves. ✅ Fixed: role check added (`parent`, `teacher`, or `admin` only).
- [x] **RACE CONDITION in AI quota** `aiRouter.js:47` — `checkAndIncrementUsage` does a read-then-write (not atomic). ✅ Fixed: atomic MongoDB aggregation pipeline `$cond` update.
- [x] **NO HOST AUTH on Socket rooms** `socket.js:49,64` — Any player in a room can emit `start_room` or `end_game`. ✅ Fixed: `hostId` tracked; `start_room`/`end_game` gated to host.
- [x] **CORRECT ANSWER EXPOSED in competition** `competitionRoutes.js:19` — options `type: "correct"` visible to clients. ✅ Fixed: `type` stripped from options projection.
- [x] **PREMIUM QUOTA BUG** `aiRouter.js:57` — Premium users capped at 100 instead of 500. ✅ Fixed: `PLAN_LIMITS` map applied per `user.plan`.
- [x] **logger NOT IMPORTED** `practiceController.js:85` — `logger.warn(...)` with no import → `ReferenceError` in production. ✅ Fixed: import added.
- [x] **CACHE STATS EXPOSED to all users** `aiRoutes.js:53` — `/api/ai/cache-stats` returned to any student. ✅ Fixed: gated behind `adminAuth`.
- [x] **safeUser() strips plan fields** `authController.js:65` — Login response missing `subject`, `grade`, `isPaid`, `plan`, `planExpiry`. ✅ Fixed: all frontend-needed fields included.
- [x] **MISSING env vars in .env.example** — `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, VAPID keys missing. ✅ Fixed: all documented.

---

## 🟠 HIGH — Bugs

- [x] **Subject filter ignored in Dashboard topics** ✅ Fixed: `GET /topics` now filters by `req.query.subject` and `req.query.grade`.
- [x] **Settings.jsx only saves `name` to Zustand** — `setAuth` now spreads all changed fields (grade, subject, goal, examDate). ✅ Fixed + Delete Account UI added.
- [x] **Socket rooms lost on server restart** `socket.js:38` — `rooms` is in-memory. Live competition lost on restart. ✅ Fixed: `@socket.io/redis-adapter` attached when `REDIS_URL` is set; room state persisted in Redis via `sessionGet`/`sessionSet` (key `competition:room:<id>`, 4h TTL) so rooms survive restarts and work across pods.
- [x] **Mixed practice start doesn't set session** — `/practice/mixed` now calls `sessionSet` after fetching question. ✅ Fixed.
- [x] **planExpiry never auto-downgrades** — Auth middleware now fire-and-forget downgrades expired paid users. ✅ Fixed.
- [x] **Revision mark doesn't update Planner state** ✅ Verified: `revisionService.markRevised` increments `revisionStage` and sets `nextRevision` atomically; Planner UI removes item optimistically on success.
- [x] **NCERT subject name mismatch for Social Science** ✅ Verified: `seedSocialScienceCurriculum.js` and NCERT route both use `"Social Science"` consistently; `ncertSubject()` passthrough is correct.
- [x] **Practice submit exposes `solutionSteps` / correct answer** ✅ Fixed: client sends `selectedOptionIndex` (not type); server derives `selectedType` from session; option types stripped from client question; `solutionSteps` only returned when answer is wrong.
- [x] **Planner `saveTopicOrder` API wired in frontend but backend route not verified** ✅ Verified: `PATCH /planner/reorder` exists in `plannerRoutes.js` with Joi validation.

---

## 🟡 MEDIUM — Security Hardening

- [x] **No CSRF protection on state-changing routes** ✅ Fixed: double-submit cookie pattern — `setCsrfCookie()` called on login/register/refresh/Google OAuth, sets a non-httpOnly `csrf` cookie; `csrfProtect` middleware validates `X-CSRF-Token` header === cookie on all POST/PUT/DELETE (skips auth routes which issue the token, and webhooks). Frontend axios request interceptor reads `csrf` cookie and injects the header automatically. Only enforced in `NODE_ENV=production`.
- [x] **Rate limit missing on `/api/user/me` PUT** ✅ Fixed: 20 updates/hour per user via `express-rate-limit`.
- [x] **No input sanitisation on `name` field** ✅ Verified: `escHtml(user.name)` used in both the welcome email and forgot-password email in `authController.js:97,242`.
- [x] **Admin delete endpoints have no soft-delete** ✅ Fixed: `deletedAt` soft-delete for Questions and Topics; list queries filter `deletedAt: { $exists: false }`.
- [x] **No output encoding on AI-generated content** ✅ Fixed: `sanitizeSvg()` in NcertTopicView strips `<script>`, `on*` event attributes, `javascript:` from SVG before `dangerouslySetInnerHTML`. LessonView has no `dangerouslySetInnerHTML`.
- [x] **`questionId` in doubt routes accepts arbitrary strings** ✅ Fixed: validates as valid ObjectId or `"ai-generated"` before DB query.
- [x] **Refresh token rotation missing invalidation of old family** ✅ Fixed: familyId embedded in raw token (`random:familyId`); on rotation both `refresh:<hash>` and `family:<familyId>` stored in Redis; if a rotated-away hash is presented but family is still active → reuse detected → family invalidated; logout deletes both keys.
- [x] **API key visible in frontend** ✅ Fixed: Comment added in `paymentService.js` next to `keyId` explicitly noting only public key is sent, never the secret.

---

## 🔵 MEDIUM — Missing Test Coverage

- [x] **No test for `authController`** ✅ Verified: `auth.controller.test.js` covers register (dup email, success), login (unknown email, locked, wrong pw, lockout, success), refresh (no cookie, expired, valid rotation, reuse detection), logout (JTI blacklist + family delete), forgotPassword (unknown email, XSS escape), resetPassword (bad token, valid token).
- [x] **No test for `practiceController`** ✅ Verified: `practice.controller.test.js` covers startTopic, submitAnswer (correct/wrong), option type stripping, server-side selectedType derivation, timeout→guessing, solutionSteps gating.
- [x] **No test for `paymentService`** ✅ Verified: `payment.service.test.js` covers createOrder, verifyPayment (signature check, plan upgrade), getSubscription; PaymentRecord mock added.
- [x] **No test for `portalController`** ✅ Verified: `portal.controller.test.js` covers linkStudentDirect (role check, invalid ID, self-link, not found, teacher allowed), getStudentAnalytics (IDOR, owner, admin bypass).
- [x] **No test for `examController`** ✅ Fixed: `exam.controller.test.js` covers listExams, startExam (404, questions returned, type stripped from options, startedAt/durationSeconds in session), submitExam (correct/wrong/blank answers, negative marking, time-expired auto-fill, session deletion, 400 on no session), getExamReview (owner/IDOR/404), getLeaderboard. Also fixed: `type` field was still exposed in exam questions (parallel bug to competition fix).
- [x] **No integration tests** ✅ Fixed: `mongodb-memory-server` added; `__tests__/integration/` with `aiQuota.integration.test.js` (11 tests — real concurrent $cond atomicity, all plan limits) and `auth.integration.test.js` (7 tests — bcrypt hashing, duplicate email, lockout, soft-delete); `npm run test:integration` script added.
- [ ] **No frontend tests** — No Vitest / Playwright setup.
- [ ] **No load tests** — Unknown behaviour under 100+ concurrent practice sessions.
- [x] **No test for AI quota race condition** ✅ Fixed: 5 concurrency-simulation tests added to `aiRouter.service.test.js` — stateful mock simulates MongoDB's serial write processing; verifies exactly N slots remain available under concurrent load (free/pro/premium limits, partial slots, already-at-limit).
- [x] **No test for `revisionService`** ✅ Verified: `revision.service.test.js` covers `getRevisionTopics` (no profile, overdue included, future excluded, priority sort) and `markRevised` (stage advance, stage capped at max).

---

## 🟢 STUDENT PERSPECTIVE — Missing Features & UX

- [x] **No visible countdown timer during practice** ✅ Fixed: Timer progress bar below header drains green → orange → red as time runs out; disappears after answer.
- [x] **No "End Session" button** ✅ Fixed: "End Session" button appears in header after first answer; shows session summary screen.
- [x] **No session summary screen** ✅ Fixed: Summary shows score, accuracy %, accuracy bar, and all missed questions with correct/selected options and AI explanations.
- [x] **No question review after practice** ✅ Fixed: Summary screen lists all wrong answers with highlighted correct option and AI explanation inline.
- [x] **No search bar** ✅ Fixed: Search overlay (⌘K / Ctrl+K) in sidebar searches topics by keyword via `GET /topics?q=`; arrow-key navigation; clicking result opens Practice with topic pre-selected.
- [x] **No bookmark / favourite questions** ✅ Fixed: ☆ Bookmark toggle on every feedback card; `POST /api/user/bookmarks/:id` (toggle), `GET /api/user/bookmarks`; dedicated Bookmarks page in sidebar with remove & "Practice this topic" links.
- [x] **No dark mode** ✅ Fixed: `html.dark` class with CSS variable overrides for all tokens (card-bg, sidebar-bg, input, labels); `themeStore.js` persists preference in localStorage and respects `prefers-color-scheme`; moon/sun toggle button in sidebar.
- [x] **No offline support** ✅ Fixed: SW v2 — stale-while-revalidate for static assets (JS/CSS/images); network-first + cache fallback for `/api/topics`, `/api/lessons`, `/api/v1/ncert`, `/api/badges`, `/api/analysis`, `/api/revision`, `/api/planner`, `/api/user/me`; shell fallback for navigation. `OfflineBanner` component shows sticky warning + auto-hides on reconnect.
- [x] **Voice tutor has no history** ✅ Fixed: `GET /api/ai/voice-history` and `DELETE /api/ai/voice-history` added; voice-answer now loads Redis history for context and appends each exchange (capped at 50 messages, 7-day TTL); VoiceTutor.jsx loads history on mount and shows a "Clear history" button.
- [x] **No manual weak-topic override UI** ✅ Fixed: Tag-style input in Settings (type + Enter or Add button); red pill tags with × to remove; loaded from `profile.weakAreas` on mount; submitted as `weakTopics` array to `PUT /user/me` which persists to `UserProfile.weakAreas`.
- [x] **Exam timer doesn't sync on tab switch** ✅ Fixed: `startedAt` (epoch ms) and `durationSeconds` returned from `startExam`; stored in Redis session; client computes `timeLeft = max(0, durationSeconds - elapsed)` on start and on `visibilitychange` resume; server validates elapsed on submit with 30s grace.
- [x] **No notification when revision is due** ✅ Fixed: `web-push` installed; `pushService.js` sends push to all subscribed users with due revisions (runs at startup + every 24h); `pushRoutes.js` adds `POST /api/push/subscribe`, `DELETE /api/push/subscribe`, `GET /api/push/vapid-public-key`; `pushSubscription` field added to User model; expired subscriptions (410) auto-cleaned; frontend `usePushNotifications` hook + toggle card in Settings.
- [x] **Competition room has no shareable link** ✅ Fixed: "Copy invite link" button in waiting room copies `?room=<id>` URL; visiting the link pre-fills the room input.
- [x] **No progress certificate / achievement download** ✅ Fixed: `Certificate.jsx` page at `/certificate` — fetches live analytics, renders gold-bordered achievement certificate (accuracy, questions answered, topics mastered, longest streak, strong areas, student name/grade/subject, issue date); "Save as PDF" calls `window.print()` with injected print styles that hide sidebar; empty state if no practice done yet; "Certificate" gold link added to Analytics header.

---

## 🟣 PARENT PERSPECTIVE — Missing Features & UX

- [ ] **No consent flow for linking** — Student should receive in-app notification and must accept before data is shared.
- [ ] **No weekly progress email to parents** — Add weekly digest email (sessions, accuracy trend, topics covered).
- [ ] **No push notification for child milestones** — Parents not notified on badge, streak, or weak-area alert.
- [ ] **Parent dashboard shows no historical trend** — No chart over time (last 4 weeks).
- [ ] **No way to set study reminders for child** — Parents cannot schedule notifications or study goals.
- [ ] **No multi-child support UI** — No combined summary across multiple linked children.
- [ ] **No teacher-specific view** — Teachers need class-level aggregated views, not individual student data.
- [ ] **Parent cannot see individual question attempts** — Only summary stats visible; no drill-down.

---

## 🏢 BUSINESS / COMPANY PERSPECTIVE

- [x] **No Razorpay webhook handler for failed/refunded payments** ✅ Fixed: `POST /api/webhooks/razorpay` verifies HMAC-SHA256 signature; `payment.failed` logs the event; `refund.processed` looks up PaymentRecord by paymentId and downgrades user to free plan. PaymentRecord model stores audit trail.
- [x] **No invoice or payment receipt** ✅ Fixed: `sendReceiptEmail()` fires after `verifyPayment`; shows plan, ₹ amount, payment ID, expiry date; fire-and-forget so failures don't block the API response.
- [ ] **No coupon / referral system** — No discount codes or referral tracking.
- [x] **No free trial for paid plans** ✅ Fixed: 7-day Pro trial granted on registration (`trialExpiry` field); AI quota uses Pro limits during trial; `trialActive` + `trialDaysLeft` exposed from `getSubscription`; trial banner shown in Settings with days remaining.
- [x] **No annual plan option** ✅ Fixed: `pro_annual` (₹1,799/yr, 25% off) and `premium_annual` (₹4,499/yr) added to PLANS; Joi validation updated; paymentRoutes accepts annual plan keys.
- [x] **No admin analytics dashboard** ✅ Fixed: `GET /api/admin/analytics` returns summary (DAU, MAU, conversion %, 7-day retention, total revenue) + 30-day trends for new registrations, practice attempts, and daily revenue. `AdminAnalytics.jsx` at `/admin/analytics` shows metric cards and CSS bar charts; linked in AdminLayout sidebar.
- [x] **No GDPR / data deletion endpoint** ✅ Fixed: `DELETE /api/user/me` deletes User + all personal data (UserProfile, Attempts, ErrorMemory, Streak, Badges, DoubtThreads, LessonProgress). UI added in Settings.
- [x] **No Terms of Service or Privacy Policy pages** ✅ Fixed: `/terms` and `/privacy` pages with full content (eligibility, subscriptions, data rights, security, PDPB/GDPR compliance); linked in sidebar footer and cross-referenced from each other.
- [x] **No CI/CD pipeline** ✅ Fixed: `.github/workflows/ci.yml` — backend Jest tests + frontend build on push to main and cursor/** branches.
- [ ] **No error monitoring** — No Sentry / Datadog integration.
- [ ] **No database backup strategy** — No automated snapshot or offsite backup documented.
- [x] **No onboarding email sequence** ✅ Fixed: `onboardingEmailService.js` — day-2 nudge (registered 2-3 days ago, < 3 attempts) and day-7 re-engagement (registered 7-9 days ago, inactive 5+ days); both track sent state via `onboardingDay2SentAt`/`onboardingDay7SentAt` on User; auto-runs on server boot + every 24h; also callable via `POST /api/admin/run-onboarding-emails`.
- [ ] **No NPS or in-app feedback** — No mechanism to collect satisfaction scores or feature requests.
- [x] **Socket.IO `rooms` object is single-instance** — Competition fails in multi-pod deployments. ✅ Fixed: same as above — Redis adapter + Redis-backed room state.
- [x] **`CLAUDE_MODEL` hardcoded fallback** ✅ Verified: fallback is `claude-haiku-4-5-20251001` — current latest Haiku. Overridable via `CLAUDE_MODEL` env var.
- [ ] **No A/B testing infrastructure** — No feature flags or experiment framework.

---

## 📋 QUICK WINS (fix in < 1 hour each)

- [x] Import `logger` in `practiceController.js` ✅
- [x] Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, VAPID keys to `.env.example` ✅
- [x] Fix `Settings.jsx` to update full user object in Zustand store on save ✅
- [x] Add role check (`parent`/`teacher`/`admin`) to `linkStudentDirect` ✅
- [x] Strip `type` field from competition question options before sending to clients ✅
- [x] Move `/api/ai/cache-stats` behind `adminAuth` ✅
- [x] Add `planExpiry` expiry check at login / on each request to auto-downgrade expired plans ✅
- [x] Fix premium AI call limit: read `user.plan` in `checkAndIncrementUsage` and apply correct cap (free=10, pro=100, premium=500) ✅

---

## ✅ ALREADY WELL IMPLEMENTED (do not regress)

- Atomic doubt-chat AI quota with `$cond` pipeline (`doubtRoutes.js:47`)
- JWT blacklist on logout + password-change token invalidation (`auth.js:35-49`)
- bcrypt with salt 10, brute-force lockout after 10 failed attempts (`authController.js:123`)
- Razorpay signature verification + plan stored server-side in Redis (`paymentService.js:83-101`)
- Joi validation on every state-changing route
- Per-user Socket.IO auth via JWT on every handshake
- Admin routes protected by `adminAuth` middleware throughout
- Ownership check (`verifyOwnership`) before any student data is shared in portal
- Subject-aware AI system prompts + 7-layer cost-minimisation cache
- Redis session TTL for practice and exam sessions (replaces in-memory `{}`)

---

*This checklist lives at `AUDIT_CHECKLIST.md` in the repo root. Tick items off as they are resolved and reference the PR number next to each completed item.*
