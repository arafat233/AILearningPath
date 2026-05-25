// Unit tests for middleware/featureFlag.js — the email-allowlist gate
// that PRO_TRACK_PLAN.md §3 decision #5 requires on /api/v1/pro/* during
// the internal pilot.

import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const mockUserFindById = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: { findById: mockUserFindById },
}));

const { requireEmailAllowlist } = await import("../middleware/featureFlag.js");

function withSelect(value) {
  return { select: () => ({ lean: () => Promise.resolve(value) }) };
}

function reqRes(userId, originalUrl = "/api/v1/pro/tracks") {
  const req = { user: userId ? { id: userId } : null, originalUrl };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

beforeEach(() => jest.clearAllMocks());
afterEach(() => { delete process.env.PILOT_TEST; });

describe("requireEmailAllowlist", () => {
  test("env unset → 403 with 'not enabled' message", async () => {
    delete process.env.PILOT_TEST;
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(`u-${Math.random().toString(36).slice(2)}`);
    await mw(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
    expect(next.mock.calls[0][0].message).toMatch(/not enabled/i);
  });

  test("env = '*' → open to any authenticated user (no DB lookup)", async () => {
    process.env.PILOT_TEST = "*";
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(`u-${Math.random().toString(36).slice(2)}`);
    await mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(mockUserFindById).not.toHaveBeenCalled();
  });

  test("email in allowlist → next() called", async () => {
    process.env.PILOT_TEST = "alice@test.dev, BOB@TEST.DEV";
    mockUserFindById.mockReturnValueOnce(withSelect({ email: "alice@test.dev" }));
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(`u-${Math.random().toString(36).slice(2)}`);
    await mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("email NOT in allowlist → 403", async () => {
    process.env.PILOT_TEST = "alice@test.dev";
    mockUserFindById.mockReturnValueOnce(withSelect({ email: "stranger@evil.dev" }));
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(`u-${Math.random().toString(36).slice(2)}`);
    await mw(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("case-insensitive + whitespace tolerant allowlist match", async () => {
    process.env.PILOT_TEST = "  Alice@Test.DEV ,  bob@test.dev  ";
    mockUserFindById.mockReturnValueOnce(withSelect({ email: "ALICE@test.dev" }));
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(`u-${Math.random().toString(36).slice(2)}`);
    await mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("no req.user → 401", async () => {
    process.env.PILOT_TEST = "alice@test.dev";
    const mw = requireEmailAllowlist("PILOT_TEST");
    const { req, res, next } = reqRes(null);
    await mw(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("second call within TTL skips DB (cached positive)", async () => {
    process.env.PILOT_TEST = "alice@test.dev";
    mockUserFindById.mockReturnValueOnce(withSelect({ email: "alice@test.dev" }));
    const mw = requireEmailAllowlist("PILOT_TEST");
    const first  = reqRes("u-cache");
    await mw(first.req, first.res, first.next);
    const second = reqRes("u-cache");
    await mw(second.req, second.res, second.next);
    expect(mockUserFindById).toHaveBeenCalledTimes(1); // only first call hit DB
    expect(second.next).toHaveBeenCalledWith();
  });
});
