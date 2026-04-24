import { analyzeAnswer, classifyThinkingProfile } from "../services/analysisService.js";

const baseQuestion = { expectedTime: 20, options: [] };

describe("analyzeAnswer", () => {
  test("correct selectedType → isCorrect:true", () => {
    const result = analyzeAnswer(baseQuestion, "correct", 20, "medium");
    expect(result.isCorrect).toBe(true);
  });

  test("wrong + fast time (< 50% expected) → behavior overridden to guessing", () => {
    const result = analyzeAnswer(baseQuestion, "concept_error", 8, "medium"); // 8 < 10
    expect(result.behavior).toBe("guessing");
    expect(result.speedProfile).toBe("guessing");
  });

  test("high confidence + wrong → confidenceInsight = dangerous_misconception", () => {
    const result = analyzeAnswer(baseQuestion, "concept_error", 20, "high");
    expect(result.confidenceInsight).toBe("dangerous_misconception");
  });

  test("low confidence + correct → confidenceInsight = unstable_knowledge", () => {
    const result = analyzeAnswer(baseQuestion, "correct", 20, "low");
    expect(result.confidenceInsight).toBe("unstable_knowledge");
  });

  test("slow + correct → speedProfile = deep_thinker", () => {
    const result = analyzeAnswer(baseQuestion, "correct", 50, "medium"); // 50 > 40
    expect(result.speedProfile).toBe("deep_thinker");
  });

  test("fast + correct → speedProfile = mastery", () => {
    const result = analyzeAnswer(baseQuestion, "correct", 5, "medium");
    expect(result.speedProfile).toBe("mastery");
  });

  test("returns non-empty message string", () => {
    const result = analyzeAnswer(baseQuestion, "concept_error", 20, "medium");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });
});

describe("classifyThinkingProfile", () => {
  const VALID_PROFILES = ["Guesser", "Deep Thinker", "Pattern Recognizer", "Surface Learner", "Overthinker"];

  test("high guessing rate → Guesser", () => {
    const stats = { guessing: 10, concept_error: 1, calculation_error: 1, partial_logic: 1 };
    expect(classifyThinkingProfile(stats, 0.4)).toBe("Guesser");
  });

  test("high accuracy → Deep Thinker", () => {
    const stats = { guessing: 0, concept_error: 0, calculation_error: 0, partial_logic: 0 };
    expect(classifyThinkingProfile(stats, 0.9)).toBe("Deep Thinker");
  });

  test("always returns a valid profile type", () => {
    const stats = { guessing: 2, concept_error: 5, calculation_error: 2, partial_logic: 3 };
    const result = classifyThinkingProfile(stats, 0.55);
    expect(VALID_PROFILES).toContain(result);
  });
});
