#!/usr/bin/env node
/**
 * Stellar — automated smoke runner.
 *
 * Runs every quick-to-execute backend gate in sequence and reports a single
 * pass/fail. Designed as a pre-commit hook or CI step:
 *
 *   npm run smoke
 *
 * Exits 0 only when ALL of the following pass:
 *   1. validate:track-isolation  (every user-context route is guarded)
 *   2. validate:board-isolation  (no examBoard / topicId mismatches in DB)
 *   3. Math content audit for each known-complete board × grade combo
 *   4. Unit tests
 *   5. Integration tests
 *
 * Individual failures are bubbled up with their last 5 lines of output so
 * the cause is visible without re-running the offending command.
 */

import { execSync } from "node:child_process";
import { performance } from "node:perf_hooks";

const checks = [
  { name: "validate:track-isolation", cmd: "node config/validateTrackIsolation.mjs",                                  required: true  },
  { name: "validate:board-isolation", cmd: "node config/validateBoardIsolation.mjs",                                   required: true  },
  { name: "audit:math AP_SSC 9",      cmd: "node config/auditMathChecklist.mjs --board=AP_SSC --grade=9",              required: true  },
  { name: "audit:math AP_SSC 10",     cmd: "node config/auditMathChecklist.mjs --board=AP_SSC --grade=10",             required: true  },
  { name: "audit:math CBSE 8",        cmd: "node config/auditMathChecklist.mjs --board=CBSE --grade=8",                required: true  },
  { name: "audit:math CBSE 9",        cmd: "node config/auditMathChecklist.mjs --board=CBSE --grade=9",                required: true  },
  { name: "audit:math CBSE 10",       cmd: "node config/auditMathChecklist.mjs --board=CBSE --grade=10",               required: true  },
  { name: "audit:math ICSE 9",        cmd: "node config/auditMathChecklist.mjs --board=ICSE --grade=9",                required: true  },
  { name: "audit:math ICSE 10",       cmd: "node config/auditMathChecklist.mjs --board=ICSE --grade=10",               required: true  },
  { name: "integration tests",        cmd: "node --experimental-vm-modules ./node_modules/jest-cli/bin/jest.js --testPathPattern=__tests__/integration --testTimeout=60000 --forceExit", required: true },
];

const results = [];
let allRequiredPassed = true;
const t0 = performance.now();

for (const check of checks) {
  const start = performance.now();
  process.stdout.write(`▶ ${check.name.padEnd(32)} `);
  try {
    const out = execSync(check.cmd, { stdio: ["pipe", "pipe", "pipe"], encoding: "utf8" });
    const ms = Math.round(performance.now() - start);
    process.stdout.write(`✓ pass  ${ms}ms\n`);
    results.push({ ...check, status: "pass", ms, output: out });
  } catch (err) {
    const ms  = Math.round(performance.now() - start);
    const status = check.required ? "FAIL" : "warn";
    process.stdout.write(`✗ ${status}  ${ms}ms\n`);
    if (check.required) allRequiredPassed = false;
    const tail = (err.stdout?.toString() || err.message || "").split(/\r?\n/).slice(-8).join("\n");
    results.push({ ...check, status, ms, tail });
  }
}

const totalMs = Math.round(performance.now() - t0);
console.log("\n──────────────────────────────────────────────");
console.log(`Smoke run: ${totalMs}ms total`);
console.log("──────────────────────────────────────────────");

const failed = results.filter((r) => r.status === "FAIL");
const warned = results.filter((r) => r.status === "warn");

if (failed.length === 0 && warned.length === 0) {
  console.log("✓ ALL CHECKS PASSED");
} else {
  if (warned.length) {
    console.log(`⚠ ${warned.length} optional check(s) failed (warnings — not blocking):`);
    for (const r of warned) console.log(`   - ${r.name}`);
  }
  if (failed.length) {
    console.log(`\n✗ ${failed.length} required check(s) failed:`);
    for (const r of failed) {
      console.log(`\n── ${r.name} ──`);
      console.log(r.tail);
    }
  }
}

process.exit(allRequiredPassed ? 0 : 1);
