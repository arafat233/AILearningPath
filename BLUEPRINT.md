# AILearningPath — Complete Project Blueprint
> Paste this into Claude.ai so it has full context without needing the zip.
> Last updated: May 2026 — reflects all security audit fixes from AUDIT_CHECKLIST.md batch 1.

---

## 1. WHAT THIS IS

An AI-powered CBSE Class 10 exam preparation platform. Students practice questions,
get AI-generated explanations for mistakes, follow a smart study planner, compete
live against each other, and receive personalised lessons — all driven by a
behavioural analysis engine that tracks HOW they think, not just whether they're right.

Stack: React (Vite) + Express + MongoDB + Claude Haiku 4.5 + Socket.IO

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
│          /api/health                                         │
│                                                              │
│  Socket.IO: competition room events (join/start/score/end)  │
└───────┬───────────────┬────────────────────────────────────-┘
        │               │
┌───────▼──────┐  ┌─────▼──────────────────────────────────┐
│   MongoDB    │  │          Claude Haiku 4.5               │
│  20 collections│  │  Routed through 7-layer cache system    │
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
aiCallsToday, aiCallsDate          ← daily AI quota tracking
role: student|admin|parent|teacher ← NEW: role-based access
linkedStudents: [String]           ← NEW: parent/teacher portal
inviteCode: String (sparse unique) ← NEW: 8-char student invite code
createdAt
```

### 3.2 Topic
```
_id, name, subject, grade
prerequisites [String]
examFrequency (0-1), estimatedHours, examMarks
realWorldUse, whyMatters

Subjects seeded: Math, Science, English, Social Science, Hindi (50+ topics)
```

### 3.3 Question
```
_id, topic, subtopic, questionText
questionType: mcq | case_based | assertion_reason | pyq
difficulty: easy | medium | hard
difficultyScore (0-1), expectedTime (seconds)
conceptTested, prerequisites [String]
isAIGenerated (bool), isFlagged, isPYQ, pyqYear
options: [{ text, type, logicTag }]
  ↳ option types: correct | concept_error | calculation_error |
                  partial_logic | guessing | misinterpretation
solutionSteps [String], shortcut, caseContext
marks, negativeMarks, createdAt
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
title, topic, totalQuestions, duration (minutes)
negativeMarking (bool), negativeValue
questionDistribution: { easy, medium, hard }
isActive, createdAt
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
userId, examDate, totalDays
dailyPlan: [{ day, date, topics [String], estimatedHours, completed }]
priorityTopics: [{ topic, priority, reason }]
skipSuggestions: [{ topic, effort, marksLost, reason }]
createdAt
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

### 3.1 User (updated)
```
Added fields:
  passwordResetToken:   String (SHA-256 hashed, null when not active)
  passwordResetExpires: Date   (1h from request, null when not active)
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

---

## 4. BACKEND SERVICES

### 4.1 aiService.js — Claude API Calls
```
SUBJECT-AWARE SYSTEM PROMPTS (NEW):
  getSystemPrompt(subject) → subject-specific Claude persona
  Subjects: Math | Science | English | Social Science | Hindi
  Each prompt cached by Claude (90% token discount on repeats)

Functions:
- getAIExplanation(question, mistakeType, correctAnswer, subject) → 320 tokens
- generateAIQuestion(topic, weakness, subject) → JSON MCQ with 4 options + logicTags
- generateLesson(topic, subject, grade) → structured lesson object
- getStudyAdvice(profile, subject) → personalised study tip
- generateHint(questionText, topic, subject) → 120 tokens, no answer given
- getChatResponse(history, userMessage, topic, subject) → 400 tokens, multi-turn
```

### 4.2 aiRouter.js — 7-Layer Cost Minimisation
```
Layer 1: isCorrect answer        → return null (0 cost)
Layer 2: Has solutionSteps       → return steps + static tip (0 cost)
Layer 3: Simple mistake pattern  → return STATIC_RESPONSES map (0 cost)
Layer 4: In-memory cache hit     → RAM lookup 24h TTL (0 cost, fast)
Layer 5: DB cache hit            → AIResponseCache lookup (0 cost, all users)
Layer 6: Daily limit check       → free=10/day, pro=100/day
Layer 7: Call Claude             → save to DB + RAM for all future users

