import { jest } from "@jest/globals";

const mockExists          = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindOne         = jest.fn();
const mockFindById        = jest.fn();
const mockFind            = jest.fn();
const mockProfileFindOne  = jest.fn();
const mockStreakFindOne   = jest.fn();
const mockBadgeFind       = jest.fn();

const mockNoop = jest.fn().mockResolvedValue([]);

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    exists:            mockExists,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findOne:           mockFindOne,
    findById:          mockFindById,
    find:              mockFind,
  },
  UserProfile:      { findOne: mockProfileFindOne },
  Streak:           { findOne: mockStreakFindOne  },
  Badge:            { find:    mockBadgeFind      },
  Attempt:          { find: mockNoop, countDocuments: mockNoop },
  Topic:            { find: mockNoop },
  ExamAttempt:      { find: mockNoop },
  DoubtThread:      { find: mockNoop },
  Question:         { find: mockNoop },
  WeeklyLeaderboard:{ find: mockNoop },
}));

jest.unstable_mockModule("../models/lessonModel.js", () => ({
  LessonProgress: { find: mockNoop },
}));

const ctrl = await import("../controllers/portalController.js");

const VALID_STUDENT_ID = "507f1f77bcf86cd799439011";
const VALID_PARENT_ID  = "507f191e810c19729de860ea";

function mockReqRes(params = {}, body = {}, userId = VALID_PARENT_ID, role = "parent") {
  const req  = { params, body, user: { id: userId, role } };
  const res  = { json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

// findById().select() chainable mock
const findByIdSelect = (doc) => ({ select: jest.fn().mockResolvedValue(doc) });

afterEach(() => jest.clearAllMocks());

describe("linkStudentDirect", () => {
  test("parent with valid studentId → student linked, returns student data", async () => {
    mockFindById.mockReturnValue(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Bob", grade: "10", subject: "Math", role: "student" }));
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(res.json.mock.calls[0][0].student.name).toBe("Bob");
    expect(next).not.toHaveBeenCalled();
  });

  test("student role → 403 AppError", async () => {
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "student");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("invalid ObjectId → 400 AppError", async () => {
    const { req, res, next } = mockReqRes({}, { studentId: "notanid" }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("self-link → 400 AppError", async () => {
    mockFindById.mockReturnValue(findByIdSelect({ _id: VALID_PARENT_ID, name: "Self", grade: "10", subject: "Math" }));
    const { req, res, next } = mockReqRes({}, { studentId: VALID_PARENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("student not found → 404 AppError", async () => {
    mockFindById.mockReturnValue(findByIdSelect(null));
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  test("teacher role → also allowed", async () => {
    mockFindById.mockReturnValue(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Alice", grade: "10", subject: "Math" }));
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "teacher");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next).not.toHaveBeenCalled();
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
