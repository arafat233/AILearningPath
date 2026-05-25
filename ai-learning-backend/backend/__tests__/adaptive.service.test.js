import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockProfileFindOne   = jest.fn();
const mockQuestionFind     = jest.fn();
const mockQuestionFindOne  = jest.fn();
const mockQuestionCreate   = jest.fn();
const mockSeenFind         = jest.fn();
const mockSeenCreate       = jest.fn();
const mockGenerateAIQuestion = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  Question: {
    find:      mockQuestionFind,
    findOne:   mockQuestionFindOne,
    create:    mockQuestionCreate,
  },
  UserProfile:  { findOne: mockProfileFindOne },
  SeenQuestion: { find: mockSeenFind, create: mockSeenCreate },
  // adaptiveService.getCachedBoard chains .select().lean() on User.findById —
  // if it crashes the surrounding Promise.all rejects, profile becomes
  // undefined, and the difficulty-adjustment branch is silently skipped.
  User: {
    findById: jest.fn().mockReturnValue({
      select: () => ({ lean: () => Promise.resolve({ examBoard: "CBSE" }) }),
    }),
  },
}));

jest.unstable_mockModule("../services/aiService.js", () => ({
  generateAIQuestion: mockGenerateAIQuestion,
}));

// adaptiveService.getCachedProfile/Board hit Redis first; mock them to miss so
// the DB-backed lookup (which the test mocks via UserProfile.findOne) runs.
jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionGet: jest.fn().mockResolvedValue(null),
  sessionSet: jest.fn().mockResolvedValue(true),
  sessionDel: jest.fn().mockResolvedValue(true),
  incrBy:     jest.fn().mockResolvedValue(1),
  acquireCronLock: jest.fn().mockResolvedValue(true),
  releaseCronLock: jest.fn().mockResolvedValue(true),
}));

const { getNextQuestion } = await import("../services/adaptiveService.js");

// Helper: wrap array in the lean() chain Question.find().lean() expects
const leanResult = (arr) => ({ lean: () => Promise.resolve(arr) });
// SeenQuestion.find() chain — service uses .sort().limit().select().lean()
// (and a shorter .select().lean() on the AI-question path); fully chainable.
const seenResult = (arr) => {
  const chain = {
    sort:   () => chain,
    limit:  () => chain,
    select: () => chain,
    lean:   () => Promise.resolve(arr),
  };
  return chain;
};

const Q = { _id: "q1", questionText: "What is 2+2?", difficultyScore: 0.5 };

beforeEach(() => {
  // SeenQuestion.create is fire-and-forget (.catch()), must return a Promise
  mockSeenCreate.mockResolvedValue({});
});

afterEach(() => jest.clearAllMocks());

describe("getNextQuestion", () => {
  test("no user profile → targets medium difficulty range (0.3–0.7)", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockSeenFind.mockReturnValue(seenResult([]));
    mockQuestionFind.mockReturnValue(leanResult([Q]));
    await getNextQuestion("u1", "Algebra");
    const filter = mockQuestionFind.mock.calls[0][0];
    expect(filter.difficultyScore.$gte).toBe(0.3);
    expect(filter.difficultyScore.$lte).toBe(0.7);
  });

  // adaptiveService.getCachedProfile chains .lean() on UserProfile.findOne, so
  // the mock must return a thenable-shaped query, not a bare Promise.
  test("high accuracy (>0.8) → targets harder range starting at 0.55", async () => {
    mockProfileFindOne.mockReturnValue(leanResult({ accuracy: 0.85, behaviorStats: {} }));
    mockSeenFind.mockReturnValue(seenResult([]));
    mockQuestionFind.mockReturnValue(leanResult([Q]));
    await getNextQuestion("u1", "Algebra");
    const filter = mockQuestionFind.mock.calls[0][0];
    expect(filter.difficultyScore.$gte).toBe(0.55);
  });

  test("low accuracy (<0.4) → targets easier range capped at 0.45", async () => {
    mockProfileFindOne.mockReturnValue(leanResult({ accuracy: 0.3, behaviorStats: {} }));
    mockSeenFind.mockReturnValue(seenResult([]));
    mockQuestionFind.mockReturnValue(leanResult([Q]));
    await getNextQuestion("u1", "Algebra");
    const filter = mockQuestionFind.mock.calls[0][0];
    expect(filter.difficultyScore.$lte).toBe(0.45);
  });

  test("no questions exist in topic → returns null", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockSeenFind.mockReturnValue(seenResult([]));
    // All three fallback calls return empty
    mockQuestionFind.mockReturnValue(leanResult([]));
    const result = await getNextQuestion("u1", "EmptyTopic");
    expect(result).toBeNull();
  });

  test("all narrow questions seen → widens search and returns a question", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockSeenFind.mockReturnValue(seenResult([{ questionId: "q1" }]));
    mockQuestionFind
      .mockReturnValueOnce(leanResult([]))  // narrow difficulty — all seen
      .mockReturnValueOnce(leanResult([]))  // wide difficulty — all seen
      .mockReturnValue(leanResult([Q]));    // full reset fallback
    const result = await getNextQuestion("u1", "Algebra");
    expect(result).toBeTruthy();
  });

  test("marks returned question as seen", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockSeenFind.mockReturnValue(seenResult([]));
    mockQuestionFind.mockReturnValue(leanResult([Q]));
    mockSeenCreate.mockResolvedValue({});
    await getNextQuestion("u1", "Algebra");
    expect(mockSeenCreate).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", questionId: "q1", topic: "Algebra" })
    );
  });

  test("excludes already-seen question IDs from the query", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockSeenFind.mockReturnValue(seenResult([{ questionId: "q99" }]));
    mockQuestionFind.mockReturnValue(leanResult([Q]));
    await getNextQuestion("u1", "Algebra");
    const filter = mockQuestionFind.mock.calls[0][0];
    expect(filter._id.$nin).toContain("q99");
  });
});
