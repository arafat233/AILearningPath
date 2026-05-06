import { jest } from "@jest/globals";

const mockAttemptFind          = jest.fn();
const mockUserProfileFindOne   = jest.fn();
const mockFindOneAndUpdate     = jest.fn();
const mockClassify             = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  Attempt:     { find: mockAttemptFind },
  UserProfile: {
    // profileService calls .findOne().select("thinkingProfile").lean()
    findOne:          (q) => ({ select: () => ({ lean: () => mockUserProfileFindOne(q) }) }),
    findOneAndUpdate: mockFindOneAndUpdate,
  },
}));
jest.unstable_mockModule("../services/analysisService.js", () => ({
  classifyThinkingProfile: mockClassify,
}));

const { updateUserProfile } = await import("../services/profileService.js");

afterEach(() => jest.clearAllMocks());

// Helper: sets up the full Attempt.find() chain
function mockAttempts(arr) {
  mockAttemptFind.mockReturnValue({
    sort:  jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: () => Promise.resolve(arr),
        }),
      }),
    }),
  });
}

function makeAttempt(overrides = {}) {
  return {
    isCorrect: true,
    timeTaken: 10,
    selectedType: "correct",
    confidence: "high",
    topic: "Algebra",
    ...overrides,
  };
}

// ── early exit ─────────────────────────────────────────────────────────────────

describe("updateUserProfile — no attempts", () => {
  test("returns early without upserting when attempt list is empty", async () => {
    mockAttempts([]);
    await updateUserProfile("u1");
    expect(mockFindOneAndUpdate).not.toHaveBeenCalled();
  });
});

// ── accuracy and avgTime ───────────────────────────────────────────────────────

describe("updateUserProfile — accuracy and avgTime", () => {
  test("accuracy = correct / total", async () => {
    const attempts = [
      makeAttempt({ isCorrect: true,  timeTaken: 10, topic: "Algebra"  }),
      makeAttempt({ isCorrect: false, timeTaken: 20, topic: "Algebra"  }),
      makeAttempt({ isCorrect: true,  timeTaken: 10, topic: "Geometry" }),
      makeAttempt({ isCorrect: true,  timeTaken: 10, topic: "Geometry" }),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.accuracy).toBeCloseTo(3 / 4);
  });

  test("avgTime is the mean of all timeTaken values", async () => {
    const attempts = [
      makeAttempt({ timeTaken: 10 }),
      makeAttempt({ timeTaken: 20 }),
      makeAttempt({ timeTaken: 30 }),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.avgTime).toBeCloseTo(20);
  });

  test("missing timeTaken is treated as 0", async () => {
    const attempts = [
      makeAttempt({ timeTaken: undefined }),
      makeAttempt({ timeTaken: 20 }),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.avgTime).toBeCloseTo(10); // (0 + 20) / 2
  });
});

// ── weakAreas and strongAreas ──────────────────────────────────────────────────

describe("updateUserProfile — weakAreas and strongAreas", () => {
  test("topic with accuracy < 0.50 lands in weakAreas", async () => {
    const attempts = [
      makeAttempt({ isCorrect: false, topic: "Algebra" }),
      makeAttempt({ isCorrect: false, topic: "Algebra" }),
      makeAttempt({ isCorrect: true,  topic: "Algebra" }),
    ]; // 1/3 = 33%
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.weakAreas).toContain("Algebra");
    expect(saved.strongAreas).not.toContain("Algebra");
  });

  test("topic with accuracy >= 0.75 lands in strongAreas", async () => {
    const attempts = [
      makeAttempt({ isCorrect: true,  topic: "Geometry" }),
      makeAttempt({ isCorrect: true,  topic: "Geometry" }),
      makeAttempt({ isCorrect: true,  topic: "Geometry" }),
      makeAttempt({ isCorrect: false, topic: "Geometry" }),
    ]; // 3/4 = 75%
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.strongAreas).toContain("Geometry");
    expect(saved.weakAreas).not.toContain("Geometry");
  });

  test("topic with 50–74% accuracy appears in neither weakAreas nor strongAreas", async () => {
    const attempts = [
      makeAttempt({ isCorrect: true,  topic: "Stats" }),
      makeAttempt({ isCorrect: false, topic: "Stats" }),
    ]; // 50%
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.weakAreas).not.toContain("Stats");
    expect(saved.strongAreas).not.toContain("Stats");
  });
});

// ── thinkingProfile classification ────────────────────────────────────────────

