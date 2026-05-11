import { Question, UserProfile, SeenQuestion, User } from "../models/index.js";
import { generateAIQuestion } from "./aiService.js";
import { isIcseTopicId } from "../utils/boardFilter.js";

// excludeIds: question IDs to never serve (e.g. already shown this session).
// Applied even in the "all seen — reset" fallback so the same question
// is never returned back-to-back within a session.
export const getNextQuestion = async (userId, topic, excludeIds = []) => {
  // Board guard: never serve a question whose topicId doesn't match user's board
  try {
    const u = await User.findById(userId).select("examBoard").lean();
    const userBoard = (u?.examBoard || "CBSE").toUpperCase();
    const topicIsIcse = isIcseTopicId(topic);
    if (topicIsIcse && userBoard !== "ICSE") return null;
    if (!topicIsIcse && userBoard === "ICSE") return null;
  } catch { /* if board lookup fails, fall through to legacy behaviour */ }

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
        const seenIds = [...new Set([...seenForTopic.map((s) => s.questionId), ...excludeIds])];

        const existingAIQ = await Question.findOne({
          topic,
          isAIGenerated: true,
          isFlagged: { $ne: true },
          deletedAt: null,
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

  // Get already-seen question IDs for this user+topic.
  // Cap at 100 most-recent to keep the $nin list small — beyond this the
  // SeenQuestion TTL index (60-day expiry) handles long-term reset automatically.
  const seen = await SeenQuestion.find({ userId, topic })
    .sort({ seenAt: -1 })
    .limit(100)
    .select("questionId")
    .lean();
  // Merge DB-seen + caller-supplied exclusions (e.g. shown this session)
  const seenIds = [...new Set([...seen.map((s) => s.questionId), ...excludeIds])];

  // Only serve gradeable questions: MCQ type AND must have at least one option
  const mcqFilter = {
    questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
    "options.0": { $exists: true },
  };

  // Try unseen questions near target difficulty
  let questions = await Question.find({
    topic,
    ...mcqFilter,
    isFlagged: { $ne: true },
    deletedAt: null,
    difficultyScore: { $gte: targetDifficulty - 0.2, $lte: targetDifficulty + 0.2 },
    ...(seenIds.length ? { _id: { $nin: seenIds } } : {}),
  }).lean();

  // If all seen, widen difficulty range (still honouring excludeIds)
  if (!questions.length) {
    questions = await Question.find({
      topic,
      ...mcqFilter,
      isFlagged: { $ne: true },
      deletedAt: null,
      ...(seenIds.length ? { _id: { $nin: seenIds } } : {}),
    }).lean();
  }

  // All questions seen — reset SeenQuestion history but still respect excludeIds
  // so we never serve the question the user JUST answered.
  if (!questions.length) {
    questions = await Question.find({
      topic,
      ...mcqFilter,
      isFlagged: { $ne: true },
      deletedAt: null,
      ...(excludeIds.length ? { _id: { $nin: excludeIds } } : {}),
    }).lean();
  }

  // Fallback: topic param may be a Science topicId (e.g. "sci_ch5_photosynthesis") —
  // retry querying by Question.topicId field since those questions keep chapter-level topic strings.
  if (!questions.length && topic.startsWith("sci_")) {
    questions = await Question.find({
      topicId: topic,
      ...mcqFilter,
      isFlagged: { $ne: true },
      deletedAt: null,
      ...(excludeIds.length ? { _id: { $nin: excludeIds } } : {}),
    }).lean();
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
