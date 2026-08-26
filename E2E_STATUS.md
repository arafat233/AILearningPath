# E2E Suite — Status & Handoff

**Last worked:** 2026-08-25 · **Current:** 12–13 passed / 3–4 failed (was 4 passed / 4 failed)

Picking this up on another machine? Read **Running it locally** first — the suite needs
seeded fixtures that nothing creates automatically, which is why it looked broken.

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
node config/seedApSscMath9NcertChapters.js   # 12 chapters  — viewAsChild asserts these
node config/seedApSscMath9Ch01.js            # 4 topics/ch1 — viewAsChild asserts these

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

`NODE_ENV=test` matters beyond convention: it relaxes the auth rate limiters
(`routes/authRoutes.js`). Production caps are 10 logins/15min and 5 registrations/hour
per IP. The suite logs in on every `beforeEach` from one IP, so a full run with CI's
`retries: 2` needs ~18 logins and the limiter — not the code under test — decides whether
it passes. Production limits are unchanged.

---

## Still failing — 3 known, 1 flaky

### 1. `practice.spec.js` › Navigation › sign-out returns to login page

**App is fine; the test is wrong.** The test clicks Sign out directly:

```js
await page.getByRole("button", { name: /sign out|logout/i }).click();
```

But Sign out lives *inside the user dropdown* (`Layout.jsx:492`), rendered only when
`userOpen` is true. It does not exist in the DOM until the avatar menu is opened, so the
click waits the full 30s.

**Fix:** open the menu first. The trigger is the avatar button in the sidebar footer —
find its accessible name in `Layout.jsx` around line 440, click that, then click Sign out.

### 2 & 3. `viewAsChild.spec.js` › both tests

Both time out on `waitForURL` after the onboarding step. The hardcoded-port bug is
already fixed (they pinned `localhost:5173`; CI serves `vite preview` on 4173), and the
page snapshot at failure shows the app working correctly — sidebar renders, header reads
`AP_SSC · Class 9`, so **registration and child onboarding both succeed**.

What is left is the wait *after* "Continue to Dashboard": the URL never settles to `/`
within 15s. Worth checking whether the app lands somewhere else now (`/child-picker` is
plausible, since `linkedStudents` is populated for a parent and `Login.jsx` routes on it).
Start by dropping a `console.log(page.url())` right after the click.

### 4. `practice.spec.js` › Practice flow › navigate to Practice page — FLAKY

Passes in isolation and in most full runs; failed in one. Not diagnosed. Suspect
test-order interference or a slow first-load of the practice bundle.

---

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
