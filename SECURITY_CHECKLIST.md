# Security & Test Checklist
<!-- STATUS KEY: [ ] = todo | [~] = in-progress | [x] = done -->
<!-- On every session start: read this file, find the first [ ] or [~] item, fix it, mark it [x], commit, move to next. -->

Last updated: 2026-04-24
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

- [ ] **SEC-18** — Remove `name` and `role` from JWT payload
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

- [ ] **SEC-22** — Shorten JWT access token to 1 day, add refresh token route
  - Token already shortened to 1 day (done in SEC-03)
  - Refresh token route (`POST /api/auth/refresh`) still needed for seamless re-auth
  - File: `authRoutes.js` + `authController.js`

- [x] **SEC-23** — Add account lockout after 10 failed logins
  - `loginAttempts` + `lockUntil` fields on User model
  - `login` increments attempts on failure, locks for 15min after 10 fails, resets on success
  - Files: `models/index.js`, `authController.js` — done

- [ ] **SEC-24** — Verify `RAZORPAY_KEY_ID` is public key only (not secret)
  - Confirm the key returned in `createOrder` response is rzp_test/live key (not secret)
  - File: `paymentService.js:75` — visual audit needed

- [x] **SEC-25** — Enforce minimum 32-character `JWT_SECRET` in `validateEnv.js`
  - Crashes server on startup if secret is too short
  - File: `validateEnv.js` — done

---

## Unit Tests (Jest)

### Auth Middleware — `__tests__/auth.middleware.test.js`
- [ ] Valid JWT (cookie) → req.user populated, next() called
- [ ] Valid JWT (Authorization header fallback) → next() called
- [ ] Expired JWT → 401 "Invalid token"
- [ ] Tampered signature → 401 "Invalid token"
- [ ] Missing cookie + no header → 401 "No token"
- [ ] Blacklisted JTI (Redis key set) → 401 "Token has been revoked"
- [ ] Token issued before pwdChangedAt → 401 "Password changed"

### Admin Auth Middleware — `__tests__/adminAuth.middleware.test.js`
- [ ] Valid admin JWT + DB role=admin → next() called
- [ ] Valid JWT + DB role=student → 403
- [ ] User deleted from DB → 401
- [ ] Redis cache hit (admin) → next() called, DB not queried
- [ ] Redis cache hit (student) → 403, DB not queried
- [ ] Invalid JWT → 401

### Auth Controller — `__tests__/auth.controller.test.js`
- [ ] Register new email → 200, sets httpOnly cookie, returns `{ user }`
- [ ] Register duplicate email → 409
- [ ] Register password < 8 chars → 422
- [ ] Login correct credentials → 200, sets cookie, returns `{ user }`
- [ ] Login wrong password → 401 generic "Invalid email or password"
- [ ] Login unknown email → 401 generic "Invalid email or password" (no enumeration)
- [ ] Login after 10 failures → 429 "Account locked"
- [ ] Login success after lockout expires → 200
- [ ] logout → 200, cookie cleared, JTI blacklisted in Redis
- [ ] forgotPassword registered email → 200, email sent, token stored
- [ ] forgotPassword unknown email → 200 same message (no reveal)
- [ ] resetPassword valid token → 200, password changed, pwdChangedAt set
- [ ] resetPassword expired token → 400
- [ ] resetPassword already-used token → 400

### Validate Middleware — `__tests__/validate.middleware.test.js`
- [ ] Valid body → next() called
- [ ] Missing required field → 422
- [ ] Unknown extra field → 422 (allowUnknown: false)
- [ ] Wrong type → 422

### Practice Controller — `__tests__/practice.controller.test.js`
- [ ] startTopic valid → 200, session created in Redis
- [ ] startTopic no questions → 404
- [ ] startTopic foundation redirect → 200 foundationRedirect:true
- [ ] submitAnswer no session → 400
- [ ] submitAnswer correct → isCorrect:true, attempt stored
- [ ] submitAnswer incorrect → isCorrect:false, ErrorMemory updated
- [ ] submitAnswer timeTaken clamped to [1,600]
- [ ] submitAnswer invalid selectedType ("hacked") → 422

