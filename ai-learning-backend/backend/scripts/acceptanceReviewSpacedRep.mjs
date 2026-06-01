#!/usr/bin/env node
/**
 * Pro-track Java — Spaced Repetition acceptance (ROADMAP F7).
 *
 * SM-2 is time-dependent: a freshly-completed topic is due in 1 day, so we
 * can't "wait" in a test. Instead we backdate a topicReviews entry directly
 * in Mongo (the honest equivalent of advancing the clock), then exercise the
 * real HTTP routes through the full middleware stack:
 *
 *   GET  /v1/pro/review/due           — backdated topic shows up
 *   POST /v1/pro/review/:topicId      — "got_it" advances interval 1→3
 *   GET  /v1/pro/review/due           — topic no longer due (interval reset clock)
 *   POST /v1/pro/review/:topicId      — "rusty" resets interval to 1
 *
 * Honors the api-round-trip lesson: this is a live request through
 * validate(reviewBodySchema) + validateParams(topicParamsSchema), not a
 * service-only unit test.
 *
 * Assumes: backend up on $BACKEND_URL, MONGO_URI set, test user allowed.
 * Usage: node scripts/acceptanceReviewSpacedRep.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";
const TRACK      = "pro_java";
const TOPIC      = "java_m30_t1";   // exists, has a name + pattern_match exercises

let cookies = "";
async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(cookies ? { Cookie: cookies } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookies = setCookie.split(";")[0] + "; " + (cookies || "");
  let payload; try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}

const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 58)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA — Spaced Repetition acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Auth + enrol ────────────────────────────────────────────────────────────
let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}
r = await http("POST", "/v1/pro/enroll", { trackKey: TRACK });
step("Enrol in pro_java (idempotent)", r.status === 200);

// ── Backdate a review entry directly in Mongo (simulate elapsed time) ───────
await mongoose.connect(process.env.MONGO_URI);
const users = mongoose.connection.collection("users");
const progs = mongoose.connection.collection("proprogresses");
const user  = await users.findOne({ email: TEST_EMAIL });
const uid   = user?._id?.toString();
step("Located test user in Mongo", !!uid, uid ? "" : "user not found");

const twoDaysAgo = new Date(Date.now() - 2 * 86400000);
// Ensure the progress doc exists, then replace any existing entry for TOPIC
// with a backdated one (intervalDays=1, lastReviewedAt=2d ago → overdue).
await progs.updateOne({ userId: uid, trackKey: TRACK }, { $setOnInsert: { completedExercises: [], totalXp: 0 } }, { upsert: true });
await progs.updateOne({ userId: uid, trackKey: TRACK }, { $pull: { topicReviews: { topicId: TOPIC } } });
await progs.updateOne({ userId: uid, trackKey: TRACK },
  { $push: { topicReviews: { topicId: TOPIC, completedAt: twoDaysAgo, lastReviewedAt: twoDaysAgo, intervalDays: 1, reps: 0 } } });
step("Seeded backdated review entry (1d interval, 2d ago)", true);

// ── TEST 1 — backdated topic appears in the due queue ───────────────────────
console.log("\nTEST 1 — GET /review/due surfaces the overdue topic");
r = await http("GET", `/v1/pro/review/due?trackKey=${TRACK}`);
let dueList = r.payload?.data || [];
let entry = dueList.find((t) => t.topicId === TOPIC);
step("due returns 200", r.status === 200, `count=${dueList.length}`);
step("backdated topic is due", !!entry);
step("due entry carries a human name", !!entry?.name, `name="${entry?.name || ""}"`);
step("overdueDays reported (~1)", (entry?.overdueDays ?? -1) >= 1, `overdueDays=${entry?.overdueDays}`);

// ── TEST 2 — "got_it" advances the interval 1 → 3 ───────────────────────────
console.log("\nTEST 2 — POST /review/:topicId got_it advances 1→3d");
r = await http("POST", `/v1/pro/review/${TOPIC}`, { trackKey: TRACK, rating: "got_it" });
step("record returns 200 (validator accepts body+param)", r.status === 200, `status=${r.status}`);
step("intervalDays advanced to 3", r.payload?.data?.intervalDays === 3, `intervalDays=${r.payload?.data?.intervalDays}`);
step("reps incremented to 1", r.payload?.data?.reps === 1, `reps=${r.payload?.data?.reps}`);

// ── TEST 3 — after review, topic is no longer due ───────────────────────────
console.log("\nTEST 3 — reviewed topic drops out of the due queue");
r = await http("GET", `/v1/pro/review/due?trackKey=${TRACK}`);
dueList = r.payload?.data || [];
step("topic no longer due (lastReviewedAt reset to now)", !dueList.find((t) => t.topicId === TOPIC));

// ── TEST 4 — "rusty" resets the interval to 1 ───────────────────────────────
console.log("\nTEST 4 — rusty resets interval to 1d");
// Backdate again so it's due, keeping the advanced interval (3d).
await progs.updateOne({ userId: uid, trackKey: TRACK, "topicReviews.topicId": TOPIC },
  { $set: { "topicReviews.$.lastReviewedAt": twoDaysAgo, "topicReviews.$.intervalDays": 3 } });
r = await http("POST", `/v1/pro/review/${TOPIC}`, { trackKey: TRACK, rating: "rusty" });
step("record returns 200", r.status === 200);
step("intervalDays reset to 1", r.payload?.data?.intervalDays === 1, `intervalDays=${r.payload?.data?.intervalDays}`);
step("reps reset to 0", r.payload?.data?.reps === 0, `reps=${r.payload?.data?.reps}`);

// ── TEST 5 — validator rejects a bad rating ─────────────────────────────────
console.log("\nTEST 5 — bad rating is rejected (422), not silently accepted");
r = await http("POST", `/v1/pro/review/${TOPIC}`, { trackKey: TRACK, rating: "maybe" });
step("invalid rating → 422", r.status === 422, `status=${r.status}`);

// ── Cleanup ─────────────────────────────────────────────────────────────────
await progs.updateOne({ userId: uid, trackKey: TRACK }, { $pull: { topicReviews: { topicId: TOPIC } } });
await mongoose.disconnect();

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — Spaced Repetition verified end-to-end");
}
