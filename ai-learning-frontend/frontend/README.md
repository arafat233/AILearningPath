# AI Learning App — Frontend

## Stack
React 18 · Vite · Tailwind CSS · Zustand · Recharts · Axios · Vitest

---

## Prerequisites
- Node.js 20+
- Backend must be running on **port 5001** (`node server.js` in `ai-learning-backend/backend`)

---

## Setup

```bash
cd ai-learning-frontend/frontend
npm install
npm run dev     # http://localhost:5173
```

---

## Tests

```bash
npm test                    # run Vitest test suite (16 unit tests)
npm run coverage            # generate coverage report
```

---

## Build for Production

```bash
npm run build   # outputs to dist/
```

---

## Environment Variables (frontend `.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL — default `http://localhost:5001/api` |
| `VITE_SENTRY_DSN` | Frontend error monitoring (optional) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key for checkout (optional — can be fetched from API) |

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Sign in |
| `/register` | Register | Create account; accepts `?ref=<inviteCode>` for referrals |
| `/forgot-password` | ForgotPassword | Request password reset email |
| `/reset-password/:token` | ResetPassword | Set new password with strength indicator |
| `/` | Dashboard | Streak, AI teacher message, revision due, NPS survey, link requests |
| `/lessons` | Lessons | CBSE textbook chapters + AI lessons; subject + sub-tabs |
| `/lessons/:topic` | LessonView | Slide-by-slide reader (short + deep dive mode) |
| `/chapters/:n` | ChapterView | Chapter detail — sections, formulas, theorems, exercises |
| `/practice` | Practice | Adaptive quiz, confidence tracking, DoubtChat, FeedbackWidget |
| `/analytics` | Analytics | Thinking profile, behaviour stats, score prediction |
| `/competition` | Competition | Weekly leaderboard + create / join live rooms |
| `/live` | LiveRoom | Real-time Socket.IO quiz room |
| `/planner` | Planner | Goal-based study calendar + revision-due section |
| `/exam-review` | ExamReview | Past exams with per-question AI review |
| `/voice-tutor` | VoiceTutor | Mic + TTS subject-aware tutor with persistent history |
| `/profile` | Profile | Badges grid, invite code generator |
| `/settings` | Settings | Subject / grade / goal / exam date + coupon input + referral card |
| `/portal` | Portal | Student: generate invite code. Parent/teacher: link students, analytics, reminders |
| `/pricing` | Pricing | Plan cards (Free / Pro / Premium / Annual) + Razorpay checkout |
| `/tos` | TermsOfService | Static legal page |
| `/privacy` | PrivacyPolicy | Static legal page |
| `/admin` | AdminOverview | Stats dashboard (admin role required) |
| `/admin/questions` | AdminQuestions | Question CRUD + flag queue |
| `/admin/topics` | AdminTopics | Topic CRUD |
| `/admin/users` | AdminUsers | User list + role management |
| `/admin/cache` | AdminCacheStats | AI cache hit rates + cost estimate |
| `/admin/analytics` | AdminAnalytics | DAU / MAU / revenue / 30-day bar charts |
| `/admin/coupons` | AdminCoupons | Coupon CRUD |

---

## Key Components

| Component | Description |
|---|---|
| `Layout.jsx` | Sidebar navigation + protected route outlet |
| `BadgeToast.jsx` | Floating toast when a new badge is awarded |
| `DoubtChat.jsx` | Expandable multi-turn AI chat below wrong answers in Practice |
| `FeedbackWidget.jsx` | 1–5 star + comment widget after practice sessions |

## Key Hooks

| Hook | Description |
|---|---|
| `useFeatureFlags` | Fetches `/api/flags` once per page load; returns `isEnabled(name)` |

---

## Project Structure

```
frontend/
├── index.html
├── vite.config.js       ← Vitest config included (test.globals, jsdom, coverage)
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx         ← Sentry init (no-op without VITE_SENTRY_DSN)
    ├── App.jsx          ← all routes including admin + protected route logic
    ├── index.css
    │
    ├── store/
    │   └── authStore.js          ← Zustand (user, role — persisted to localStorage)
    │
    ├── services/
    │   └── api.js                ← axios instance; CSRF header; auto-logout on 401
    │
    ├── hooks/
    │   └── useFeatureFlags.js    ← module-level cache; fetches flags once per load
    │
    ├── components/
    │   ├── Layout.jsx
    │   ├── BadgeToast.jsx
    │   ├── DoubtChat.jsx
    │   └── FeedbackWidget.jsx
    │
    ├── __tests__/
    │   ├── setup.js                       ← @testing-library/jest-dom
    │   ├── authStore.test.js              (4 tests)
    │   ├── api.interceptors.test.js       (7 tests)
    │   └── NPSSurveyBanner.test.jsx       (5 tests)
    │
    └── pages/
        ├── Dashboard.jsx
        ├── Lessons.jsx
        ├── LessonView.jsx
        ├── ChapterView.jsx
        ├── Practice.jsx
        ├── Analytics.jsx
        ├── Competition.jsx
        ├── LiveRoom.jsx
        ├── Planner.jsx
        ├── ExamReview.jsx
        ├── VoiceTutor.jsx
        ├── Profile.jsx
        ├── Settings.jsx
        ├── Onboarding.jsx
        ├── StartOnboarding.jsx
        ├── Login.jsx
        ├── Register.jsx
        ├── ForgotPassword.jsx
        ├── ResetPassword.jsx
        ├── Portal.jsx
        ├── Pricing.jsx
        ├── TermsOfService.jsx
        ├── PrivacyPolicy.jsx
        └── admin/
            ├── AdminLayout.jsx
            ├── AdminOverview.jsx
            ├── AdminQuestions.jsx
            ├── AdminTopics.jsx
            ├── AdminUsers.jsx
            ├── AdminCacheStats.jsx
            ├── AdminAnalytics.jsx
            └── AdminCoupons.jsx
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page | Open browser console and check for errors |
| API calls fail / CORS error | Make sure backend is running on **port 5001** |
| No topics showing | Run `npm run seed` in the backend directory |
| No lessons showing | Run `npm run seed:lessons` in the backend directory |
| Charts empty | Need at least 2 days of practice data for line charts |
| Push notifications not working | Check VAPID vars are set in backend `.env` |
| Vitest tests fail with `styleText` error | Requires Node 20.11.1+ (vitest@2 compatible) |
