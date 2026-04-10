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

    // AI question for persistent concept errors —
    // DB-first: pick an existing AI question the user hasn't seen yet.
    // Only call Claude if none exists yet for this topic.
    if (weakness === "concept_error" && (behaviorStats?.concept_error || 0) > 5) {
      try {
        const seenForTopic = await SeenQuestion.find({ userId, topic }).select("questionId").lean();
        const seenIds = seenForTopic.map((s) => s.questionId);

        const existingAIQ = await Question.findOne({
          topic,
          isAIGenerated: true,
          isFlagged: { $ne: true },
          ...(seenIds.length ? { _id: { $nin: seenIds } } : {}),
        }).lean();

        if (existingAIQ) {
          // Reuse the stored question — zero AI cost
          SeenQuestion.create({ userId, questionId: existingAIQ._id.toString(), topic }).catch(() => {});
          return existingAIQ;
        }

        // Nothing in DB yet — generate once and save permanently
        const aiQ = await generateAIQuestion(topic, weakness);
        if (aiQ) {
          const saved = await Question.create({
            topic,
            questionText:  aiQ.questionText,
            options:       aiQ.options,
            solutionSteps: aiQ.solutionSteps || [],
            shortcut:      aiQ.shortcut || null,
            conceptTested: aiQ.conceptTested || null,
            expectedTime:  aiQ.expectedTime  || 25,
            difficultyScore: 0.65,
            isAIGenerated: true,
          });
          SeenQuestion.create({ userId, questionId: saved._id.toString(), topic }).catch(() => {});
          return { ...saved.toObject(), isAIGenerated: true };
        }
      } catch { /* fallback to regular DB question */ }
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

export const getInterleavedQuestion = async (userId, topics) => {
  const profile = await UserProfile.findOne({ userId });
  const topicProgress = profile?.topicProgress || [];

  // Weight topics by weakness — weak topics appear more often
  const weighted = topics.map((t) => {
    const tp = topicProgress.find((p) => p.topic === t);
    const accuracy = tp?.accuracy ?? 0.5;
    return { topic: t, weight: 1 - accuracy };
  });

  const totalWeight = weighted.reduce((s, t) => s + t.weight, 0) || 1;
  let rand = Math.random() * totalWeight;
  let chosen = weighted[0].topic;
  for (const w of weighted) {
    rand -= w.weight;
    if (rand <= 0) { chosen = w.topic; break; }
  }

  return getNextQuestion(userId, chosen);
};
