import { jest } from "@jest/globals";

const mockSessionGet = jest.fn();
const mockSessionSet = jest.fn();
const mockFindById   = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: mockSessionGet,
  sessionSet: mockSessionSet,
}));
jest.unstable_mockModule("../models/index.js", () => ({
  User: { findById: mockFindById },
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), debug: jest.fn(), error: jest.fn() },
}));

const { adminAuth } = await import("../middleware/adminAuth.js");
import jwt from "jsonwebtoken";

const SECRET = "a-very-long-test-secret-key-32ch";

beforeEach(() => {
  process.env.JWT_SECRET = SECRET;
  mockSessionGet.mockResolvedValue(null);
  mockSessionSet.mockResolvedValue(null);
});

afterEach(() => jest.clearAllMocks());

function makeToken(id) {
  return jwt.sign({ id, jti: "jti123" }, SECRET, { expiresIn: "1d" });
}

function mockReqRes(token) {
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

describe("adminAuth middleware", () => {
  test("valid admin JWT + DB role=admin → next() called", async () => {
    const token = makeToken("admin1");
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve({ role: "admin" }) }) });
    const { req, res, next } = mockReqRes(token);
    await adminAuth(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  test("valid JWT + DB role=student → 403", async () => {
    const token = makeToken("user1");
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve({ role: "student" }) }) });
    const { req, res, next } = mockReqRes(token);
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("user deleted from DB → 401", async () => {
    const token = makeToken("gone1");
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve(null) }) });
    const { req, res, next } = mockReqRes(token);
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("Redis cache hit (admin) → next() called, DB not queried", async () => {
    const token = makeToken("admin2");
    mockSessionGet.mockResolvedValue("admin");
    const { req, res, next } = mockReqRes(token);
    await adminAuth(req, res, next);
    expect(mockFindById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test("Redis cache hit (student) → 403, DB not queried", async () => {
    const token = makeToken("user2");
    mockSessionGet.mockResolvedValue("student");
    const { req, res, next } = mockReqRes(token);
    await adminAuth(req, res, next);
    expect(mockFindById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("invalid JWT → 401", async () => {
    const { req, res, next } = mockReqRes("not.a.valid.token");
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
