import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock all external dependencies before importing
jest.unstable_mockModule("../utils/cache.js", () => ({
  getCached: jest.fn(() => null),
  setCache:  jest.fn(),
}));

jest.unstable_mockModule("../services/aiService.js", () => ({
  getAIExplanation: jest.fn(async () => "Claude response"),
  getStudyAdvice:   jest.fn(async () => "Study advice"),
}));

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    findById: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({
        isPaid: false, plan: "free",
        aiCallsToday: 0, aiCallsDate: "",
        save: jest.fn(),
      })),
    })),
  },
  AIResponseCache: {
    findOne:          jest.fn(() => ({ lean: jest.fn(() => Promise.resolve(null)) })),
    findOneAndUpdate: jest.fn(() => Promise.resolve({})),
  },
  AIUsageStats: {
    findOneAndUpdate: jest.fn(() => Promise.resolve({})),
  },
}));

const { smartAIExplanation } = await import("../services/aiRouter.js");

describe("smartAIExplanation — layer routing", () => {
  it("Layer 1: correct answer → returns null immediately", async () => {
    const result = await smartAIExplanation("u1", "What is 2+2?", "correct", "4", []);
    expect(result).toBeNull();
  });

  it("Layer 2: has solutionSteps → returns steps without calling Claude", async () => {
    const { getAIExplanation } = await import("../services/aiService.js");
    const result = await smartAIExplanation("u1", "Some question", "concept_error", "Answer", ["Step 1", "Step 2"]);
    expect(result).toContain("Step 1");
    expect(getAIExplanation).not.toHaveBeenCalled();
  });

  it("Layer 3: guessing → returns static message without Claude", async () => {
    const { getAIExplanation } = await import("../services/aiService.js");
    getAIExplanation.mockClear();
    const result = await smartAIExplanation("u1", "Some question", "guessing", "Answer", []);
    expect(result).toMatch(/guess/i);
    expect(getAIExplanation).not.toHaveBeenCalled();
  });

  it("Layer 3: misinterpretation → returns static message", async () => {
    const result = await smartAIExplanation("u1", "Some question", "misinterpretation", "Answer", []);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(10);
  });

  it("Layer 7: novel question+mistake → calls Claude", async () => {
    const { getAIExplanation } = await import("../services/aiService.js");
    getAIExplanation.mockClear();
    // concept_error on a fresh question not in cache (mocked to return null)
    const result = await smartAIExplanation("u1", "A unique concept question about XYZ theorem", "concept_error", "42", []);
    expect(getAIExplanation).toHaveBeenCalledTimes(1);
    expect(result).toBe("Claude response");
  });
});
