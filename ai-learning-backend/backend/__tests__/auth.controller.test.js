import { jest } from "@jest/globals";

const mockFindOne          = jest.fn();
const mockFindById         = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockCreate           = jest.fn();

const mockBcryptHash       = jest.fn();
const mockBcryptCompare    = jest.fn();
const mockJwtSign          = jest.fn();

const mockSessionSet       = jest.fn();
const mockSessionGet       = jest.fn();
const mockSessionDel       = jest.fn();

const mockSendEmail        = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    findOne:           mockFindOne,
    findById:          mockFindById,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    create:            mockCreate,
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: { hash: mockBcryptHash, compare: mockBcryptCompare },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: mockJwtSign },
}));

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionSet: mockSessionSet,
  sessionGet: mockSessionGet,
  sessionDel: mockSessionDel,
}));

jest.unstable_mockModule("../utils/email.js", () => ({
  sendEmail: mockSendEmail,
}));

const ctrl = await import("../controllers/authController.js");

function mockReqRes(body = {}, cookies = {}) {
  const req  = { body, cookies, params: {}, user: null };
  const res  = { json: jest.fn(), status: jest.fn().mockReturnThis(), cookie: jest.fn(), clearCookie: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

const makeUser = (overrides = {}) => ({
  _id: "u1", name: "Alice", email: "a@b.com",
  password: "hashed", loginAttempts: 0, lockUntil: null, ...overrides,
});

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret-that-is-long-enough-32ch";
  mockBcryptHash.mockResolvedValue("hashed_password");
  mockJwtSign.mockReturnValue("mock.jwt.token");
  mockSessionSet.mockResolvedValue(null);
  mockSessionGet.mockResolvedValue(null);
  mockSessionDel.mockResolvedValue(null);
});

afterEach(() => jest.clearAllMocks());

// ── register ────────────────────────────────────────────────────────

describe("register", () => {
  test("duplicate email → 409 AppError", async () => {
    mockFindOne.mockResolvedValue({ _id: "u0", email: "a@b.com" });
    const { req, res, next } = mockReqRes({ name: "A", email: "a@b.com", password: "pass1234" });
    await ctrl.register(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(409);
  });

  test("new user → creates user, sets access+refresh cookies, returns user", async () => {
    mockFindOne.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ _id: "u2", name: "Bob", email: "b@c.com", role: "student" });
    const { req, res, next } = mockReqRes({ name: "Bob", email: "b@c.com", password: "pass1234" });
    await ctrl.register(req, res, next);
    expect(mockCreate).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("token", expect.any(String), expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Object) }));
    expect(next).not.toHaveBeenCalled();
  });
});

// ── login ─────────────────────────────────────────────────────────

