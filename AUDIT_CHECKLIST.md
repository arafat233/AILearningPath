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
- [ ] **Socket rooms lost on server restart** `socket.js:38` — `rooms` is in-memory. Live competition lost on restart. Fix: Redis adapter for `socket.io-redis`.
- [x] **Mixed practice start doesn't set session** — `/practice/mixed` now calls `sessionSet` after fetching question. ✅ Fixed.
- [x] **planExpiry never auto-downgrades** — Auth middleware now fire-and-forget downgrades expired paid users. ✅ Fixed.
- [x] **Revision mark doesn't update Planner state** ✅ Verified: `revisionService.markRevised` increments `revisionStage` and sets `nextRevision` atomically; Planner UI removes item optimistically on success.
- [x] **NCERT subject name mismatch for Social Science** ✅ Verified: `seedSocialScienceCurriculum.js` and NCERT route both use `"Social Science"` consistently; `ncertSubject()` passthrough is correct.
- [x] **Practice submit exposes `solutionSteps` / correct answer** ✅ Fixed: client sends `selectedOptionIndex` (not type); server derives `selectedType` from session; option types stripped from client question; `solutionSteps` only returned when answer is wrong.
- [x] **Planner `saveTopicOrder` API wired in frontend but backend route not verified** ✅ Verified: `PATCH /planner/reorder` exists in `plannerRoutes.js` with Joi validation.

---

## 🟡 MEDIUM — Security Hardening

- [ ] **No CSRF protection on state-changing routes** — Production uses `SameSite: none`. Add CSRF token for POST/PUT/DELETE in production.
- [x] **Rate limit missing on `/api/user/me` PUT** ✅ Fixed: 20 updates/hour per user via `express-rate-limit`.
- [x] **No input sanitisation on `name` field** ✅ Verified: `escHtml(user.name)` used in both the welcome email and forgot-password email in `authController.js:97,242`.
- [x] **Admin delete endpoints have no soft-delete** ✅ Fixed: `deletedAt` soft-delete for Questions and Topics; list queries filter `deletedAt: { $exists: false }`.
- [x] **No output encoding on AI-generated content** ✅ Fixed: `sanitizeSvg()` in NcertTopicView strips `<script>`, `on*` event attributes, `javascript:` from SVG before `dangerouslySetInnerHTML`. LessonView has no `dangerouslySetInnerHTML`.
- [x] **`questionId` in doubt routes accepts arbitrary strings** ✅ Fixed: validates as valid ObjectId or `"ai-generated"` before DB query.
- [ ] **Refresh token rotation missing invalidation of old family** — Stolen token reuse not detected. Implement token family tracking.
- [ ] **API key visible in frontend** — Razorpay `keyId` (public) returned in `createOrder`. Safe but add comment to prevent accidental secret inclusion.

---

## 🔵 MEDIUM — Missing Test Coverage

- [ ] **No test for `authController`** — register, login, logout, refresh, forgot/reset-password untested.
- [ ] **No test for `practiceController`** — start, submit flow (session handling, badge award, streak update) untested.
- [ ] **No test for `paymentService`** — signature verification, plan upgrade, order TTL untested.
- [ ] **No test for `portalController`** — IDOR checks on `getStudentAnalytics` and `getStudentDashboardCtrl` untested.
- [ ] **No test for `examController`** — exam start, submit, scoring, leaderboard untested.
- [ ] **No integration tests** — All existing tests mock Mongoose. No tests hit a real test DB.
- [ ] **No frontend tests** — No Vitest / Playwright setup.
- [ ] **No load tests** — Unknown behaviour under 100+ concurrent practice sessions.
- [ ] **No test for AI quota race condition** — Atomicity fix for `checkAndIncrementUsage` needs concurrent-request test.
- [ ] **No test for `revisionService`** — Spaced-repetition interval and `markRevised` stage progression untested.

---

## 🟢 STUDENT PERSPECTIVE — Missing Features & UX

- [ ] **No visible countdown timer during practice** — Add per-question timer display.
- [x] **No "End Session" button** ✅ Fixed: "End Session" button appears in header after first answer; shows session summary screen.
- [x] **No session summary screen** ✅ Fixed: Summary shows score, accuracy %, accuracy bar, and all missed questions with correct/selected options and AI explanations.
- [x] **No question review after practice** ✅ Fixed: Summary screen lists all wrong answers with highlighted correct option and AI explanation inline.
- [x] **No search bar** ✅ Fixed: Search overlay (⌘K / Ctrl+K) in sidebar searches topics by keyword via `GET /topics?q=`; arrow-key navigation; clicking result opens Practice with topic pre-selected.
- [x] **No bookmark / favourite questions** ✅ Fixed: ☆ Bookmark toggle on every feedback card; `POST /api/user/bookmarks/:id` (toggle), `GET /api/user/bookmarks`; dedicated Bookmarks page in sidebar with remove & "Practice this topic" links.
- [ ] **No dark mode** — No dark theme toggle.
- [ ] **No offline support** — Service worker caches only `index.html`. No offline questions/lessons.
- [ ] **Voice tutor has no history** — Each voice session starts fresh.
- [ ] **No manual weak-topic override UI** — `PUT /user/me` accepts `weakTopics` but no UI exposes it.
- [ ] **Exam timer doesn't sync on tab switch** — Use server-side start timestamp instead of `Date.now()`.
- [ ] **No notification when revision is due** — PWA push stubbed but never triggered.
- [ ] **Competition room has no shareable link** — Add "Copy link" button with room ID.
- [ ] **No progress certificate / achievement download** — No printable proof of completion.

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

- [ ] **No Razorpay webhook handler for failed/refunded payments** — `payment.failed` / `refund.processed` events don't update user plan.
- [ ] **No invoice or payment receipt** — No email with receipt or invoice after successful payment.
- [ ] **No coupon / referral system** — No discount codes or referral tracking.
- [ ] **No free trial for paid plans** — Users go directly from free to paid with no trial period.
- [ ] **No annual plan option** — Only monthly plans; annual plans improve LTV and reduce churn.
- [ ] **No admin analytics dashboard** — No DAU/MAU, revenue, conversion rate, or retention charts.
- [x] **No GDPR / data deletion endpoint** ✅ Fixed: `DELETE /api/user/me` deletes User + all personal data (UserProfile, Attempts, ErrorMemory, Streak, Badges, DoubtThreads, LessonProgress). UI added in Settings.
- [ ] **No Terms of Service or Privacy Policy pages** — Required before commercial launch or app store listing.
- [x] **No CI/CD pipeline** ✅ Fixed: `.github/workflows/ci.yml` — backend Jest tests + frontend build on push to main and cursor/** branches.
- [ ] **No error monitoring** — No Sentry / Datadog integration.
- [ ] **No database backup strategy** — No automated snapshot or offsite backup documented.
- [ ] **No onboarding email sequence** — No day-2 / day-7 re-engagement emails.
- [ ] **No NPS or in-app feedback** — No mechanism to collect satisfaction scores or feature requests.
- [ ] **Socket.IO `rooms` object is single-instance** — Competition fails in multi-pod deployments. Fix: `socket.io-redis` adapter.
- [ ] **`CLAUDE_MODEL` hardcoded fallback** — Review quarterly as Anthropic releases new models.
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
