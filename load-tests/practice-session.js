/**
 * k6 load test — concurrent practice sessions
 *
 * Scenario: N virtual users simultaneously start a practice session,
 * submit 5 answers each, and end the session.
 *
 * Install k6:  https://k6.io/docs/getting-started/installation/
 *
 * Run:
 *   k6 run load-tests/practice-session.js
 *   k6 run --vus 100 --duration 60s load-tests/practice-session.js
 *
 * Env vars:
 *   K6_BASE_URL    — default: http://localhost:5001/api
 *   K6_EMAIL       — seeded test user email
 *   K6_PASSWORD    — seeded test user password
 *   K6_TOPIC       — topic to practice (default: "Quadratic Equations")
 */

import http        from "k6/http";
import { check, sleep }   from "k6";
import { Trend, Counter } from "k6/metrics";

const BASE_URL = __ENV.K6_BASE_URL || "http://localhost:5001/api";
const EMAIL    = __ENV.K6_EMAIL    || "loadtest@ailearn.dev";
const PASSWORD = __ENV.K6_PASSWORD || "loadtest123";
const TOPIC    = __ENV.K6_TOPIC    || "Quadratic Equations";

// Custom metrics
const loginDuration    = new Trend("login_duration_ms",    true);
const startDuration    = new Trend("start_duration_ms",    true);
const submitDuration   = new Trend("submit_duration_ms",   true);
const sessionErrors    = new Counter("session_errors");

export const options = {
  stages: [
    { duration: "15s", target: 20  }, // ramp up to 20 VUs
    { duration: "30s", target: 100 }, // ramp up to 100 VUs
    { duration: "60s", target: 100 }, // sustain 100 VUs
    { duration: "15s", target: 0   }, // ramp down
  ],
  thresholds: {
    http_req_failed:       ["rate<0.02"],      // < 2% errors
    http_req_duration:     ["p(95)<2000"],     // 95th percentile < 2s
    start_duration_ms:     ["p(95)<1500"],
    submit_duration_ms:    ["p(95)<1000"],
  },
};

const JSON_HEADERS = { "Content-Type": "application/json" };

function post(path, body, cookies) {
  const headers = { ...JSON_HEADERS };
  if (cookies?.token)      headers["Cookie"]       = `token=${cookies.token}`;
  if (cookies?.csrfToken)  headers["x-csrf-token"] = cookies.csrfToken;
  return http.post(`${BASE_URL}${path}`, JSON.stringify(body), { headers });
}

export default function () {
  // ── 1. Login ─────────────────���──────────────────���───────────────────────────
  const loginStart = Date.now();
  const loginRes = post("/auth/login", { email: EMAIL, password: PASSWORD }, {});
  loginDuration.add(Date.now() - loginStart);

  if (!check(loginRes, { "login 200": (r) => r.status === 200 })) {
    sessionErrors.add(1);
    return;
  }

  const cookies = {
    token:     loginRes.cookies?.token?.[0]?.value,
    csrfToken: loginRes.cookies?.csrf?.[0]?.value,
  };

  // ── 2. Start practice session ───────��────────────────────────────────────────
  // First we need a topicId — fetch topics list
  const topicsRes = http.get(`${BASE_URL}/topics?q=${encodeURIComponent(TOPIC)}`, {
    headers: { Cookie: `token=${cookies.token}` },
  });

  if (!check(topicsRes, { "topics 200": (r) => r.status === 200 })) {
    sessionErrors.add(1);
    return;
  }

  const topics  = JSON.parse(topicsRes.body)?.data || [];
  const topicId = topics[0]?._id;
  if (!topicId) {
    sessionErrors.add(1);
    return; // topic not seeded — skip VU
  }

  const startTs = Date.now();
  const startRes = post("/practice/start", { topicId }, cookies);
  startDuration.add(Date.now() - startTs);

  if (!check(startRes, { "start 200": (r) => r.status === 200 })) {
    sessionErrors.add(1);
    return;
  }

  // ── 3. Submit 5 answers ─────────────────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    sleep(0.5 + Math.random() * 1.5); // simulate think-time 0.5–2s

    const submitTs  = Date.now();
    const submitRes = post("/practice/submit", {
      selectedOptionIndex: Math.floor(Math.random() * 4), // random guess
      timeTaken:           Math.floor(5 + Math.random() * 20),
      confidence:          ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    }, cookies);
    submitDuration.add(Date.now() - submitTs);

    check(submitRes, { "submit 200": (r) => r.status === 200 });
    if (submitRes.status !== 200) { sessionErrors.add(1); break; }
  }

  sleep(1);
}