describe("updateUserProfile — thinkingProfile", () => {
  test("classifies when total >= 10 attempts", async () => {
    const attempts = Array(10).fill(makeAttempt());
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockClassify.mockReturnValue("Systematic");
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    expect(mockClassify).toHaveBeenCalled();
    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.thinkingProfile).toBe("Systematic");
  });

  test("preserves existing profile when total < 10 attempts", async () => {
    const attempts = Array(5).fill(makeAttempt());
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue({ thinkingProfile: "Analytical" });
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    expect(mockClassify).not.toHaveBeenCalled();
    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.thinkingProfile).toBe("Analytical");
  });

  test("uses 'Unclassified' when < 10 attempts and no existing profile", async () => {
    const attempts = Array(3).fill(makeAttempt());
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.thinkingProfile).toBe("Unclassified");
  });
});

// ── difficultyLevels ───────────────────────────────────────────────────────────

describe("updateUserProfile — difficultyLevels", () => {
  async function getDifficulty(accuracy) {
    const total = 4;
    const correct = Math.round(accuracy * total);
    const attempts = [
      ...Array(correct).fill(makeAttempt({ isCorrect: true,  topic: "T1" })),
      ...Array(total - correct).fill(makeAttempt({ isCorrect: false, topic: "T1" })),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    jest.clearAllMocks(); // clear for clean assert
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    await updateUserProfile("u1");
    return mockFindOneAndUpdate.mock.calls[0][1].difficultyLevels["T1"];
  }

  test("accuracy >= 0.85 → difficulty level 4", async () => {
    // 4/4 = 100%
    const attempts = Array(4).fill(makeAttempt({ isCorrect: true, topic: "T1" }));
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    await updateUserProfile("u1");
    expect(mockFindOneAndUpdate.mock.calls[0][1].difficultyLevels["T1"]).toBe(4);
  });

  test("accuracy 70–84% → difficulty level 3", async () => {
    // 3/4 = 75%
    const attempts = [
      ...Array(3).fill(makeAttempt({ isCorrect: true,  topic: "T1" })),
      ...Array(1).fill(makeAttempt({ isCorrect: false, topic: "T1" })),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    await updateUserProfile("u1");
    expect(mockFindOneAndUpdate.mock.calls[0][1].difficultyLevels["T1"]).toBe(3);
  });

  test("accuracy 50–69% → difficulty level 2", async () => {
    // 2/4 = 50%
    const attempts = [
      ...Array(2).fill(makeAttempt({ isCorrect: true,  topic: "T1" })),
      ...Array(2).fill(makeAttempt({ isCorrect: false, topic: "T1" })),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    await updateUserProfile("u1");
    expect(mockFindOneAndUpdate.mock.calls[0][1].difficultyLevels["T1"]).toBe(2);
  });

  test("accuracy < 0.50 → difficulty level 1", async () => {
    // 1/4 = 25%
    const attempts = [
      ...Array(1).fill(makeAttempt({ isCorrect: true,  topic: "T1" })),
      ...Array(3).fill(makeAttempt({ isCorrect: false, topic: "T1" })),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});
    await updateUserProfile("u1");
    expect(mockFindOneAndUpdate.mock.calls[0][1].difficultyLevels["T1"]).toBe(1);
  });
});

// ── confidence accuracy ────────────────────────────────────────────────────────

describe("updateUserProfile — confidence accuracy stats", () => {
  test("counts highConfidenceWrong correctly", async () => {
    const attempts = [
      makeAttempt({ confidence: "high", isCorrect: false }),
      makeAttempt({ confidence: "high", isCorrect: false }),
      makeAttempt({ confidence: "high", isCorrect: true  }),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.confidenceAccuracy.highConfidenceWrong).toBe(2);
  });

  test("counts lowConfidenceRight correctly", async () => {
    const attempts = [
      makeAttempt({ confidence: "low", isCorrect: true  }),
      makeAttempt({ confidence: "low", isCorrect: true  }),
      makeAttempt({ confidence: "low", isCorrect: false }),
    ];
    mockAttempts(attempts);
    mockUserProfileFindOne.mockResolvedValue(null);
    mockFindOneAndUpdate.mockResolvedValue({});

    await updateUserProfile("u1");

    const saved = mockFindOneAndUpdate.mock.calls[0][1];
    expect(saved.confidenceAccuracy.lowConfidenceRight).toBe(2);
  });
});
