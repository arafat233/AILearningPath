import { describe, it, expect } from "@jest/globals";
import { calculateExamScore, normalizeScores } from "../services/scoringService.js";

describe("calculateExamScore", () => {
  it("returns 0 for all wrong answers", () => {
    const answers = [
      { isCorrect: false, difficulty: 0.5, timeTaken: 20 },
      { isCorrect: false, difficulty: 0.8, timeTaken: 15 },
    ];
    expect(calculateExamScore(answers)).toBe(0);
  });

  it("returns positive score for correct answers", () => {
    const answers = [
      { isCorrect: true, difficulty: 0.5, timeTaken: 20 },
      { isCorrect: true, difficulty: 0.8, timeTaken: 20 },
    ];
    const score = calculateExamScore(answers);
    expect(score).toBeGreaterThan(0);
  });

  it("fast correct answer scores higher than slow correct answer", () => {
    const fast = calculateExamScore([{ isCorrect: true, difficulty: 0.5, timeTaken: 5  }]);
    const slow = calculateExamScore([{ isCorrect: true, difficulty: 0.5, timeTaken: 60 }]);
    expect(fast).toBeGreaterThan(slow);
  });

  it("higher difficulty correct answer scores more than lower difficulty", () => {
    const hard = calculateExamScore([{ isCorrect: true, difficulty: 0.9, timeTaken: 20 }]);
    const easy = calculateExamScore([{ isCorrect: true, difficulty: 0.2, timeTaken: 20 }]);
    expect(hard).toBeGreaterThan(easy);
  });
});

describe("normalizeScores", () => {
  it("identical scores all normalize to 0", () => {
    const attempts = [
      { rawScore: 5, _doc: { rawScore: 5 } },
      { rawScore: 5, _doc: { rawScore: 5 } },
      { rawScore: 5, _doc: { rawScore: 5 } },
    ];
    const result = normalizeScores(attempts);
    result.forEach((r) => expect(r.normalizedScore).toBe(0));
  });

  it("returns one entry per attempt", () => {
    const attempts = [
      { rawScore: 3, _doc: { rawScore: 3 } },
      { rawScore: 7, _doc: { rawScore: 7 } },
    ];
    const result = normalizeScores(attempts);
    expect(result).toHaveLength(2);
  });
});
