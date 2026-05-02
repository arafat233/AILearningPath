// Integration tests — hit a real in-memory MongoDB to prove the atomic
// $cond pipeline in checkAndIncrementUsage actually prevents over-counting
// under concurrent load. Unit tests mock Mongoose and cannot verify this.

import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import mongoose from "mongoose";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";
import { checkAndIncrementUsage } from "../../services/aiRouter.js";

const TODAY = new Date().toISOString().split("T")[0];

const makeUser = (overrides = {}) =>
  User.create({
    name:  "Test User",
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    password: "hashed",
    aiCallsToday: 0,
    aiCallsDate: TODAY,
    plan: "free",
    isPaid: false,
    ...overrides,
  });

beforeAll(connectTestDB,  120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

// ── Atomicity ────────────────────────────────────────────────────────

describe("checkAndIncrementUsage — real MongoDB atomicity", () => {
  test("20 concurrent free-user calls from 0 → exactly 10 succeed (limit enforced)", async () => {
    const user = await makeUser({ aiCallsToday: 0 });
    const id = user._id.toString();

    const results = await Promise.all(
      Array.from({ length: 20 }, () => checkAndIncrementUsage(id))
    );

    expect(results.filter(Boolean)).toHaveLength(10);
    expect(results.filter(r => !r)).toHaveLength(10);

    const saved = await User.findById(id).lean();
    expect(saved.aiCallsToday).toBe(10);
  });

  test("10 concurrent calls with 2 slots left (8/10) → exactly 2 succeed", async () => {
    const user = await makeUser({ aiCallsToday: 8 });
    const id = user._id.toString();

    const results = await Promise.all(
      Array.from({ length: 10 }, () => checkAndIncrementUsage(id))
    );

    expect(results.filter(Boolean)).toHaveLength(2);

    const saved = await User.findById(id).lean();
    expect(saved.aiCallsToday).toBe(10);
  });

  test("already at free limit → all calls rejected, DB count unchanged", async () => {
    const user = await makeUser({ aiCallsToday: 10 });
    const id = user._id.toString();

    const results = await Promise.all(
      Array.from({ length: 5 }, () => checkAndIncrementUsage(id))
    );

    expect(results.every(r => !r)).toBe(true);

    const saved = await User.findById(id).lean();
    expect(saved.aiCallsToday).toBe(10); // never exceeded
  });

  test("pro user — 15 concurrent calls at 0/100 → all 15 succeed", async () => {
    const user = await makeUser({ aiCallsToday: 0, isPaid: true, plan: "pro" });
    const id = user._id.toString();

    const results = await Promise.all(
      Array.from({ length: 15 }, () => checkAndIncrementUsage(id))
    );

    expect(results.filter(Boolean)).toHaveLength(15);

    const saved = await User.findById(id).lean();
    expect(saved.aiCallsToday).toBe(15);
  });

  test("stale date resets counter — concurrent calls on new day all start fresh", async () => {
    const user = await makeUser({ aiCallsToday: 10, aiCallsDate: "2000-01-01" });
    const id = user._id.toString();

    // Even though yesterday's count was 10, today is a new day — quota resets
    const results = await Promise.all(
      Array.from({ length: 5 }, () => checkAndIncrementUsage(id))
    );

    // All 5 succeed because the counter resets to 0 on a new day
    expect(results.filter(Boolean)).toHaveLength(5);

    const saved = await User.findById(id).lean();
    expect(saved.aiCallsToday).toBe(5);
    expect(saved.aiCallsDate).toBe(TODAY);
  });

  test("user not found → returns false without throwing", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const result = await checkAndIncrementUsage(fakeId);
    expect(result).toBe(false);
  });
});

// ── Per-plan limits ──────────────────────────────────────────────────

describe("checkAndIncrementUsage — plan limits on real DB", () => {
  test("free limit is 10", async () => {
    const user = await makeUser({ aiCallsToday: 9, plan: "free" });
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(true);  // 10th call OK
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(false); // 11th rejected
  });

  test("pro limit is 100", async () => {
    const user = await makeUser({ aiCallsToday: 99, isPaid: true, plan: "pro" });
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(true);  // 100th OK
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(false); // 101st rejected
  });

  test("premium limit is 500", async () => {
    const user = await makeUser({ aiCallsToday: 499, isPaid: true, plan: "premium" });
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(true);  // 500th OK
    expect(await checkAndIncrementUsage(user._id.toString())).toBe(false); // 501st rejected
  });
});