Cache key = MD5(questionText.lower() + "::" + mistakeType + "::" + subject)
Subject included in key so Math/Science don't collide (UPDATED)

Exports: smartAIExplanation, smartStudyAdvice, getUsageCount, getCacheStats
         checkAndIncrementUsage (exported — used by doubtRoutes)
```

### 4.3 adaptiveService.js — Smart Question Selection
```
1. Read UserProfile: accuracy → target difficulty (0.25/0.5/0.75)
2. If concept_error > 5 → try DB-first AI question
   Only call Claude if no unseen AI question exists for this topic
3. Filter seen questions (SeenQuestion collection)
4. Find DB question closest to target difficulty
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

---

## 5. BACKEND ROUTES — ALL ENDPOINTS

### Existing
```
POST   /api/auth/register             → 409 if email already exists
POST   /api/auth/login               → 404 if email not found, 401 if wrong password
POST   /api/auth/forgot-password     → sends reset link by email (1h expiry); console-logs in dev
POST   /api/auth/reset-password/:token → verifies hashed token, updates password

POST   /api/practice/start          → foundation check → AI teacher msg → first question
POST   /api/practice/submit         → analysis → AI explanation → badge check → next question
                                      response includes: newBadges[]  ← NEW

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
POST   /api/exam/start
POST   /api/exam/submit
GET    /api/exam/history
GET    /api/exam/review/:attemptId

GET    /api/planner
POST   /api/planner/generate
POST   /api/planner/complete

GET    /api/revision/due
POST   /api/revision/mark
GET    /api/revision/last-day

GET    /api/ai/advice
GET    /api/ai/usage
GET    /api/ai/cache-stats     → admin only (adminAuth)
POST   /api/ai/chat                 → multi-turn tutor chat
POST   /api/ai/evaluate-explanation
POST   /api/ai/hint
POST   /api/ai/voice-answer         ← NEW: VoiceTutor dedicated endpoint

GET    /api/user/me
PUT    /api/user/me            → rate-limited (20 updates/hour per user)
DELETE /api/user/me            ← GDPR/PDPB: deletes User + all personal data

GET    /api/competition/leaderboard
POST   /api/competition/room-questions
```

### New routes
```
GET    /api/badges                  ← all badges for logged-in user

GET    /api/doubt/:questionId       ← get/create doubt thread
POST   /api/doubt/:questionId/message ← send message (counts AI quota)
DELETE /api/doubt/:questionId       ← clear thread

POST   /api/portal/generate-invite  ← student generates 8-char code
POST   /api/portal/link             ← parent/teacher links by code
GET    /api/portal/students         ← list linked students
GET    /api/portal/students/:id/analytics ← read-only student view

GET    /api/admin/stats             ← requires admin role
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

GET    /api/v1/curriculum/subjects     ← distinct subject+grade combos in DB
GET    /api/v1/curriculum              ← all chapters (?subject=&grade=&board=)
GET    /api/v1/curriculum/:chapterNumber ← full chapter detail + sections + formulas
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
/practice      → Practice       — Subject tabs + Science sub-tabs; adaptive quiz per subject
                                  confidence, AI explain, DoubtChat
/analytics     → Analytics      — thinking profile, behavior stats, topic progress, prediction
/competition   → Competition    — weekly leaderboard, create/join room
/live          → LiveRoom       — real-time Socket.IO quiz
/planner       → Planner        — calendar, priority topics, skip suggestions
                                  Revision Due section (spaced-repetition topics from revisionService)
/exam-review   → ExamReview     — past exams, per-question AI review
/voice-tutor   → VoiceTutor     — mic + text chat, subject-aware, TTS playback ← NOW FUNCTIONAL
/profile       → Profile        — user info, badges grid, invite code generator
/settings      → Settings       — update subject/grade/goal/examDate; all 5 CBSE subjects
                                  subscription card; Delete Account (GDPR — double-confirm)
/portal        → Portal         — student: generate invite code
                                  parent/teacher: link students, view analytics
                                  Subject Mastery bars always shown (4 CBSE subjects pre-seeded at 0%)
```

