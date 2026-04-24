import { jest } from "@jest/globals";

const mockSessionGet       = jest.fn();
const mockSessionSet       = jest.fn();
const mockAnalyzeAnswer    = jest.fn();
const mockGetNextQuestion  = jest.fn();
const mockCheckFoundation  = jest.fn();
const mockAttemptCreate    = jest.fn();
const mockUpdateUserProfile = jest.fn();
const mockUpdateStreak     = jest.fn();
const mockSmartAIExplanation = jest.fn();
const mockGetUsageCount    = jest.fn();
const mockResolveDoubt     = jest.fn();
const mockGenerateTeacherMessage = jest.fn();
const mockCheckAndAwardBadges   = jest.fn();
const mockUpdateQuestionStats   = jest.fn();
const mockProfileFindOne   = jest.fn();
const mockStreakFindOne     = jest.fn();
const mockUserFindById     = jest.fn();
const mockErrorMemoryFAU   = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: mockSessionGet,
  sessionSet: mockSessionSet,
  sessionDel: jest.fn(),
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { warn: jest.fn(), info: jest.fn(), error: jest.fn() },
}));

jest.unstable_mockModule("../models/index.js", () => ({
  Attempt:      { create: mockAttemptCreate },
  ErrorMemory:  { findOneAndUpdate: mockErrorMemoryFAU },
  User:         { findById: mockUserFindById },
  UserProfile:  { findOne: mockProfileFindOne },
  Streak:       { findOne: mockStreakFindOne },
}));

jest.unstable_mockModule("../services/analysisService.js", () => ({
  analyzeAnswer: mockAnalyzeAnswer,
}));

jest.unstable_mockModule("../services/adaptiveService.js", () => ({
  getNextQuestion:     mockGetNextQuestion,
  getInterleavedQuestion: jest.fn(),
}));

jest.unstable_mockModule("../services/profileService.js", () => ({
  updateUserProfile: mockUpdateUserProfile,
}));

jest.unstable_mockModule("../services/foundationService.js", () => ({
  checkFoundation: mockCheckFoundation,
}));

jest.unstable_mockModule("../services/selfLearningService.js", () => ({
  updateQuestionStats: mockUpdateQuestionStats,
}));

jest.unstable_mockModule("../services/streakService.js", () => ({
  updateStreak: mockUpdateStreak,
}));

jest.unstable_mockModule("../services/aiRouter.js", () => ({
  smartAIExplanation: mockSmartAIExplanation,
  getUsageCount:      mockGetUsageCount,
}));

jest.unstable_mockModule("../services/autoDoubtService.js", () => ({
  resolveDoubt: mockResolveDoubt,
}));

jest.unstable_mockModule("../services/aiTeacherService.js", () => ({
  generateTeacherMessage: mockGenerateTeacherMessage,
}));

jest.unstable_mockModule("../services/badgeService.js", () => ({
  checkAndAwardBadges: mockCheckAndAwardBadges,
}));

const ctrl = await import("../controllers/practiceController.js");

function mockReqRes(body = {}, userId = "user1") {
  const req  = { body, user: { id: userId }, params: {} };
  const res  = { json: jest.fn() };
  const next = jest.fn();
  return { req, res, next };
}

const PROFILE = {
  accuracy: 0.7, totalAttempts: 30,
  behaviorStats: {}, weakAreas: [],
  difficultyLevels: { get: () => 1 },
  topicProgress: [],
};

beforeEach(() => {
  mockAttemptCreate.mockResolvedValue({});
  mockUpdateUserProfile.mockResolvedValue({});
  mockUpdateStreak.mockResolvedValue({ streak: 3, isNew: false });
  mockUpdateQuestionStats.mockResolvedValue({});
  mockGetUsageCount.mockResolvedValue({ used: 2, limit: 10, remaining: 8 });
  mockCheckAndAwardBadges.mockResolvedValue([]);
  mockGenerateTeacherMessage.mockReturnValue({ type: "continue", message: "Keep it up!" });
  mockSessionSet.mockResolvedValue(null);
  mockErrorMemoryFAU.mockResolvedValue({});
  mockStreakFindOne.mockReturnValue({ lean: () => Promise.resolve({ currentStreak: 3 }) });
  mockUserFindById.mockReturnValue({
    select: jest.fn().mockResolvedValue({ goal: "distinction", subject: "Math" }),
  });
});

afterEach(() => jest.clearAllMocks());

// ── startTopic ─────────────────────────────────────────────────────

