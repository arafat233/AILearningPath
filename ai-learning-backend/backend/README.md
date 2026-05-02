# AI Learning App — Backend

## Stack
Node.js 20 · Express · MongoDB · Anthropic Claude Haiku 4.5 · Socket.IO · Redis · Razorpay

---

## Prerequisites

- **Node.js 20+** — https://nodejs.org (LTS installer)
- **MongoDB** — local Community edition or Atlas URI
- **Redis** (optional) — falls back to in-memory store in dev if `REDIS_URL` is not set

---

## Setup

```bash
cd ai-learning-backend/backend
npm install
cp .env.example .env        # Mac/Linux
copy .env.example .env      # Windows
```

Edit `.env` — minimum required fields:
```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/ai_learning
JWT_SECRET=any_long_random_string_at_least_32_chars
ANTHROPIC_API_KEY=your_key_here
```

```bash
node server.js    # starts on port 5001
```

You should see:
```
Server + WebSocket started { port: 5001, env: development }
MongoDB connected
```

---

## Seed the Database (run once, in order)

```bash
npm run seed                           # Math topics + questions
npm run seed:lessons                   # initial lesson content
npm run seed:subjects                  # Science / English / Social Science / Hindi topics
npm run seed:curriculum                # CBSE Class 10 Math — 14 chapters
npm run seed:science-curriculum        # CBSE Class 10 Science — 13 chapters
npm run seed:english-curriculum        # CBSE Class 10 English — 23 chapters
npm run seed:hindi-curriculum          # CBSE Class 10 Hindi — 32 chapters
npm run seed:social-science-curriculum # CBSE Class 10 Social Science — 22 chapters
```

---

## Tests

```bash
npm test    # Jest ESM — 22 unit tests (analysisService, scoringService, plannerService, aiRouter)
```

---

## Database Backup

```bash
npm run backup    # mongodump → gzip archive in ./backups/ (optional S3 upload)
npm run restore   # mongorestore from latest local backup; 5-second abort window
```

Set `BACKUP_ENABLED=true` in GitHub Actions `vars` to activate the nightly cron workflow.

---

## Make First Admin

```js
// Run in MongoDB shell or Compass
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
// Then re-login in the app to receive an updated JWT
```

---

## API Routes (summary)

All routes below (except auth) require `Authorization: Bearer <token>` via httpOnly cookie.

### Auth
| Method | URL | Body |
|--------|-----|------|
| POST | /api/auth/register | `{ name, email, password, examDate, grade, referralCode? }` |
| POST | /api/auth/login | `{ email, password }` |
| POST | /api/auth/logout | — |
| POST | /api/auth/forgot-password | `{ email }` |
| POST | /api/auth/reset-password/:token | `{ password }` |

### User
| Method | URL | Body |
|--------|-----|------|
| GET | /api/user/me | — |
| PUT | /api/user/me | `{ name, examDate, grade, subject, goal, weakTopics }` |
| DELETE | /api/user/me | — (GDPR delete — removes all personal data) |
| GET | /api/user/bookmarks | — |
| POST | /api/user/bookmarks/:questionId | — (toggle) |

### Practice
| Method | URL | Body |
|--------|-----|------|
| POST | /api/practice/start | `{ topicId }` |
| POST | /api/practice/submit | `{ selectedOptionIndex, timeTaken, confidence }` |
| POST | /api/practice/mixed | `{ topics: [...] }` |
| POST | /api/practice/flag | `{ questionId }` |

### Analysis
| Method | URL |
|--------|-----|
| GET | /api/analysis/report |
| GET | /api/analysis/errors |
| GET | /api/analysis/weekly-leaderboard |
| GET | /api/analysis/predict |

### Exams
| Method | URL | Body |
|--------|-----|------|
| GET | /api/exam/list | — |
| POST | /api/exam/start | `{ examId }` |
| POST | /api/exam/submit | `{ answers: [...] }` |
| GET | /api/exam/leaderboard/:examId | — |

### Planner
| Method | URL | Body |
|--------|-----|------|
| GET | /api/planner | — |
| POST | /api/planner/complete | `{ day }` |
| PATCH | /api/planner/reorder | `{ topicOrder }` |

### Revision
| Method | URL | Body |
|--------|-----|------|
| GET | /api/revision/due | — |
| POST | /api/revision/mark | `{ topic }` |
| GET | /api/revision/last-day | — |

