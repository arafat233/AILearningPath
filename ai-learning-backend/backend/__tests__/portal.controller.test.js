import { jest } from "@jest/globals";

const mockExists            = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindOne           = jest.fn();
const mockFindById          = jest.fn();
const mockFind              = jest.fn();
const mockProfileFindOne    = jest.fn();
const mockStreakFindOne      = jest.fn();
const mockBadgeFind         = jest.fn();

const mockLinkReqFindOne   = jest.fn();
const mockLinkReqCreate    = jest.fn();
const mockLinkReqFind      = jest.fn();
const mockLinkReqFindById  = jest.fn();

const mockNoop = jest.fn().mockResolvedValue([]);

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    exists:            mockExists,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findOne:           mockFindOne,
    findById:          mockFindById,
    find:              mockFind,
  },
  UserProfile:  { findOne: mockProfileFindOne },
  Streak:       { findOne: mockStreakFindOne  },
  Badge:        { find:    mockBadgeFind      },
  LinkRequest: {
    findOne:   mockLinkReqFindOne,
    create:    mockLinkReqCreate,
    find:      mockLinkReqFind,
    findById:  mockLinkReqFindById,
  },
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

// findById().select() — resolves directly when awaited
const findByIdSelect = (doc) => ({ select: jest.fn().mockResolvedValue(doc) });
// findById().select().lean() — for requester lookup
const findByIdSelectLean = (doc) => ({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) }) });

afterEach(() => jest.clearAllMocks());

describe("linkStudentDirect", () => {
  test("parent with valid studentId → creates pending request, returns status+student", async () => {
    mockFindById
      .mockReturnValueOnce(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Bob", grade: "10", subject: "Math", role: "student" }))
      .mockReturnValueOnce(findByIdSelectLean({ name: "Parent", linkedStudents: [] }));
    mockLinkReqFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    mockLinkReqCreate.mockResolvedValue({ _id: "req-id-1" });
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(res.json.mock.calls[0][0].status).toBe("pending");
    expect(res.json.mock.calls[0][0].student.name).toBe("Bob");
    expect(next).not.toHaveBeenCalled();
  });

  test("duplicate request → returns existing pending request idempotently", async () => {
    mockFindById.mockReturnValue(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Bob", grade: "10", subject: "Math", role: "student" }));
    mockLinkReqFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "existing-req" }) });
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(res.json.mock.calls[0][0].status).toBe("pending");
    expect(mockLinkReqCreate).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("already linked → returns status 'linked'", async () => {
    mockFindById
      .mockReturnValueOnce(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Bob", grade: "10", subject: "Math", role: "student" }))
      .mockReturnValueOnce(findByIdSelectLean({ name: "Parent", linkedStudents: [VALID_STUDENT_ID] }));
    mockLinkReqFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "parent");
    await ctrl.linkStudentDirect(req, res, next);
    expect(res.json.mock.calls[0][0].status).toBe("linked");
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
    mockFindById
      .mockReturnValueOnce(findByIdSelect({ _id: VALID_STUDENT_ID, name: "Alice", grade: "10", subject: "Math" }))
      .mockReturnValueOnce(findByIdSelectLean({ name: "Teacher", linkedStudents: [] }));
    mockLinkReqFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    mockLinkReqCreate.mockResolvedValue({ _id: "req-id-2" });
    const { req, res, next } = mockReqRes({}, { studentId: VALID_STUDENT_ID }, VALID_PARENT_ID, "teacher");
    await ctrl.linkStudentDirect(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("getLinkRequests", () => {
  test("returns pending requests for the current student", async () => {
    const fakeReqs = [{ _id: "r1", requesterName: "Mom", status: "pending" }];
    mockLinkReqFind.mockReturnValue({ lean: jest.fn().mockResolvedValue(fakeReqs) });
    const { req, res, next } = mockReqRes({}, {}, VALID_STUDENT_ID, "student");
    await ctrl.getLinkRequests(req, res, next);
    expect(res.json.mock.calls[0][0]).toEqual(fakeReqs);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("respondToLinkRequest", () => {
  const REQUEST_ID = "507f1f77bcf86cd799439022";

  test("accept → links student, returns accepted", async () => {
    const saveMock = jest.fn().mockResolvedValue({});
    mockLinkReqFindById.mockResolvedValue({
      _id: REQUEST_ID,
      requesterId: VALID_PARENT_ID,
      studentId: { toString: () => VALID_STUDENT_ID },
      status: "pending",
      save: saveMock,
    });
    mockFindByIdAndUpdate.mockResolvedValue({});
    const { req, res, next } = mockReqRes({ id: REQUEST_ID }, { action: "accept" }, VALID_STUDENT_ID, "student");
    await ctrl.respondToLinkRequest(req, res, next);
    expect(saveMock).toHaveBeenCalled();
    expect(mockFindByIdAndUpdate).toHaveBeenCalled();
    expect(res.json.mock.calls[0][0].status).toBe("accepted");
  });

  test("reject → does not link, returns rejected", async () => {
    const saveMock = jest.fn().mockResolvedValue({});
    mockLinkReqFindById.mockResolvedValue({
      _id: REQUEST_ID,
      requesterId: VALID_PARENT_ID,
      studentId: { toString: () => VALID_STUDENT_ID },
      status: "pending",
      save: saveMock,
    });
    const { req, res, next } = mockReqRes({ id: REQUEST_ID }, { action: "reject" }, VALID_STUDENT_ID, "student");
    await ctrl.respondToLinkRequest(req, res, next);
    expect(saveMock).toHaveBeenCalled();
    expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.json.mock.calls[0][0].status).toBe("rejected");
  });

  test("wrong student → 403", async () => {
    mockLinkReqFindById.mockResolvedValue({
      studentId: { toString: () => "different-student-id" },
      status: "pending",
      save: jest.fn(),
    });
    const { req, res, next } = mockReqRes({ id: REQUEST_ID }, { action: "accept" }, VALID_STUDENT_ID, "student");
    await ctrl.respondToLinkRequest(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  test("already responded → 400", async () => {
    mockLinkReqFindById.mockResolvedValue({
      studentId: { toString: () => VALID_STUDENT_ID },
      status: "accepted",
      save: jest.fn(),
    });
    const { req, res, next } = mockReqRes({ id: REQUEST_ID }, { action: "accept" }, VALID_STUDENT_ID, "student");
    await ctrl.respondToLinkRequest(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("request not found → 404", async () => {
    mockLinkReqFindById.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ id: REQUEST_ID }, { action: "accept" }, VALID_STUDENT_ID, "student");
    await ctrl.respondToLinkRequest(req, res, next);
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