describe("startTopic", () => {
  test("foundation redirect → returns foundationRedirect:true with topic and question", async () => {
    mockCheckFoundation.mockResolvedValue({
      redirect: true,
      message: "Learn basics first",
      foundationTopic: "Numbers",
      question: { questionText: "What is 5?" },
    });
    const { req, res, next } = mockReqRes({ topicId: "Algebra" });
    await ctrl.startTopic(req, res, next);
    const payload = res.json.mock.calls[0][0];
    expect(payload.foundationRedirect).toBe(true);
    expect(payload.foundationTopic).toBe("Numbers");
  });

  test("no questions found for topic → 404 AppError", async () => {
    mockCheckFoundation.mockResolvedValue({ redirect: false });
    mockGetNextQuestion.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ topicId: "Algebra" });
    await ctrl.startTopic(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
  });

  test("question available → stores session and returns question data", async () => {
    mockCheckFoundation.mockResolvedValue({ redirect: false });
    const q = {
      _id: "q1", questionText: "Q?", difficultyScore: 0.5,
      toObject: () => ({ _id: "q1", questionText: "Q?" }),
    };
    mockGetNextQuestion.mockResolvedValue(q);
    mockProfileFindOne.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ topicId: "Algebra" });
    await ctrl.startTopic(req, res, next);
    expect(mockSessionSet).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});

// ── submitAnswer ───────────────────────────────────────────────────

describe("submitAnswer", () => {
  test("no active session → 400 AppError", async () => {
    mockSessionGet.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ selectedType: "correct", timeTaken: 20, confidence: "medium" });
    await ctrl.submitAnswer(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("session with no currentQuestion → 400 AppError", async () => {
    mockSessionGet.mockResolvedValue({ topic: "Algebra" }); // no currentQuestion
    const { req, res, next } = mockReqRes({ selectedType: "correct", timeTaken: 20, confidence: "medium" });
    await ctrl.submitAnswer(req, res, next);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("correct answer → isCorrect:true, no aiExplanation, no resolveDoubt call", async () => {
    const question = { _id: "q1", questionText: "Q?", expectedTime: 20, options: [], difficultyScore: 0.5 };
    mockSessionGet.mockResolvedValue({ currentQuestion: question, topic: "Algebra", sessionTotal: 2, sessionCorrect: 1 });
    mockAnalyzeAnswer.mockReturnValue({ isCorrect: true, behavior: "normal", speedProfile: "mastery", confidenceInsight: null, message: "Great!" });
    mockProfileFindOne.mockResolvedValue(PROFILE);
    mockGetNextQuestion.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ selectedType: "correct", timeTaken: 15, confidence: "high" });
    await ctrl.submitAnswer(req, res, next);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.isCorrect).toBe(true);
    expect(payload.aiExplanation).toBeFalsy();
    expect(mockResolveDoubt).not.toHaveBeenCalled();
  });

  test("wrong answer → resolveDoubt is called with correct args", async () => {
    const question = {
      _id: "q1", questionText: "What is sqrt(16)?", expectedTime: 20,
      options: [{ type: "correct", text: "4" }], difficultyScore: 0.5,
      solutionSteps: [], shortcut: null,
    };
    mockSessionGet.mockResolvedValue({ currentQuestion: question, topic: "Algebra", sessionTotal: 4, sessionCorrect: 2 });
    mockAnalyzeAnswer.mockReturnValue({ isCorrect: false, behavior: "concept_error", speedProfile: "normal", confidenceInsight: "dangerous_misconception", message: "Review." });
    mockResolveDoubt.mockResolvedValue({ doubtType: "concept_gap", insight: "Gap.", suggestedAction: "revisit_lesson", aiHelp: "Here's help" });
    mockProfileFindOne.mockResolvedValue(PROFILE);
    mockGetNextQuestion.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ selectedType: "concept_error", timeTaken: 20, confidence: "high" });
    await ctrl.submitAnswer(req, res, next);
    expect(mockResolveDoubt).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.isCorrect).toBe(false);
    expect(payload.doubtType).toBe("concept_gap");
  });

  test("wrong answer → attempt is recorded in DB", async () => {
    const question = { _id: "q1", questionText: "Q?", expectedTime: 20, options: [], difficultyScore: 0.5, solutionSteps: [] };
    mockSessionGet.mockResolvedValue({ currentQuestion: question, topic: "Algebra", sessionTotal: 0, sessionCorrect: 0 });
    mockAnalyzeAnswer.mockReturnValue({ isCorrect: false, behavior: "guessing", speedProfile: "guessing", confidenceInsight: null, message: "Slow down." });
    mockResolveDoubt.mockResolvedValue(null);
    mockProfileFindOne.mockResolvedValue(PROFILE);
    mockGetNextQuestion.mockResolvedValue(null);
    const { req, res, next } = mockReqRes({ selectedType: "guessing", timeTaken: 5, confidence: "low" });
    await ctrl.submitAnswer(req, res, next);
    expect(mockAttemptCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user1", isCorrect: false, selectedType: "guessing",
    }));
  });
});
