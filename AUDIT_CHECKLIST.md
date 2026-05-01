# AILearningPath — Full Audit Checklist
> Generated: May 2026 | Covers: Security · Bugs · Tests · Student UX · Parent UX · Business
> Status key: ❌ Not done · ⚠️ Partial · ✅ Done

---

## 🔴 CRITICAL — Security Vulnerabilities

- [ ] **REGEX INJECTION** `portalController.js:17` — `{ $regex: q }` runs user input as a MongoDB regex. A query like `.*` or `(a+)+` can DoS the database. Fix: escape the string or use `$text` index.
- [ ] **NO ROLE CHECK on linkStudentDirect** `portalController.js:32` — Any authenticated user (including students) can link another student to themselves. A student could claim another student as their "child". Fix: check `req.user.role` is `parent`, `teacher`, or `admin`.
- [ ] **RACE CONDITION in AI quota** `aiRouter.js:47` — `checkAndIncrementUsage` does a read-then-write (not atomic). Two simultaneous requests both see `9/10` and both increment, exceeding the limit. Fix: use the same atomic `$cond` pipeline update pattern used in `doubtRoutes.js:47`.
- [ ] **NO HOST AUTH on Socket rooms** `socket.js:49,64` — Any player in a room can emit `start_room` or `end_game` to control the game. Fix: record the socket ID or userId of the room creator and verify on start/end events.
- [ ] **CORRECT ANSWER EXPOSED in competition** `competitionRoutes.js:19` — `/room-questions` projects `options` array, which contains `type: "correct"` visible to every client. Fix: strip `type` from options before sending to clients; only reveal after the round ends.
- [ ] **PREMIUM QUOTA BUG** `aiRouter.js:57` — `isPaid ? PRO_DAILY_LIMIT (100) : FREE_DAILY_LIMIT (10)`. Premium plan advertises 500 calls/day (`paymentService.js:31`) but users actually get 100. Fix: read `user.plan` and apply per-plan limit map.
- [ ] **logger NOT IMPORTED** `practiceController.js:85,86,87` — Code calls `logger.warn(...)` but `logger` is never imported. Will throw `ReferenceError` in production when any of those `.catch()` paths fires. Fix: add `import logger from "../utils/logger.js";`.
- [ ] **CACHE STATS EXPOSED to all users** `aiRoutes.js:53` — `/api/ai/cache-stats` returns business metrics (total cache hits, Claude calls saved) to any logged-in student. Fix: gate behind `adminAuth` or restrict to admin role.
- [ ] **safeUser() strips plan fields** `authController.js:65` — Login/register response only returns `id, name, email, role`. Frontend relies on `user.subject`, `user.grade`, `user.isPaid`, `user.plan` from the store. After OAuth redirect, these fields are `undefined` until `/api/user/me` is called. Fix: include all fields needed by the frontend in `safeUser()`.
- [ ] **MISSING env vars in .env.example** — Code uses `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL` but none are documented. New developers cannot run Google OAuth or push notifications.

---

## 🟠 HIGH — Bugs

- [ ] **Subject filter ignored in Dashboard topics** — `getTopics({ subject, grade })` sends query params but `userRoutes.js` `GET /topics` runs `Topic.find()` with no filter. All 60+ topics are returned regardless of the active tab. Confirm behaviour in `topicRoutes.js` and add `req.query.subject`/`req.query.grade` filtering there.
- [ ] **Settings.jsx only saves `name` to Zustand** `Settings.jsx:51` — `setAuth(null, { ...user, name: data.user.name })` — grade, subject, goal, examDate changes are saved to DB but the in-memory store is not updated. The Dashboard and Practice pages read stale values until full page reload.
- [ ] **Socket rooms lost on server restart** `socket.js:38` — `rooms` is an in-memory object. Any live competition is lost if the server restarts or crashes. Fix: use Redis adapter (`socket.io-redis`) to persist room state.
- [ ] **Mixed practice start doesn't set session** `adaptiveService.js` — `/practice/mixed` calls `getInterleavedQuestion` but doesn't call `sessionSet`, so subsequent `/practice/submit` finds no `session.currentQuestion` and returns 400. Students cannot submit answers from mixed-practice mode.
- [ ] **planExpiry never auto-downgrades** — `planExpiry` date is stored but no cron job checks it. After 30 days, `user.isPaid` stays `true` forever. Fix: add a daily cron (or check at login) to set `isPaid: false` when `planExpiry < now`.
- [ ] **Revision mark doesn't update Planner state** `Planner.jsx` — After clicking "Done" on a revision item, the item is removed from UI state but `revisionDue` is a derived slice of the plan data. A page refresh restores it if the backend `markRevised` call hasn't updated the `revisionStage`. Verify the stage is incremented in `revisionService.markRevised`.
- [ ] **NCERT subject name mismatch for Social Science** — `Lessons.jsx:22` maps "Math" → "Mathematics" but Social Science NCERT data may be stored as "Social_Science" or "Social Science" depending on seed. Needs consistency check.
- [ ] **Practice submit exposes `solutionSteps` before session ends** `practiceController.js:168` — `solutionSteps` is returned in the submit response. A user could call `/practice/start` and then `/practice/submit` with a fake `selectedType: "correct"` to read the solution without answering.
- [ ] **Planner `saveTopicOrder` API wired in frontend but backend route not verified** — `api.js:56` calls `PATCH /planner/reorder` but if `plannerRoutes.js` does not expose this endpoint, drag-and-drop reordering silently fails.

