import { calculateExamScore, normalizeScores, assignRanks, computeDynamicDifficulty } from "../services/scoringService.js";

describe("calculateExamScore", () => {
  test("all correct answers → positive score", () => {
    const answers = [
      { isCorrect: true,  difficulty: 0.5, timeTaken: 20 },
      { isCorrect: true,  difficulty: 0.8, timeTaken: 20 },
    ];
    expect(calculateExamScore(answers)).toBeGreaterThan(0);
  });

  test("all incorrect → score = 0", () => {
    const answers = [
      { isCorrect: false, difficulty: 0.5, timeTaken: 20 },
    ];
    expect(calculateExamScore(answers)).toBe(0);
  });

  test("faster answer earns higher timeFactor (up to 1.5x)", () => {
    const fast = calculateExamScore([{ isCorrect: true, difficulty: 0.5, timeTaken: 5 }]);
    const slow = calculateExamScore([{ isCorrect: true, difficulty: 0.5, timeTaken: 60 }]);
    expect(fast).toBeGreaterThan(slow);
  });

  test("negative marking: wrong answer doesn't add score", () => {
    const answers = [
      { isCorrect: true,  difficulty: 0.5, timeTaken: 20 },
      { isCorrect: false, difficulty: 0.5, timeTaken: 20 },
    ];
    const mixedScore = calculateExamScore(answers);
    const allCorrect = calculateExamScore([{ isCorrect: true, difficulty: 0.5, timeTaken: 20 }]);
    expect(mixedScore).toBe(allCorrect); // wrong answers don't subtract in this engine
  });
});

describe("normalizeScores", () => {
  test("single attempt → normalizedScore = 0 (std = 0)", () => {
    const attempts = [{ rawScore: 5, _doc: { rawScore: 5 }, _id: "a1" }];
    const result = normalizeScores(attempts);
    expect(result[0].normalizedScore).toBe(0);
  });

  test("multiple attempts → returns z-scores", () => {
    const attempts = [
      { rawScore: 10, _doc: { rawScore: 10 }, _id: "a1" },
      { rawScore: 20, _doc: { rawScore: 20 }, _id: "a2" },
      { rawScore: 30, _doc: { rawScore: 30 }, _id: "a3" },
    ];
    const result = normalizeScores(attempts);
    expect(result.find((r) => r._id === "a3").normalizedScore).toBeGreaterThan(0);
    expect(result.find((r) => r._id === "a1").normalizedScore).toBeLessThan(0);
  });
});

describe("assignRanks", () => {
  test("highest normalizedScore gets rank 1", () => {
    const attempts = [
      { normalizedScore: 1.0, _id: "a1" },
      { normalizedScore: 0.5, _id: "a2" },
      { normalizedScore: -1.0, _id: "a3" },
    ];
    const ranked = assignRanks(attempts);
    expect(ranked.find((r) => r._id === "a1").rank).toBe(1);
  });

  test("tied scores get consecutive ranks (no deduplication)", () => {
    const attempts = [
      { normalizedScore: 1.0, _id: "a1" },
      { normalizedScore: 1.0, _id: "a2" },
    ];
    const ranked = assignRanks(attempts);
    const ranks = ranked.map((r) => r.rank).sort();
    expect(ranks).toEqual([1, 2]);
  });
});

describe("computeDynamicDifficulty", () => {
  test("100% correct rate → difficulty decreases", () => {
    const updated = computeDynamicDifficulty(0.5, 1.0, 20, 20);
    expect(updated).toBeLessThan(0.5);
  });

  test("0% correct rate → difficulty increases", () => {
    const updated = computeDynamicDifficulty(0.5, 0.0, 20, 20);
    expect(updated).toBeGreaterThan(0.5);
  });

  test("output is always a finite number", () => {
    const d = computeDynamicDifficulty(0.5, 0.5, 20, 20);
    expect(Number.isFinite(d)).toBe(true);
  });
});
