import { jest } from "@jest/globals";

const mockSave                   = jest.fn().mockResolvedValue({});
const mockQSFindOne              = jest.fn();
const mockQuestionFindById       = jest.fn();
const mockComputeDynamicDifficulty = jest.fn().mockReturnValue(0.5);
const mockQuestionSave           = jest.fn().mockResolvedValue({});

jest.unstable_mockModule("../models/index.js", () => {
  function MockQuestionStats(init) {
    return {
      attempts: 0, correct: 0, avgTime: 0,
      errorDistribution: {}, computedDifficulty: 0.5,
      isBadQuestion: false, updatedAt: null,
      save: mockSave,
      ...init,
    };
  }
  MockQuestionStats.findOne = mockQSFindOne;

  return {
    QuestionStats: MockQuestionStats,
    Question:      { findById: mockQuestionFindById },
  };
});
jest.unstable_mockModule("../services/scoringService.js", () => ({
  computeDynamicDifficulty: mockComputeDynamicDifficulty,
}));

const { updateQuestionStats } = await import("../services/selfLearningService.js");

function makeQuestion(overrides = {}) {
  return { _id: "q1", expectedTime: 20, difficultyScore: 0.5, isFlagged: false, save: mockQuestionSave, ...overrides };
}

function makeStats(overrides = {}) {
  return {
    attempts: 0, correct: 0, avgTime: 0,
    errorDistribution: {}, computedDifficulty: 0.5,
    isBadQuestion: false, updatedAt: null,
    save: mockSave,
    ...overrides,
  };
}

afterEach(() => jest.clearAllMocks());

// ── attempt counting ───────────────────────────────────────────────────────────

describe("updateQuestionStats — attempt counting", () => {
  test("increments attempts by 1 on each call", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 15, "correct");
    expect(stats.attempts).toBe(1);
  });

  test("increments correct when answer is right", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 15, "correct");
    expect(stats.correct).toBe(1);
  });

  test("does NOT increment correct on wrong answer", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", false, 15, "concept_error");
    expect(stats.correct).toBe(0);
  });
});

// ── rolling avgTime ────────────────────────────────────────────────────────────

describe("updateQuestionStats — rolling avgTime", () => {
  test("first attempt: avgTime equals timeTaken", async () => {
    const stats = makeStats({ attempts: 0, avgTime: 0 });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 20, "correct");
    // After: attempts = 1, avgTime = (0 * 0 + 20) / 1 = 20
    expect(stats.avgTime).toBe(20);
  });

  test("second attempt: avgTime is rolling mean", async () => {
    const stats = makeStats({ attempts: 1, correct: 1, avgTime: 10 });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 20, "correct");
    // After: attempts = 2, avgTime = (10 * 1 + 20) / 2 = 15
    expect(stats.avgTime).toBe(15);
  });

  test("avgTime is stored with 1 decimal place", async () => {
    const stats = makeStats({ attempts: 1, avgTime: 10 });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 25, "correct");
    // (10 + 25) / 2 = 17.5
    expect(stats.avgTime).toBe(17.5);
  });
});

// ── error distribution ─────────────────────────────────────────────────────────

describe("updateQuestionStats — error distribution", () => {
  test("non-correct selectedType is tracked in errorDistribution", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", false, 15, "concept_error");
    expect(stats.errorDistribution.concept_error).toBe(1);
  });

  test("each error type accumulates independently", async () => {
    const stats = makeStats({ errorDistribution: { concept_error: 1 } });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", false, 15, "concept_error");
    expect(stats.errorDistribution.concept_error).toBe(2);
  });

  test("'correct' selectedType is NOT added to errorDistribution", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", true, 15, "correct");
    expect(stats.errorDistribution.correct).toBeUndefined();
  });
});

// ── bad question flagging ──────────────────────────────────────────────────────

describe("updateQuestionStats — bad question flagging", () => {
  test("flags question when > 20 attempts and error rate > 95%", async () => {
    // After increment: attempts = 22, correct = 0 → errorRate = 22/22 = 100%
    const stats = makeStats({ attempts: 21, correct: 0 });
    mockQSFindOne.mockResolvedValue(stats);
    const q = makeQuestion();
    mockQuestionFindById.mockResolvedValue(q);

    await updateQuestionStats("q1", false, 15, "concept_error");

    expect(stats.isBadQuestion).toBe(true);
    expect(q.isFlagged).toBe(true);
  });

  test("does not flag when attempts <= 20", async () => {
    const stats = makeStats({ attempts: 19, correct: 0 });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", false, 15, "concept_error");

    expect(stats.isBadQuestion).toBe(false);
  });

  test("does not flag when error rate <= 95% even with > 20 attempts", async () => {
    // 21 attempts, 5 correct → errorRate = 16/21 ≈ 76%
    const stats = makeStats({ attempts: 21, correct: 5 });
    mockQSFindOne.mockResolvedValue(stats);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await updateQuestionStats("q1", false, 15, "concept_error");

    expect(stats.isBadQuestion).toBe(false);
  });
});

// ── creates new stats when not found ──────────────────────────────────────────

describe("updateQuestionStats — creates new stats when not found", () => {
  test("saves successfully when QuestionStats document does not exist", async () => {
    mockQSFindOne.mockResolvedValue(null);
    mockQuestionFindById.mockResolvedValue(makeQuestion());

    await expect(
      updateQuestionStats("q1", true, 15, "correct")
    ).resolves.not.toThrow();

    expect(mockSave).toHaveBeenCalled();
  });

  test("syncs computedDifficulty back to Question document", async () => {
    const stats = makeStats();
    mockQSFindOne.mockResolvedValue(stats);
    const q = makeQuestion();
    mockQuestionFindById.mockResolvedValue(q);
    mockComputeDynamicDifficulty.mockReturnValue(0.75);

    await updateQuestionStats("q1", true, 15, "correct");

    expect(q.difficultyScore).toBe(0.75);
    expect(mockQuestionSave).toHaveBeenCalled();
  });
});