### Admin Pages (inside AdminLayout, admin role required)
```
/admin              → AdminOverview   — user counts, plan breakdown, AI cache stats
/admin/questions    → AdminQuestions  — CRUD + flag/unflag, filter by topic/subject
/admin/topics       → AdminTopics     — CRUD for all topics
/admin/users        → AdminUsers      — paginated user list, role management
/admin/cache        → AdminCacheStats — cache hit rates, Claude calls saved, cost estimate
```

### Components
```
Layout.jsx      — sidebar nav + outlet
BadgeToast.jsx  — floating toast when newBadges[] returned from practice submit ← NEW
DoubtChat.jsx   — expandable multi-turn chat below wrong answer in Practice ← NEW
```

---

## 7. AUTH + MIDDLEWARE

```
JWT payload: { id, name, role }   ← role added
JWT expiry: 7 days

middleware/auth.js       — verifies token, attaches req.user
middleware/adminAuth.js  — requires role === "admin" in JWT
middleware/validate.js   — Joi schema validation; 422 on invalid input ← NEW
middleware/errorHandler.js — centralised error handler (AppError,
                              Mongoose validation, duplicate key, JWT) ← NEW

utils/AppError.js        — operational error class with statusCode
utils/email.js           — nodemailer wrapper; logs to console when SMTP not set ← NEW
utils/logger.js          — structured logger (pretty dev / JSON prod)
utils/validateEnv.js     — crashes on startup if required env vars missing
utils/redisClient.js     — ioredis singleton with in-memory fallback for dev

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
  Jobs: backend Jest tests (with MongoDB service) + frontend Vite build
```

---

## 9. FRONTEND STATE + API

```
authStore (Zustand + persist):
  token, user → { id, name, email, subject, grade, goal,
                  examDate, isPaid, plan, role }  ← role added
  login(token, user), logout()

api.js (axios, baseURL: http://localhost:5001/api):
  Auto-attaches Bearer token. On 401 → logout().

New functions added to api.js:
  getPrediction()
  getBadges()
  getDoubtThread(questionId)
  sendDoubtMessage(questionId, message, topic, subject)
  clearDoubtThread(questionId)
  voiceAnswer(transcript, subject, topic)
  generateInvite()
  linkStudent(inviteCode)
  getLinkedStudents()
  getStudentAnalytics(studentId)
  adminGet* / adminCreate* / adminUpdate* / adminDelete* (8 admin functions)

  getCurriculumSubjects()
  listCurriculumChapters(subject, grade)
  getCurriculumChapter(chapterNumber, subject, grade)
```

---

## 10. AI COST ARCHITECTURE

```
Subject is now part of the cache key:
  cacheKey = MD5(questionText.lower() + "::" + mistakeType + "::" + subject)

5 subject-specific system prompts — each cached by Claude:
  Math          → CBSE Math teacher
  Science       → Physics/Chemistry/Biology teacher
  English       → First Flight + grammar teacher
  Social Science → History/Geography/Civics/Economics teacher
  Hindi         → Hindi grammar + prose teacher (prompt in Hindi)

Voice Tutor lang:
  Hindi subject → SpeechRecognition.lang = "hi-IN"
  all others    → "en-IN"

Daily limits (per plan): free=10/day, pro=100/day, premium=500/day
  Enforced via atomic MongoDB $cond pipeline — race-condition safe
DoubtChat messages count against the same daily quota
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
```

---

## 12. TEST SUITE  ← NEW

