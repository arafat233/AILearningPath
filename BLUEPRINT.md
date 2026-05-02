# AILearningPath — Complete Project Blueprint
> Paste this into Claude.ai so it has full context without needing the zip.
> Last updated: May 2026 — 880 questions + 14 mock papers + placement quiz + board-style questions seeded. Adaptive recommender engine ported from Python (mastery/fluke/routing). New: placement quiz API, /api/v1/recommender endpoints, UserTopicMastery model, topic DAG (43 nodes, levels 0-7), answer-key enrichment (152 questions).

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
│          /api/v1/placement-quiz  /api/v1/recommender        │
│          /api/v1/curriculum  /api/v1/ncert  /api/v1/pyq     │
│          /api/health                                         │
│                                                              │
│  Socket.IO: competition room events (join/start/score/end)  │
└───────┬───────────────┬────────────────────────────────────-┘
        │               │
┌───────▼──────┐  ┌─────▼──────────────────────────────────┐
│   MongoDB    │  │          Claude Haiku 4.5               │
│  23 collections│  │  Routed through 7-layer cache system    │
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
trialUsed (bool), trialStart (Date)
aiCallsToday, aiCallsDate          ← daily AI quota tracking
role: student|admin|parent|teacher ← role-based access
linkedStudents: [String]           ← parent/teacher portal
inviteCode: String (sparse unique) ← 8-char student invite code
npsLastShownAt: Date               ← NPS survey throttle (30-day cooldown)
placementCompletedAt: Date         ← set once after placement quiz scored (gates re-take)
referredBy: ObjectId (ref: User)   ← referral system: who referred this user
referralCount: Number (default 0)  ← how many users this user has referred
referralRewarded: Boolean (false)  ← prevents double-reward for referrer
studyReminders: [{                 ← parent-set push reminders
  studentId: ObjectId, time: String (HH:MM), days: [Number]
}]
passwordResetToken:   String (SHA-256 hashed, null when not active)
passwordResetExpires: Date   (1h from request, null when not active)
createdAt
```

### 3.23 UserTopicMastery  ← NEW (adaptive recommender state)
```
userId, topicId (e.g. "ch1_s1_c1_t1")
chapterNumber: Number
currentDifficulty: easy | medium | hard
mastery: { easy: Boolean, medium: Boolean, hard: Boolean }
secondsOnTopic: Number (total time spent)
attempts: [{
  questionId, correct, timeTakenSec, difficulty,
  hintsUsed, flukeDetected, misconceptionId, createdAt
}]
updatedAt
Unique index: { userId, topicId }

Mastery rules (from recommender_config.json):
  easy:   4 of last 5 correct
  medium: 5 of last 7 correct AND no misconception in last 3
  hard:   3 of last 5 correct AND ≥8 min on topic AND no fluke in last 3
Fluke: answered correctly but time < guess_below OR correct after 3 consecutive wrongs
```

### 3.22 Coupon  ← NEW
```
code:          String (required, unique, uppercase, trimmed)
discountType:  "percent" | "fixed"
discountValue: Number (min 1)
planFilter:    [String]   ← restrict to specific plan keys; empty = all plans
validUntil:    Date | null
maxUses:       Number (0 = unlimited)
usedCount:     Number (default 0)
isActive:      Boolean (default true)
createdAt:     Date
```

### 3.2 Topic
```
_id, name, subject, grade
prerequisites [String]
examFrequency (0-1), estimatedHours, examMarks
realWorldUse, whyMatters
topicId: String (sparse, e.g. "ch1_s1_c1_t1") ← fine-grained DAG key
level:   Number (0-7) ← DAG depth (0 = no prerequisites)

Subjects seeded: Math, Science, English, Social Science, Hindi (50+ broad topics)
Fine-grained Math topics seeded: 43 nodes (seedTopicDAG.js)
  Level 0: Euclid's Lemma, Prime Factorisation, Polynomial basics, AP basics, Similar triangles, Stats/Probability
  Level 7: Two-triangle elevation, Volume of composites
```

### 3.3 Question
```
_id, topic, subtopic, questionText
questionType: mcq | case_based | assertion_reason | pyq | free_text | numeric | numeric_range | fill_blank
difficulty: easy | medium | hard
difficultyScore (0-1), expectedTime (seconds)
conceptTested, prerequisites [String]
isAIGenerated (bool), isFlagged, isPYQ, pyqYear
options: [{ text, type, logicTag }]
  ↳ option types: correct | concept_error | calculation_error |
                  partial_logic | guessing | misinterpretation
solutionSteps [String], shortcut, caseContext
marks, negativeMarks, createdAt

── Adaptive algorithm fields (seeded from JSON question banks) ──
questionId:    String (unique sparse) ← dedup key matching JSON bank ID
topicId:       String ← fine-grained topic e.g. "ch1_s1_c1_t1"
chapterNumber: Number 1-14
bloomLevel:    String (recall|understand|apply|analyse|evaluate|create)
correctAnswer: String ← for numeric/free_text/fill_blank
mixingType:    String (single_topic|within_chapter|cross_chapter)
approachTags:  [String]
hintLevels:    [String] ← 3 progressive hints
timeThresholds: { guessBelow, expectedMin, expectedMax, stuckAbove }
stepByStep:    [{ stepNumber, clean, voice }] ← enriched solutions
routing:       { ifCorrect, ifWrong, ifStuck, ifFlukeDetected } ← routing tokens
flukeCheckQuestionId: String ← paired fluke-check question
placementRole: "primary" | "secondary" ← placement quiz only

