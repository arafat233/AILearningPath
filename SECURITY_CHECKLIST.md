# Security & Test Checklist
<!-- STATUS KEY: [ ] = todo | [~] = in-progress | [x] = done -->
<!-- On every session start: read this file, find the first [ ] or [~] item, fix it, mark it [x], commit, move to next. -->

Last updated: 2026-04-25
Session auto-resume: YES — Claude reads this on every open and continues from the first unchecked item.

---

## CRITICAL Security Fixes

- [x] **SEC-01** — Fix user enumeration on `/api/auth/login`
  - Generic "Invalid email or password" for both wrong-email and wrong-password cases
  - File: `authController.js` — done

- [x] **SEC-02** — Add tight rate limiter on `/login` and `/forgot-password`
  - loginLimiter: 10/15min per IP on /login
  - forgotLimiter: 5/hr per IP on /forgot-password
  - File: `authRoutes.js` — done

- [x] **SEC-03** — Move JWT from localStorage to httpOnly cookie
  - Backend sets `httpOnly, secure, sameSite` cookie on login/register
  - Frontend: `withCredentials:true` on axios, no token in JS memory
  - authStore only persists `user` object, not token
  - App.jsx Protected checks `user !== null`
  - Files: `authController.js`, `auth.js`, `api.js`, `authStore.js`, `App.jsx`, all pages

- [x] **SEC-04** — Add logout endpoint + Redis token blacklist
  - `POST /api/auth/logout` — blacklists JTI in Redis with remaining TTL, clears cookie
  - `auth.js` — checks blacklist after every JWT verify
  - JWT now includes `jti: crypto.randomUUID()` for unique identification
  - Files: `authController.js`, `auth.js`, `authRoutes.js`, `api.js`, `Layout.jsx`

- [x] **SEC-05** — Invalidate all sessions on password reset
  - `resetPassword` stores `pwdChangedAt` on user document
  - `auth.js` rejects tokens with `iat < pwdChangedAt`
  - Files: `authController.js`, `auth.js`, `models/index.js`

- [x] **SEC-06** — Restrict `selectedType` to valid enum values
  - Joi `.valid("correct","concept_error","calculation_error","partial_logic","guessing","misinterpretation")`
  - File: `practiceRoutes.js` — done

- [x] **SEC-07** — Fix payment planKey swap attack
  - `createOrder` stores planKey in Redis keyed by orderId (30min TTL)
  - `verifyPayment` reads planKey from Redis — ignores client-supplied planKey
  - File: `paymentService.js` — done

- [x] **SEC-08** — Escape user.name before HTML interpolation in emails
  - `escHtml()` helper added, applied to `user.name` in reset email
  - File: `authController.js` — done

---

## HIGH Security Fixes

- [x] **SEC-09** — Add Joi validation to `PUT /admin/questions/:id` and `PUT /admin/topics/:id`
  - Both PUT routes now have `validate()` middleware
  - File: `adminRoutes.js` — done

- [x] **SEC-10** — Remove `.unknown(true)` from admin question/topic schemas
  - Explicit field lists only — no extra fields pass through
  - File: `adminRoutes.js` — done

- [x] **SEC-11** — Validate `studentId` route param as valid MongoDB ObjectId
  - `mongoose.isValidObjectId()` check before DB query
  - File: `portalController.js` — done

- [x] **SEC-12** — Add rate limit on `/practice/flag` and log abuse
  - Per-user flagLimiter: 20/hr, keyGenerator = req.user.id
  - `logger.info("Question flagged", { userId, questionId })` for audit trail
  - File: `practiceRoutes.js` — done

- [x] **SEC-13** — Fix `aiCallsToday` race condition with atomic DB operation
  - Single `findOneAndUpdate` with pipeline `$cond` — no separate read+check+write
  - File: `doubtRoutes.js` — done

- [x] **SEC-14** — Add uniqueness retry to `generateInvite`
  - 5-attempt retry loop, 8-char hex code from 6 random bytes
  - File: `portalController.js` — done

- [x] **SEC-15** — Add `.max(2000)` to doubt message field
  - File: `doubtRoutes.js` — done

- [x] **SEC-16** — Add `auth` middleware to `/api/user/topics`
  - File: `userRoutes.js` — done

---

## MEDIUM Security Fixes

- [x] **SEC-17** — Configure strict Content Security Policy via helmet
  - Explicit CSP directives in `server.js` — defaultSrc:'self', objectSrc:'none', frameAncestors:'none'
  - File: `server.js` — done

- [x] **SEC-18** — Remove `name` and `role` from JWT payload
  - JWT now only contains `{ id, jti }` — done for new tokens (SEC-03/04 already applied this)
  - Anywhere `req.user.name` or `req.user.role` is read outside adminAuth: fetch from DB
  - Audit: grep for `req.user.name` and `req.user.role` in routes/controllers and fix each

