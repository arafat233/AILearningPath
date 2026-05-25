// Integration tests for the "view as child" middleware swap.
//
// Verifies the contract today's fix established. Calls the `auth` middleware
// directly with a constructed (req, res, next) and asserts the mutations on
// req. No HTTP layer required — supertest isn't a dependency here.
//
//   - When a parent sends x-child-id and owns that child, downstream code
//     sees req.user.id = childId and req.parentUserId = parentId.
//   - When the parent does NOT own the child, the swap silently fails
//     (no privilege escalation).
//   - Routes in CHILD_SWAP_SKIP_PREFIXES (portal, admin, /user/me, etc.)
//     are never swapped, even with a valid x-child-id.
//   - The header check accepts only mongo ObjectIds (no junk DB lookups).
//
// Uses a real in-memory MongoDB so the linkedStudents ownership check is
// actually exercised end-to-end.

import { beforeAll, afterAll, beforeEach, describe, test, expect, jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";
import { auth } from "../../middleware/auth.js";

const SECRET = "a-very-long-test-secret-key-32ch";

beforeAll(async () => {
  process.env.JWT_SECRET = SECRET;
  await connectTestDB();
}, 120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

function tokenFor(userId) {
  return jwt.sign({ id: String(userId) }, SECRET, { expiresIn: "1d" });
}

// Build a fake req/res/next triple the way Express would. originalUrl matters
// because the skip-prefix check reads it; cookies/headers carry the JWT and
// the x-child-id; status/json on res are spied so 401 paths are detectable.
function makeReqRes({ originalUrl, jwtToken, childIdHeader } = {}) {
  const req = {
    originalUrl: originalUrl || "/api/v1/ncert/topics",
    cookies:     jwtToken ? { token: jwtToken } : {},
    headers:     childIdHeader ? { "x-child-id": childIdHeader } : {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json:   jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
}

describe("actAsChild middleware swap", () => {
  test("parent who owns child → swap fires, req.user.id = childId, req.parentUserId = parentId", async () => {
    const child  = await User.create({ name: "Nayak", email: "n@test", password: "h", role: "student" });
    const parent = await User.create({ name: "Najeeb", email: "p@test", password: "h", role: "parent", linkedStudents: [child._id.toString()] });

    const { req, res, next } = makeReqRes({
      jwtToken:      tokenFor(parent._id),
      childIdHeader: child._id.toString(),
    });
    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(res.status).not.toHaveBeenCalled();
    expect(req.user.id).toBe(child._id.toString());
    expect(req.parentUserId).toBe(parent._id.toString());
  });

  test("no x-child-id header → no swap, req.user.id = parentId", async () => {
    const parent = await User.create({ name: "P", email: "p@test", password: "h" });
    const { req, res, next } = makeReqRes({ jwtToken: tokenFor(parent._id) });

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user.id).toBe(parent._id.toString());
    expect(req.parentUserId).toBeUndefined();
  });

  test("parent does NOT own claimed child → swap silently skipped (no privilege escalation)", async () => {
    const stranger = await User.create({ name: "Stranger", email: "s@test", password: "h" });
    const parent   = await User.create({ name: "P", email: "p@test", password: "h", linkedStudents: [] });

    const { req, res, next } = makeReqRes({
      jwtToken:      tokenFor(parent._id),
      childIdHeader: stranger._id.toString(),
    });
    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user.id).toBe(parent._id.toString());
    expect(req.parentUserId).toBeUndefined();
  });

  test("invalid x-child-id (not an ObjectId) → swap silently skipped, no DB lookup", async () => {
    const parent = await User.create({ name: "P", email: "p@test", password: "h" });
    const { req, res, next } = makeReqRes({
      jwtToken:      tokenFor(parent._id),
      childIdHeader: "not-an-objectid",
    });

    await auth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user.id).toBe(parent._id.toString());
  });

  test("skip-list path /api/portal/* → swap is NEVER attempted, even if owned", async () => {
    const child  = await User.create({ name: "C", email: "c@test", password: "h" });
    const parent = await User.create({ name: "P", email: "p@test", password: "h", linkedStudents: [child._id.toString()] });

    const { req, res, next } = makeReqRes({
      originalUrl:   "/api/portal/students",
      jwtToken:      tokenFor(parent._id),
      childIdHeader: child._id.toString(),
    });
    await auth(req, res, next);

    // Portal endpoints need parent identity (list children, set controls).
    expect(req.user.id).toBe(parent._id.toString());
    expect(req.parentUserId).toBeUndefined();
  });

  test("skip-list path /api/user/me → swap is NEVER attempted (Settings stays parent)", async () => {
    const child  = await User.create({ name: "C", email: "c@test", password: "h" });
    const parent = await User.create({ name: "P", email: "p@test", password: "h", linkedStudents: [child._id.toString()] });

    const { req, res, next } = makeReqRes({
      originalUrl:   "/api/user/me",
      jwtToken:      tokenFor(parent._id),
      childIdHeader: child._id.toString(),
    });
    await auth(req, res, next);

    expect(req.user.id).toBe(parent._id.toString());
  });

  test("skip-list path /api/user/children → swap is NEVER attempted (managing the list itself)", async () => {
    const child  = await User.create({ name: "C", email: "c@test", password: "h" });
    const parent = await User.create({ name: "P", email: "p@test", password: "h", linkedStudents: [child._id.toString()] });

    const { req, res, next } = makeReqRes({
      originalUrl:   "/api/user/children",
      jwtToken:      tokenFor(parent._id),
      childIdHeader: child._id.toString(),
    });
    await auth(req, res, next);

    expect(req.user.id).toBe(parent._id.toString());
  });

  test("x-child-id equals JWT userId → swap is a no-op", async () => {
    const user = await User.create({ name: "U", email: "u@test", password: "h" });
    const { req, res, next } = makeReqRes({
      jwtToken:      tokenFor(user._id),
      childIdHeader: user._id.toString(),
    });

    await auth(req, res, next);

    expect(req.user.id).toBe(user._id.toString());
    expect(req.parentUserId).toBeUndefined();
  });

  test("no JWT cookie → 401, swap never reached", async () => {
    const child = await User.create({ name: "C", email: "c@test", password: "h" });
    const { req, res, next } = makeReqRes({
      childIdHeader: child._id.toString(),
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
