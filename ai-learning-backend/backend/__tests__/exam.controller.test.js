import { jest } from "@jest/globals";

// ── Model mocks ─────────────────────────────────────────────────────
const mockExamFindById        = jest.fn();
const mockQuestionAggregate   = jest.fn();
const mockAttemptCreate       = jest.fn();
const mockAttemptFind         = jest.fn();
const mockAttemptFindById     = jest.fn();
const mockAttemptFindByIdAndUpdate = jest.fn();
const mockLeaderboardFindOneAndUpdate = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  Exam: { findById: mockExamFindById },
  Question: { aggregate: mockQuestionAggregate },
  ExamAttempt: {
    create: mockAttemptCreate,
    find: mockAttemptFind,
    findById: mockAttemptFindById,
    findByIdAndUpdate: mockAttemptFindByIdAndUpdate,
  },
  WeeklyLeaderboard: { findOneAndUpdate: mockLeaderboardFindOneAndUpdate },
}));

// ── Scoring service mocks ───────────────────────────────────────────
const mockCalcScore     = jest.fn();
const mockNormalize     = jest.fn();
const mockAssignRanks   = jest.fn();

jest.unstable_mockModule("../services/scoringService.js", () => ({
  calculateExamScore: mockCalcScore,
  normalizeScores:    mockNormalize,
  assignRanks:        mockAssignRanks,
}));

// ── Redis session mocks ─────────────────────────────────────────────
const mockSessionGet = jest.fn();
const mockSessionSet = jest.fn();
const mockSessionDel = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: mockSessionGet,
  sessionSet: mockSessionSet,
  sessionDel: mockSessionDel,
}));

const ctrl = await import("../controllers/examController.js");

const USER_ID   = "user123";
const EXAM_ID   = "exam456";
const ATTEMPT_ID = "507f1f77bcf86cd799439011";