```
Location: backend/__tests__/
Runner:   node --experimental-vm-modules ./node_modules/jest-cli/bin/jest.js
Command:  npm test

__tests__/analysisService.test.js   — 7 tests (all pass)
  ✅ fast+wrong → guessing override
  ✅ correct answer → isCorrect true
  ✅ slow+correct → deep_thinker
  ✅ fast+correct → mastery
  ✅ high confidence+wrong → dangerous_misconception
  ✅ low confidence+right → unstable_knowledge
  ✅ normal time+partial_logic → keeps classification

__tests__/scoringService.test.js    — 6 tests (all pass)
  ✅ all wrong → score 0
  ✅ correct answers → positive score
  ✅ fast correct > slow correct
  ✅ hard correct > easy correct
  ✅ identical scores normalize to 0
  ✅ returns one entry per attempt

__tests__/plannerService.test.js    — 4 tests (mocked Mongoose)
  ✅ dailyPlan length respects daysLeft
  ✅ scholarship goal → minimal skipSuggestions
  ✅ pass goal → has skipSuggestions
  ✅ priorityTopics always present

__tests__/aiRouter.test.js          — 5 tests (mocked Mongoose + aiService)
  ✅ correct answer → null immediately
  ✅ solutionSteps present → no Claude call
  ✅ guessing → static message, no Claude
  ✅ misinterpretation → static message
  ✅ novel concept_error → Claude called once
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
| Test suite (Jest ESM, 22 tests) | ✅ Complete |
| Forgot password (email reset link, 1h expiry, console fallback in dev) | ✅ Complete |
| Password show/hide toggle on Login + Register | ✅ Complete |
| Password strength indicator on Register + ResetPassword | ✅ Complete |
| CBSE Class 10 Math textbook curriculum (14 chapters, Chapter model, seed, API) | ✅ Complete |
| CBSE Class 10 Science curriculum (13 chapters — Chemistry/Biology/Physics, seed, API) | ✅ Complete |
| CBSE Class 10 English curriculum (23 chapters — First Flight/Footprints/Words & Expr, seed) | ✅ Complete |
| CBSE Class 10 Hindi curriculum (32 chapters — Kshitij/Sparsh/Kritika/Sanchayan, seed) | ✅ Complete |
| CBSE Class 10 Social Science curriculum (22 chapters — History/Geo/Eco/PolSci, seed) | ✅ Complete |
| ChapterView page (sections, formulas, theorems, tips, exercises) | ✅ Complete |
| Lessons page — Textbook Chapters tab + AI Lessons tab | ✅ Complete |
| Payment / Subscription system (Razorpay — Pro ₹199/mo, Premium ₹499/mo) | ✅ Complete |
| Pricing page (/pricing) with plan cards and Razorpay checkout | ✅ Complete |
| Settings page subscription status card with Upgrade CTA | ✅ Complete |

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
**Push Notifications (backend shell exists)**
- VAPID keys needed: `npx web-push generate-vapid-keys`
- Install: `npm install web-push`
- Wire: POST /api/notifications/subscribe (save PushSubscription to DB)
- Wire: cron trigger: POST /api/cron/daily (check revision due + streak at risk)

**Personalised Daily Brief**
- Morning AI summary for each student on Dashboard first load
- "Focus on X today, exam in Y days, your weak area is Z"
- Cache per user per day in AIResponseCache

**Offline Mode**
- IndexedDB queue for attempts when offline
- Service worker pre-caches today's questions + study plan

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
MONGO_URI=
JWT_SECRET=
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-haiku-4-5-20251001
PORT=5001

# Optional — for PWA push notifications (not yet active)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=
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

# Tests
cd ai-learning-backend/backend
npm test

# Make yourself admin (run in MongoDB shell or Compass)
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
# Then re-login in the app to get updated JWT
```

---

## 17. COMPLETE FILE STRUCTURE

