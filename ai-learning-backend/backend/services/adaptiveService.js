import { Question, UserProfile, SeenQuestion } from "../models/index.js";
import { generateAIQuestion } from "./aiService.js";

export const getNextQuestion = async (userId, topic) => {
  const profile = await UserProfile.findOne({ userId });

  let targetDifficulty = 0.5;
  let weakness = null;

  if (profile) {
    const { accuracy, behaviorStats } = profile;
    if (accuracy > 0.8) targetDifficulty = 0.75;
    else if (accuracy < 0.4) targetDifficulty = 0.25;

    const sorted = Object.entries(behaviorStats || {}).sort((a, b) => b[1] - a[1]);
    if (sorted.length && sorted[0][1] > 5) weakness = sorted[0][0];

    // AI question for persistent concept errors
    if (weakness === "concept_error" && (behaviorStats?.concept_error || 0) > 5) {
      try {
        const aiQ = await generateAIQuestion(topic, weakness);
        if (aiQ) return { ...aiQ, isAIGenerated: true };
      } catch { /* fallback to DB */ }
    }
  }

  // Get already-seen question IDs for this user+topic
  const seen = await SeenQuestion.find({ userId, topic }).select("questionId").lean();
  const seenIds = seen.map((s) => s.questionId);

  // Try unseen questions near target difficulty
  let questions = await Question.find({
    topic,
    isFlagged: { $ne: true },
    difficultyScore: { $gte: targetDifficulty - 0.2, $lte: targetDifficulty + 0.2 },
    ...(seenIds.length ? { _id: { $nin: seenIds } } : {}),
  }).lean();

  // If all seen, widen difficulty range
  if (!questions.length) {
    questions = await Question.find({
      topic,
      isFlagged: { $ne: true },
      ...(seenIds.length ? { _id: { $nin: seenIds } } : {}),
    }).lean();
  }

  // If truly all seen, reset and serve any
  if (!questions.length) {
    questions = await Question.find({ topic, isFlagged: { $ne: true } }).lean();
  }

  if (!questions.length) return null;

  const q = questions[Math.floor(Math.random() * questions.length)];

  // Mark as seen (ignore duplicate key errors)
  SeenQuestion.create({ userId, questionId: q._id.toString(), topic }).catch(() => {});

  return q;
};