Seeded content:
  880 questions  — 43 topic banks (seedQuestionsAndMockPapers.js)
   40 questions  — CBSE board-style 2024/2025 (seedBoardStyleQuestions.js)
   20 questions  — Placement quiz diagnostic (seedPlacementQuiz.js)
  152 questions  — answer-key solution steps enriched (seedMockPaperAnswerKeys.js)
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
title, topic, subject, totalQuestions, duration (minutes)
negativeMarking (bool), negativeValue
questionDistribution: { easy, medium, hard }
isActive, createdAt
isMockPaper:     Boolean ← chapter-level mock with pre-defined question order
isPlacementQuiz: Boolean ← diagnostic placement quiz (one in DB)
chapterNumber:   Number  ← 1-14 for mock papers
questionIds:     [ObjectId] ← ordered question set for mock/placement exams

Seeded: 14 chapter mock papers (Ch1-Ch14) + 1 placement quiz Exam doc
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

### 4.3 adaptiveService.js — Smart Question Selection (broad topic)
```
1. Read UserProfile: accuracy → target difficulty (0.25/0.5/0.75)
2. If concept_error > 5 → try DB-first AI question
   Only call Claude if no unseen AI question exists for this topic
3. Filter seen questions (SeenQuestion collection)
4. Find DB question closest to target difficulty
```

### 4.3b adaptiveRecommenderService.js — Fine-Grained Mastery Engine  ← NEW
```
Port of Python recommender_engine.py using topicId-level state (UserTopicMastery).

checkMastery(attemptsAtDiff, difficulty, secondsOnTopic)
  → pure function, applies MASTERY_CFG thresholds

detectFluke(question, correct, timeSec, priorAttemptsAtDiff)
  → time < guessBelow OR correct after 3 consecutive wrongs

recordAttempt(userId, topicId, questionId, correct, timeSec, selectedOptionIndex, hintsUsed)
  → detects fluke + misconception, updates UserTopicMastery, advances currentDifficulty

nextQuestion(userId, topicId)
  → Priority: fluke detected → stuck → correct → wrong → fallback
  → Resolves routing tokens: next_difficulty_up | topic_mastery_check |
    next_hard_different_subtype | q_<id> | <topicId:teaching_ref>
  → Returns: { action: serve_question|serve_teaching|topic_mastered|no_questions }

nextTopic(userId)
  → 1. Continue in-progress (any mastery true, not all true) — lowest level first
  → 2. Recommend eligible (all prerequisites mastered, not started) — lowest level first
  → 3. Fallback to level-0 foundational topic
  → 4. all_complete

applyPlacementResults(userId, placementByTopic)
  → placementByTopic: { topicId → label }
  → 4 labels: mastered_through_medium (easy+medium→hard) |
               mastered_easy (easy→medium) | partial_familiarity | novice
  → Bulk-initialises UserTopicMastery from placement quiz results
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

### 4.14 couponService.js  ← NEW
```
validateCoupon(code, planKey) → checks isActive, validUntil, maxUses, planFilter → Coupon doc
computeDiscount(coupon, basePrice) → { discountAmount, finalPrice, discountLabel }
redeemCoupon(couponId) → atomic $inc on usedCount (race-condition safe)
```

### 4.15 paymentService.js  ← NEW
```
createOrder(userId, planKey, couponCode=null)
  - validates coupon via validateCoupon
  - applies discount; stores order_coupon:<orderId> in Redis
  - creates Razorpay order with (discounted) amount
  - stores order_plan:<orderId> in Redis (TTL 1h)

verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
  - verifies HMAC signature
  - reads plan + coupon from Redis; calls redeemCoupon if coupon present
  - upgrades User: isPaid=true, plan, planExpiry
  - referral reward: if referredBy && !referralRewarded → 30 days to referrer + mark referralRewarded

Plans: pro (₹199/mo, 100 AI/day), premium (₹499/mo, 500 AI/day),
       pro_annual (₹1499/yr), premium_annual (₹3999/yr)
Env required: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
```

### 4.16 onboardingEmailService.js / weeklyParentEmailService.js / pushService.js  ← NEW
```
onboardingEmailService: drip sequence (day 0/3/7) via nodemailer
weeklyParentEmailService: Monday 8am digest email to parents (portal users)
pushService:
  sendRevisionReminders() — daily: push to users with topics due today
  sendStudyReminders()    — every minute: fires push at parent-set HH:MM
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
                                      options returned WITHOUT type field (correct answer hidden)
POST   /api/practice/submit         → body: { selectedOptionIndex, timeTaken, confidence }
                                      server derives selectedType from session question options
                                      response includes: newBadges[], correctOptionIndex, selectedOptionIndex
                                      solutionSteps only included when answer is wrong

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
POST   /api/exam/start              → returns startedAt (epoch ms) + durationSeconds for
                                      server-side timer sync; option `type` field stripped