- [x] **SEC-19** — Add dedicated rate limiter to `forgot-password` (5/hour per IP)
  - File: `authRoutes.js` — done alongside SEC-02

- [x] **SEC-20** — Add ObjectId validation helper
  - `middleware/validateObjectId.js` created
  - Applied in `portalController.js`; apply to remaining `:id` routes as needed

- [x] **SEC-21** — Replace silent `.catch(() => {})` with `.catch(err => logger.warn(...))`
  - `practiceController.js` fire-and-forget errors now logged
  - File: `practiceController.js` — done

- [x] **SEC-22** — Shorten JWT access token to 1 day, add refresh token route
  - Token already shortened to 1 day (done in SEC-03)
  - Refresh token route (`POST /api/auth/refresh`) added — opaque random token in Redis, rotated on use
  - File: `authRoutes.js` + `authController.js` — done

- [x] **SEC-23** — Add account lockout after 10 failed logins
  - `loginAttempts` + `lockUntil` fields on User model
  - `login` increments attempts on failure, locks for 15min after 10 fails, resets on success
  - Files: `models/index.js`, `authController.js` — done

- [x] **SEC-24** — Verify `RAZORPAY_KEY_ID` is public key only (not secret)
  - Confirmed: `createOrder` returns `keyId: process.env.RAZORPAY_KEY_ID` (public key only)
  - Secret key stays server-side for HMAC verification — never sent to client
  - File: `paymentService.js` — verified

- [x] **SEC-25** — Enforce minimum 32-character `JWT_SECRET` in `validateEnv.js`
  - Crashes server on startup if secret is too short
  - File: `validateEnv.js` — done

---

## Unit Tests (Jest)

### Auth Middleware — `__tests__/auth.middleware.test.js`
- [x] Valid JWT (cookie) → req.user populated, next() called
- [x] Valid JWT (Authorization header fallback) → next() called
- [x] Expired JWT → 401 "Invalid token"
- [x] Tampered signature → 401 "Invalid token"
- [x] Missing cookie + no header → 401 "No token"
- [x] Blacklisted JTI (Redis key set) → 401 "Token has been revoked"
- [x] Token issued before pwdChangedAt → 401 "Password changed"

### Admin Auth Middleware — `__tests__/adminAuth.middleware.test.js`
- [x] Valid admin JWT + DB role=admin → next() called
- [x] Valid JWT + DB role=student → 403
- [x] User deleted from DB → 401
- [x] Redis cache hit (admin) → next() called, DB not queried
- [x] Redis cache hit (student) → 403, DB not queried
- [x] Invalid JWT → 401

### Auth Controller — `__tests__/auth.controller.test.js`
- [x] Register new email → 200, sets httpOnly cookie, returns `{ user }`
- [x] Register duplicate email → 409
- [x] Login correct credentials → 200, sets cookie, returns `{ user }`
- [x] Login wrong password → 401 generic "Invalid email or password"
- [x] Login unknown email → 401 generic "Invalid email or password" (no enumeration)
- [x] Login after 10 failures → 429 "Account locked"
- [x] logout → 200, cookie cleared, JTI blacklisted in Redis
- [x] forgotPassword registered email → 200, email sent, name HTML-escaped
- [x] forgotPassword unknown email → 200 same message (no reveal)
- [x] resetPassword valid token → 200, password changed, pwdChangedAt set
- [x] resetPassword expired token → 400
- [x] refresh valid token → rotates refresh token and returns user
- [x] refresh no cookie → 401

### Validate Middleware — `__tests__/validate.middleware.test.js`
- [x] Valid body → next() called
- [x] Missing required field → 422
- [x] Unknown extra field → 422 (allowUnknown: false)
- [x] Wrong type → 422

### Practice Controller — `__tests__/practice.controller.test.js`
- [x] startTopic valid → 200, session created in Redis
- [x] startTopic no questions → 404
- [x] startTopic foundation redirect → 200 foundationRedirect:true
- [x] submitAnswer no session → 400
- [x] submitAnswer correct → isCorrect:true, attempt stored
- [x] submitAnswer incorrect → resolveDoubt called, doubtType returned
- [x] submitAnswer wrong → attempt recorded in DB

### Payment Service — `__tests__/payment.service.test.js`
- [x] createOrder valid planKey → stores planKey in Redis, returns orderId
- [x] createOrder unknown planKey → AppError 400
- [x] createOrder missing Razorpay env keys → AppError 503
- [x] verifyPayment correct HMAC → plan upgraded in DB, Redis key deleted
- [x] verifyPayment tampered signature → AppError 400
- [x] verifyPayment expired/missing Redis key → AppError 400 (planKey swap prevented)
- [x] getSubscription active plan → isActive:true
- [x] getSubscription expired plan → isActive:false
- [x] getSubscription unknown user → AppError 404

