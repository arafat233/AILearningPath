# AILearningPath — Complete Project Blueprint
> Paste this into Claude.ai so it has full context without needing the zip.
> Last updated: April 2026

---

## 1. WHAT THIS IS

An AI-powered CBSE Class 10 exam preparation platform. Students practice questions,
get AI-generated explanations for mistakes, follow a smart study planner, compete
live against each other, and receive personalized lessons — all driven by a
behavioural analysis engine that tracks HOW they think, not just whether they're right.

Stack: React (Vite) + Express + MongoDB + Claude Haiku 4.5 + Socket.IO

---

## 2. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)                    │
│  Port 5173  │  Zustand auth store  │  Axios API service      │
│                                                             │
│  Pages: Dashboard, Lessons, LessonView, Practice,           │
│         Analytics, Competition, LiveRoom, Planner,          │
│         ExamReview, Profile, Settings, VoiceTutor,          │
│         Onboarding, Login, Register, StartOnboarding        │
└────────────────────┬────────────────────────────────────────┘
                     │ REST + WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND (Express + Node)                    │
│  Port 5001  │  JWT auth middleware  │  Rate limiter (300/15m)│
│                                                             │
│  Routes: /api/auth  /api/practice  /api/analysis            │
│          /api/exam  /api/planner   /api/ai                  │
│          /api/user  /api/revision  /api/lessons             │
│          /api/topics  /api/competition  /api/health         │
│                                                             │
│  Socket.IO: competition room events (join/start/score/end)  │
└───────┬───────────────┬────────────────────────────────────-┘
        │               │
┌───────▼──────┐  ┌─────▼──────────────────────────────────┐
│   MongoDB    │  │          Claude Haiku 4.5               │
│  15 collections│  │  Routed through 7-layer cache system    │
│              │  │  (free: 10 calls/day, pro: 100/day)     │
└──────────────┘  └────────────────────────────────────────-┘
```

---

## 3. DATABASE — ALL 15 COLLECTIONS

### 3.1 User
```
_id, name, email, password (bcrypt)
examDate, subject, grade, goal
isPaid (bool), plan (free|pro|premium), planExpiry
aiCallsToday, aiCallsDate  ← daily AI quota tracking
createdAt
```

### 3.2 Topic
```
_id, name, subject, grade
prerequisites [String]
examFrequency (0-1), estimatedHours, examMarks
realWorldUse, whyMatters
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

### 3.5 SeenQuestion  (exposure control — prevents repeat questions)
```
userId, questionId, topic, seenAt
Unique index: { userId, questionId }
```

### 3.6 Streak
```
userId (unique), currentStreak, longestStreak
lastActiveDate (YYYY-MM-DD), updatedAt
```

### 3.7 UserProfile  (the brain of the system)
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

### 3.8 QuestionStats  (crowd-sourced difficulty calibration)
```
questionId (unique)
attempts, correct, avgTime
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
cacheKey (MD5 hash of questionText+mistakeType) — unique
questionSnippet, mistakeType, response (Claude's text)
hitCount, savedCalls
createdAt, lastHitAt, expiresAt (90 days, auto-purge via TTL index)
```

### 3.14 ErrorMemory  (per-user mistake pattern tracking)
```
userId, topic, mistakeType, count, lastSeen
questionSnippets [String]
Unique index: { userId, topic, mistakeType }
```

### 3.15 AIUsageStats  (per-user daily AI metrics)
```
userId, date (YYYY-MM-DD), callsMade, callsSaved, tokensUsed
Unique index: { userId, date }
```

### 3.16 Lesson  (in lessonModel.js)
```
topic, subject, grade, title, tagline
shortLesson: { summary, keyPoints, estimatedMinutes }
longLesson:  { introduction, sections [...], summary, practicePrompt }
prerequisites [String]
```

### 3.17 LessonProgress  (in lessonModel.js)
```
userId, topic, completed (bool), completedAt, timeSpent, notes
```

---