POST   /api/exam/submit             → server validates elapsed time (30s grace); auto-fills
                                      blank for unanswered if time expired
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
POST   /api/ai/voice-answer         ← VoiceTutor; persists history in Redis (7d TTL, 50-msg cap)
GET    /api/ai/voice-history        ← load persisted voice conversation
DELETE /api/ai/voice-history        ← clear voice history

GET    /api/user/me
PUT    /api/user/me            → rate-limited (20 updates/hour per user)
DELETE /api/user/me            ← GDPR/PDPB: deletes User + all personal data
GET    /api/user/bookmarks
POST   /api/user/bookmarks/:questionId ← toggle bookmark

GET    /api/competition/leaderboard
POST   /api/competition/room-questions

POST   /api/practice/mixed          ← mixed-topic practice session
POST   /api/practice/flag           ← student flags a question for review
```

### New routes
```
GET    /api/badges                  ← all badges for logged-in user

GET    /api/doubt/:questionId       ← get/create doubt thread
POST   /api/doubt/:questionId/message ← send message (counts AI quota)
DELETE /api/doubt/:questionId       ← clear thread

GET    /api/portal/search           ← search students by name/email
POST   /api/portal/link-direct      ← link student by userId
DELETE /api/portal/students/:id     ← unlink student
GET    /api/portal/students         ← list linked students + basic stats
GET    /api/portal/students/:id/analytics ← read-only student view
GET    /api/portal/students/:id/dashboard ← student dashboard snapshot
GET    /api/portal/requests         ← pending link requests
POST   /api/portal/requests/:id/respond  ← accept/reject link request
GET    /api/portal/class-stats      ← aggregate stats across all linked students
GET    /api/portal/students/:id/attempts ← paginated attempt history for a student
GET    /api/portal/reminders        ← get parent-set study reminders
POST   /api/portal/reminders        ← set study reminder (time + days for a student)
DELETE /api/portal/reminders/:studentId  ← remove reminder

GET    /api/admin/stats             ← requires admin role
GET    /api/admin/analytics         ← DAU/MAU/revenue/conversion/retention + 30-day trends
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
GET    /api/admin/coupons           ← admin coupon CRUD
POST   /api/admin/coupons
PUT    /api/admin/coupons/:id
DELETE /api/admin/coupons/:id

GET    /api/v1/curriculum/subjects     ← distinct subject+grade combos in DB
GET    /api/v1/curriculum              ← all chapters (?subject=&grade=&board=)
GET    /api/v1/curriculum/:chapterNumber ← full chapter detail + sections + formulas

GET    /api/v1/ncert/chapters          ← NCERT chapter list (?subject=&grade=)
GET    /api/v1/ncert/chapters/:id      ← single NCERT chapter detail
GET    /api/v1/ncert/topics/:id        ← single NCERT topic content

GET    /api/v1/pyq/topics              ← distinct topics that have PYQs
GET    /api/v1/pyq/years               ← distinct years available
GET    /api/v1/pyq                     ← paginated PYQs (?topic=&year=&subject=&grade=)
GET    /api/v1/pyq/:id                 ← single PYQ

GET    /api/v1/payment/plans           ← all plan definitions with pricing
GET    /api/v1/payment/subscription    ← current user's subscription status
POST   /api/v1/payment/create-order    ← create Razorpay order (body: planKey, couponCode?)
POST   /api/v1/payment/verify          ← verify Razorpay payment signature + activate plan
POST   /api/v1/payment/validate-coupon ← preview discount without creating order

POST   /api/webhooks/razorpay          ← Razorpay webhook (raw body, no CSRF, no auth)

GET    /api/push/vapid-public-key      ← returns VAPID_PUBLIC_KEY for SW subscription
POST   /api/push/subscribe             ← save Web Push subscription object
DELETE /api/push/subscribe             ← unsubscribe

GET    /api/flags                      ← user-aware feature flag map; decodes cookie token if present

POST   /api/feedback                ← submit NPS score (0-10) + optional comment; sets npsLastShownAt
GET    /api/feedback/nps-eligible   ← returns { eligible: bool } — true if 20+ attempts AND 7-day account age AND 30-day cooldown
GET    /api/feedback                ← admin only: NPS score (% promoters minus % detractors), avg, raw items

PATCH  /api/planner/reorder         ← save drag-reordered topic order
GET    /api/exam/leaderboard/:examId ← top scores for a specific exam

GET    /api/v1/placement-quiz             ← 20 diagnostic questions (ordered)
GET    /api/v1/placement-quiz/status      ← { taken: bool, takenAt }
POST   /api/v1/placement-quiz/score       ← score answers; returns placementByTopic
                                             + summary (chaptersAced/started/novice)
                                             + sets UserTopicMastery via applyPlacementResults
                                             + sets User.placementCompletedAt (one-shot)

