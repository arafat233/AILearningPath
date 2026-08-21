# Feature Gap Checklist

> Round 1 (2026-08-21/22): CLOSED — see tables below.
> Round 2 (2026-08-22 audit of the extended 68-item list): see "Round 2 backlog" at the end.

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

---

# Round 2 — extended 68-item audit (2026-08-22)

Verdict counts: **31 exist · 25 partial · 12 missing**. Evidence-verified against the codebase.

## ✅ Fully exist (31)
Diagnostic onboarding (placement quiz), goal setting, bookmark collections, offline mode (mobile packs + PWA queue), confidence tracking (+calibration curve), AI study coach (NBA/recommender/today-plan), AI quiz generation (weak-area mocks, PYQ mock-from-filters), AI mock interview (Pro), explanation level control (tutor modes), PYQ bank filters, PYQ chapter-frequency analytics, rank/percentile (Z-score), meaningful badges (concept_master_*), purposeful push (revision-due/streak-risk/parent-set), study groups (classes/challenges/co-study/live rooms), parent guidance (digest advice/co-signed goals/messages/controls), subscription management, child self-comparison over time, assignment builder, printable worksheets, company assessment mode, report bad question, content review (AdminQuestions), AI response rating, academic honesty mode (socratic/hint), privacy controls, data export/delete (GDPR), cohort analytics (AdminRetention), referrals, coupon dashboard, notification prefs.

## 🟡 Partial (25) — what's missing in one line each
| Item | Gap |
|---|---|
| Streak recovery | weekly grace day + risk push exist; no streak freeze or comeback plan |
| Study calendar | planner exists; no unified calendar with school exams + assignment deadlines |
| Focus mode | client-only Pomodoro on Dashboard; nothing persisted |
| Multi-language | AI hi/hinglish + Hindi nav/CTAs; full UI + regional languages open |
| Accessibility | dark mode only; no font size, dyslexia mode; ListenButton on just 2 pages |
| AI revision notes | collection "AI summary" is a heuristic template — zero LLM calls |
| Handwritten checker | image doubt solves the photo; no "grade my working" flow |
| Long-form evaluator | 2-3 sentence concept feedback; no board-style marks/rubric (2000-char cap) |
| Hallucination controls | RAG + report/rate exist; no citations or confidence shown |
| Adaptive mocks | weak-TOPIC-targeted; difficulty mix is static, no within-test branching |
| Exam-day planner | smart planner + phase labels; no final-7/15/30-day crunch plan |
| Weekly student report | analytics exist; no weekly report artifact for the student |
| Comeback flow | one day-7 email; no lighter restart plan in-app |
| Parent mobile view | responsive web only; Flutter app has no parent mode |
| Parent event alerts | weekly digest only; no missed-3-days / score-drop triggers |
| Auto-remediation groups | heatmap shows clusters; no auto-grouping action |
| Teacher content upload | AI generation yes; no PDF/custom-question upload (no multer anywhere) |
| Study-time tracking | per-student minutes in portal (from Attempt.timeTaken); no attendance |
| Student risk flags | `getClassStats.weakStudents` endpoint EXISTS but is dead code — no UI consumes it |
| Pro project portfolio | projects are exercises; submissions expire after 30 days (TTL) — portfolio impossible by design |
| Pro skill graph | flat per-module skill list + radar; no graph |
| Certificates verification | Certificate is a stub model, print-to-PDF only; no verification code/URL |
| Source-backed explanations | RAG used internally, never cited to the student |
| Feature flags | two env-var systems work; no admin UI (change = redeploy) |
| Localization mgmt | i18n dictionary; no management tooling |

## ❌ Missing (12)
AI flashcards · timed drills (the "5-min warmup" button is a plain redirect) · negative-marking coach · WhatsApp parent reports (blocked on WA Business account) · classroom projection mode · school billing/licenses · GitHub integration · resume builder · job-readiness score · mentor review workflow · A/B testing (vestigial rollout flags, no exposure logging) · in-app support tickets (NPS only)

## Round 2 build order (suggested)
1. **Certificate verification URL** — user's top pick; small: verificationCode on Certificate + public lookup route + QR/link on the PDF
2. **Timed drills** — 5-min speed / 15-min accuracy rounds; practice engine already exists, needs a session timer mode
3. **AI flashcards from mistakes** — mistake notebook + SM-2 review already exist; generate Q/A cards from wrong answers
4. **Parent event alerts** — signals already computed (streak risk, anomalies); route them to the parent email/push
5. **Comeback flow** — detect 7-day inactivity at login → offer a lighter restart plan (planner already supports regeneration)
6. **Wire up `weakStudents`** — dead endpoint → at-risk list on the teacher Portal (near-zero backend work)
7. **Exam-day crunch planner** — final-7/15/30-day mode in plannerSmartService
8. **Real AI revision notes** — replace the heuristic "aiSummary" with an actual model call (or rename it honestly)
9. Accessibility pass (font size + wider ListenButton coverage) · negative-marking coach · feature-flag admin UI · support tickets
10. Larger/blocked: WhatsApp channel, school billing, GitHub/resume/mentor (Pro), A/B infra, classroom projection, parent mode in the mobile app

## Notable honesty flags from the audit
- `bookmarkService.generateAiSummary` is branded "AI" but calls no model
- `portalController.getClassStats` is fully wired backend + api.js and used by nothing