## 4. BACKEND SERVICES — WHAT EACH ONE DOES

### 4.1 aiRouter.js — 7-Layer Cost Minimisation System
```
Layer 1: isCorrect answer        → return null (0 cost)
Layer 2: Has solutionSteps       → return steps + static tip (0 cost)
Layer 3: Simple mistake pattern  → return STATIC_RESPONSES map (0 cost)
Layer 4: DB cache hit            → AIResponseCache lookup (0 cost, shared all users)
Layer 5: In-memory cache hit     → RAM lookup 24h TTL (0 cost, fast)
Layer 6: Daily limit check       → free=10/day, pro=100/day
Layer 7: Call Claude             → save to DB + RAM for all future users

Key: cacheKey = MD5(questionText.lower() + "::" + mistakeType)
     Same question + same mistake by ANY user = same key = Claude called ONCE EVER
```

### 4.2 aiService.js — Claude API Calls
```
SYSTEM_PROMPT: cached CBSE Class 10 Math teacher persona (shared = prompt cache discount)

Functions:
- getAIExplanation(question, mistakeType, correctAnswer) → 320 tokens
- generateAIQuestion(topic, weakness) → JSON MCQ with 4 options + logicTags
- generateLesson(topic, subject, grade) → structured lesson object
- getStudyAdvice(profile, goal) → personalised study tip
```

### 4.3 adaptiveService.js — Smart Question Selection
```
Algorithm:
1. Read UserProfile for accuracy + behaviorStats
2. If accuracy > 0.8 → target difficulty 0.75 (push harder)
   If accuracy < 0.4 → target difficulty 0.25 (go easier)
3. If concept_error > 5 total → try to fetch unseen AI-generated question
   DB-first: find existing AI question user hasn't seen
   Only call Claude if none exists → save permanently
4. Filter out SeenQuestion IDs
5. Find DB question closest to target difficulty
```

### 4.4 analysisService.js — Thinking Behaviour Detector
```
Inputs: question, selectedType, timeTaken, confidence

Overrides:
- Fast + wrong → reclassify as "guessing" regardless of option type

Speed profiles: mastery | guessing | deep_thinker | concept_unclear | normal

Confidence mismatches:
- high confidence + wrong → "dangerous_misconception"
- low confidence + right  → "unstable_knowledge"

Returns: { isCorrect, behavior, speedProfile, confidenceInsight, message }
```

### 4.5 plannerService.js — AI Study Plan Generator
```
Goal-based priority weights:
  pass:        freq=0.65, weak=0.25, accuracy=0.10
  distinction: freq=0.50, weak=0.30, accuracy=0.20
  top:         freq=0.30, weak=0.30, accuracy=0.40
  scholarship: freq=0.20, weak=0.40, accuracy=0.40

Priority score per topic = examFrequency×w.freq + isWeak×w.weak + (1-accuracy)×w.accuracy

Output: dailyPlan array + priorityTopics + skipSuggestions
```

### 4.6 revisionService.js — Spaced Repetition
```
Intervals: [1, 3, 7, 15, 30] days between revision sessions
Tracks revisionStage per topic in UserProfile.topicProgress
Topics become "due" when now >= nextRevision date
Priority = daysSince / expectedInterval
```

### 4.7 scoringService.js — Exam Scoring
```
Per answer:
  timeFactor = min(1.5, max(0.5, expectedTime/timeTaken))
  score += difficultyScore × timeFactor   (correct answers only)

normalizeScores: Z-score normalisation across all exam attempts
→ rank + percentile per student
```

### 4.8 profileService.js — Thinking Profile Classification
```
Classifies user into one of 5 thinking profiles based on behaviorStats:
Guesser | Surface Learner | Overthinker | Pattern Recognizer | Deep Thinker
```

### 4.9 streakService.js — Daily Activity Streaks
```
Updates Streak collection on any practice/exam attempt
Tracks currentStreak, longestStreak, lastActiveDate
```

