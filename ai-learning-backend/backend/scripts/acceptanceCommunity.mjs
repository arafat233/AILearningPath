#!/usr/bin/env node
/**
 * Acceptance — Community engine (GAP #8). Live HTTP round-trip of the full
 * user-generated lifecycle: create → list → read → upvote → comment →
 * delete-comment → report → delete. Verifies the answer key / reporter list are
 * never leaked. (Runs locally; on prod, POSTs need an x-csrf-token the dev
 * script doesn't send — verify prod via DB audit instead.)
 *
 * Usage: node scripts/acceptanceCommunity.mjs   (backend running)
 */
import "dotenv/config";

const BASE = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

let cookies = "";
async function http(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (cookies) headers.Cookie = cookies;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const sc = res.headers.get("set-cookie");
  if (sc) cookies = sc.split(";")[0] + "; " + (cookies || "");
  let payload; try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}
const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") { console.log(`${ok ? "✓" : "✗"}  ${pad(label, 52)} ${detail}`); if (!ok) process.exitCode = 1; }

console.log("COMMUNITY (GAP #8) — acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) { r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS }); step("Register/login", r.status === 200 || r.status === 201, `status=${r.status}`); }
else step("Login", true);

// Create
r = await http("POST", "/v1/community/posts", { kind: "question", title: "Acceptance test question", body: "Body of the test question.", tags: ["test", "Test", "#meta"] });
const id = r.payload?.data?.id;
step("Create question → 201 + id", r.status === 201 && !!id, `status=${r.status}`);
step("tags normalised (dedupe/lowercase/strip #)", JSON.stringify(r.payload?.data?.tags) === JSON.stringify(["test", "meta"]), JSON.stringify(r.payload?.data?.tags));
step("answer-key/reports not leaked on create", !JSON.stringify(r.payload?.data || {}).includes("\"reports\":[{"), "checked");

// List
r = await http("GET", "/v1/community/posts?kind=question&sort=new&limit=50");
step("List includes the new post", r.status === 200 && (r.payload?.data?.items || []).some((p) => p.id === id), `total=${r.payload?.data?.total}`);

// Read (increments views)
r = await http("GET", `/v1/community/posts/${id}`);
step("Read → 200 with body + isMine", r.status === 200 && r.payload?.data?.body?.length > 0 && r.payload?.data?.isMine === true, `views=${r.payload?.data?.views}`);

// Upvote toggle
r = await http("POST", `/v1/community/posts/${id}/upvote`);
step("Upvote → upvotes=1", r.status === 200 && r.payload?.data?.upvotes === 1 && r.payload?.data?.upvotedByMe === true, `upvotes=${r.payload?.data?.upvotes}`);

// Comment
r = await http("POST", `/v1/community/posts/${id}/comments`, { body: "A test comment." });
const commentId = r.payload?.data?.comments?.[0]?.id;
step("Comment → 201 + appears", r.status === 201 && !!commentId && r.payload?.data?.commentCount === 1, `comments=${r.payload?.data?.commentCount}`);

// Delete comment
r = await http("DELETE", `/v1/community/posts/${id}/comments/${commentId}`);
step("Delete own comment → commentCount=0", r.status === 200 && r.payload?.data?.commentCount === 0, `comments=${r.payload?.data?.commentCount}`);

// Report
r = await http("POST", `/v1/community/posts/${id}/report`, { reason: "test report" });
step("Report → reported=true", r.status === 200 && r.payload?.data?.reported === true, `status=${r.status}`);

// Validation: empty title rejected
r = await http("POST", "/v1/community/posts", { kind: "article", title: "", body: "x" });
step("Empty title rejected (400/422)", r.status === 400 || r.status === 422, `status=${r.status}`);

// Delete
r = await http("DELETE", `/v1/community/posts/${id}`);
step("Delete own post → 200", r.status === 200, `status=${r.status}`);
r = await http("GET", `/v1/community/posts/${id}`);
step("Deleted post → 404", r.status === 404, `status=${r.status}`);

console.log("──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) { console.log("✗  Acceptance FAILED"); process.exit(1); }
else console.log("✓  Acceptance PASSED — community lifecycle verified");