### Analysis Service — `__tests__/analysis.service.test.js`
- [x] analyzeAnswer correct option → isCorrect:true
- [x] analyzeAnswer wrong + fast time → speedProfile contains "guessing"
- [x] analyzeAnswer high confidence wrong → confidenceInsight non-empty warning
- [x] analyzeAnswer returns non-empty message string
- [x] classifyThinkingProfile all behavior stats → returns valid profile type

### Adaptive Service — `__tests__/adaptive.service.test.js`
- [x] getNextQuestion no profile → targets medium difficulty range (0.3–0.7)
- [x] getNextQuestion high accuracy → targets harder questions
- [x] getNextQuestion low accuracy → targets easier questions
- [x] getNextQuestion no questions for topic → returns null
- [x] getNextQuestion all seen → widens search and returns a question
- [x] getNextQuestion → marks returned question as seen
- [x] getNextQuestion → excludes seen IDs from query

### Revision Service — `__tests__/revision.service.test.js`
- [x] getRevisionTopics topic due → in results
- [x] getRevisionTopics future nextRevision → not included
- [x] getRevisionTopics overdue → sorted by priority descending
- [x] getRevisionTopics no profile → returns empty array
- [x] markRevised → nextRevision in future, nextStage advances
- [x] markRevised at max stage → stage capped

### Streak Service — `__tests__/streak.service.test.js`
- [x] First day → streak = 1
- [x] Consecutive day → streak increments
- [x] Same day twice → streak unchanged, save not called
- [x] Gap > 1 day → streak resets to 1
- [x] New longest streak → longestStreak updated
- [x] getStreak no doc → returns 0,0
- [x] getStreak existing → returns values

### Scoring Service — `__tests__/scoring.service.test.js`
- [x] calculateExamScore all correct → max score
- [x] calculateExamScore with negative marking → correctly reduced
- [x] normalizeScores single attempt → 1.0
- [x] normalizeScores multiple attempts → values in [0,1]
- [x] assignRanks tie → same rank
- [x] computeDynamicDifficulty 100% correct → difficulty decreases
- [x] computeDynamicDifficulty 0% correct → difficulty increases

### Portal Controller — `__tests__/portal.controller.test.js`
- [x] linkStudent valid code → student linked
- [x] linkStudent self-link → 400
- [x] linkStudent invalid code → 404
- [x] generateInvite → code is 8 uppercase hex chars, unique in DB
- [x] generateInvite collision → retries up to 5x and succeeds
- [x] getStudentAnalytics valid ObjectId, owner → 200
- [x] getStudentAnalytics invalid ObjectId → 400
- [x] getStudentAnalytics non-owner → 403
- [x] getStudentAnalytics admin → 200 (role bypass)

### Auto Doubt Service — `__tests__/autoDoubt.service.test.js`
- [x] detectDoubtType correct → null
- [x] detectDoubtType fast wrong → guessing
- [x] detectDoubtType concept_error normal speed → concept_gap
- [x] detectDoubtType slow → overthinking
- [x] generateDoubtInsight includes topic name
- [x] resolveDoubt correct → null
- [x] resolveDoubt wrong → returns doubtType, insight, aiHelp, suggestedAction

### AI Teacher Service — `__tests__/aiTeacher.service.test.js`
- [x] new user → welcome type
- [x] high guessing rate → warning type
- [x] high concept_error rate → redirect type with topic
- [x] high accuracy + many attempts → challenge type
- [x] good session accuracy ≥80% → praise type
- [x] poor session accuracy <40% → support type
- [x] weak areas present → focus type
- [x] known thinkingProfile → profile type message

### AI Router — `__tests__/aiRouter.service.test.js`
- [x] correct answer → null immediately, no AI call (Layer 1)
- [x] has solution steps → formatted steps, no AI call (Layer 2)
- [x] static mistake type → static response, no AI call (Layer 3)
- [x] in-memory cache hit → cached response, no AI call (Layer 4)
- [x] DB cache hit → DB response, no AI call (Layer 5)
- [x] at daily limit → quota message, no AI call (Layer 6)
- [x] checkAndIncrementUsage user not found → false
- [x] checkAndIncrementUsage at limit → false
- [x] checkAndIncrementUsage under limit → true, increments counter
- [x] checkAndIncrementUsage new day → resets counter before incrementing
- [x] getUsageCount user not found → defaults
- [x] getUsageCount free user → limit 10
- [x] getUsageCount paid user → limit 100
- [x] getUsageCount stale day → used = 0