### 4.10 aiTeacherService.js — Contextual Guidance Engine
```
Reads profile state → returns contextual message + action:
- totalAttempts < 5         → welcome + start_easy
- guessing > 40% of answers → warning + slow_down
- concept_error > 35%       → targeted topic drill
- accuracy > 0.8            → goal-specific push message
- session performance dip   → encouragement
```

### 4.11 selfLearningService.js — Foundation Gap Detector
```
Detects when a student's errors suggest they're missing prerequisite knowledge
Recommends going back to Topic.prerequisites before continuing
```

### 4.12 autoDoubtService.js — Auto Doubt Clarifier
```
Surfaces recurring error patterns from ErrorMemory
Generates targeted clarification prompts for the student's specific recurring mistake
```

### 4.13 foundationService.js — Prerequisite Checker
```
Cross-references Topic.prerequisites with UserProfile.weakAreas
Surfaces gaps before the student hits a harder topic
```

---

## 5. BACKEND ROUTES — ALL ENDPOINTS

```
POST   /api/auth/register           — register + create UserProfile + Streak
POST   /api/auth/login              — login → JWT token

GET    /api/practice/question       — get next adaptive question (topic param)
POST   /api/practice/submit         — submit answer → analysis → AI explanation
GET    /api/practice/streak         — get current streak

GET    /api/analysis/profile        — full UserProfile
GET    /api/analysis/thinking       — thinkingProfile + behaviorStats
GET    /api/analysis/weak-areas     — weakAreas with topic detail
GET    /api/analysis/strong-areas

GET    /api/lessons                 — list all lessons
GET    /api/lessons/:topic          — get lesson (DB-first, AI generates if missing)
POST   /api/lessons/:topic/progress — mark lesson progress/completed

GET    /api/topics                  — all topics from DB
GET    /api/topics/:subject/:grade  — topics filtered by subject + grade

GET    /api/exam/list               — available exams
POST   /api/exam/start              — start exam → get questions
POST   /api/exam/submit             — submit all answers → score + percentile
GET    /api/exam/history            — past ExamAttempts
GET    /api/exam/review/:attemptId  — detailed review with AI explanations

GET    /api/planner/plan            — get current StudyPlan
POST   /api/planner/generate        — generate new plan (examDate + goal)
PATCH  /api/planner/complete-day    — mark a day's plan complete

GET    /api/revision/due            — topics due for revision today
POST   /api/revision/complete       — mark revision done → advance revisionStage

POST   /api/ai/explain              — get AI explanation (routed through 7-layer system)
GET    /api/ai/cache-stats          — cache hit rate + calls saved
POST   /api/ai/study-advice         — get personalised study tip
POST   /api/ai/teacher-message      — contextual AI teacher guidance

GET    /api/user/profile            — user info + subscription
PATCH  /api/user/profile            — update examDate/goal/subject/grade
GET    /api/user/ai-usage           — daily AI call usage

GET    /api/competition/leaderboard — weekly leaderboard
POST   /api/competition/room/create — create live room
GET    /api/competition/room/:id    — get room info
```

### Socket.IO Events (port 5001 alongside REST)
```
Client → Server:
  join_room    { roomId, userId, userName }
  start_room   { roomId, questions }
  submit_score { roomId, userId, score }
  end_game     { roomId }
  disconnect

Server → Client:
  room_update  { players, status, questions }
  game_started { questions }
  score_update { players map }
  game_ended   { players, winner }
```

---

## 6. FRONTEND — ALL PAGES

### 6.1 StartOnboarding
Landing page for unauthenticated users → CTA to register or login

### 6.2 Register / Login
JWT stored in Zustand authStore (persisted to localStorage)

### 6.3 Onboarding
Collects: subject, grade, goal (pass/distinction/top/scholarship), examDate
Saves to User model → generates initial StudyPlan

### 6.4 Dashboard
- Today's revision topics (due from spaced repetition)
- AI Teacher message (contextual guidance)
- Streak display
- Quick-start links to Practice / Planner / Competition