GET    /api/v1/recommender/next-topic              ← DAG-gated topic recommendation
GET    /api/v1/recommender/next-question/:topicId  ← routing-based next question
GET    /api/v1/recommender/mastery/:topicId        ← mastery state for a topic
POST   /api/v1/recommender/record-attempt          ← body: { topicId, questionId,
                                                     correct, timeSec, selectedOptionIndex?, hintsUsed? }
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
/placement-quiz → PlacementQuiz — one-time 20-question diagnostic; intro screen → timed quiz
                                  (global countdown, per-question timer); MCQ + text answer;
                                  skip + next controls; results screen (score ring, chapter
                                  breakdown: aced/practise/novice, recommended first topic);
                                  sets UserTopicMastery via 4-label system; Dashboard shows
                                  nudge banner until placementCompletedAt is set; once-only guard
/practice      → Practice       — Subject tabs + Science sub-tabs; adaptive quiz per subject
                                  confidence, AI explain, DoubtChat; End Session button after
                                  first answer; session summary screen (score, accuracy bar,
                                  missed-question review with correct option + AI explanation)
/analytics     → Analytics      — thinking profile, behavior stats, topic progress, prediction
/competition   → Competition    — weekly leaderboard, create/join room
/live          → LiveRoom       — real-time Socket.IO quiz
/planner       → Planner        — calendar, priority topics, skip suggestions
                                  Revision Due section (spaced-repetition topics from revisionService)
/exam-review   → ExamReview     — past exams, per-question AI review
/voice-tutor   → VoiceTutor     — mic + text chat, subject-aware, TTS playback ← NOW FUNCTIONAL
/profile       → Profile        — user info, badges grid, invite code generator
/settings      → Settings       — update subject/grade/goal/examDate; all 5 CBSE subjects
                                  weak topics tag-editor (type+Enter → red pill tags → synced
                                  to UserProfile.weakAreas via PUT /user/me);
                                  subscription card; Delete Account (GDPR — double-confirm)
/portal        → Portal         — student: generate invite code
                                  parent/teacher: link students, view analytics
                                  Subject Mastery bars always shown (4 CBSE subjects pre-seeded at 0%)
/pricing       → Pricing        — plan cards (Free/Pro/Premium/Annual), Razorpay checkout
/tos           → TermsOfService — static legal page
/privacy       → PrivacyPolicy  — static legal page
```

### Admin Pages (inside AdminLayout, admin role required)
```
/admin              → AdminOverview   — user counts, plan breakdown, AI cache stats
/admin/questions    → AdminQuestions  — CRUD + flag/unflag, filter by topic/subject
/admin/topics       → AdminTopics     — CRUD for all topics
/admin/users        → AdminUsers      — paginated user list, role management
/admin/cache        → AdminCacheStats — cache hit rates, Claude calls saved, cost estimate
/admin/analytics    → AdminAnalytics  — DAU, MAU, paid conversion %, 7-day retention,
                                        total revenue, 30-day bar charts (registrations,
                                        attempts, daily revenue)
/admin/coupons      → AdminCoupons    — coupon CRUD (code, type, value, planFilter, maxUses, expiry)
```

### Key page updates
```
Dashboard.jsx   — NPSSurveyBanner (0-10 score, 30-day cooldown, 20+ attempts + 7-day account age)
                  LinkRequestsCard (pending parent/teacher link requests)
Settings.jsx    — CouponInput (validate + apply coupon before checkout)
                  ReferralCard (shareable /register?ref=<inviteCode>, shows referralCount)
                  Subscription card with upgrade CTA for free users
VoiceTutor.jsx  — Loads + displays persisted voice history on mount; clear history button
Practice.jsx    — FeedbackWidget shown after session (rate question quality)
```

### Components
```
Layout.jsx           — sidebar nav + outlet; fixed drawer on mobile (hamburger opens,
                        backdrop closes, auto-closes on route change); static on sm+
BadgeToast.jsx       — floating toast when newBadges[] returned from practice submit
DoubtChat.jsx        — expandable multi-turn chat below wrong answers in Practice
FeedbackWidget.jsx   — inline 1-5 star + comment widget (used after practice sessions)
OfflineBanner.jsx    — shows when navigator.onLine is false
SearchOverlay.jsx    — ⌘K global search
Skeleton.jsx         — shimmer skeleton components: DashboardSkeleton, AnalyticsSkeleton,
                        LessonsSkeleton, ProfileSkeleton, SkeletonCard, SkeletonStat
```

### Frontend test suite (Vitest 2.x + jsdom@24)
```
Location: src/__tests__/
Runner:   vitest (npm test in frontend dir)
Coverage: @vitest/coverage-v8

src/__tests__/setup.js                    — @testing-library/jest-dom import
src/__tests__/authStore.test.js           — 4 tests: initial state, setAuth, logout, re-auth
src/__tests__/api.interceptors.test.js    — 7 tests: CSRF cookie, method filter, 401 logout
src/__tests__/NPSSurveyBanner.test.jsx    — 5 tests: eligibility, score select, submit, dismiss
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
utils/email.js           — nodemailer wrapper; logs to console when SMTP not set
utils/logger.js          — structured logger (pretty dev / JSON prod)
utils/swagger.js         — OpenAPI 3.0 spec + setupSwagger(app); served at /api-docs
utils/cookieNames.js     — __Host-token / __Secure-refreshToken / __Host-csrf in prod
                           COOKIE_DOMAIN env var supported on refresh cookie
