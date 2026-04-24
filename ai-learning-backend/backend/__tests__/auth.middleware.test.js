import { jest } from "@jest/globals";

const mockSessionGet = jest.fn();
const mockFindById  = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: mockSessionGet,
}));
jest.unstable_mockModule("../models/index.js", () => ({
  User: { findById: mockFindById },
}));

const { auth } = await import("../middleware/auth.js");
import jwt from "jsonwebtoken";

const SECRET = "a-very-long-test-secret-key-32ch";

function mockReqRes(overrides = {}) {
  const req = { cookies: {}, headers: {}, ...overrides };
  const res = {
    status: jest.fn().mockReturnThis(),
    json:   jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
}

function makeToken(payload, expiresIn = "1d") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
  mockSessionGet.mockResolvedValue(null);
  mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve(null) }) });
});

afterEach(() => jest.clearAllMocks());

describe("auth middleware", () => {
  test("valid JWT in cookie → req.user populated, next() called", async () => {
    const token = makeToken({ id: "user1", jti: "abc" });
    const { req, res, next } = mockReqRes({ cookies: { token } });
    await auth(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user.id).toBe("user1");
  });

  test("valid JWT in Authorization header fallback → next() called", async () => {
    const token = makeToken({ id: "user1", jti: "abc" });
    const { req, res, next } = mockReqRes({ headers: { authorization: `Bearer ${token}` } });
    await auth(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("expired JWT → 401 Invalid token", async () => {
    const token = makeToken({ id: "user1", jti: "abc" }, "-1s");
    const { req, res, next } = mockReqRes({ cookies: { token } });
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  test("tampered signature → 401 Invalid token", async () => {
    const token = makeToken({ id: "user1", jti: "abc" }) + "tampered";
    const { req, res, next } = mockReqRes({ cookies: { token } });
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("missing cookie and no header → 401 No token", async () => {
    const { req, res, next } = mockReqRes();
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token" });
  });

  test("blacklisted JTI → 401 Token has been revoked", async () => {
    const token = makeToken({ id: "user1", jti: "blacklisted-jti" });
    mockSessionGet.mockResolvedValue("1"); // blacklisted
    const { req, res, next } = mockReqRes({ cookies: { token } });
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token has been revoked" });
  });

  test("token issued before pwdChangedAt → 401 Password changed", async () => {
    const issuedAt = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
    const token    = jwt.sign({ id: "user1", jti: "xyz", iat: issuedAt }, SECRET, { expiresIn: "1d" });
    const future   = new Date(Date.now() - 1800 * 1000); // 30 min ago (after token issue)
    mockFindById.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ pwdChangedAt: future }) }),
    });
    const { req, res, next } = mockReqRes({ cookies: { token } });
    await auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Password changed — please log in again" });
  });
});