### 6.5 Lessons
- Lists all topics with lesson availability status
- Subject/grade filter (dynamic from DB Topics)
- Shows estimated read time

### 6.6 LessonView
- Short lesson (summary + key points, ~5 min)
- Long lesson (full structured content with sections)
- DB-first: if lesson doesn't exist → Claude generates it once → saved permanently
- Mark as complete + notes field

### 6.7 Practice
- Topic picker (dynamic from DB)
- Adaptive question delivery (adaptiveService selects difficulty)
- Confidence selector before each answer (low/medium/high)
- Timer per question
- Answer reveals: correct option + error type tag + solution steps
- AI explanation button (routed through 7-layer cache)
- AI Teacher message shown after session

### 6.8 Analytics
- Thinking profile card (Guesser/Surface Learner/etc.)
- Accuracy gauge + avgTime
- BehaviorStats bar chart (5 mistake types)
- Confidence accuracy (highConfidenceWrong / lowConfidenceRight)
- Topic progress table (accuracy + last attempted + revision stage)
- Weak vs Strong areas
- AI usage stats (calls today + cache savings)

### 6.9 Planner
- Visual calendar of dailyPlan
- Today's topics highlighted
- Priority topics with reason
- Skip suggestions (effort vs marks tradeoff)
- Regenerate plan button (takes examDate + goal)

### 6.10 ExamReview
- List of past ExamAttempts with score + percentile
- Per-attempt drill-down: each question with correct/wrong + AI explanation
- normalizedScore vs peers

### 6.11 Competition
- Weekly leaderboard table (rank/accuracy/score by week)
- Create or join a live room
- Shows current week stats for logged-in user

### 6.12 LiveRoom
- Real-time multiplayer quiz via Socket.IO
- Scoreboard updates live as players submit
- Host controls: start game, select questions
- Winner announcement at end

### 6.13 VoiceTutor
- Page exists, UI scaffolded
- Intended: voice-based Q&A with AI teacher (NOT yet functional)

### 6.14 Profile
- User info (name, email, subject, grade, goal, examDate)
- Subscription plan badge (free/pro/premium)
- Edit profile inline

### 6.15 Settings
- Update subject/grade/goal/examDate
- AI usage quota display

---

## 7. AUTH + MIDDLEWARE

```
JWT: signed with JWT_SECRET, 7-day expiry
Middleware: auth.js extracts + verifies token → attaches req.user.id
Rate limit: 300 requests per 15 minutes (global)
```

---

## 8. FRONTEND STATE MANAGEMENT

```
authStore (Zustand + persist):
  token, user → { id, name, email, subject, grade, goal, examDate, isPaid, plan }
  login(token, user), logout()

API service (axios):
  baseURL = http://localhost:5001/api
  interceptor: auto-attaches Authorization: Bearer <token>
  interceptor: on 401 → logout()
```

---

## 9. AI COST ARCHITECTURE (THE CLEVER BIT)

The AI system is designed so Claude is called as rarely as possible:

```
Student gets question wrong
         ↓
Layer 1: Was it correct?          → No AI needed
Layer 2: Has solution steps?      → Show steps (free)
Layer 3: Simple mistake pattern?  → Static message (free)
Layer 4: DB cache hit?            → Return stored response (free, shared all users)
Layer 5: RAM cache hit (24h)?     → Return from memory (free, fast)
Layer 6: Under daily quota?       → Check free (10/day) or pro (100/day)
Layer 7: Call Claude              → Cache in DB forever for next user

Result: After the first student triggers a question+mistake combo,
        every future student gets the response for free.
        Cache hit rate grows as more students use the platform.

Claude model: claude-haiku-4-5-20251001
System prompt: shared + cached (90% token discount on Anthropic's end)
Max tokens per explanation: 320
Max tokens per lesson: ~800
Max tokens per AI question: ~400
```

---

## 10. SEED DATA

```
config/seed.js      — seeds Topics + Questions into MongoDB
config/seedLessons.js — seeds initial Lesson content
```