utils/validateEnv.js     — crashes on startup if required env vars missing
utils/redisClient.js     — ioredis singleton with in-memory fallback for dev
utils/sentry.js          — Sentry init wrapper; no-op when SENTRY_DSN not set; exports Sentry for captureException
utils/featureFlags.js    — flag registry with env-var overrides + rollout %; getFlagsForUser(user) for /api/flags endpoint
  Rollout flags: new_ai_model (0%), new_practice_ui (0%)
  Boolean flags: nps_survey, coupon_codes, voice_tutor, competition_rooms, parent_portal,
                 weekly_digest_email, push_notifications (all default true)
scripts/backup.js        — mongodump → gzip archive → optional S3 upload; prunes old local backups; npm run backup
scripts/restore.js       — mongorestore from local file or S3 path; 5s abort window; npm run restore
.github/workflows/backup.yml — nightly cron 02:00 UTC; only runs if vars.BACKUP_ENABLED == 'true'

Frontend (main.jsx): Sentry browser SDK init with VITE_SENTRY_DSN + browserTracingIntegration
Frontend hooks/useFeatureFlags.js: fetches /api/flags once per page load; isEnabled(name)

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
  Jobs:
    backend-test   — Jest unit tests + integration tests against real MongoDB service
    frontend-build — Vitest + Vite build
    e2e            — Playwright (Chromium) against vite preview + test backend
    deploy         — SSH deploy to production (main branch only)

Backup (.github/workflows/backup.yml):
  Trigger: nightly cron 0 2 * * * (02:00 UTC) + workflow_dispatch
  Guard: only runs when vars.BACKUP_ENABLED == 'true'
  Installs mongodb-database-tools, runs node scripts/backup.js
  Annotates the workflow run on failure
  S3 upload optional: set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + BACKUP_S3_BUCKET
```

---

## 9. FRONTEND STATE + API

```
authStore (Zustand + persist):
  token, user → { id, name, email, subject, grade, goal,
                  examDate, isPaid, plan, role }  ← role added
  login(token, user), logout()

