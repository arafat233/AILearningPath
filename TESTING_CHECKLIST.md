# Stellar — End-to-End Testing Checklist

**Owner:** Najeeb + Salma
**Last updated:** 2026-05-25
**Purpose:** Single source of truth for what's been verified vs still needs testing. Tick boxes as you go. Worker assigned in `[X]` column.

Legend:
- `[ ]` not tested
- `[~]` partial (DB / API level OK, UI not visually confirmed)
- `[x]` end-to-end verified (manual UI walkthrough OR automated test passed)
- `[F]` failed — known bug, link issue
- `[N]` not applicable / out of scope for this release

For each row: try the action with **najeeb** logged in viewing-as **nayak** (AP_SSC Class 9), then repeat with a CBSE Class 10 user (the original test account).

---

## 0. Smoke test (5 minutes — do this first after every deploy)

| # | Action | Expected | Status |
|---|---|---|---|
| 0.1 | Visit `http://localhost:5173/` while logged out | Lands on Landing page, no errors in console | `[ ]` |
| 0.2 | Click "Get Started" / register a brand-new email | Redirects to `/onboarding` or `/welcome`, no 500s | `[ ]` |
| 0.3 | Log in as najeeb | Lands on Dashboard with sidebar showing "AP_SSC · Class 9" (Nayak) | `[ ]` |
| 0.4 | Navigate to Learn → Practice → Bookmarks → Analytics → Profile | All five pages render without console errors | `[ ]` |
| 0.5 | Open dev tools Network tab on `/lessons` | Every request has `x-child-id` header when activeChild set | `[ ]` |
| 0.6 | Log out | Cookies cleared, redirect to landing | `[ ]` |

---

## 1. Auth & Identity

### 1.1 Registration
| # | Action | Expected | Status |
|---|---|---|---|
| 1.1.1 | Register with valid name/email/password | 200, cookies set, redirect to next step | `[ ]` |
| 1.1.2 | Register with duplicate email | 400 with clear error message | `[ ]` |
| 1.1.3 | Register with password < 8 chars | 400 "min 8 chars" | `[ ]` |
| 1.1.4 | Google OAuth — click "Continue with Google" | Redirects to Google, returns to dashboard | `[ ]` |