```
AILearningPath/
├── BLUEPRINT.md               ← this file — always up to date
│
├── ai-learning-backend/backend/
│   ├── server.js              ← Express + Socket.IO + all routes mounted
│   │
│   ├── models/
│   │   ├── index.js           ← 20 Mongoose schemas (all collections)
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
│   │   ├── aiService.js          ← UPDATED: getSystemPrompt(subject), 5 prompts
│   │   ├── aiRouter.js           ← UPDATED: subject in cache key, exported checkAndIncrementUsage
│   │   ├── adaptiveService.js
│   │   ├── analysisService.js
│   │   ├── aiTeacherService.js
│   │   ├── autoDoubtService.js
│   │   ├── badgeService.js       ← NEW: checkAndAwardBadges, getUserBadges
│   │   ├── foundationService.js
│   │   ├── plannerService.js
│   │   ├── predictionService.js  ← NEW: predictExamScore (weighted by marks×freq)
│   │   ├── profileService.js
│   │   ├── revisionService.js
│   │   ├── scoringService.js
│   │   ├── selfLearningService.js
│   │   └── streakService.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js        ← NEW: /api/admin/* (adminAuth protected)
│   │   ├── curriculumRoutes.js   ← NEW: /api/v1/curriculum/*
│   │   ├── aiRoutes.js           ← UPDATED: + /voice-answer
│   │   ├── analysisRoutes.js     ← UPDATED: + /predict
│   │   ├── authRoutes.js
│   │   ├── badgeRoutes.js        ← NEW: GET /api/badges
│   │   ├── competitionRoutes.js
│   │   ├── doubtRoutes.js        ← NEW: /api/doubt/:questionId (GET/POST/DELETE)
│   │   ├── examRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── plannerRoutes.js
│   │   ├── portalRoutes.js       ← NEW: /api/portal/*
│   │   ├── practiceRoutes.js
│   │   ├── revisionRoutes.js
│   │   ├── topicRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js              ← JWT verify → req.user
│   │   ├── adminAuth.js         ← NEW: requires role === "admin"
│   │   ├── validate.js          ← NEW: Joi schema validation, 422 on fail
│   │   └── errorHandler.js      ← NEW: centralised error handler
│   │
│   ├── utils/
│   │   ├── AppError.js          ← NEW: operational error class
│   │   ├── logger.js            ← NEW: structured logger (pretty dev / JSON prod)
│   │   ├── validateEnv.js       ← NEW: startup crash if required env vars missing
│   │   ├── redisClient.js       ← NEW: ioredis singleton + in-memory fallback
│   │   ├── cache.js             ← in-memory LRU (24h TTL)
│   │   ├── socket.js            ← Socket.IO competition rooms
│   │   └── questionGenerator.js
│   │
│   ├── config/
│   │   ├── seed.js
│   │   ├── seedLessons.js
│   │   ├── seedSubjects.js      ← NEW: 50+ Science/English/SocSci/Hindi topics
│   │   └── seedMathCurriculum.js ← NEW: 14 CBSE Class 10 Math chapters
│   │
│   ├── __tests__/               ← NEW: Jest ESM test suite
│   │   ├── analysisService.test.js   (7 tests)
│   │   ├── scoringService.test.js    (6 tests)
│   │   ├── plannerService.test.js    (4 tests, mocked)
│   │   └── aiRouter.test.js          (5 tests, mocked)
│   │
│   └── package.json             ← UPDATED: jest config + npm test script
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
        ├── components/
        │   ├── Layout.jsx
        │   ├── BadgeToast.jsx   ← NEW: toast when badge awarded
        │   └── DoubtChat.jsx    ← NEW: multi-turn chat below wrong answers
        │
        └── pages/
            ├── Dashboard.jsx
            ├── Lessons.jsx
            ├── LessonView.jsx
            ├── Practice.jsx
            ├── Analytics.jsx
            ├── Competition.jsx
            ├── LiveRoom.jsx
            ├── Planner.jsx
            ├── ExamReview.jsx
            ├── VoiceTutor.jsx   ← UPDATED: fully functional, subject-aware
            ├── Profile.jsx
            ├── Settings.jsx
            ├── Onboarding.jsx
            ├── StartOnboarding.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── Portal.jsx       ← NEW: invite code + parent/teacher view
            ├── ChapterView.jsx  ← NEW: chapter detail (sections/formulas/theorems/tips/exercises)
            └── admin/
                ├── AdminLayout.jsx      ← NEW: sidebar nav, role guard
                ├── AdminOverview.jsx    ← NEW: stats dashboard
                ├── AdminUsers.jsx       ← NEW: user list + role editor
                ├── AdminQuestions.jsx   ← NEW: question CRUD + flag queue
                ├── AdminTopics.jsx      ← NEW: topic CRUD
                └── AdminCacheStats.jsx  ← NEW: AI cache breakdown
```