### AI
| Method | URL | Body |
|--------|-----|------|
| GET | /api/ai/advice | — |
| GET | /api/ai/usage | — |
| GET | /api/ai/cache-stats | — (admin only) |
| POST | /api/ai/chat | `{ message, history, topic }` |
| POST | /api/ai/evaluate-explanation | `{ concept, userExplanation }` |
| POST | /api/ai/hint | `{ questionText, topic }` |
| POST | /api/ai/voice-answer | `{ transcript, subject, topic }` |
| GET | /api/ai/voice-history | — |
| DELETE | /api/ai/voice-history | — |

### Lessons / Topics / Badges / Doubt
| Method | URL |
|--------|-----|
| GET | /api/lessons |
| GET | /api/lessons/:topic |
| POST | /api/lessons/progress |
| GET | /api/topics |
| GET | /api/topics/meta |
| GET | /api/badges |
| GET/POST/DELETE | /api/doubt/:questionId |
| POST | /api/doubt/:questionId/message |

### Feedback (NPS)
| Method | URL | Body |
|--------|-----|------|
| GET | /api/feedback/nps-eligible | — |
| POST | /api/feedback | `{ score, comment? }` |
| GET | /api/feedback | — (admin only) |

### Portal (Parent / Teacher)
| Method | URL |
|--------|-----|
| GET | /api/portal/search |
| POST | /api/portal/link-direct |
| GET | /api/portal/students |
| GET | /api/portal/students/:id/analytics |
| GET | /api/portal/students/:id/dashboard |
| GET | /api/portal/students/:id/attempts |
| GET | /api/portal/requests |
| POST | /api/portal/requests/:id/respond |
| GET | /api/portal/class-stats |
| GET/POST | /api/portal/reminders |
| DELETE | /api/portal/reminders/:studentId |

