/**
 * smokeTestDsa.mjs — Execute every code_scratch exercise in the given DSA modules
 * on Judge0 (JDK 21 / language id 90) and verify each program compiles, runs, and
 * prints its expected_stdout_contains substrings. Read-only (submits code, asserts
 * output). Uses base64 encoding (handles non-ASCII like em-dashes) + token polling
 * + retry, and ignores "Note:" compiler warnings.
 *
 * Usage: node config/smokeTestDsa.mjs               # default M36–M41
 *        node config/smokeTestDsa.mjs java_m37 java_m38
 */
import "dotenv/config";
import mongoose from "mongoose";

const JUDGE0_URL = process.env.JUDGE0_URL;
const TOKEN = process.env.JUDGE0_AUTH_TOKEN;
const JAVA_ID = Number(process.env.JUDGE0_JAVA_LANGUAGE_ID) || 90; // JDK 21 (prod)
const POOL = 3; // modest concurrency to avoid the box's queue/rate fallback
const MODULES = process.argv.slice(2).filter(a => a.startsWith("java_m"));
const TARGET_MODULES = MODULES.length ? MODULES : ["java_m36","java_m37","java_m38","java_m39","java_m40","java_m41"];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const b64 = s => Buffer.from(s, "utf8").toString("base64");
const unb64 = s => (s ? Buffer.from(s, "base64").toString("utf8") : "");

function normalizeJava(source) {
  const m = source.match(/public\s+class\s+(\w+)/);
  if (!m) return source;
  const original = m[1];
  if (original === "Main") return source;
  const re = new RegExp([`"(?:\\\\.|[^"\\\\])*"`, `'(?:\\\\.|[^'\\\\])'`, `//[^\\n]*`, `/\\*[\\s\\S]*?\\*/`, `\\b${original}\\b`].join("|"), "g");
  return source.replace(re, mm => (mm === original ? "Main" : mm));
}

async function runJudge0(source) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": TOKEN },
      body: JSON.stringify({ source_code: b64(normalizeJava(source)), language_id: JAVA_ID, stdin: "" }),
    });
    const j = await res.json().catch(() => ({}));
    if (j.status && j.status.id > 2) return { status: j.status.description, stdout: unb64(j.stdout), compile: unb64(j.compile_output) };
    if (j.token) {
      for (let i = 0; i < 12; i++) {
        await sleep(1000);
        const g = await fetch(`${JUDGE0_URL}/submissions/${j.token}?base64_encoded=true`, { headers: { "X-Auth-Token": TOKEN } });
        const gj = await g.json().catch(() => ({}));
        if (gj.status && gj.status.id > 2) return { status: gj.status.description, stdout: unb64(gj.stdout), compile: unb64(gj.compile_output) };
      }
    }
    await sleep(2000);
  }
  return { status: "NO_RESULT_AFTER_RETRIES", stdout: "", compile: "" };
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");
  const docs = await E.find(
    { moduleId: { $in: TARGET_MODULES }, type: "code_scratch" },
    { projection: { exerciseId: 1, expectedSolution: 1, testCases: 1 } }
  ).sort({ exerciseId: 1 }).toArray();
  await mongoose.disconnect();

  const targets = docs.filter(d => (d.testCases || []).some(t => t.type === "execution" && Array.isArray(t.expected_stdout_contains)));
  console.log(`Smoke-testing ${targets.length} code_scratch exercises across ${TARGET_MODULES.join(", ")} (Judge0 lang ${JAVA_ID})...\n`);

  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < targets.length) {
      const d = targets[idx++];
      const needles = d.testCases.find(t => t.type === "execution").expected_stdout_contains;
      const r = await runJudge0(d.expectedSolution);
      const missing = needles.filter(n => !r.stdout.includes(n));
      let verdict;
      if (/error:/i.test(r.compile)) verdict = "COMPILE_FAIL";       // ignore "Note:" warnings
      else if (r.status !== "Accepted") verdict = "RUN:" + r.status;
      else if (missing.length) verdict = "OUTPUT_MISMATCH";
      else verdict = "PASS";
      results.push({ id: d.exerciseId, verdict, missing, stdout: r.stdout.slice(0, 160), compile: r.compile.slice(0, 160) });
      if (results.length % 15 === 0) console.log(`  ...${results.length}/${targets.length} done`);
    }
  }
  await Promise.all(Array.from({ length: POOL }, worker));

  const fail = results.filter(r => r.verdict !== "PASS");
  console.log(`\n=== RESULT: ${results.length - fail.length}/${results.length} PASS ===`);
  for (const f of fail.sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(`✗ ${f.id} — ${f.verdict}`);
    if (f.missing?.length) console.log(`   missing: ${JSON.stringify(f.missing)} | stdout: ${JSON.stringify(f.stdout)}`);
    if (f.compile) console.log(`   compile: ${f.compile.replace(/\n/g, " ")}`);
  }
  if (!fail.length) console.log("🎉 All DSA code_scratch exercises compile, run, and produce expected output.");
}
main().catch(e => { console.error(e); process.exit(1); });