Topics are fully dynamic (read from DB), not hardcoded in frontend.
Questions can be seeded manually or AI-generated on demand.

---

## 11. CURRENT STATE — WHAT WORKS ✅

| Feature | Status |
|---|---|
| Auth (register/login/JWT) | ✅ Complete |
| Onboarding flow | ✅ Complete |
| Dynamic topics + subjects from DB | ✅ Complete |
| Adaptive practice engine | ✅ Complete |
| Thinking behaviour analysis | ✅ Complete |
| Spaced repetition revision | ✅ Complete |
| 7-layer AI cost minimisation | ✅ Complete |
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

---

## 12. WHAT NEEDS TO BE BUILT NEXT 🔨

### Priority 1 — Core Gaps (build these first)

**12.1 Payment / Subscription System**
- User model already has: isPaid, plan (free|pro|premium), planExpiry
- Need: Razorpay or Stripe integration
- Need: /api/payment/create-order, /api/payment/verify-payment routes
- Need: plan upgrade flow in Settings page
- Need: paywall UI when free quota (10 AI calls/day) is hit

**12.2 VoiceTutor (page is scaffolded — needs implementation)**
- Intended flow: student speaks question → speech-to-text → Claude answers → text-to-speech
- Options: Web Speech API (free, browser native) for STT + TTS
- Or: Whisper API for STT + Claude for answer + ElevenLabs/browser TTS
- Backend: POST /api/ai/voice-answer { transcript } → Claude response
- Design: microphone button, live waveform, playback controls

**12.3 Admin Dashboard (separate route, admin-only)**
- Question bank management: add/edit/delete/flag questions
- Topic CRUD
- AI cache stats (hitRate, callsSaved, savedCost in $)
- User overview (total users, active today, plan breakdown)
- Seed trigger buttons (run seed.js from UI)

**12.4 More Subjects**
- Currently hardcoded to: CBSE Class 10 Math
- User model has subject + grade fields — DB is ready
- Need: seed data for Science, English, Social Science, Hindi
- Need: subject-specific system prompts in aiService.js
- Need: subject picker to be fully wired on Dashboard

### Priority 2 — Engagement & Retention

**12.5 Achievement / Badge System**
- New collection: Achievement { userId, type, unlockedAt, metadata }
- Badge types: "7-day streak", "First perfect exam", "Concept master",
               "100 questions", "Top 10 this week", etc.
- Show on Profile page + toast notification on unlock

**12.6 Push Notifications (PWA)**
- Add manifest.json + service worker → install as PWA
- Notification triggers: revision due today, streak at risk, competition starting
- Backend: schedule daily cron to check nextRevision dates + send push

**12.7 Parent / Teacher Portal**
- New role: "parent" or "teacher" in User model
- Can view linked students' analytics read-only
- Weekly progress email digest
- Invite student by email → link accounts

**12.8 Offline Mode**
- Service worker caches: lessons, study plan, today's questions
- Practice works offline, syncs attempts when back online
- IndexedDB for local attempt queue

### Priority 3 — AI Enhancements

**12.9 Multi-turn Doubt Chat**
- Currently: one-shot AI explanation per mistake
- Proposed: chat thread per question — student can ask follow-ups
- New collection: DoubtThread { userId, questionId, messages: [{role, content}] }
- Backend: POST /api/ai/doubt/message { threadId, message }
- Frontend: expandable chat panel below each question

**12.10 Personalised Daily Brief**
- Morning summary generated by Claude for each student:
  "Today you should focus on X (due for revision), your weak area is Y, exam in Z days"
- Triggered: on first Dashboard load of the day
- Cached per-user per-day in AIResponseCache

**12.11 Exam Prediction**
- Based on: topicProgress accuracy + examFrequency + daysLeft
- Predict expected score range on actual board exam
- Show confidence interval: "You're likely to score 68-74 / 100"
- Update daily as student practices

### Priority 4 — Quality & Scale

