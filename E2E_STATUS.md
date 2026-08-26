# E2E Suite — Status & Handoff

**Last worked:** 2026-08-26 · **Current: 16 passed / 0 failed** (was 4 passed / 4 failed)

The suite is green locally — 16/16 on three consecutive runs. If it fails for you, the
cause is almost always missing fixtures: read **Running it locally** first, especially
the seeding step.

---

## Running it locally (Windows or otherwise)

The suite needs four things up. Nothing in the repo starts them for you.

```bash
# 1. Mongo (any Mongo works; Docker is just convenient)
docker run -d --name stellar-e2e-mongo -p 27017:27017 mongo:7

# 2. Fixtures — REQUIRED. Without these, 5 tests fail for missing data, not bugs.
cd ai-learning-backend/backend
set MONGO_URI=mongodb://localhost:27017/ai_learning_e2e     # PowerShell: $env:MONGO_URI="..."
node config/seedE2eFixtures.js          # creates test@ailearn.dev / TestPassword1!
node config/seedApSscMath9NcertChapters.js   # the 12 chapter records
npm run seed:ap-ssc-math9-content-all        # topics for ALL 12 — see note below (~8s)

# 3. Backend. Secrets MUST be >=32 chars or validateEnv exits before listen()
#    and the server dies silently — see "CI was running against no backend" below.
set JWT_SECRET=test_secret_for_ci_only_padded_to_32_plus_chars
set JWT_REFRESH_SECRET=refresh_secret_for_ci_only_padded_to_32_plus
set NODE_ENV=test
set PORT=5001
set FRONTEND_URL=http://localhost:4173
node server.js

# 4. Frontend + tests (second terminal)
cd ai-learning-frontend/frontend
set VITE_API_URL=http://localhost:5001/api
npm run build
npx vite preview --port 4173
set PLAYWRIGHT_BASE_URL=http://localhost:4173
npx playwright test --retries=0 --reporter=line
```

Seed **all 12** chapters, not just ch1: `/lessons` renders only chapters that have
topics, so ch1 alone shows "1 chapters" and `viewAsChild`'s 12-title assertion fails.

`NODE_ENV=test` matters beyond convention: it relaxes the auth rate limiters
(`routes/authRoutes.js`). Production caps are 10 logins/15min and 5 registrations/hour
per IP. The suite logs in on every `beforeEach` from one IP, so a full run with CI's
`retries: 2` needs ~18 logins and the limiter — not the code under test — decides whether
it passes. Production limits are unchanged.

---

## Previously failing — all resolved 2026-08-26

**`practice.spec.js` › sign-out.** The app was fine; the test was wrong. Sign out lives
inside the account dropdown (`Layout.jsx:492`) and is not in the DOM until it is opened,
so clicking it directly waited out the full 30s. The test now opens the trigger first —
the avatar button, `aria-label="Account menu"`.

**`viewAsChild.spec.js` › both tests.** Two causes stacked, which is why they looked
harder than they were:

1. *Hardcoded port.* Both waits matched `/^http:\/\/localhost:5173\//` — the Vite dev
   port. CI serves the built app with `vite preview` on 4173 via `PLAYWRIGHT_BASE_URL`,
   so neither could ever match. They match on pathname now.
2. *Only chapter 1 was seeded.* `/lessons` renders only chapters that have topics, so
   with `seedApSscMath9Ch01.js` alone the page reported "1 chapters" and the spec's
   12-title assertion failed on "Polynomials". The API was returning all 12 the whole
   time — the gap was topics, not chapters. CI now seeds all 12
   (`npm run seed:ap-ssc-math9-content-all`, ~8s).

**`practice.spec.js` › navigate to Practice page — was flaky.** Never reproduced after
the fixture and `login()` fixes; passed 3/3 consecutive full runs. It was most likely the
login race, not the practice page.


## Fixed in this pass

| Was | Now |
|---|---|
| `auth.spec.js` 4 failed / 4 passed | **8 passed** |
| Whole suite 4 passed / 4 failed (local), 11/5 (CI) | **12–13 passed / 3–4 failed** |

**CI was running against no backend.** `ci.yml` set `JWT_SECRET: test_secret_for_ci_only`
— 23 characters. `utils/validateEnv.js` requires >=32 and exits *before* `listen()`, so
`node server.js &` died on startup and every backend-dependent assertion ran against
nothing. There was no failing step to point at it. Fixed in #6.

**Login/register omitted `tracks` and `linkedStudents`** (`authController.safeUser`).
Two real user-facing bugs, not just test failures:

- `App.jsx`'s `OnboardingGate`/`RootElement` treat `tracks` as the source of truth for
  "did this user onboard" — its own comment says so. Absent from the payload, it read as
  empty and **bounced fully-onboarded users to `/welcome` on every login**.
- `Login.jsx` routes to `/onboarding` vs `/child-picker` on `linkedStudents`. Always
  empty, so **a parent with children never reached the child picker**.

`GET /user/me` already returned both; this only made login/register consistent with it.

**`practice.spec.js` login helper never waited.** It ended with
`waitForURL(/dashboard|\//)` — that alternation matches *any* path containing a slash,
including `/login`, so it resolved instantly and returned before the request was sent.
Tests that navigated immediately raced the auth cookie and booted unauthenticated onto
the marketing landing page. `App.jsx` calls `getMe()` once at boot, so a page that starts
unauthenticated stays that way — which is why this surfaced as a 30s click timeout rather
than a login error.

**Missing fixtures.** `practice.spec.js` documents `E2E_EMAIL`/`E2E_PASSWORD` in its own
header, but nothing ever created that account and `ci.yml` points at a fresh
`ai_learning_e2e`. Added `config/seedE2eFixtures.js` (idempotent; refuses any database
whose name lacks `e2e`/`test`, since it writes a known-password account).

---

## CI seeding — now wired

`ci.yml`'s e2e job runs the three fixture seeds between "Start backend" and "Install
frontend dependencies". This landed with the same change that fixed `login()`, and it
had to: once the helper genuinely waits for a 200, a missing fixture account stops
being survivable. Before the fix CI sailed past the failed login unauthenticated and
some tests passed by accident — that run read 11 passed / 5 failed. With an honest
login and no fixtures it read 8 passed / 8 failed. Neither number described the code;
both described whether the suite noticed it was logged out.


## Unrelated, still red

`Workers Builds: crackit` fails on `main` too — an external Cloudflare Workers project
wired to this repo, with no corresponding code here. Worth disconnecting if it is dead.