describe("login", () => {
  test("unknown email → 401 with generic message (no enumeration)", async () => {
    mockFindOne.mockReturnValue({ select: () => Promise.resolve(null) });
    const { req, res, next } = mockReqRes({ email: "no@one.com", password: "x" });
    await ctrl.login(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(next.mock.calls[0][0].message).toBe("Invalid email or password.");
  });

  test("locked account → 429 with minutes-remaining message", async () => {
    const locked = makeUser({ lockUntil: new Date(Date.now() + 10 * 60_000) });
    mockFindOne.mockReturnValue({ select: () => Promise.resolve(locked) });
    const { req, res, next } = mockReqRes({ email: "a@b.com", password: "x" });
    await ctrl.login(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(429);
  });

  test("wrong password → 401 generic + increments loginAttempts", async () => {
    mockFindOne.mockReturnValue({ select: () => Promise.resolve(makeUser()) });
    mockBcryptCompare.mockResolvedValue(false);
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({ email: "a@b.com", password: "wrong" });
    await ctrl.login(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(401);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      "u1", { $set: expect.objectContaining({ loginAttempts: 1 }) }
    );
  });

  test("10th failed attempt → sets lockUntil in the future", async () => {
    mockFindOne.mockReturnValue({ select: () => Promise.resolve(makeUser({ loginAttempts: 9 })) });
    mockBcryptCompare.mockResolvedValue(false);
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({ email: "a@b.com", password: "wrong" });
    await ctrl.login(req, res, next);
    const { $set } = mockFindByIdAndUpdate.mock.calls[0][1];
    expect($set.lockUntil).toBeInstanceOf(Date);
    expect($set.lockUntil.getTime()).toBeGreaterThan(Date.now());
  });

  test("correct password → resets attempts and issues cookies", async () => {
    mockFindOne.mockReturnValue({ select: () => Promise.resolve(makeUser({ loginAttempts: 3 })) });
    mockBcryptCompare.mockResolvedValue(true);
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({ email: "a@b.com", password: "correct" });
    await ctrl.login(req, res, next);
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith("u1", { $set: { loginAttempts: 0, lockUntil: null } });
    expect(res.cookie).toHaveBeenCalledWith("token", expect.any(String), expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });
});

// ── refresh ────────────────────────────────────────────────────────

describe("refresh", () => {
  test("no refreshToken cookie → 401", async () => {
    const { req, res, next } = mockReqRes({}, {});
    await ctrl.refresh(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("token not in Redis (expired/invalid) → 401", async () => {
    mockSessionGet.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({}, { refreshToken: "stale-token" });
    await ctrl.refresh(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("valid token → rotates refresh token and returns user", async () => {
    mockSessionGet.mockResolvedValue("user123");
    mockFindById.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ _id: "user123", name: "A", email: "a@b.com", role: "student" }) }),
    });
    const { req, res, next } = mockReqRes({}, { refreshToken: "valid-raw-token" });
    await ctrl.refresh(req, res, next);
    expect(mockSessionDel).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("token", expect.any(String), expect.any(Object));
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

// ── logout ─────────────────────────────────────────────────────────

describe("logout", () => {
  test("blacklists JTI, invalidates refresh token, clears both cookies", async () => {
    const req = {
      body: {}, params: {},
      cookies: { refreshToken: "raw-refresh" },
      user: { jti: "test-jti", exp: Math.floor(Date.now() / 1000) + 3600 },
    };
    const res = { json: jest.fn(), clearCookie: jest.fn() };
    const next = jest.fn();
    await ctrl.logout(req, res, next);
    expect(mockSessionSet).toHaveBeenCalledWith(
      expect.stringContaining("token_blacklist:test-jti"), "1", expect.any(Number)
    );
    expect(mockSessionDel).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalled();
  });
});

// ── forgotPassword ─────────────────────────────────────────────────

describe("forgotPassword", () => {
  test("unknown email → 200 with generic message (no info leak)", async () => {
    mockFindOne.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ email: "nope@x.com" });
    await ctrl.forgotPassword(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ data: { message: expect.stringContaining("reset link") } });
    expect(next).not.toHaveBeenCalled();
  });

  test("valid email → sends email and responds 200", async () => {
    const userDoc = {
      _id: "u1", name: "Alice <script>", email: "a@b.com",
      passwordResetToken: null, passwordResetExpires: null,
      save: jest.fn().mockResolvedValue({}),
    };
    mockFindOne.mockResolvedValue(userDoc);
    mockSendEmail.mockResolvedValue({});
    const { req, res, next } = mockReqRes({ email: "a@b.com" });
    await ctrl.forgotPassword(req, res, next);
    expect(mockSendEmail).toHaveBeenCalled();
    // HTML in email must have escaped the <script> tag
    const htmlArg = mockSendEmail.mock.calls[0][0].html;
    expect(htmlArg).not.toContain("<script>");
    expect(res.json).toHaveBeenCalled();
  });
});

// ── resetPassword ──────────────────────────────────────────────────

describe("resetPassword", () => {
  test("invalid/expired token → 400 AppError", async () => {
    mockFindOne.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ password: "newpass123" });
    req.params = { token: "badtoken" };
    await ctrl.resetPassword(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("valid token → hashes new password and sets pwdChangedAt", async () => {
    const userDoc = {
      _id: "u1", password: "old",
      passwordResetToken: "hashed", passwordResetExpires: new Date(Date.now() + 10_000),
      pwdChangedAt: null, loginAttempts: 5, lockUntil: new Date(),
      save: jest.fn().mockResolvedValue({}),
    };
    mockFindOne.mockResolvedValue(userDoc);
    const { req, res, next } = mockReqRes({ password: "NewPass123!" });
    req.params = { token: "valid-raw-token" };
    await ctrl.resetPassword(req, res, next);
    expect(userDoc.pwdChangedAt).toBeInstanceOf(Date);
    expect(userDoc.loginAttempts).toBe(0);
    expect(userDoc.lockUntil).toBeNull();
    expect(res.json).toHaveBeenCalled();
  });
});
