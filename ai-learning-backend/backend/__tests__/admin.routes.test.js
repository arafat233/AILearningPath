import { jest } from "@jest/globals";
import Joi from "joi";

// ── Auth / session mocks ──────────────────────────────────────────────────────
const mockSessionGet      = jest.fn();
const mockSessionSet      = jest.fn();
const mockUserFindById    = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: mockSessionGet,
  sessionSet: mockSessionSet,
  isUsingFallback: () => true,
}));
jest.unstable_mockModule("../models/index.js", () => ({
  User:     { findById: (id) => ({ select: () => ({ lean: () => mockUserFindById(id) }) }) },
  Question: { findOne: jest.fn() },
  Topic:    {},
  Coupon:   {},
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.unstable_mockModule("../utils/cookieNames.js", () => ({
  TOKEN_COOKIE:   "token",
  REFRESH_COOKIE: "refreshToken",
}));

const { adminAuth } = await import("../middleware/adminAuth.js");
const { validate }  = await import("../middleware/validate.js");

import jwt from "jsonwebtoken";

function makeToken(role, userId = "admin1") {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || "testsecret");
}

function mockRes() {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

beforeEach(() => {
  process.env.JWT_SECRET = "testsecret";
  mockSessionGet.mockResolvedValue(null);  // no cache hit by default
  mockSessionSet.mockResolvedValue(null);
});
afterEach(() => jest.clearAllMocks());

describe("adminAuth middleware — role enforcement", () => {
  test("admin role (from DB) → calls next()", async () => {
    mockUserFindById.mockResolvedValue({ role: "admin" });
    const req  = { cookies: { token: makeToken("admin") }, path: "/api/admin/users", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(); // no error arg
  });

  test("student role (from DB) → 403 forbidden, next not called", async () => {
    mockUserFindById.mockResolvedValue({ role: "student" });
    const req  = { cookies: { token: makeToken("student", "student1") }, path: "/api/admin/users", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("no token → 401 returned", async () => {
    const req  = { cookies: {}, headers: {}, path: "/api/admin/test", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("cached admin role in Redis → skips DB lookup", async () => {
    mockSessionGet.mockResolvedValue("admin");
    const req  = { cookies: { token: makeToken("admin") }, path: "/api/admin/users", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  test("cached non-admin role in Redis → 403 without DB lookup", async () => {
    mockSessionGet.mockResolvedValue("student");
    const req  = { cookies: { token: makeToken("student") }, path: "/api/admin/users", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(mockUserFindById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("tampered JWT → 401", async () => {
    const req  = { cookies: { token: "bad.jwt.token" }, headers: {}, path: "/api/admin/test", method: "GET" };
    const res  = mockRes();
    const next = jest.fn();
    await adminAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("validate middleware — question schema", () => {
  const questionSchema = Joi.object({
    questionText: Joi.string().min(5).max(2000).required(),
    questionType: Joi.string().valid("mcq", "numeric", "short_answer").required(),
    difficulty:   Joi.string().valid("easy", "medium", "hard").required(),
    subject:      Joi.string().required(),
    marks:        Joi.number().integer().min(1).max(10).required(),
  });

  const validator = validate(questionSchema);

  test("valid question payload → next() called without error", () => {
    const req = {
      body: {
        questionText: "What is 2 + 2?",
        questionType: "mcq",
        difficulty:   "easy",
        subject:      "Math",
        marks:        1,
      },
    };
    const next = jest.fn();
    validator(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(); // no AppError
  });

  test("missing required field → next called with 422 error", () => {
    const req = {
      body: {
        questionText: "What is 2 + 2?",
        // questionType missing
        difficulty:   "easy",
        subject:      "Math",
        marks:        1,
      },
    };
    const next = jest.fn();
    validator(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 422 }));
  });

  test("unknown field in body → next called with 422 (no extra fields allowed)", () => {
    const req = {
      body: {
        questionText: "What is 2 + 2?",
        questionType: "mcq",
        difficulty:   "easy",
        subject:      "Math",
        marks:        1,
        hackerField:  "DROP TABLE users;",
      },
    };
    const next = jest.fn();
    validator(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 422 }));
  });

  test("invalid difficulty value → next called with 422", () => {
    const req = {
      body: {
        questionText: "What is 2 + 2?",
        questionType: "mcq",
        difficulty:   "extreme", // invalid
        subject:      "Math",
        marks:        1,
      },
    };
    const next = jest.fn();
    validator(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 422 }));
  });
});
