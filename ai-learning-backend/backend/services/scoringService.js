// ── Scoring Engine ────────────────────────────────────────────────
export const calculateExamScore = (answers) => {
  let score = 0;

  answers.forEach((a) => {
    if (!a.isCorrect) return;

    const difficulty = a.difficulty || 0.5;

    // Time factor: bonus for fast, slight penalty for very slow
    const expectedTime = 20;
    const timeTaken = a.timeTaken || expectedTime;
    const timeFactor = Math.min(1.5, Math.max(0.5, expectedTime / timeTaken));

    score += difficulty * timeFactor;
  });

  return parseFloat(score.toFixed(4));
};

// ── Normalization Engine (Z-score) ────────────────────────────────
export const normalizeScores = (attempts) => {
  const scores = attempts.map((a) => a.rawScore);
  const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
  const std = Math.sqrt(
    scores.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / scores.length
  );

  return attempts.map((a) => ({
    ...a._doc,
    _id: a._id,
    normalizedScore: std === 0 ? 0 : parseFloat(((a.rawScore - mean) / std).toFixed(4)),
  }));
};

// ── Ranking Engine ────────────────────────────────────────────────
export const assignRanks = (attempts) => {
  const sorted = [...attempts].sort((a, b) => b.normalizedScore - a.normalizedScore);
  const total = sorted.length;

  return sorted.map((a, i) => ({
    ...a,
    rank: i + 1,
    percentile: parseFloat((((total - i - 1) / total) * 100).toFixed(1)),
  }));
};

// ── Difficulty Score Update (self-learning) ────────────────────────
export const computeDynamicDifficulty = (oldDifficulty, correctRate, avgTime, expectedTime) => {
  const rawDiff = (1 - correctRate) * 0.7 + (avgTime / expectedTime) * 0.3;
  // Smooth update: 80% old, 20% new
  return parseFloat((0.8 * oldDifficulty + 0.2 * rawDiff).toFixed(4));
};