api.js (axios, baseURL: http://localhost:5001/api):
  CSRF: reads csrf= cookie, sends x-csrf-token header on POST/PUT/PATCH/DELETE
  On 401 (except /user/me) → logout()

Complete api.js exports:
  Auth:     register, login, logoutApi, forgotPassword, resetPassword
  User:     getMe, updateMe, deleteMe, toggleBookmark, getBookmarks
  Topics:   getTopics, getTopicsMeta, searchTopics
  Lessons:  listLessons, getLesson, saveProgress
  Practice: startTopic, submitAnswer, startMixedPractice, flagQuestion
  Analysis: getReport, getErrorMemory, getWeeklyLeaderboard, getPrediction
  Revision: getRevisionDue, markRevised, getLastDayRevision
  Exams:    listExams, startExam, submitExam, getLeaderboard(examId)
  Planner:  getPlan, markDayComplete, saveTopicOrder
  AI:       getAIAdvice, getAIUsage, getAICacheStats, askTutor,
            evaluateExplanation, getHint, voiceAnswer,
            getVoiceHistory, clearVoiceHistory
  Badges:   getBadges
  Feedback: submitFeedback, getNpsEligibility
  Doubt:    getDoubtThread, sendDoubtMessage, clearDoubtThread
  Portal:   searchStudents, linkStudentDirect, removeLinkedStudent,
            getLinkedStudents, getStudentAnalytics, getStudentDashboard,
            getLinkRequests, respondToLinkRequest, getClassStats,
            getStudentAttempts, getStudyReminders, setStudyReminder, deleteStudyReminder
  Competition: getRoomQuestions
  Curriculum: getCurriculumSubjects, listCurriculumChapters, getCurriculumChapter
  NCERT:    listNcertChapters, getNcertChapter, getNcertTopicContent
  PYQ:      getPYQTopics, getPYQYears, getPYQs, getPYQById
  Payment:  getPlans, getSubscription, createOrder(planKey, couponCode?),
            verifyPayment, validateCoupon
  Push:     getVapidKey, subscribePush, unsubscribePush
  Flags:    getFlags
  Admin:    adminGetStats, adminGetAnalytics, adminGetUsers, adminUpdateRole,
            adminGetQuestions, adminGetFlagged, adminCreateQuestion,
            adminUpdateQuestion, adminDeleteQuestion, adminUnflagQuestion,
            adminGetTopics, adminCreateTopic, adminUpdateTopic, adminDeleteTopic,
            adminGetCoupons, adminCreateCoupon, adminUpdateCoupon, adminDeleteCoupon
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
npm run seed:ncert-content              ← NCERT chapter content (self-contained, no external files)
npm run seed:pyq                        ← 30+ real CBSE board exam PYQ MCQs (2020-2024)
npm run migrate                         ← run pending DB migrations (migrate-mongo)
```

---

## 12. TEST SUITE

### Backend (Jest ESM)
```
Location: backend/__tests__/
Runner:   node --experimental-vm-modules ./node_modules/jest-cli/bin/jest.js
Command:  npm test              (unit tests, ignores integration/)
          npm run test:integration  (integration tests against real DB)

Unit tests (22+): analysisService, scoringService, plannerService, aiRouter,
  auth.middleware, adminAuth.middleware, validate.middleware, practice.controller,
  exam.controller, payment.service, portal.controller, ai.service, adaptive.service,
  revision.service, streak.service, autoDoubt.service, aiTeacher.service

Integration tests (backend/__tests__/integration/):
  _setup.js — connects to MONGO_URI if set (CI real DB), else MongoMemoryServer
  auth.integration.test.js   — register, login lockout, password update, soft-delete
  aiQuota.integration.test.js — daily quota tracking, plan limits
```

### E2E Tests (Playwright)
```
Location: ai-learning-frontend/frontend/e2e/
Config:   playwright.config.js  (Chromium, baseURL from PLAYWRIGHT_BASE_URL)
Command:  npm run test:e2e  (in frontend dir)

e2e/auth.spec.js     — landing page CTA, register, login, wrong password, forgot link,
                        pricing page, terms page, privacy page
e2e/practice.spec.js — authenticated: practice page, dashboard stats, analytics,
                        settings, sidebar nav links, sign-out
```

### Frontend (Vitest 2.x + jsdom@24)
```
Location: src/__tests__/
Runner:   vitest  (npm test in ai-learning-frontend/frontend/)
Coverage: @vitest/coverage-v8
Node version requirement: ≥20.11.1 (pinned vitest@2 for Node 20.11.1 compatibility)

src/__tests__/setup.js                    — @testing-library/jest-dom import
src/__tests__/authStore.test.js           — 4 tests
  ✅ initial state is null
  ✅ setAuth stores user (ignores token)
  ✅ logout clears state
  ✅ re-auth replaces previous user
src/__tests__/api.interceptors.test.js    — 7 tests
  ✅ CSRF token extracted from cookie
  ✅ POST/PUT/DELETE get x-csrf-token header
  ✅ GET/HEAD/OPTIONS do not get header
  ✅ 401 triggers logout
  ✅ 401 on /user/me does NOT trigger logout
  ✅ non-401 error does not trigger logout
  ✅ successful response passes through
src/__tests__/NPSSurveyBanner.test.jsx    — 5 tests
  ✅ renders nothing when not eligible
  ✅ shows survey when eligible
  ✅ submit disabled until score selected
  ✅ shows thanks after successful submission
  ✅ dismiss hides banner
Total: 16 frontend tests
```

### Load Tests (k6)
```
Location: load-tests/practice-session.js
Runner:   k6 run load-tests/practice-session.js
  (requires k6 installed: https://k6.io/docs/get-started/installation/)

Flow: login → GET /topics → POST /practice/start → 5× POST /practice/submit
Stages: 15s→20VU ramp, 30s→100VU ramp, 60s sustain, 15s ramp-down
Custom metrics: loginDuration, startDuration, submitDuration (Trend), sessionErrors (Counter)
Thresholds: http_req_failed < 2%, p(95) < 2000ms
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
| Payment / Subscription system (Razorpay — Pro ₹199/mo, Premium ₹499/mo, annual plans) | ✅ Complete |
| Pricing page (/pricing) with plan cards and Razorpay checkout | ✅ Complete |
| Settings page subscription status card with Upgrade CTA | ✅ Complete |
| 7-day free trial + annual plan options | ✅ Complete |
| Terms of Service + Privacy Policy pages | ✅ Complete |
| Dark mode support | ✅ Complete |
| Refresh token family tracking (stolen-token detection) | ✅ Complete |
| Exam timer server-side sync + weak topics UI in exams | ✅ Complete |
| Voice history persistence (Redis 7-day TTL, 50-msg cap) | ✅ Complete |
| Push notifications (VAPID, Web Push API, revision + study reminders) | ✅ Complete |
| NPS in-app survey (0-10, 30-day cooldown, 5+ attempts gate) | ✅ Complete |
| Error monitoring (Sentry — backend + frontend, no-op when DSN not set) | ✅ Complete |
| Database backup (mongodump + gzip, nightly GitHub Actions cron, optional S3) | ✅ Complete |
| Coupon system (percent/fixed discount, planFilter, maxUses, atomic redemption) | ✅ Complete |
| Referral system (inviteCode, referredBy, 30-day reward, double-reward guard) | ✅ Complete |
| Frontend test suite (Vitest 2.x, 16 tests — authStore, API interceptors, NPS) | ✅ Complete |
| k6 load tests (100VU practice-session flow, p95 thresholds) | ✅ Complete |
| Feature flags (env-var overrides, % rollout, /api/flags, useFeatureFlags hook) | ✅ Complete |
| NCERT chapter + topic content routes | ✅ Complete |
| PYQ (Past Year Questions) browse + filter routes | ✅ Complete |
| Admin analytics dashboard (DAU/MAU/revenue/30-day charts) | ✅ Complete |
| Admin coupon CRUD | ✅ Complete |
| Question bookmarks (toggle + list) | ✅ Complete |

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
**Push Notifications** ✅ DONE — VAPID keys wired, /api/push/subscribe active,
  revision + study reminders fire via pushService.js

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
# Required (server exits on startup if missing)
MONGO_URI=
JWT_SECRET=
ANTHROPIC_API_KEY=

# Optional — defaults shown
CLAUDE_MODEL=claude-haiku-4-5-20251001
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Razorpay payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Push notifications (Web Push)
VAPID_PUBLIC_KEY=    # npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=
VAPID_EMAIL=

# Error monitoring
SENTRY_DSN=                    # backend
VITE_SENTRY_DSN=               # frontend (in frontend .env)

# Email (nodemailer — console-logs in dev if not set)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Redis (falls back to in-memory Map in dev if not set)
REDIS_URL=

# Database backup
BACKUP_DIR=./backups
BACKUP_RETAIN_DAYS=7
AWS_ACCESS_KEY_ID=             # optional S3 upload
AWS_SECRET_ACCESS_KEY=
BACKUP_S3_BUCKET=
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

# Backend tests
cd ai-learning-backend/backend
npm test

# Frontend tests
cd ai-learning-frontend/frontend
npm test

# Load tests (requires k6)
k6 run load-tests/practice-session.js

# Database backup
cd ai-learning-backend/backend
npm run backup             # create backup
npm run restore            # restore latest backup

# Make yourself admin (run in MongoDB shell or Compass)
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
# Then re-login in the app to get updated JWT
```

---

## 17. COMPLETE FILE STRUCTURE

```
AILearningPath/
├── BLUEPRINT.md               ← this file — always up to date
├── AUDIT_CHECKLIST.md         ← 113/113 items fixed
├── CONTRIBUTING.md            ← setup, folder rules, PR checklist, commit style
├── CHANGELOG.md               ← full change history
├── docker-compose.yml         ← mongo + redis + api services
├── load-tests/practice-session.js ← k6 100VU load test
├── .github/workflows/
│   ├── ci.yml                 ← backend-test, frontend-build, e2e, deploy
│   └── backup.yml             ← nightly mongodump to gzip + optional S3
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
│   │   ├── aiService.js                ← getSystemPrompt(subject), 5 subject prompts
│   │   ├── aiRouter.js                 ← 7-layer cache, subject in key, checkAndIncrementUsage
│   │   ├── adaptiveService.js
│   │   ├── analysisService.js
│   │   ├── aiTeacherService.js
│   │   ├── autoDoubtService.js
│   │   ├── badgeService.js             ← checkAndAwardBadges, getUserBadges
│   │   ├── couponService.js            ← validateCoupon, computeDiscount, redeemCoupon
│   │   ├── foundationService.js
│   │   ├── onboardingEmailService.js   ← drip email sequence (day 0/3/7)
│   │   ├── paymentService.js           ← Razorpay order + verify + referral reward
│   │   ├── plannerService.js
│   │   ├── predictionService.js        ← predictExamScore (weighted by marks×freq)
│   │   ├── profileService.js
│   │   ├── pushService.js              ← sendRevisionReminders, sendStudyReminders
│   │   ├── revisionService.js
│   │   ├── scoringService.js
│   │   ├── selfLearningService.js
│   │   ├── streakService.js
│   │   └── weeklyParentEmailService.js ← Monday digest email to parents
│   │
│   ├── routes/
│   │   ├── adminRoutes.js        ← /api/admin/* (stats, users, questions, topics, coupons)
│   │   ├── aiRoutes.js           ← + /voice-answer, /voice-history
│   │   ├── analysisRoutes.js     ← + /predict
│   │   ├── authRoutes.js
│   │   ├── badgeRoutes.js        ← GET /api/badges
│   │   ├── competitionRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── curriculumRoutes.js   ← /api/v1/curriculum/*
│   │   ├── doubtRoutes.js        ← /api/doubt/:questionId (GET/POST/DELETE)
│   │   ├── examRoutes.js
│   │   ├── feedbackRoutes.js     ← /api/feedback (NPS submit + eligibility + admin view)
│   │   ├── lessonRoutes.js
│   │   ├── ncertRoutes.js        ← /api/v1/ncert/chapters + /topics
│   │   ├── paymentRoutes.js      ← /api/v1/payment/* (plans/subscription/create-order/verify/validate-coupon)
│   │   ├── plannerRoutes.js      ← + PATCH /reorder
│   │   ├── portalRoutes.js       ← /api/portal/* (full set: search, link, students, analytics, reminders)
│   │   ├── practiceRoutes.js     ← + /mixed, /flag
│   │   ├── pushRoutes.js         ← /api/push/vapid-public-key + subscribe (POST/DELETE)
│   │   ├── pyqRoutes.js          ← /api/v1/pyq/* (topics/years/list/detail)
│   │   ├── revisionRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── userRoutes.js         ← + /bookmarks
│   │   └── webhookRoutes.js      ← POST /api/webhooks/razorpay (raw body)
│   │
│   ├── middleware/
│   │   ├── auth.js              ← JWT verify → req.user
│   │   ├── adminAuth.js         ← NEW: requires role === "admin"
│   │   ├── validate.js          ← NEW: Joi schema validation, 422 on fail
│   │   └── errorHandler.js      ← NEW: centralised error handler
│   │
│   ├── utils/
│   │   ├── AppError.js          ← operational error class
│   │   ├── cache.js             ← in-memory LRU (24h TTL)
│   │   ├── cookieNames.js       ← __Host-token / __Secure-refreshToken / __Host-csrf (env-aware)
│   │   ├── email.js             ← nodemailer wrapper (console fallback)
│   │   ├── featureFlags.js      ← flag registry, env overrides, rollout %, getFlagsForUser
│   │   ├── logger.js            ← structured logger (pretty dev / JSON prod)
│   │   ├── questionGenerator.js
│   │   ├── redisClient.js       ← ioredis singleton + in-memory fallback
│   │   ├── sentry.js            ← Sentry init, no-op without DSN
│   │   ├── socket.js            ← Socket.IO rooms + per-IP conn limit + per-user submit throttle
│   │   ├── swagger.js           ← OpenAPI 3.0 spec + setupSwagger(app) → /api-docs
│   │   └── validateEnv.js       ← startup crash if required env vars missing
│   │
│   ├── config/
│   │   ├── seed.js
│   │   ├── seedLessons.js
│   │   ├── seedSubjects.js        ← 50+ Science/English/SocSci/Hindi topics
│   │   ├── seedMathCurriculum.js  ← 14 CBSE Class 10 Math chapters
│   │   ├── seedNcertContent.js    ← NCERT chapter content (all 14 Math chapters, ch1-4 detailed)
│   │   └── seedPYQ.js             ← 38 CBSE board exam PYQ MCQs (2020-2024, 9 topics)
│   │
│   ├── migrations/
│   │   └── 20260503000000-add-indexes-and-soft-delete.js ← TTL/compound indexes + question soft-delete
│   │
│   ├── migrate-mongo-config.js  ← ESM migrate-mongo config (MONGO_URI, migrationsDir: "migrations")
│   │
│   ├── __tests__/               ← Jest ESM test suite (22+ backend tests)
│   │   ├── analysisService.test.js   (7 tests)
│   │   ├── scoringService.test.js    (6 tests)
│   │   ├── plannerService.test.js    (4 tests, mocked)
│   │   ├── aiRouter.test.js          (5 tests, mocked)
│   │   └── integration/
│   │       ├── _setup.js             ← real DB (MONGO_URI) or MongoMemoryServer fallback
│   │       ├── auth.integration.test.js
│   │       └── aiQuota.integration.test.js
│   │
│   ├── scripts/
│   │   ├── backup.js            ← mongodump + gzip + optional S3 + prune
│   │   └── restore.js           ← mongorestore from local or S3, 5s abort window
│   │
│   └── package.json             ← jest config + npm test / test:integration + backup/restore
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
        ├── playwright.config.js ← Chromium, PLAYWRIGHT_BASE_URL, 2 retries in CI
        ├── e2e/
        │   ├── auth.spec.js         ← landing CTA, register, login, forgot-password, pricing, TOS
        │   └── practice.spec.js     ← authenticated: practice, dashboard, analytics, settings, nav, sign-out
        │
        ├── components/
        │   ├── Layout.jsx           ← mobile drawer (hamburger + backdrop + auto-close on nav)
        │   ├── BadgeToast.jsx       ← toast when badge awarded
        │   ├── DoubtChat.jsx        ← multi-turn chat below wrong answers
        │   ├── FeedbackWidget.jsx   ← 1-5 star + comment (after practice sessions)
        │   ├── OfflineBanner.jsx    ← shows when navigator.onLine is false
        │   ├── SearchOverlay.jsx    ← ⌘K global search
        │   └── Skeleton.jsx         ← DashboardSkeleton, AnalyticsSkeleton, LessonsSkeleton, etc.
        │
        ├── hooks/
        │   └── useFeatureFlags.js   ← fetches /api/flags once per page load
        │
        ├── __tests__/               ← Vitest 2.x test suite (16 tests)
        │   ├── setup.js
        │   ├── authStore.test.js         (4 tests)
        │   ├── api.interceptors.test.js  (7 tests)
        │   └── NPSSurveyBanner.test.jsx  (5 tests)
        │
        └── pages/
            ├── Dashboard.jsx        ← + NPSSurveyBanner, LinkRequestsCard
            ├── Lessons.jsx
            ├── LessonView.jsx
            ├── Practice.jsx         ← + FeedbackWidget after session
            ├── Analytics.jsx
            ├── Competition.jsx
            ├── LiveRoom.jsx
            ├── Planner.jsx
            ├── ExamReview.jsx
            ├── VoiceTutor.jsx       ← + persisted history, clear button
            ├── Profile.jsx
            ├── Settings.jsx         ← + CouponInput, ReferralCard
            ├── Onboarding.jsx
            ├── StartOnboarding.jsx
            ├── Login.jsx
            ├── Register.jsx         ← + referral code (?ref=) pre-fill
            ├── Portal.jsx           ← invite code + parent/teacher portal
            ├── ChapterView.jsx      ← chapter detail (sections/formulas/theorems/tips)
            ├── Pricing.jsx          ← plan cards + Razorpay checkout + annual options
            ├── TermsOfService.jsx
            ├── PrivacyPolicy.jsx
            └── admin/
                ├── AdminLayout.jsx
                ├── AdminOverview.jsx
                ├── AdminUsers.jsx
                ├── AdminQuestions.jsx
                ├── AdminTopics.jsx
                ├── AdminCacheStats.jsx
                ├── AdminAnalytics.jsx   ← DAU/MAU/revenue/30-day charts
                └── AdminCoupons.jsx     ← coupon CRUD
```
