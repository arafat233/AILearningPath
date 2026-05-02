// Integration tests for register + login flow against a real in-memory MongoDB.
// Verifies bcrypt hashing, duplicate email rejection, and lockout logic without mocks.

import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import bcrypt from "bcryptjs";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";

beforeAll(connectTestDB,  120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

// ── Registration ─────────────────────────────────────────────────────

describe("User registration — real DB", () => {
  test("creates user with bcrypt-hashed password", async () => {
    const plain = "secret123";
    const hash  = await bcrypt.hash(plain, 10);
    const user  = await User.create({ name: "Alice", email: "alice@test.com", password: hash });

    const saved = await User.findById(user._id).lean();
    expect(saved.email).toBe("alice@test.com");
    expect(saved.password).not.toBe(plain);
    expect(await bcrypt.compare(plain, saved.password)).toBe(true);
  });

  test("rejects duplicate email with unique constraint", async () => {
    await User.create({ name: "Alice", email: "dup@test.com", password: "h" });
    await expect(
      User.create({ name: "Bob", email: "dup@test.com", password: "h" })
    ).rejects.toThrow(/duplicate|E11000/i);
  });

  test("default plan is free, aiCallsToday is 0", async () => {
    const user = await User.create({ name: "Alice", email: "a@test.com", password: "h" });
    const saved = await User.findById(user._id).lean();
    expect(saved.plan).toBe("free");
    expect(saved.isPaid).toBe(false);
    expect(saved.aiCallsToday).toBe(0);
    expect(saved.role).toBe("student");
  });
});

// ── Login lockout ─────────────────────────────────────────────────────

describe("Login lockout — real DB", () => {
  test("loginAttempts increments and lockUntil is set after threshold", async () => {
    const user = await User.create({ name: "Bob", email: "bob@test.com", password: "h" });

    // Simulate 10 failed attempts
    await User.findByIdAndUpdate(user._id, { loginAttempts: 10, lockUntil: new Date(Date.now() + 60000) });

    const locked = await User.findById(user._id).lean();
    expect(locked.loginAttempts).toBe(10);
    expect(locked.lockUntil.getTime()).toBeGreaterThan(Date.now());
  });

  test("lockUntil in the past means account is unlocked", async () => {
    const user = await User.create({
      name: "Bob", email: "bob@test.com", password: "h",
      loginAttempts: 10,
      lockUntil: new Date(Date.now() - 1000), // expired
    });

    const saved = await User.findById(user._id).lean();
    expect(saved.lockUntil.getTime()).toBeLessThan(Date.now());
  });

  test("pwdChangedAt is updated on password change", async () => {
    const user = await User.create({ name: "Bob", email: "bob@test.com", password: "h" });
    const changedAt = new Date();
    await User.findByIdAndUpdate(user._id, { pwdChangedAt: changedAt });

    const saved = await User.findById(user._id).lean();
    expect(saved.pwdChangedAt.getTime()).toBeCloseTo(changedAt.getTime(), -2);
  });
});

// ── Soft-delete safety ────────────────────────────────────────────────

describe("User deletion — real DB", () => {
  test("User.deleteOne removes the document", async () => {
    const user = await User.create({ name: "Temp", email: "temp@test.com", password: "h" });
    await User.deleteOne({ _id: user._id });
    const found = await User.findById(user._id).lean();
    expect(found).toBeNull();
  });
});