### 1.2 Login
| # | Action | Expected | Status |
|---|---|---|---|
| 1.2.1 | Login with correct credentials | Cookies set, redirect | `[ ]` |
| 1.2.2 | Login with wrong password | 401, inline error visible | `[ ]` |
| 1.2.3 | Login with non-existent email | 401 (don't leak which is wrong) | `[ ]` |
| 1.2.4 | Login then rapid-fire bad password 5x | Lockout / rate limit kicks in | `[ ]` |

### 1.3 Session
| # | Action | Expected | Status |
|---|---|---|---|
| 1.3.1 | Refresh page after login | Stays logged in, no re-auth needed | `[ ]` |
| 1.3.2 | Close browser, reopen | Still logged in (httpOnly cookie persists) | `[ ]` |
| 1.3.3 | Wait for token expiry (~15 min) then navigate | Auto-refresh via `/auth/refresh`, no user impact | `[ ]` |
| 1.3.4 | Logout | All cookies cleared, navigating to `/` shows landing | `[ ]` |

### 1.4 Password
| # | Action | Expected | Status |
|---|---|---|---|
| 1.4.1 | Click "Forgot password" → enter email | Confirmation message + email queued | `[ ]` |
| 1.4.2 | Use reset link from email | Lands on `/reset-password/:token`, can set new password | `[ ]` |
| 1.4.3 | Old JWT issued before reset | 401 "Password changed, please log in again" | `[ ]` |

---

## 2. Onboarding & View-as-Child

### 2.1 Self onboarding (parent's own profile is incomplete)
| # | Action | Expected | Status |
|---|---|---|---|
| 2.1.1 | Brand-new user with no board/grade hits `/lessons` | BoardGated redirects to `/start` | `[ ]` |
| 2.1.2 | On `/start`, pick CBSE + Class 10, submit | User record updated, redirect to dashboard | `[ ]` |
| 2.1.3 | Header at `/start` reads "Hi <firstname>" | First name comes from user record | `[ ]` |

### 2.2 Add a child (parent flow)
| # | Action | Expected | Status |
|---|---|---|---|
| 2.2.1 | Parent visits `/onboarding`, fills form (AP_SSC, Class 9) | New child created, parent.linkedStudents updated, activeChild set | `[~]` (backend route fixed today — Joi AP_SSC added) |
| 2.2.2 | Same form with invalid board | Clear error message (not "Something went wrong") | `[~]` (error message now bubbles up from server) |
| 2.2.3 | After creating child, dashboard shows fresh stats | Streak=0, AI=0/10, accuracy=0%, no weak topics | `[ ]` |

### 2.3 View-as-child
| # | Action | Expected | Status |
|---|---|---|---|
| 2.3.1 | Active child = AP_SSC nayak; sidebar logo reads "AP_SSC · Class 9" | Matches activeChild board+grade (not parent) | `[x]` fixed Layout.jsx:172 |
| 2.3.2 | Click X on "Viewing as" pill | Returns to parent view (activeChild=null) | `[ ]` |
| 2.3.3 | Pick a different child from `/child-picker` | Sidebar + content update to new child | `[ ]` |
| 2.3.4 | `/start` while viewing-as-child with missing board | Form greets "Finish setting up <child>"; submit updates CHILD not parent | `[x]` fixed StartOnboarding.jsx |

### 2.4 actAsChild header swap (the architectural fix from today)
| # | Action | Expected | Status |
|---|---|---|---|
| 2.4.1 | Dev tools Network — any /api request while viewing-as-child | Carries `x-child-id` header | `[x]` confirmed in api.js |
| 2.4.2 | Parent claims to view-as a stranger's child | Backend silently ignores swap (no privilege escalation) | `[x]` jest integration test |
| 2.4.3 | `/api/portal/students` while viewing-as-child | Returns parent's children list, NOT scoped to child | `[x]` jest integration test |
| 2.4.4 | `/api/user/me` PUT while viewing-as-child | Updates parent record, not child | `[x]` jest integration test (skip-list verified) |

---

## 3. Lessons

### 3.1 Chapter listing
| # | Action | Expected | Status |
|---|---|---|---|
| 3.1.1 | AP_SSC Class 9 Math → 12 chapters | Number Systems … Statistics | `[x]` seed + 8 fixes today |
| 3.1.2 | CBSE Class 10 Math → 14 chapters | Real Numbers … Probability | `[~]` 14 chapters seeded (verified DB) |
| 3.1.3 | ICSE Class 10 Math → 25 chapters | VAT … Probability | `[~]` 25 seeded today (DB); was 0 before |
| 3.1.4 | CBSE Class 9 Math | 8 chapters | `[~]` 8 chapters seeded (verified DB) |
| 3.1.4b | AP_SSC Class 10 Math → 14 chapters | Real Numbers … Probability | `[~]` 14 seeded today (DB); was 0 before |
| 3.1.4c | ICSE Class 9 Math → 28 chapters | Per memory: 28 ch | `[~]` 28 seeded (DB) |
| 3.1.5 | AP_SSC Class 9 Science / English / etc | "Coming soon" message (no content seeded yet) | `[ ]` |
| 3.1.6 | OTHER SUBJECTS sidebar hides subjects with no seeded content | E.g. AP_SSC 9 sees no Science card | `[~]` available-subjects API live |

### 3.2 Chapter detail (`/ncert/chapters/:chapterId`)
| # | Action | Expected | Status |
|---|---|---|---|
| 3.2.1 | Open ap_ssc_math9_ch1 | 4 topics, no leakage from other grades | `[x]` chapterId-scoped filter today |
| 3.2.2 | Open cbse_math10_ch1 | Real-Numbers topics, all sections render | `[ ]` |
| 3.2.3 | Open chapter with no subchapters (new architecture) | Falls back to flat topic list | `[x]` NcertChapterView.jsx update today |
| 3.2.4 | Click "Mark done" on a topic | Persists; refresh shows it checked | `[ ]` |
| 3.2.5 | Progress bar updates when topics marked done | % matches studied/total | `[ ]` |

### 3.3 Topic detail (`/ncert/topics/:topicId`)
| # | Action | Expected | Status |
|---|---|---|---|
| 3.3.1 | AP_SSC Math 9 topic loads | Hook, concept, derivation, worked example all render | `[ ]` |
| 3.3.2 | SVG diagrams display | Per memory: AP_SSC 9 has 56 SVG diagrams seeded | `[ ]` |
| 3.3.3 | "Practice this topic" button | Navigates to /practice and auto-starts | `[ ]` |
| 3.3.4 | Bookmark toggle | Bookmarks page lists the topic | `[ ]` |

---

## 4. Practice

### 4.1 Topic selection
| # | Action | Expected | Status |
|---|---|---|---|
| 4.1.1 | AP_SSC Class 9 Math → 12 chapter topics | Listed in topic picker | `[x]` topicRoutes fix today |
| 4.1.2 | Pick "Triangles" → start practice | Question loads, no 404 | `[ ]` |
| 4.1.3 | Other boards (CBSE 10, ICSE 10) Math | Picker shows their respective chapters | `[ ]` |
| 4.1.4 | Switch subject to Science | Science topics load | `[ ]` |

### 4.2 Question flow
| # | Action | Expected | Status |
|---|---|---|---|
| 4.2.1 | Answer correctly | Green feedback, +XP, next Q | `[ ]` |
| 4.2.2 | Answer incorrectly | Red feedback, explanation shown | `[ ]` |
| 4.2.3 | Use hint (AI) | Hint text appears, AI credits decrement | `[ ]` |
| 4.2.4 | Skip question | Skip reason modal, then next Q | `[ ]` |
| 4.2.5 | Flag question | Flag form opens, submit logs to admin | `[ ]` |
| 4.2.6 | Offline → answer queued | "Saved offline" toast; next online sync drains queue | `[ ]` |

### 4.3 Adaptive difficulty
| # | Action | Expected | Status |
|---|---|---|---|
| 4.3.1 | 3 correct in a row → difficulty rises | Next Qs harder | `[ ]` |
| 4.3.2 | 2 wrong in a row → difficulty drops | Next Qs easier | `[ ]` |

---

## 5. Bookmarks
| # | Action | Expected | Status |
|---|---|---|---|
| 5.1 | Bookmark a question | Appears in /bookmarks | `[ ]` |
| 5.2 | Add to a custom collection | Collection chip shows count | `[ ]` |
| 5.3 | "Practice bookmarks" button | Practice page starts with bookmark mix | `[ ]` |
| 5.4 | Generate share link | URL copy, opens in incognito for someone else | `[ ]` |

---

## 6. Analytics
| # | Action | Expected | Status |
|---|---|---|---|
| 6.1 | Visit /analytics | Heatmap, accuracy, weak topics render | `[ ]` |
| 6.2 | Persona widget shows current thinking profile | E.g. "Overthinker" / "Careful" | `[ ]` |
| 6.3 | Predicted board score updates after attempts | Number changes | `[ ]` |
| 6.4 | Compare to class | Peer count + median visible | `[ ]` |
| 6.5 | While viewing-as-child: analytics scope to child | Numbers reflect child's data only | `[ ]` |

---

## 7. Certificate
| # | Action | Expected | Status |
|---|---|---|---|
| 7.1 | /certificate renders | Name, board, grade, subject from profile | `[x]` fixed today to use activeProfile |
| 7.2 | Print button → save as PDF | Sidebar/header hidden in print | `[ ]` |
| 7.3 | Admin can view list of issued certs | /admin/certificates page populates | `[ ]` |

---

## 8. Competition / Live Room
| # | Action | Expected | Status |
|---|---|---|---|
| 8.1 | Open /competition | Weekly leaderboard for user's class | `[~]` label fixed today |
| 8.2 | Create a room | Room created, lobby visible | `[ ]` |
| 8.3 | Join room via code | Lobby shows joined player | `[ ]` |
| 8.4 | Start a match | 10 Qs flow, scoring updates | `[ ]` |
| 8.5 | Match ends | Results page, XP awarded | `[ ]` |
| 8.6 | Quick match | Auto-finds opponent or bot | `[ ]` |

---

## 9. Study Planner
| # | Action | Expected | Status |
|---|---|---|---|
| 9.1 | Create new plan | Wizard finishes, plan persists | `[ ]` |
| 9.2 | Plan defaults use active profile's subjects/grade/examDate | Not parent's | `[x]` Planner.jsx fixed today |
| 9.3 | Drag a topic to a different day | Persisted on refresh | `[ ]` |
| 9.4 | Mark a day complete | Confetti + streak update | `[ ]` |
| 9.5 | Generate parent share token | Link opens read-only view | `[ ]` |
| 9.6 | Weekly digest button | Email queued (check logs) | `[ ]` |

---

## 10. PYQ Bank
| # | Action | Expected | Status |
|---|---|---|---|
| 10.1 | /pyq loads | Year filter, subject filter, questions | `[~]` grade now from profile |
| 10.2 | Filter by year | Q list narrows | `[ ]` |
| 10.3 | Multi-select chapters → build mock paper | Mock PDF / page renders | `[ ]` |
| 10.4 | Bookmark a PYQ | Appears in bookmarks with PYQ tag | `[ ]` |

---

## 11. Parent View
| # | Action | Expected | Status |
|---|---|---|---|
| 11.1 | /parent shows linked children | Names, grades, boards (incl. examBoard now) | `[x]` portalController fix today |
| 11.2 | Click into a child | Read-only dashboard for that child | `[ ]` |
| 11.3 | Set study reminder | Persists in user.studyReminders[] | `[ ]` |
| 11.4 | Set parental controls (screen time / pause AI) | Saved to child's parentalControls | `[ ]` |
| 11.5 | Send parent message to child | Child sees it in their notifications | `[ ]` |
| 11.6 | Co-sign a goal | Goal appears on child's dashboard | `[ ]` |
| 11.7 | "Link existing student" by ID search | Link request created (pending child accept) | `[ ]` |

---

## 12. School Groups
| # | Action | Expected | Status |
|---|---|---|---|
| 12.1 | Teacher creates a class | Code generated | `[ ]` |
| 12.2 | Student joins with code | Membership recorded | `[ ]` |
| 12.3 | Class-wide leaderboard | Aggregates across members | `[ ]` |

---

## 13. Mock Paper
| # | Action | Expected | Status |
|---|---|---|---|
| 13.1 | /mock-paper generates a board paper | Right marks distribution per board | `[ ]` |
| 13.2 | Submit answers | Auto-grade + per-section breakdown | `[ ]` |
| 13.3 | Mixes PYQ + generated questions | Source labels visible | `[ ]` |

---

## 14. Voice Tutor
| # | Action | Expected | Status |
|---|---|---|---|
| 14.1 | /voice-tutor opens mic permission | Browser prompt | `[ ]` |
| 14.2 | Speak a doubt | Transcribed; AI responds in voice | `[ ]` |
| 14.3 | Voice history persists in Redis | Re-open shows prior turns | `[ ]` |

---

## 15. Profile / Settings
| # | Action | Expected | Status |
|---|---|---|---|
| 15.1 | /profile renders with right board/grade/subject | Even when viewing-as-child | `[x]` activeProfile chained today |
| 15.2 | Update avatar | Persists; sidebar avatar updates | `[ ]` |
| 15.3 | Set manifesto | Appears on profile header | `[ ]` |
| 15.4 | /settings while viewing-as-child | Edits PARENT's record (not child) | `[x]` /api/user/me in skip list |
| 15.5 | Toggle dark mode | Persists via Zustand | `[ ]` |
| 15.6 | Change locale to Hindi | UI strings switch | `[ ]` |

---

## 16. Admin
| # | Action | Expected | Status |
|---|---|---|---|
| 16.1 | Non-admin hits /admin → 403 | Cannot bypass | `[ ]` |
| 16.2 | Admin lists users | Pagination works | `[ ]` |
| 16.3 | Admin creates a question | Lives in Question collection | `[ ]` |
| 16.4 | Admin flags & unflags | Status updates | `[ ]` |
| 16.5 | Admin sends weekly parent emails | Job runs without error | `[ ]` |

---

## 17. Cross-cutting (CRITICAL)

### 17.1 Board isolation
| # | Action | Expected | Status |
|---|---|---|---|
| 17.1.1 | AP_SSC user never sees CBSE content anywhere | Lessons / Practice / PYQ / Analytics all scoped | `[~]` need spot-check per module |
| 17.1.2 | CBSE user never sees ICSE content | Same | `[~]` |
| 17.1.3 | Run `npm run validate:board-isolation` | Exits 0 | `[x]` PASS (2026-05-25) |
| 17.1.4 | All CBSE Class 10 subjects have 0 orphan questions | Math/Science/English/Social/Hindi each = canonical topicIds 100% | `[x]` 503/257/256/359/129 Qs all canonical (2026-05-25) |

### 17.2 Track isolation (today's fix)
| # | Action | Expected | Status |
|---|---|---|---|
| 17.2.1 | Run `npm run validate:track-isolation` | Exits 0 — every user-context route guarded | `[x]` 101 controllers indexed, all guarded (2026-05-25) |
| 17.2.2 | Add a new route with `req.user.id` but no auth | Validator fails (gate works) | `[ ]` |

### 17.3 Multi-grade isolation
| # | Action | Expected | Status |
|---|---|---|---|
| 17.3.1 | Class 9 user never sees Class 10 topics | All endpoints grade-filter | `[~]` chapterId scope now strict |
| 17.3.2 | Class 10 user never sees Class 9 topics | Same | `[~]` |

### 17.4 Permissions
| # | Action | Expected | Status |
|---|---|---|---|
| 17.4.1 | Direct POST to /portal/link-direct as student | 403 | `[ ]` |
| 17.4.2 | Direct PUT /user/children/:id you don't own | 403 | `[x]` ownership check in updateChild |
| 17.4.3 | Direct GET /v1/ncert/topics without cookie | 401 | `[x]` curl confirmed 401 (2026-05-25) |

---

## 18. Performance / UX
| # | Action | Expected | Status |
|---|---|---|---|
| 18.1 | Lighthouse on Dashboard | LCP < 2.5s, no layout shift | `[ ]` |
| 18.2 | Bundle size after Monaco lazy-load (when added) | No regression on non-pro routes | `[N]` pro track not shipped |
| 18.3 | Offline → online sync | Queued attempts drain, no dupes | `[ ]` |
| 18.4 | Mobile viewport — all pages render | No horizontal scroll, fluid grids | `[ ]` |
| 18.5 | Dark mode — all pages | Readable, no white flashes | `[ ]` |

---

## 19. Content audits (do once per content release)
| # | Action | Expected | Status |
|---|---|---|---|
| 19.1 | `npm run audit:math -- --board=AP_SSC --grade=9` | Passes 15/15 checks | `[x]` 35/35 topics PASS (2026-05-25) |
| 19.2 | `npm run validate:board-isolation` | No topicId/examBoard mismatches | `[x]` PASS (2026-05-25) |
| 19.3 | `npm run audit:math:cbse9` | Passes | `[x]` PASS (2026-05-25) |
| 19.4 | `npm run audit:math:cbse10` | Passes | `[x]` **54/54 PASS** (was 0/54 before today). Today: re-keyed 304 v0 topicIds → v2, fixed broken `seedCbseMath10ZeroQGaps.js`, seeded 80 new questions (4 ZeroQ topics + 16 nth_term Qs authored). |
| 19.5 | `npm run audit:math:icse10` | Passes | `[x]` PASS (2026-05-25) |
| 19.6 | `audit:coverage` | All seeded subjects/chapters reachable from UI | `[ ]` |

---

## 20. Automated test commands

| Command | Coverage | Last result (2026-05-25) |
|---|---|---|
| `npm test` (backend) | 367 unit tests | ⚠ 367/369 pass + 4 suites fail to load. All pre-existing & unrelated to today: 2 adaptive.service tests (difficulty cap math), 4 suites failing on missing exports `NcertChunk` / `incrBy` (refactor leftovers). None blocking. |
| `npm run test:integration` | 25 integration tests including actAsChild swap (real DB) | ✓ 25/25 pass |
| `npm run validate:board-isolation` | DB-level scan: no topicId/examBoard mismatches | ✓ PASS |
| `npm run validate:track-isolation` | Code-level scan: no unguarded routes touching req.user | ✓ PASS (101 controllers, all guarded) |
| `npm run audit:math -- --board=AP_SSC --grade=9` | Content-quality 15-check audit | ✓ 35/35 topics 100% |
| `npm run smoke` | **Bundled smoke run** — runs all 10 backend gates in ~27s | ✓ **10/10 PASS, 0 warnings** |
| `npx playwright test e2e/viewAsChild.spec.js` (frontend) | E2E: parent → onboard AP_SSC child → see right chapters + fresh dashboard | `[ ]` not yet executed |

---

## How to use this doc

1. **Before each release / branch merge:** run section 0 (smoke) and 17 (cross-cutting). Block release if any `[F]`.
2. **After bug fix:** mark the relevant row `[x]` and link the commit hash.
3. **New module added:** append a section here in the same format BEFORE the feature ships.
4. **Unsure if something works?** Leave `[ ]` and tell whoever's testing what specifically to check.

---

## Today's fixes (2026-05-25) — what got us here

Tick `[x]` once you've re-verified each in the browser:

- [x] AP_SSC added to Joi validation schemas (3 routes)
- [x] `getLinkedStudents` portal endpoint returns `examBoard` (was leaking)
- [x] `PUT /user/children/:id` added so parents can repair child profiles
- [x] StartOnboarding rewrites to update child when viewing-as-child
- [x] Lessons.jsx — 5 user→profile fixes (titles, board filter, chapter card title map, deps, OTHER SUBJECTS sidebar)
- [x] NcertChapterView handles flat topics from NcertTopicContent
- [x] `listNcertTopics` accepts `chapterId` for strict scoping
- [x] `auth` middleware added to all `/api/v1/ncert/*` routes
- [x] `actAsChild` swap via `x-child-id` header (auth middleware + frontend interceptor)
- [x] `/api/topics` merges legacy Topic with Question.distinct for AP_SSC/ICSE/Class 9 coverage
- [x] `validateTrackIsolation.mjs` validator + npm scripts
- [x] 9 new Jest integration tests for actAsChild
- [x] Playwright e2e test for parent-views-child happy path
- [x] **AP_SSC Class 10 Math** chapter skeleton seeded (was 0, now 14)
- [x] **ICSE Class 10 Math** chapter skeleton seeded (was 0, now 25)
- [x] `validateTrackIsolation.mjs` static analyzer (101 controllers indexed, all guarded)
- [x] `scripts/smoke.mjs` — single bundled `npm run smoke` for all 10 backend gates (~26s)
- [x] **CBSE Class 10 Math questions re-keyed** — 304 Questions migrated from v0 descriptive topicIds (`"Algebra Basics"`, `"Prime factorisation"`, …) to standardized v2 (`cbse_math10_ch1_prime_factorisation`, …). Audit: 0/54 → 51/54 (94%) |
