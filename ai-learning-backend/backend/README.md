# AI Learning App — Backend

## Stack
Node.js · Express · MongoDB · OpenAI API

---

## Prerequisites

### Node.js (v18+)
- Mac: `brew install node` or https://nodejs.org
- Windows: https://nodejs.org (LTS installer)
- Check: `node -v` and `npm -v`

### MongoDB
- Mac: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- Windows: https://www.mongodb.com/try/download/community (MSI installer — starts as a service automatically)
- Check: run `mongosh` in terminal — you should see a prompt

---

## Setup

```bash
cd backend
npm install
cp .env.example .env        # Mac/Linux
copy .env.example .env      # Windows
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_learning
JWT_SECRET=any_long_random_string
OPENAI_API_KEY=your_key_here   # get from platform.openai.com/api-keys
```
> Without an OpenAI key, AI explanations fall back to a default message. Everything else works fine.

```bash
npm run seed           # loads questions, topics, exams
npm run seed:lessons   # loads lesson content
npm run dev            # starts server
```

You should see:
```
✅ MongoDB connected
🚀 Server on port 5000
```

---

## All API Routes

### Auth
| Method | URL | Body |
|--------|-----|------|
| POST | /api/auth/register | `{ name, email, password, examDate, grade }` |
| POST | /api/auth/login | `{ email, password }` |

All routes below require: `Authorization: Bearer <token>`

### User / Profile
| Method | URL | Body |
|--------|-----|------|
| GET | /api/user/me | — |
| PUT | /api/user/me | `{ name, examDate, grade }` |

### Topics
| Method | URL |
|--------|-----|
| GET | /api/topics |

### Lessons
| Method | URL | Body |
|--------|-----|------|
| GET | /api/lessons | — |
| GET | /api/lessons/:topic | — |
| POST | /api/lessons/progress | `{ topic, mode, slideIndex, completed }` |

### Practice
| Method | URL | Body |
|--------|-----|------|
| POST | /api/practice/start | `{ topicId }` |
| POST | /api/practice/submit | `{ selectedType, timeTaken, confidence }` |

`selectedType`: `correct` · `concept_error` · `calculation_error` · `partial_logic` · `guessing` · `misinterpretation`
`confidence`: `low` · `medium` · `high`

### Analysis
| Method | URL |
|--------|-----|
| GET | /api/analysis/report |

### Revision
| Method | URL | Body |
|--------|-----|------|
| GET | /api/revision/due | — |
| POST | /api/revision/mark | `{ topic }` |

### Competition
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

### AI Advice
| Method | URL |
|--------|-----|
| GET | /api/ai/advice |

---

## Project Structure
```
backend/
├── server.js
├── .env.example
├── .gitignore
├── package.json
├── config/
│   ├── seed.js            ← questions, topics, exams
│   └── seedLessons.js     ← lesson content with slides
├── middleware/
│   └── auth.js
├── models/
│   ├── index.js           ← User, Topic, Question, Attempt, UserProfile,
│   │                         QuestionStats, Exam, ExamAttempt, StudyPlan
│   └── lessonModel.js     ← Lesson, LessonProgress
├── controllers/
│   ├── authController.js
│   ├── practiceController.js
│   ├── analysisController.js
│   ├── examController.js
│   ├── plannerController.js
│   ├── lessonController.js
│   └── aiController.js
├── services/
│   ├── analysisService.js     ← thinking pattern detection
│   ├── adaptiveService.js     ← smart question selection
│   ├── aiService.js           ← OpenAI: explain, generate, advise
│   ├── foundationService.js   ← prerequisite repair
│   ├── plannerService.js      ← study plan + skip strategy
│   ├── profileService.js      ← user memory + behaviour tracking
│   ├── revisionService.js     ← spaced repetition scheduler
│   ├── scoringService.js      ← difficulty scoring + Z-score ranking
│   ├── selfLearningService.js ← auto-calibrates question difficulty
│   └── streakService.js       ← daily streak counter
└── routes/
    ├── authRoutes.js
    ├── userRoutes.js
    ├── topicRoutes.js
    ├── lessonRoutes.js
    ├── practiceRoutes.js
    ├── analysisRoutes.js
    ├── revisionRoutes.js
    ├── examRoutes.js
    ├── plannerRoutes.js
    └── aiRoutes.js
```

---

## Troubleshooting
| Problem | Fix |
|---------|-----|
| `connect ECONNREFUSED` | MongoDB not running — start it first |
| `Cannot find module` | Run `npm install` |
| AI says fallback message | OPENAI_API_KEY missing or invalid in .env |
| No topics on frontend | Run `npm run seed` |
| No lessons showing | Run `npm run seed:lessons` |
| JWT errors | Token expired — log out and log back in |