**12.12 Question Flagging + Review Queue**
- Students can flag bad/incorrect questions (isFlagged already in schema)
- Admin sees flagged queue, reviews, edits or deletes
- QuestionStats.isBadQuestion auto-set when error rate > 80% + attempts > 20

**12.13 API Rate Limit Per User (not just global)**
- Current: 300 req/15min global rate limit
- Add: per-user rate limit using userId from JWT
- Prevent one user from hammering the AI endpoints

**12.14 Refresh Token System**
- Current: 7-day JWT, no refresh
- Add: refreshToken stored in httpOnly cookie
- Auto-refresh before expiry → seamless session

**12.15 Test Suite**
- Currently: no tests
- Priority areas:
  - adaptiveService question selection logic
  - analysisService behaviour classification
  - scoringService raw + normalised scores
  - aiRouter 7-layer cache hit/miss logic
  - plannerService priority scoring

---

## 13. ENV VARIABLES NEEDED

```
MONGO_URI=
JWT_SECRET=
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-haiku-4-5-20251001
PORT=5001
```

---

## 14. HOW TO RUN LOCALLY

```bash
# Backend
cd ai-learning-backend/backend
npm install
node server.js          # runs on port 5001

# Frontend
cd ai-learning-frontend/frontend
npm install
npm run dev             # runs on port 5173

# Seed DB (run once)
cd ai-learning-backend/backend
node config/seed.js
node config/seedLessons.js
```

---

## 15. FILE STRUCTURE SUMMARY

```
AILearningPath/
├── ai-learning-backend/backend/
│   ├── server.js                  ← Express + Socket.IO setup
│   ├── models/
│   │   ├── index.js               ← all 15 Mongoose schemas
│   │   └── lessonModel.js         ← Lesson + LessonProgress schemas
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── analysisController.js
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── lessonController.js
│   │   ├── plannerController.js
│   │   └── practiceController.js
│   ├── services/
│   │   ├── aiService.js           ← Claude API calls (explain/question/lesson)
│   │   ├── aiRouter.js            ← 7-layer cache system
│   │   ├── aiTeacherService.js    ← contextual guidance
│   │   ├── adaptiveService.js     ← question selection
│   │   ├── analysisService.js     ← behaviour detection
│   │   ├── plannerService.js      ← study plan generator
│   │   ├── revisionService.js     ← spaced repetition
│   │   ├── scoringService.js      ← exam scoring + Z-score
│   │   ├── profileService.js      ← thinking profile
│   │   ├── streakService.js       ← daily streaks
│   │   ├── selfLearningService.js ← foundation gaps
│   │   ├── autoDoubtService.js    ← recurring mistake clarifier
│   │   └── foundationService.js   ← prerequisite checker
│   ├── routes/                    ← 11 route files
│   ├── middleware/auth.js          ← JWT verification
│   ├── utils/
│   │   ├── socket.js              ← Socket.IO competition rooms
│   │   ├── cache.js               ← in-memory LRU cache
│   │   └── questionGenerator.js
│   └── config/
│       ├── seed.js
│       └── seedLessons.js
│
└── ai-learning-frontend/frontend/src/
    ├── App.jsx                    ← routing (16 pages)
    ├── main.jsx
    ├── index.css
    ├── store/authStore.js         ← Zustand auth
    ├── services/api.js            ← axios instance
    ├── components/Layout.jsx      ← sidebar + nav shell
    └── pages/                     ← 16 page components
        ├── Dashboard.jsx
        ├── Lessons.jsx
        ├── LessonView.jsx
        ├── Practice.jsx
        ├── Analytics.jsx
        ├── Competition.jsx
        ├── LiveRoom.jsx
        ├── Planner.jsx
        ├── ExamReview.jsx
        ├── VoiceTutor.jsx         ← scaffolded, NOT functional yet
        ├── Profile.jsx
        ├── Settings.jsx
        ├── Onboarding.jsx
        ├── StartOnboarding.jsx
        ├── Login.jsx
        └── Register.jsx
```