---

## 🟡 MEDIUM — Security Hardening

- [ ] **No CSRF protection on state-changing routes** — Cookies are `SameSite: lax` in dev, which helps, but production uses `SameSite: none` (required for cross-origin). Add a CSRF token check for all `POST/PUT/DELETE` routes in production.
- [ ] **Rate limit missing on `/api/user/me` PUT** — A user can spam profile updates. Add a per-user rate limit (e.g. 10 updates/hour).
- [ ] **No input sanitisation on `name` field** — `name` passes through `trim()` but is not stripped of HTML entities before being embedded in welcome emails. The `escHtml()` helper exists in `authController.js` — use it on `user.name` in all email templates.
- [ ] **Admin delete endpoints have no soft-delete** — `DELETE /admin/questions/:id` and `DELETE /admin/topics/:id` permanently remove DB records with no recovery path. Add a `deletedAt` soft-delete flag.
- [ ] **No output encoding on AI-generated content** — AI responses displayed in React are safe (React auto-escapes), but `LessonView.jsx` and `NcertTopicView.jsx` may use `dangerouslySetInnerHTML` for SVG/HTML content. Audit all `dangerouslySetInnerHTML` usages for XSS risk.
- [ ] **`questionId` in doubt routes accepts arbitrary strings** — `/doubt/:questionId` uses the ID to scope a thread but doesn't validate it is a valid MongoDB ObjectId (or `"ai-generated"`). Validate format before DB query.
- [ ] **Refresh token rotation missing invalidation of old family** — If a refresh token is stolen and used, the attacker gets a new token. The legitimate user's next refresh will also work (no detection). Implement token family tracking to detect reuse and invalidate the whole family.
- [ ] **API key visible in frontend** — Razorpay `keyId` (public key) is returned in `createOrder` response. This is intentional (Razorpay requires it). Ensure `RAZORPAY_KEY_SECRET` is never accidentally included — currently safe but worth a comment.

---

## 🔵 MEDIUM — Missing Test Coverage

- [ ] **No test for `authController`** — register, login, logout, refresh, forgot/reset-password are untested. These are highest-risk paths.
- [ ] **No test for `practiceController`** — start, submit flow (session handling, badge award, streak update) is untested.
- [ ] **No test for `paymentService`** — signature verification, plan upgrade, order TTL are untested.
- [ ] **No test for `portalController`** — IDOR checks on `getStudentAnalytics` and `getStudentDashboardCtrl` are untested.
- [ ] **No test for `examController`** — exam start, submit, scoring, leaderboard are untested.
- [ ] **No integration tests** — All existing tests mock Mongoose. No tests hit a real test DB. Bugs at the DB query level (wrong field names, missing indexes) are invisible.
- [ ] **No frontend tests** — No Vitest / Playwright setup. UI regressions are caught manually only.
- [ ] **No load tests** — Unknown how the server behaves under 100+ concurrent practice sessions. The Redis session approach should handle it, but this has never been verified.
- [ ] **No test for AI quota race condition** — The atomicity fix for `checkAndIncrementUsage` needs a concurrent-request test to verify it holds.
- [ ] **No test for `revisionService`** — Spaced-repetition interval calculation and `markRevised` stage progression are untested.

---

## 🟢 STUDENT PERSPECTIVE — Missing Features & UX

- [ ] **No visible countdown timer during practice** — The system records `timeTaken` but students see no clock. Add a per-question timer display so students can pace themselves (matches real exam conditions).
- [ ] **No "End Session" button** — The only way to stop a practice session is to navigate away. Add an explicit end/summary button that shows session stats.
- [ ] **No session summary screen** — After finishing a topic, there is no "You got 7/10" screen with a review of missed questions. Students don't know how they did.
- [ ] **No question review after practice** — Students cannot go back and read explanations for questions they got wrong once the next question loads. Missed learning opportunity.
- [ ] **No search bar** — No way to search for a topic, chapter, or question by keyword. As content grows this becomes a blocker.
- [ ] **No bookmark / favourite questions** — Students cannot save hard questions for later review.
- [ ] **No dark mode** — No dark theme toggle. Most students study at night.
- [ ] **No offline support** — The service worker caches only `index.html`. No questions or lessons are available offline. Relevant for students with patchy connectivity.
- [ ] **Voice tutor has no history** — Each voice session starts fresh. Students cannot refer back to what the tutor said.
- [ ] **No manual weak-topic override** — `PUT /user/me` accepts `weakTopics` array and the API function exists, but no UI exposes this. Students cannot correct the AI's analysis.
- [ ] **Exam timer doesn't sync on tab switch** — If a student switches tabs during a timed exam, the `Date.now()` timer keeps running but the tab may throttle it. Use a server-side start timestamp instead.
- [ ] **No notification when revision is due** — PWA push notification infrastructure is stubbed (`public/sw.js`) but never triggered. Students miss revision deadlines silently.
- [ ] **Competition room has no shareable link** — Players must manually share the room ID. A "Copy link" button would reduce drop-off.
- [ ] **No progress certificate / achievement download** — Students and parents have no printable proof of completion or milestone.

