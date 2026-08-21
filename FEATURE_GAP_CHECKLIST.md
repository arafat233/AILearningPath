# Feature Gap Checklist

Audited 2026-08-21 against the priority feature list. Status is from a full codebase audit
(backend routes/services/models, frontend pages, mobile).

Legend: ✅ exists · 🟡 partial · ❌ missing · 🔨 built this session

## Highest-priority features

| # | Feature | Status | What exists | Gap |
|---|---------|--------|-------------|-----|
| 1 | Daily Learning Plan | 🟡 → 🔨 | `dailyBriefService` (weak topics, revision due, plan progress), dashboard NBA/streak cards | No single queue of *actual questions*. **Built:** `GET /api/user/today-plan` returns a sequenced question queue (3 weak-topic + 1 revision) + streak + next lesson; Dashboard "Begin plan" now launches it |
| 2a | Spaced Revision Engine | ✅ | `revisionService` (1/3/7/15/30-day intervals, promote/demote), SM-2 on bookmarks (`BookmarkReview`), daily push cron | Two engines not unified (topic-level vs question-level) — acceptable for now |
| 2b | Mistake Notebook | ❌ → 🔨 | Wrong answers already recorded in `Attempt`; retry-wrong flow exists (`/practice/start-bookmarks`) | No mistakes surface. **Built:** `GET /api/v1/mistakes` (question, your answer, correct answer, why wrong, retry date, similar questions) + `/mistakes` page + nav entry |
| 3a | Mock Test Mode | ✅ | `Exam`/`ExamAttempt` (timer, negative marking, percentile, rank), `MockPaper.jsx`, `ExamReview.jsx`, 14 seeded papers | Done — nothing to build |
| 3b | Exam Readiness Score | 🟡 → 🔨 | `predictionService` (CBSE predicted score + grade band), `getMockPaperReadiness` per chapter | **Built:** `getReadiness` — per-subject "X% ready" (examFrequency-weighted, coverage-penalized), weakest topics, JEE/NEET label from goal; in analytics dashboard payload + `GET /api/v1/analytics-v2/readiness`; cards on Analytics page |
| 4 | AI Tutor modes + guardrails | 🟡 → 🔨 | Socratic tutor was Pro-track only; K-12 had hints + full explanations | **Built:** `mode` (full/hint/socratic/shortcut) + `lang` (en/hi/hinglish) on tutor chat + doubt chat; `User.locale` now feeds the default language; cache bypass for non-default modes; mode chips + Hinglish toggle in Practice tutor panel |
| 5 | Parent Weekly Digest | ✅ (email) | `weeklyParentEmailService` + 7-day cron, full parent dashboard, parental controls | WhatsApp channel missing (needs WhatsApp Business API account — business decision, not code-first) |

## Second tier

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 6 | Mastery Map (visual) | 🟡 → 🔨 | States existed in data only. **Built:** `GET /api/v1/lessons-v2/mastery-map` — 5 states (not started/learning/weak/mastered/needs revision, revision-engine-aware) + clickable per-chapter colour grid with legend on Lessons page |
| 7 | Teacher/Classroom | 🟡 → 🔨 | Join codes, class dashboard, challenges, homework variants, portal existed. **Built:** `Assignment` model + assign-by-class-code flow with due dates, attempt-derived completion tracking, per-student teacher report, student Assignments card + role-gated Portal form, and the students × topics **class heatmap** grid |
| 8 | AI content creation for teachers | ❌ → 🔨 | **Built:** worksheet generator (bank-backed, printable, answer key) + AI docs — class summary, 2-week remedial plan, parent note (`POST /api/v1/school-group/teacher-content`, generated from real class stats, copy-to-WhatsApp button on Portal) |
| 9 | Voice doubt solving | ✅ | `VoiceTutor` pages + `/api/ai/voice-answer` (Web Speech API) |
| 10 | Image doubt solving | ❌ → 🔨 | **Built:** `POST /api/ai/image-doubt` (Claude vision, 6mb body, rate-limited + quota'd, mode/Hinglish aware) + 📷 button in the Practice tutor chat with client-side downscaling |
| 11 | Hinglish/Hindi UI + AI | 🟡 → 🔨 | Hindi content existed. **Built:** AI replies in Hindi/Hinglish via `lang` param + stored `User.locale`; sidebar nav fully translated server-side for locale=hi + `src/i18n.js` dictionary on key Dashboard CTAs. Remaining: extend the dictionary screen-by-screen as needed |
| 12 | Leaderboard | ✅ | Weekly, exam, class, ELO arena — with privacy opt-outs |
| 13 | Scholarship/admission tracker | ❌ → 🔨 | **Built:** curated Indian scholarship/talent-exam list (NMMS, INSPIRE, Olympiads, AICTE, …) grade-filtered with per-user tracking, on the `/career` page |
| 14 | Career path mode (K-12) | ❌ → 🔨 | **Built:** 5 curated roadmaps (IIT, NEET, AI/DS, software, CA) with staged plans, exams, and deep links into practice/mocks/Pro track; user's chosen path saved to `User.careerPath` |
| 15 | Offline practice packs (mobile) | ❌ → 🔨 | **Built:** downloadable weak-topic packs (≤40 Qs, answer key included for local grading) stored as JSON via path_provider — no new dependencies; offline practice screen with solutions; queued answers sync back via `POST /api/practice/sync-offline` with server-side re-grading |
| 16 | Personal AI memory | ✅ | `UserProfile` (thinking profile, weak areas, behavior stats) injected into every AI call |
| 17 | Monetization tiers | ✅ | free/pro/premium (+annual), Razorpay, coupons, referrals, quotas |
| 18 | Streaks/gamification | ✅ | Streaks w/ grace day, badges, quests, XP, certificates |

## Build order (remaining)

- [x] 1. Daily plan queue endpoint + Dashboard wiring *(this session)*
- [x] 2. Mistake Notebook backend + page *(this session)*
- [x] 3. Exam readiness roll-up endpoint (`GET /api/v1/analytics-v2/readiness`) + score card UI *(this session)*
- [x] 4. Tutor `mode` param (hint/socratic/full/shortcut) + Hindi/Hinglish via `User.locale` *(this session)*
- [x] 5. Assignment model + teacher assign/due-date flow *(this session)*
- [x] 6. Visual mastery map on Lessons page *(this session)*
- [x] 7. Image doubt solving (upload + Claude vision) *(this session)*
- [x] 8. Teacher worksheet generation with answer key *(this session)*
- [x] 9. AI teacher docs — class summary / remedial plan / parent note *(this session)*
- [x] 10. Per-topic class heatmap grid *(this session)*
- [x] 11. Career path mode + scholarship tracker *(this session)*
- [x] 12. Offline mobile practice packs *(this session)*