### Payment
| Method | URL | Body |
|--------|-----|------|
| GET | /api/v1/payment/plans | — |
| GET | /api/v1/payment/subscription | — |
| POST | /api/v1/payment/create-order | `{ planKey, couponCode? }` |
| POST | /api/v1/payment/verify | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` |
| POST | /api/v1/payment/validate-coupon | `{ code, planKey }` |

### Curriculum / NCERT / PYQ
| Method | URL |
|--------|-----|
| GET | /api/v1/curriculum/subjects |
| GET | /api/v1/curriculum |
| GET | /api/v1/curriculum/:chapterNumber |
| GET | /api/v1/ncert/chapters |
| GET | /api/v1/ncert/chapters/:id |
| GET | /api/v1/ncert/topics/:id |
| GET | /api/v1/pyq/topics |
| GET | /api/v1/pyq/years |
| GET | /api/v1/pyq |
| GET | /api/v1/pyq/:id |

### Push Notifications
| Method | URL |
|--------|-----|
| GET | /api/push/vapid-public-key |
| POST | /api/push/subscribe |
| DELETE | /api/push/subscribe |

### Feature Flags
| Method | URL |
|--------|-----|
| GET | /api/flags |

### Admin (requires `role: "admin"` in JWT)
| Method | URL |
|--------|-----|
| GET | /api/admin/stats |
| GET | /api/admin/analytics |
| GET/PUT | /api/admin/users, /api/admin/users/:id/role |
| GET/POST/PUT/DELETE | /api/admin/questions, /api/admin/questions/:id |
| PUT | /api/admin/questions/:id/unflag |
| GET | /api/admin/questions/flagged |
| GET/POST/PUT/DELETE | /api/admin/topics, /api/admin/topics/:id |
| GET/POST/PUT/DELETE | /api/admin/coupons, /api/admin/coupons/:id |

### Health
| Method | URL |
|--------|-----|
| GET | /api/health |

---

## Project Structure

```
backend/
├── server.js              ← Express app, all routes mounted, Socket.IO, crons
├── .env.example
├── package.json
│
├── controllers/
│   ├── admin/             ← adminStatsController, adminUserController,
│   │                         adminQuestionController, adminTopicController
│   ├── aiController.js
│   ├── analysisController.js
│   ├── authController.js  ← JWT + Google OAuth (passport-google-oauth20)
│   ├── curriculumController.js
│   ├── examController.js
│   ├── lessonController.js
│   ├── plannerController.js
│   ├── portalController.js
│   └── practiceController.js
│
├── services/
│   ├── aiService.js           ← Claude calls + subject-aware system prompts
│   ├── aiRouter.js            ← 7-layer cost minimisation cache
│   ├── adaptiveService.js     ← smart question selection
│   ├── analysisService.js     ← thinking behaviour detector
│   ├── aiTeacherService.js    ← contextual teacher messages
│   ├── badgeService.js        ← achievement awards
│   ├── couponService.js       ← validate / compute / redeem coupons
│   ├── foundationService.js
│   ├── onboardingEmailService.js ← drip email sequence
│   ├── paymentService.js      ← Razorpay order + verify + referral reward
│   ├── plannerService.js
│   ├── predictionService.js   ← weighted exam score prediction
│   ├── profileService.js
│   ├── pushService.js         ← revision + study reminder push notifications
│   ├── revisionService.js     ← spaced repetition
│   ├── scoringService.js      ← Z-score exam ranking
│   ├── selfLearningService.js
│   ├── streakService.js
│   └── weeklyParentEmailService.js
│
├── routes/
│   ├── adminRoutes.js         ← /api/admin/*
│   ├── aiRoutes.js
│   ├── analysisRoutes.js
│   ├── authRoutes.js
│   ├── badgeRoutes.js
│   ├── competitionRoutes.js
│   ├── companyRoutes.js
│   ├── curriculumRoutes.js    ← /api/v1/curriculum/*
│   ├── doubtRoutes.js
│   ├── examRoutes.js
│   ├── feedbackRoutes.js      ← NPS feedback
│   ├── lessonRoutes.js
│   ├── ncertRoutes.js         ← /api/v1/ncert/*
│   ├── paymentRoutes.js       ← /api/v1/payment/*
│   ├── plannerRoutes.js
│   ├── portalRoutes.js
│   ├── practiceRoutes.js
│   ├── pushRoutes.js          ← /api/push/*
│   ├── pyqRoutes.js           ← /api/v1/pyq/*
│   ├── revisionRoutes.js
│   ├── topicRoutes.js
│   ├── userRoutes.js
│   └── webhookRoutes.js       ← POST /api/webhooks/razorpay (raw body)
│
├── middleware/
│   ├── auth.js            ← JWT verify → req.user
│   ├── adminAuth.js       ← requires role === "admin"
│   ├── csrf.js            ← double-submit cookie CSRF protection
│   ├── validate.js        ← Joi schema validation (422 on fail)
│   └── errorHandler.js    ← centralised error handler + Sentry
│
├── utils/
│   ├── AppError.js        ← operational error class
│   ├── cache.js           ← in-memory LRU (24h TTL)
│   ├── email.js           ← nodemailer wrapper (console fallback)
│   ├── featureFlags.js    ← flag registry, env overrides, % rollout
│   ├── logger.js          ← structured logger (pretty dev / JSON prod)
│   ├── redisClient.js     ← ioredis singleton + in-memory fallback
│   ├── sentry.js          ← Sentry init (no-op without SENTRY_DSN)
│   ├── socket.js          ← Socket.IO competition rooms
│   └── validateEnv.js     ← startup crash if required env vars missing
│
├── models/
│   ├── index.js           ← 20+ Mongoose schemas
│   ├── lessonModel.js     ← Lesson + LessonProgress
│   └── chapterModel.js    ← CBSE textbook chapters
│
├── config/
│   ├── seed.js
│   ├── seedLessons.js
│   ├── seedSubjects.js
│   ├── seedMathCurriculum.js
│   ├── seedScienceCurriculum.js
│   ├── seedEnglishCurriculum.js
│   ├── seedHindiCurriculum.js
│   └── seedSocialScienceCurriculum.js
│
├── scripts/
│   ├── backup.js          ← mongodump + gzip + optional S3 + prune
│   └── restore.js         ← mongorestore from local or S3
│
└── __tests__/
    ├── analysisService.test.js   (7 tests)
    ├── scoringService.test.js    (6 tests)
    ├── plannerService.test.js    (4 tests)
    └── aiRouter.test.js          (5 tests)
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `connect ECONNREFUSED` | MongoDB not running — start it first |
| `Cannot find module` | Run `npm install` |
| AI returns fallback message | `ANTHROPIC_API_KEY` missing or invalid in `.env` |
| No topics on frontend | Run `npm run seed` |
| No lessons showing | Run `npm run seed:lessons` |
| JWT errors | Token expired — log out and back in |
| Redis connection error | Either set `REDIS_URL` or leave it unset (falls back to in-memory) |
| CSRF 403 on POST | Cookie `csrf=` not being sent — check `withCredentials: true` on frontend |
| Push notifications not working | Run `npx web-push generate-vapid-keys` and set all three VAPID vars |
