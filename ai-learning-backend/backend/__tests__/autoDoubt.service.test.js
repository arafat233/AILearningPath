import { jest } from "@jest/globals";

const mockSmartAIExplanation = jest.fn();

jest.unstable_mockModule("../services/aiRouter.js", () => ({
  smartAIExplanation: mockSmartAIExplanation,
}));

const { detectDoubtType, generateDoubtInsight, resolveDoubt } =
  await import("../services/autoDoubtService.js");

afterEach(() => jest.clearAllMocks());

// ── detectDoubtType ────────────────────────────────────────────────

describe("detectDoubtType", () => {
  test("correct answer → null", () => {
    expect(detectDoubtType("correct", 15, 20)).toBeNull();
  });

  test("fast wrong answer (< 40% of expectedTime) → guessing", () => {
    // 5 < 20 * 0.4 = 8
    expect(detectDoubtType("concept_error", 5, 20)).toBe("guessing");
  });

  test("concept_error at normal speed → concept_gap", () => {
    expect(detectDoubtType("concept_error", 20, 20)).toBe("concept_gap");
  });

  test("calculation_error at normal speed → calculation_slip", () => {
    expect(detectDoubtType("calculation_error", 20, 20)).toBe("calculation_slip");
  });

  test("partial_logic → incomplete_logic", () => {
    expect(detectDoubtType("partial_logic", 20, 20)).toBe("incomplete_logic");
  });

  test("misinterpretation → misread_question", () => {
    expect(detectDoubtType("misinterpretation", 20, 20)).toBe("misread_question");
  });

  test("slow wrong answer (> 2.5x expectedTime) → overthinking", () => {
    // 60 > 20 * 2.5 = 50; type is not a named fast type so falls through to isSlow
    expect(detectDoubtType("guessing", 60, 20)).toBe("overthinking");
  });

  test("unknown type at normal speed → general_error", () => {
    expect(detectDoubtType("some_other_type", 20, 20)).toBe("general_error");
  });
});

// ── generateDoubtInsight ───────────────────────────────────────────

describe("generateDoubtInsight", () => {
  test("guessing insight mentions topic and 'too quickly'", () => {
    const result = generateDoubtInsight("guessing", "Algebra");
    expect(result).toContain("Algebra");
    expect(result).toContain("too quickly");
  });

  test("concept_gap insight mentions topic and lesson", () => {
    const result = generateDoubtInsight("concept_gap", "Geometry");
    expect(result).toContain("Geometry");
    expect(result).toContain("lesson");
  });

  test("calculation_slip insight mentions topic", () => {
    const result = generateDoubtInsight("calculation_slip", "Arithmetic");
    expect(result).toContain("Arithmetic");
  });

  test("unknown doubt type → falls back to general_error message", () => {
    const result = generateDoubtInsight("unknown_type", "Math");
    expect(result).toContain("Math");
  });
});

// ── resolveDoubt ───────────────────────────────────────────────────

describe("resolveDoubt", () => {
  test("correct answer → returns null immediately", async () => {
    const result = await resolveDoubt("u1", "Q?", "correct", "A", [], 20, 20, "Algebra");
    expect(result).toBeNull();
    expect(mockSmartAIExplanation).not.toHaveBeenCalled();
  });

  test("concept_error → returns doubtType, insight, aiHelp, suggestedAction", async () => {
    mockSmartAIExplanation.mockResolvedValue("AI: review the concept.");
    const result = await resolveDoubt("u1", "Q?", "concept_error", "4", [], 20, 20, "Algebra");
    expect(result.doubtType).toBe("concept_gap");
    expect(result.insight).toContain("Algebra");
    expect(result.aiHelp).toBe("AI: review the concept.");
    expect(result.suggestedAction).toBe("revisit_lesson");
  });

  test("fast wrong answer → doubtType guessing + suggestedAction slow_down", async () => {
    mockSmartAIExplanation.mockResolvedValue(null);
    const result = await resolveDoubt("u1", "Q?", "concept_error", "A", [], 2, 20, "Math");
    expect(result.doubtType).toBe("guessing");
    expect(result.suggestedAction).toBe("slow_down");
  });

  test("calculation_error → suggestedAction practice_arithmetic", async () => {
    mockSmartAIExplanation.mockResolvedValue(null);
    const result = await resolveDoubt("u1", "Q?", "calculation_error", "A", [], 20, 20, "Algebra");
    expect(result.suggestedAction).toBe("practice_arithmetic");
  });
});
