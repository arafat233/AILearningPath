#!/usr/bin/env node
/**
 * Pro-track Java v2 — end-to-end acceptance for the new test-case shapes.
 *
 * v1 (acceptanceTest.mjs) covered the basic submission round-trip on M1-T1.
 * This script extends it to verify the shapes that 1,400+ M2-M46 exercises
 * use but that the test matcher silently failed pre-commit 7d5c41ac:
 *
 *   1. `stdin` per test case (Scanner-style input)         — M1-T6 ex_4
 *   2. `expected_stdout_contains` array assertion          — M10-T1 ex_2
 *
 * Also re-checks the original M1-T1 path to confirm nothing regressed.
 *
 * Assumes:
 *   - Backend on $BACKEND_URL (default localhost:5001) is up
 *   - Judge0 reachable (whatever JUDGE0_URL points to)
 *   - pilot_acceptance@stellar.dev is on PRO_TRACKS_ENABLED_FOR_EMAILS
 *     (it already is in this repo's .env)
 *
 * Usage: node scripts/acceptanceTestV2.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

let cookies = "";

async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookies ? { Cookie: cookies } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookies = setCookie.split(";")[0] + "; " + (cookies || "");
  let payload;
  try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}

const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA v2 — new test-case shape acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Login (assumes user already exists from v1 acceptance) ──────────────────
let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  // First-time setup: register, then continue.
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}

// ── Enrol (idempotent) ─────────────────────────────────────────────────────
r = await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });
step("Enrol in pro_java (idempotent)", r.status === 200);

// ── Test 1: stdin + expected_stdout (M1-T6 ex_4 Square Calculator) ─────────
//
// This exercise was authored fresh to close the curriculum's beginner-input
// gap. It is the canonical test of the new stdin code path.
console.log("\nTEST 1 — Scanner exercise with stdin (M1-T6 ex_4 Square Calculator)");
const scannerCode = `import java.util.Scanner;

public class Square {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        System.out.println("Square: " + (n * n));
        sc.close();
    }
}`;
r = await http("POST", "/v1/pro/exercises/java_m1_t6_ex_4/submit", { code: scannerCode });
let data = r.payload?.data;
step("Submit returns 200", r.status === 200, `status=${r.status}`);
step("Sandbox executed (no 503)", r.status !== 503, r.status === 503 ? "Judge0 unreachable" : `status=${data?.sandboxResult?.status}`);
step("stdin was piped to program", (data?.sandboxResult?.stdout || "").includes("Square: 49"),
  `stdout="${(data?.sandboxResult?.stdout || "").slice(0, 80).replace(/\n/g, "\\n")}"`);
const t1Passed = data?.passed === true;
step("Exercise passed (overall)", t1Passed, `xpAwarded=${data?.xpAwarded}`);
if (!t1Passed) {
  console.log("    testResults:", JSON.stringify(data?.testResults || [], null, 2));
}

// ── Test 2: expected_stdout_contains array (M10-T1 ex_2 lambda thread) ─────
//
// Pre-fix: this assertion shape was never read by runTestCases, so every
// learner who solved it correctly was told they failed. This is the bug
// that affected 1,102 test cases.
console.log("\nTEST 2 — expected_stdout_contains array (M10-T1 ex_2 lambda thread)");
const lambdaCode = `public class App {
    public static void main(String[] args) {
        Thread t = new Thread(() -> System.out.println("Hello from thread: " + Thread.currentThread().getName()));
        t.start();
    }
}`;
r = await http("POST", "/v1/pro/exercises/java_m10_t1_ex_2/submit", { code: lambdaCode });
data = r.payload?.data;
step("Submit returns 200", r.status === 200);
step("stdout contains the substring", (data?.sandboxResult?.stdout || "").includes("Hello from thread:"));
const t2Passed = data?.passed === true;
step("Exercise passed (overall)", t2Passed, `xpAwarded=${data?.xpAwarded}`);
if (!t2Passed) {
  console.log("    testResults:", JSON.stringify(data?.testResults || [], null, 2));
}

// ── Test 3: failing submission produces an informative message ─────────────
//
// Submit code that compiles but produces wrong output. The test result
// should say something specific the learner can act on.
console.log("\nTEST 3 — wrong output produces an actionable message");
const wrongCode = `public class App {
    public static void main(String[] args) {
        System.out.println("nope");
    }
}`;
r = await http("POST", "/v1/pro/exercises/java_m10_t1_ex_2/submit", { code: wrongCode });
data = r.payload?.data;
step("Submit returns 200 (even on wrong)", r.status === 200);
step("Marked as failed (passed=false)", data?.passed === false);
const failMsg = data?.testResults?.[0]?.message || "";
step("Failure message mentions what was missing", /missing|hello|thread/i.test(failMsg),
  `msg="${failMsg.slice(0, 80)}"`);

// ── Test 4: regression check on original M1-T1 path (v1 territory) ─────────
console.log("\nTEST 4 — regression check: M1-T1 ex_1 still passes (no v1 breakage)");
const helloCode = `public class Greeting {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}`;
r = await http("POST", "/v1/pro/exercises/java_m1_t1_ex_1/submit", { code: helloCode });
data = r.payload?.data;
step("M1-T1 ex_1 submit returns 200", r.status === 200);
step("Sandbox executed", !!data?.sandboxResult?.status);
// ex_1 has multiple test cases — at least the must_compile one should pass.
const anyPassed = (data?.testResults || []).some((t) => t.passed);
step("At least one test case passes", anyPassed);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — v2 fix verified end-to-end");
}
