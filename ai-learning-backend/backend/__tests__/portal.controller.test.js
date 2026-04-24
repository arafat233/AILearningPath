import { jest } from "@jest/globals";

const mockExists          = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindOne         = jest.fn();
const mockFindById        = jest.fn();
const mockFind            = jest.fn();
const mockProfileFindOne  = jest.fn();
const mockStreakFindOne   = jest.fn();
const mockBadgeFind       = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    exists:           mockExists,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findOne:          mockFindOne,
    findById:         mockFindById,
    find:             mockFind,
  },
  UserProfile: { findOne: mockProfileFindOne },
  Streak:      { findOne: mockStreakFindOne   },
  Badge:       { find:    mockBadgeFind       },
}));

const ctrl = await import("../controllers/portalController.js");

function mockReqRes(params = {}, body = {}, userId = "requester1") {
  const req  = { params, body, user: { id: userId } };
  const res  = { json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

afterEach(() => jest.clearAllMocks());

describe("generateInvite", () => {
  test("generates 8-char uppercase code and updates user", async () => {
    mockExists.mockResolvedValue(false);
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes();
    await ctrl.generateInvite(req, res, next);
    const code = res.json.mock.calls[0][0].inviteCode;
    expect(code).toMatch(/^[A-F0-9]{8}$/);
  });

  test("retries on collision and eventually succeeds", async () => {
    // First call: collision, second: unique
    mockExists.mockResolvedValueOnce(true).mockResolvedValue(false);
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes();
    await ctrl.generateInvite(req, res, next);
    expect(mockExists.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(res.json).toHaveBeenCalled();
  });
});

// linkStudent calls User.findOne(...).select(...) — needs chainable mock
const findOneSelect = (doc) => ({ select: () => Promise.resolve(doc) });

describe("linkStudent", () => {
  test("valid code → student linked", async () => {
    mockFindOne.mockReturnValue(findOneSelect({ _id: "student1", name: "Bob", email: "b@c.com" }));
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({}, { inviteCode: "ABCD1234" }, "parent1");
    await ctrl.linkStudent(req, res, next);
    expect(res.json.mock.calls[0][0].student.name).toBe("Bob");
  });

  test("self-link → 400 AppError", async () => {
    mockFindOne.mockReturnValue(findOneSelect({ _id: "requester1", name: "Self" }));
    const { req, res, next } = mockReqRes({}, { inviteCode: "SELF1234" }, "requester1");
    await ctrl.linkStudent(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("invalid code → 404 AppError", async () => {
    mockFindOne.mockReturnValue(findOneSelect(null));
    const { req, res, next } = mockReqRes({}, { inviteCode: "BADCODE1" });
    await ctrl.linkStudent(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });
});

describe("getStudentAnalytics", () => {
  const VALID_ID = "507f1f77bcf86cd799439011"; // valid ObjectId

  test("invalid ObjectId → 400 AppError", async () => {
    const { req, res, next } = mockReqRes({ studentId: "not-an-id" });
    await ctrl.getStudentAnalytics(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("non-owner → 403 AppError", async () => {
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve({ linkedStudents: [], role: "parent" }) }) });
    const { req, res, next } = mockReqRes({ studentId: VALID_ID });
    await ctrl.getStudentAnalytics(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("owner → 200 with profile/streak/badges", async () => {
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve({ linkedStudents: [VALID_ID], role: "parent" }) }) });
    mockProfileFindOne.mockReturnValue({ lean: () => Promise.resolve({ accuracy: 0.8 }) });
    mockStreakFindOne.mockReturnValue({ lean: () => Promise.resolve({ currentStreak: 5 }) });
    mockBadgeFind.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([]) }) });
    const { req, res, next } = mockReqRes({ studentId: VALID_ID });
    await ctrl.getStudentAnalytics(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("admin → 200 regardless of linkedStudents", async () => {
    mockFindById.mockReturnValue({ select: () => ({ lean: () => Promise.resolve({ linkedStudents: [], role: "admin" }) }) });
    mockProfileFindOne.mockReturnValue({ lean: () => Promise.resolve({}) });
    mockStreakFindOne.mockReturnValue({ lean: () => Promise.resolve({}) });
    mockBadgeFind.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([]) }) });
    const { req, res, next } = mockReqRes({ studentId: VALID_ID });
    await ctrl.getStudentAnalytics(req, res, next);
    expect(res.json).toHaveBeenCalled();
  });
});
