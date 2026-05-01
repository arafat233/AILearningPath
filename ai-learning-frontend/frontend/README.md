# AI Learning App — Frontend

## Stack
React 18 · Vite · Tailwind CSS · Zustand · Recharts · Axios

## Prerequisites
- Node.js v18+ (same install as backend)
- Backend must be running on port 5000

## Setup
```bash
cd frontend
npm install
npm run dev
```
Open: http://localhost:5173

---

## Pages
| Page | Path | What it does |
|------|------|-------------|
| Login | /login | Sign in |
| Register | /register | Create account, set exam date + grade |
| Dashboard | / | Stats, streak, thinking profile, AI advice; subject tabs (Maths/Science/English/Social/Hindi) in Topics |
| Learn | /lessons | Subject tabs + Science sub-tabs (Physics/Chemistry/Biology); Textbook Chapters + AI Lessons tabs |
| Lesson | /lessons/:topic | Slide-by-slide lesson reader (short + deep dive mode) |
| Practice | /practice | Subject tabs + Science sub-tabs; adaptive questions, timer, confidence, AI explanation |
| Analytics | /analytics | Accuracy charts, topic bars, mistake breakdown, confidence analysis |
| Competition | /competition | Join exams, countdown timer, ranked results, leaderboard |
| Study Planner | /planner | Daily schedule, priority topics, skip suggestions; revision-due section |
| Settings | /settings | Update name, exam date, grade; all 5 CBSE subjects |

## Project Structure
```
frontend/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── store/
    │   └── authStore.js       ← Zustand (token persisted to localStorage)
    ├── services/
    │   └── api.js             ← All API calls, auto-attaches token, auto-logout on 401
    ├── components/
    │   └── Layout.jsx         ← Sidebar + nav
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── Dashboard.jsx      ← Topics from API (not hardcoded), streak display
        ├── Lessons.jsx        ← Lesson list + revision-due alerts
        ├── LessonView.jsx     ← Slide reader, short/long mode, progress tracking
        ├── Practice.jsx       ← Full practice flow with AI feedback
        ├── Analytics.jsx      ← Charts + empty-state safe
        ├── Competition.jsx    ← Fixed answers-ref bug, full exam flow
        ├── Planner.jsx        ← Study plan + skip strategy
        └── Settings.jsx       ← Profile update (exam date, grade, name)
```

## Build for production
```bash
npm run build   # outputs to dist/
```

## Troubleshooting
| Problem | Fix |
|---------|-----|
| Blank page | Open browser console, check for errors |
| API calls fail | Make sure backend is running on port 5000 |
| No topics showing | Run `npm run seed` in backend |
| No lessons showing | Run `npm run seed:lessons` in backend |
| Charts empty | Need at least 2 days of practice data for line chart |