---

## 🟣 PARENT PERSPECTIVE — Missing Features & UX

- [ ] **No consent flow for linking** — `linkStudentDirect` lets a parent link any student by ID with no approval from the student. The student should receive an in-app notification and must accept before their data is shared.
- [ ] **No weekly progress email to parents** — Parents only see data when they log in. A weekly digest email (sessions completed, accuracy trend, topics covered) would drive engagement.
- [ ] **No push notification for child milestones** — Parents are not notified when child earns a badge, completes a streak, or hits a weak-area alert.
- [ ] **Parent dashboard shows no historical trend** — Subject mastery bars show current snapshot. No chart over time (last 4 weeks). Parents cannot see if the child is improving.
- [ ] **No way to set study reminders for child** — Parents cannot schedule notifications or set study goals for their linked student.
- [ ] **No multi-child support UI** — Multiple children are shown as tabs, but there is no combined summary (e.g. "both children need to work on Electricity").
- [ ] **No teacher-specific view** — Teachers have the same portal as parents. Teachers need class-level aggregated views, not just individual student data.
- [ ] **Parent cannot see individual question attempts** — Only summary stats (accuracy %, weak areas) are visible. A parent cannot drill into what went wrong on a specific topic.

---

## 🏢 BUSINESS / COMPANY PERSPECTIVE

- [ ] **No Razorpay webhook handler for failed/refunded payments** — `webhookRoutes.js` exists but may be incomplete. If Razorpay sends a `payment.failed` or `refund.processed` event, the user's plan is not updated automatically.
- [ ] **No invoice or payment receipt** — After a successful payment there is no email with a receipt or invoice. Required for business users and tax compliance in India.
- [ ] **No coupon / referral system** — No discount codes, no referral tracking. Both are standard growth levers for ed-tech in India.
- [ ] **No free trial for paid plans** — Users go directly from free to paid with no trial period. A 7-day trial of Pro removes friction and increases conversion.
- [ ] **No annual plan option** — Only monthly plans (₹199/₹499). Annual plans at a discount (e.g. ₹1499/₹3999) improve LTV and reduce churn.
- [ ] **No admin analytics dashboard** — `AdminOverview` shows user counts and cache stats, but no DAU/MAU, revenue, conversion rate, or retention charts.
- [ ] **No GDPR / data deletion endpoint** — No `DELETE /api/user/me` endpoint. Users cannot delete their account. Required for privacy compliance (PDPB in India, GDPR if EU users).
- [ ] **No Terms of Service or Privacy Policy pages** — No `/terms` or `/privacy` route. Required before any commercial launch or app store listing.
- [ ] **No CI/CD pipeline** — No GitHub Actions workflow for automated test runs on push. Broken code can be pushed to main without detection.
- [ ] **No error monitoring** — No Sentry / Datadog integration. Production errors are logged to console only and are invisible unless someone is watching logs.
- [ ] **No database backup strategy** — Docker volume provides persistence, but no automated snapshot or offsite backup is documented.
- [ ] **No onboarding email sequence** — Welcome email is sent, but no day-2 / day-7 re-engagement emails for users who haven't returned.
- [ ] **No NPS or in-app feedback** — No mechanism to collect student satisfaction scores or feature requests from within the app.
- [ ] **Socket.IO `rooms` object is single-instance** — Competition will fail silently if two backend pods are running (PM2 cluster mode). Documented as a known risk but not fixed. Fix: `socket.io-redis` adapter.
- [ ] **`CLAUDE_MODEL` hardcoded fallback** — If `CLAUDE_MODEL` env var is unset, the model defaults to `claude-haiku-4-5-20251001`. As Anthropic releases new models, this fallback may point to a deprecated model. Review quarterly.
- [ ] **No A/B testing infrastructure** — No feature flags or experiment framework. Cannot test different onboarding flows, pricing, or UI variants.

---

## 📋 QUICK WINS (fix in < 1 hour each)

- [ ] Import `logger` in `practiceController.js`
- [ ] Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BACKEND_URL`, VAPID keys to `.env.example`
- [ ] Fix `Settings.jsx` to update full user object in Zustand store on save
- [ ] Add role check (`parent`/`teacher`/`admin`) to `linkStudentDirect`
- [ ] Strip `type` field from competition question options before sending to clients
- [ ] Move `/api/ai/cache-stats` behind `adminAuth`
- [ ] Add `planExpiry` expiry check at login / on each request to auto-downgrade expired plans
- [ ] Fix premium AI call limit: read `user.plan` in `checkAndIncrementUsage` and apply correct cap (free=10, pro=100, premium=500)

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