function mockReqRes(params = {}, body = {}, userId = USER_ID) {
  const req  = { params, body, user: { id: userId } };
  const res  = { json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

afterEach(() => jest.clearAllMocks());

// ── listExams ───────────────────────────────────────────────────────
describe("listExams", () => {
  test("returns active exams array", async () => {
    const exams = [{ _id: EXAM_ID, title: "Week 1 Math", isActive: true }];
    mockExamFindById.mockResolvedValue(exams); // not used here — listExams calls Exam.find
    // patch Exam.find on the imported module
    const { Exam } = await import("../models/index.js");
    Exam.find = jest.fn().mockResolvedValue(exams);

    const { req, res, next } = mockReqRes();
    await ctrl.listExams(req, res, next);
    expect(res.json).toHaveBeenCalledWith(exams);
    expect(next).not.toHaveBeenCalled();
  });
});

// ── startExam ───────────────────────────────────────────────────────
describe("startExam", () => {
  const fakeExam = {
    _id: EXAM_ID,
    title: "Test Exam",
    topic: "Algebra",
    duration: 60,
    negativeMarking: true,
    negativeValue: 0.25,
    questionDistribution: { easy: 1, medium: 1, hard: 1 },
  };

  const makeQuestion = (id, difficulty) => ({
    _id: { toString: () => id },
    questionText: `Q ${id}`,
    options: [
      { text: "A", type: "correct" },
      { text: "B", type: "wrong1" },
    ],
    expectedTime: 60,
    difficultyScore: difficulty,
    marks: 1,
  });

  beforeEach(() => {
    mockExamFindById.mockResolvedValue(fakeExam);
    mockQuestionAggregate
      .mockResolvedValueOnce([makeQuestion("q1", 0.2)])   // easy
      .mockResolvedValueOnce([makeQuestion("q2", 0.5)])   // medium
      .mockResolvedValueOnce([makeQuestion("q3", 0.8)]);  // hard
    mockSessionSet.mockResolvedValue(true);
  });

  test("returns questions, duration, startedAt, durationSeconds", async () => {
    const { req, res, next } = mockReqRes({}, { examId: EXAM_ID });
    await ctrl.startExam(req, res, next);
    expect(next).not.toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.questions).toHaveLength(3);
    expect(payload.durationSeconds).toBe(3600);
    expect(typeof payload.startedAt).toBe("number");
    expect(payload.negativeMarking).toBe(true);
  });

  test("strips correct/wrong type from options sent to client", async () => {
    const { req, res, next } = mockReqRes({}, { examId: EXAM_ID });
    await ctrl.startExam(req, res, next);
    const q = res.json.mock.calls[0][0].questions[0];
    expect(q.options.every((o) => !("type" in o))).toBe(true);
  });

  test("exam not found → 404", async () => {
    mockExamFindById.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({}, { examId: "bad" });
    await ctrl.startExam(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  test("stores startedAt and durationSeconds in session", async () => {
    const { req, res, next } = mockReqRes({}, { examId: EXAM_ID });
    const before = Date.now();
    await ctrl.startExam(req, res, next);
    const after = Date.now();
    const sessionData = mockSessionSet.mock.calls[0][1];
    expect(sessionData.startedAt).toBeGreaterThanOrEqual(before);
    expect(sessionData.startedAt).toBeLessThanOrEqual(after);
    expect(sessionData.durationSeconds).toBe(3600);
  });
});

// ── submitExam ──────────────────────────────────────────────────────
describe("submitExam", () => {
  const SESSION = {
    examId: EXAM_ID,
    topic: "Algebra",
    negativeMarking: true,
    negativeValue: 0.25,
    startedAt: Date.now() - 600_000, // started 10 min ago
    durationSeconds: 3600,
    questions: [
      {
        _id: { toString: () => "q1" },
        questionText: "What is 2+2?",
        options: [
          { text: "4", type: "correct" },
          { text: "5", type: "wrong1" },
        ],
        difficultyScore: 0.2,
        marks: 1,
        solutionSteps: [],
        shortcut: null,
      },
    ],
  };

  const ANSWERS = [{ questionId: "q1", selectedType: "correct", timeTaken: 30 }];

  beforeEach(() => {
    mockSessionGet.mockResolvedValue(SESSION);
    mockCalcScore.mockReturnValue(1);
    mockAttemptCreate.mockResolvedValue({ _id: "a1", userId: USER_ID });
    mockAttemptFind.mockResolvedValue([{ _id: "a1", userId: USER_ID, rawScore: 1 }]);
    mockNormalize.mockReturnValue([{ _id: "a1", userId: USER_ID, normalizedScore: 75 }]);
    mockAssignRanks.mockReturnValue([{ _id: "a1", userId: USER_ID, normalizedScore: 75, rank: 1, percentile: 100 }]);
    mockAttemptFindByIdAndUpdate.mockResolvedValue({});
    mockLeaderboardFindOneAndUpdate.mockResolvedValue({});
    mockSessionDel.mockResolvedValue(true);
  });

  test("returns score, rank, percentile, review on correct answer", async () => {
    const { req, res, next } = mockReqRes({}, { answers: ANSWERS });
    await ctrl.submitExam(req, res, next);
    expect(next).not.toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.rawScore).toBe(1);
    expect(payload.rank).toBe(1);
    expect(payload.percentile).toBe(100);
    expect(payload.review).toHaveLength(1);
    expect(payload.review[0].isCorrect).toBe(true);
    expect(payload.review[0].marksAwarded).toBe(1);
  });

  test("wrong answer with negative marking → negative marksAwarded", async () => {
    const wrongAnswers = [{ questionId: "q1", selectedType: "wrong1", timeTaken: 20 }];
    mockCalcScore.mockReturnValue(-0.25);
    const { req, res, next } = mockReqRes({}, { answers: wrongAnswers });
    await ctrl.submitExam(req, res, next);
    const review = res.json.mock.calls[0][0].review;
    expect(review[0].isCorrect).toBe(false);
    expect(review[0].marksAwarded).toBe(-0.25);
  });

  test("unanswered question → 0 marks (no negative for blank)", async () => {
    const blankAnswers = [{ questionId: "q1", selectedType: "", timeTaken: 0 }];
    const { req, res, next } = mockReqRes({}, { answers: blankAnswers });
    await ctrl.submitExam(req, res, next);
    const review = res.json.mock.calls[0][0].review;
    expect(review[0].marksAwarded).toBe(0);
  });

  test("no active session → 400", async () => {
    mockSessionGet.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({}, { answers: ANSWERS });
    await ctrl.submitExam(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("time expired → unanswered questions auto-filled as blank", async () => {
    const expiredSession = {
      ...SESSION,
      startedAt: Date.now() - 4000_000, // way past duration
      questions: [
        ...SESSION.questions,
        {
          _id: { toString: () => "q2" },
          questionText: "Q2",
          options: [{ text: "X", type: "correct" }],
          difficultyScore: 0.5,
          marks: 1,
          solutionSteps: [],
          shortcut: null,
        },
      ],
    };
    mockSessionGet.mockResolvedValue(expiredSession);
    mockCalcScore.mockReturnValue(0);
    mockNormalize.mockReturnValue([{ _id: "a1", userId: USER_ID, normalizedScore: 0 }]);
    mockAssignRanks.mockReturnValue([{ _id: "a1", userId: USER_ID, normalizedScore: 0, rank: 1, percentile: 50 }]);

    // Only submit q1, q2 is unanswered
    const { req, res, next } = mockReqRes({}, { answers: [{ questionId: "q1", selectedType: "correct", timeTaken: 10 }] });
    await ctrl.submitExam(req, res, next);
    expect(next).not.toHaveBeenCalled();
    const created = mockAttemptCreate.mock.calls[0][0];
    // Both q1 and q2 should appear in evaluated answers
    expect(created.answers).toHaveLength(2);
    const q2ans = created.answers.find((a) => a.questionId === "q2");
    expect(q2ans.selectedType).toBe("");
    expect(q2ans.marksAwarded).toBe(0);
  });

  test("clears Redis session after submit", async () => {
    const { req, res, next } = mockReqRes({}, { answers: ANSWERS });
    await ctrl.submitExam(req, res, next);
    expect(mockSessionDel).toHaveBeenCalledWith(`exam:${USER_ID}`);
  });
});

// ── getExamReview ───────────────────────────────────────────────────
describe("getExamReview", () => {
  test("returns attempt for owner", async () => {
    const attempt = { _id: ATTEMPT_ID, userId: USER_ID, answers: [] };
    mockAttemptFindById.mockResolvedValue(attempt);
    const { req, res, next } = mockReqRes({ attemptId: ATTEMPT_ID }, {}, USER_ID);
    await ctrl.getExamReview(req, res, next);
    expect(res.json).toHaveBeenCalledWith(attempt);
  });

  test("attempt not found → 404", async () => {
    mockAttemptFindById.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ attemptId: ATTEMPT_ID });
    await ctrl.getExamReview(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  test("wrong user → 403", async () => {
    mockAttemptFindById.mockResolvedValue({ _id: ATTEMPT_ID, userId: "other_user" });
    const { req, res, next } = mockReqRes({ attemptId: ATTEMPT_ID }, {}, USER_ID);
    await ctrl.getExamReview(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });
});

// ── getLeaderboard ──────────────────────────────────────────────────
describe("getLeaderboard", () => {
  test("returns top 100 attempts sorted by rank", async () => {
    const rows = [
      { _id: "a1", userId: "u1", rank: 1, percentile: 100 },
      { _id: "a2", userId: "u2", rank: 2, percentile: 80 },
    ];
    // ExamAttempt.find().sort().limit().select() chain
    const chain = {
      sort:   jest.fn().mockReturnThis(),
      limit:  jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue(rows),
    };
    mockAttemptFind.mockReturnValue(chain);

    const { req, res, next } = mockReqRes({ examId: EXAM_ID });
    await ctrl.getLeaderboard(req, res, next);
    expect(res.json).toHaveBeenCalledWith(rows);
    expect(chain.sort).toHaveBeenCalledWith({ rank: 1 });
    expect(chain.limit).toHaveBeenCalledWith(100);
  });
});
