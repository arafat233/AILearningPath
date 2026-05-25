// Unit tests for middleware/trackFilter.js — the User.tracks-based
// enrolment gate that scopes /api/v1/pro/* to enrolled users.

import { jest, describe, test, expect, beforeEach } from "@jest/globals";

const mockUserFindOne = jest.fn();
jest.unstable_mockModule("../models/index.js", () => ({
  User: { findOne: mockUserFindOne },
}));

const { isEnrolled, requireEnrolled, invalidateEnrolment } =
  await import("../middleware/trackFilter.js");

const TRACK = "pro_java";
const uid = () => `u-${Math.random().toString(36).slice(2)}`;

beforeEach(() => jest.clearAllMocks());

describe("isEnrolled", () => {
  test("returns true when User has tracks entry with matching key", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve({ _id: "u1" }) });
    const u = uid();
    await expect(isEnrolled(u, TRACK)).resolves.toBe(true);
  });

  test("returns false when no matching tracks entry", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve(null) });
    const u = uid();
    await expect(isEnrolled(u, TRACK)).resolves.toBe(false);
  });

  test("returns false when userId or trackKey missing", async () => {
    await expect(isEnrolled(null, TRACK)).resolves.toBe(false);
    await expect(isEnrolled("u1", null)).resolves.toBe(false);
    expect(mockUserFindOne).not.toHaveBeenCalled();
  });

  test("caches the positive result — second call skips DB", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve({ _id: "u1" }) });
    const u = uid();
    await isEnrolled(u, TRACK);
    await isEnrolled(u, TRACK);
    expect(mockUserFindOne).toHaveBeenCalledTimes(1);
  });

  test("invalidateEnrolment clears one (user, track) cache entry", async () => {
    mockUserFindOne
      .mockReturnValueOnce({ lean: () => Promise.resolve({ _id: "u1" }) })
      .mockReturnValueOnce({ lean: () => Promise.resolve(null) });
    const u = uid();
    await expect(isEnrolled(u, TRACK)).resolves.toBe(true);
    invalidateEnrolment(u, TRACK);
    await expect(isEnrolled(u, TRACK)).resolves.toBe(false);
    expect(mockUserFindOne).toHaveBeenCalledTimes(2);
  });
});

describe("requireEnrolled middleware", () => {
  function reqRes(userId, trackKey) {
    const req  = { user: userId ? { id: userId } : null, params: { trackKey } };
    const res  = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    return { req, res, next };
  }

  test("no req.user → 401", async () => {
    const mw = requireEnrolled("trackKey");
    const { req, res, next } = reqRes(null, TRACK);
    await mw(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  test("missing trackKey in params → 400", async () => {
    const mw = requireEnrolled("trackKey");
    const { req, res, next } = reqRes(uid(), undefined);
    await mw(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("enrolled user → next() with no args", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve({ _id: "u1" }) });
    const mw = requireEnrolled("trackKey");
    const { req, res, next } = reqRes(uid(), TRACK);
    await mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("not enrolled → 403", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve(null) });
    const mw = requireEnrolled("trackKey");
    const { req, res, next } = reqRes(uid(), TRACK);
    await mw(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("getTrackKey can be a function reading from anywhere on req", async () => {
    mockUserFindOne.mockReturnValueOnce({ lean: () => Promise.resolve({ _id: "u1" }) });
    const mw = requireEnrolled((req) => req.body?.trackKey);
    const u = uid();
    const req  = { user: { id: u }, params: {}, body: { trackKey: TRACK } };
    const res  = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
