import { QuestionStats, Question } from "../models/index.js";
import { computeDynamicDifficulty } from "./scoringService.js";

// Called after every attempt to keep system self-improving
export const updateQuestionStats = async (questionId, isCorrect, timeTaken, selectedType) => {
  let stats = await QuestionStats.findOne({ questionId });

  if (!stats) {
    stats = new QuestionStats({ questionId });
  }

  stats.attempts += 1;
  if (isCorrect) stats.correct += 1;

  // Rolling average of time
  stats.avgTime = parseFloat(
    ((stats.avgTime * (stats.attempts - 1) + timeTaken) / stats.attempts).toFixed(1)
  );

  // Track error distribution
  if (selectedType && selectedType !== "correct") {
    stats.errorDistribution[selectedType] = (stats.errorDistribution[selectedType] || 0) + 1;
  }

  const correctRate = stats.correct / stats.attempts;
  const question = await Question.findById(questionId);
  const expectedTime = question?.expectedTime || 20;

  // Update dynamic difficulty
  stats.computedDifficulty = computeDynamicDifficulty(
    stats.computedDifficulty,
    correctRate,
    stats.avgTime,
    expectedTime
  );

  // Flag bad questions (too confusing or near-impossible)
  if (stats.attempts > 20) {
    const errorRate = (stats.attempts - stats.correct) / stats.attempts;
    if (errorRate > 0.95 || (stats.avgTime > expectedTime * 4 && errorRate > 0.85)) {
      stats.isBadQuestion = true;
    }
  }

  stats.updatedAt = new Date();
  await stats.save();

  // Sync difficulty back to the question document
  if (question) {
    question.difficultyScore = stats.computedDifficulty;
    if (stats.isBadQuestion) question.isFlagged = true;
    await question.save();
  }
};