### Payment Service — `__tests__/payment.service.test.js`
- [ ] createOrder valid planKey → stores planKey in Redis, returns orderId
- [ ] createOrder unknown planKey → AppError 400
- [ ] createOrder missing Razorpay env keys → AppError 503
- [ ] verifyPayment correct HMAC → plan upgraded in DB, Redis key deleted
- [ ] verifyPayment tampered signature → AppError 400
- [ ] verifyPayment expired/missing Redis key → AppError 400 (planKey swap prevented)
- [ ] getSubscription active plan → isActive:true
- [ ] getSubscription expired plan → isActive:false
- [ ] getSubscription unknown user → AppError 404

### Analysis Service — `__tests__/analysis.service.test.js`
- [ ] analyzeAnswer correct option → isCorrect:true
- [ ] analyzeAnswer wrong + fast time → speedProfile contains "guessing"
- [ ] analyzeAnswer high confidence wrong → confidenceInsight non-empty warning
- [ ] generateFeedback various profiles → returns non-empty string
- [ ] classifyThinkingProfile all behavior stats → returns valid profile type

### Adaptive Service — `__tests__/adaptive.service.test.js`
- [ ] getNextQuestion → returns unseen question near target difficulty
- [ ] getNextQuestion all seen → still returns question
- [ ] getNextQuestion no questions for topic → returns null
- [ ] getInterleavedQuestion → topic of returned question is in input list

### Revision Service — `__tests__/revision.service.test.js`
- [ ] getRevisionTopics topic due → in list with urgency field
- [ ] getRevisionTopics all up-to-date → empty array
- [ ] markRevised → nextRevision > today
- [ ] markRevised unknown user → no crash

### Streak Service — `__tests__/streak.service.test.js`
- [ ] First day → streak = 1
- [ ] Consecutive day → streak increments
- [ ] Same day twice → streak unchanged
- [ ] Gap > 1 day → streak resets to 1
- [ ] New longest streak → longestStreak updated

### Scoring Service — `__tests__/scoring.service.test.js`
- [ ] calculateExamScore all correct → max score
- [ ] calculateExamScore with negative marking → correctly reduced
- [ ] normalizeScores single attempt → 1.0
- [ ] normalizeScores multiple attempts → values in [0,1]
- [ ] assignRanks tie → same rank
- [ ] computeDynamicDifficulty 100% correct → difficulty decreases
- [ ] computeDynamicDifficulty 0% correct → difficulty increases

### Portal Controller — `__tests__/portal.controller.test.js`
- [ ] linkStudent valid code → student linked
- [ ] linkStudent self-link → 400
- [ ] linkStudent invalid code → 404
- [ ] generateInvite → code is 8 uppercase hex chars, unique in DB
- [ ] generateInvite collision → retries up to 5x and succeeds
- [ ] getStudentAnalytics valid ObjectId, owner → 200
- [ ] getStudentAnalytics invalid ObjectId → 400
- [ ] getStudentAnalytics non-owner → 403
- [ ] getStudentAnalytics admin → 200 (role bypass)

### Doubt Routes — `__tests__/doubt.routes.test.js`
- [ ] Send message under limit → 200, reply stored
- [ ] Send message at free limit (10) atomic → 429, no extra DB writes
- [ ] Send concurrent requests at limit → only one passes (atomic test)
- [ ] Send message paid under limit → 200
- [ ] ai-generated questionId → 400
- [ ] Thread truncates at 20 messages
- [ ] Message > 2000 chars → 422
- [ ] GET thread no existing → returns empty messages array
- [ ] DELETE thread → messages cleared

### AI Router — `__tests__/aiRouter.service.test.js`
- [ ] Cache hit same question+mistakeType → no Anthropic call
- [ ] Cache miss → calls Anthropic, stores result
- [ ] getUsageCount → matches DB record for today
- [ ] Anthropic API failure → returns null gracefully

### Question Generator — `__tests__/questionGenerator.test.js`
- [ ] linear() → has exactly 1 "correct" option
- [ ] quadratic() → discriminant ≥ 0 (real roots)
- [ ] trigonometry() → answer is a standard trig value
- [ ] probability() → answer in [0,1]
- [ ] All generators → return object with questionText, options[], solutionSteps[]
