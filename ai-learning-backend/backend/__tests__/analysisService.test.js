import { describe, it, expect } from "@jest/globals";
import { analyzeAnswer } from "../services/analysisService.js";

const baseQuestion = { expectedTime: 20 };

describe("analyzeAnswer — behavior classification", () => {
  it("fast + wrong → guessing regardless of option type", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "concept_error", 5, "high");
    expect(r.behavior).toBe("guessing");
    expect(r.isCorrect).toBe(false);
  });

  it("correct answer → isCorrect true, behavior correct", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "correct", 15, "medium");
    expect(r.isCorrect).toBe(true);
    expect(r.behavior).toBe("correct");
  });

  it("slow + correct → deep_thinker speed profile", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "correct", 60, "low");
    expect(r.speedProfile).toBe("deep_thinker");
  });

  it("fast + correct → mastery speed profile", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "correct", 5, "high");
    expect(r.speedProfile).toBe("mastery");
  });

  it("high confidence + wrong → dangerous_misconception", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "concept_error", 25, "high");
    expect(r.confidenceInsight).toBe("dangerous_misconception");
  });

  it("low confidence + correct → unstable_knowledge", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "correct", 20, "low");
    expect(r.confidenceInsight).toBe("unstable_knowledge");
  });

  it("normal time + wrong with partial_logic → keeps partial_logic if not fast", () => {
    const r = analyzeAnswer({ ...baseQuestion }, "partial_logic", 20, "medium");
    expect(r.behavior).toBe("partial_logic");
    expect(r.isCorrect).toBe(false);
  });
});
