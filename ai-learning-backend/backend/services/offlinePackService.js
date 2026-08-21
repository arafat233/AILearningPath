import { Attempt, Question, UserProfile } from "../models/index.js";

const PACK_TOPICS = 5;
const PER_TOPIC = 8;

/**
 * Build a downloadable practice pack for low-connectivity use.
 * Includes correctIndex + solution so the CLIENT can grade offline —
 * an accepted trade-off: offline grading is impossible without the key.
 */
export async function buildOfflinePack(userId) {
  const profile = await UserProfile.findOne({ userId }).select("topicProgress").lean();
  // Weakest topics first; fall back to any practiced topic
  const topics = (profile?.topicProgress || [])
    .filter((tp) => (tp.attempts || 0) > 0)
    .sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))
    .slice(0, PACK_TOPICS)
    .map((tp) => tp.topic);
  if (!topics.length) return { generatedAt: new Date(), topics: [], questions: [] };

  const raw = await Question.find({
    topic: { $in: topics },
    deletedAt: null,
    questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
    "options.0": { $exists: true },
  })
    .select("questionText topic subject difficulty options solutionSteps")
    .limit(PACK_TOPICS * PER_TOPIC * 3)
    .lean();

  // Cap per topic so one big topic doesn't eat the whole pack
  const perTopicCount = {};
  const questions = [];
  for (const q of raw) {
    if ((perTopicCount[q.topic] || 0) >= PER_TOPIC) continue;
    const correctIndex = (q.options || []).findIndex((o) => o.type === "correct");
    if (correctIndex < 0) continue;
    perTopicCount[q.topic] = (perTopicCount[q.topic] || 0) + 1;
    questions.push({
      id: String(q._id),
      questionText: q.questionText,
      topic: q.topic,
      subject: q.subject,
      difficulty: q.difficulty,
      options: q.options.map((o) => o.text),
      correctIndex,
      solution: (q.solutionSteps || []).join("\n") || null,
    });
  }

  return { generatedAt: new Date(), topics: [...new Set(questions.map((q) => q.topic))], questions };
}

/**
 * Sync attempts made offline. Correctness and mistake-type are derived
 * SERVER-SIDE from the stored question — the client's verdict is not trusted.
 * ponytail: creates Attempt records only (feeds analytics/mistakes/heatmaps);
 * add UserProfile recompute if offline volume warrants it.
 */
export async function syncOfflineAttempts(userId, attempts) {
  const capped = attempts.slice(0, 200);
  const ids = [...new Set(capped.map((a) => a.questionId))];
  const questions = await Question.find({ _id: { $in: ids } }).select("topic options").lean();
  const qById = new Map(questions.map((q) => [String(q._id), q]));

  const docs = [];
  for (const a of capped) {
    const q = qById.get(String(a.questionId));
    if (!q) continue;
    const idx = Number(a.selectedOptionIndex);
    const opt = (q.options || [])[idx];
    if (!opt) continue;
    docs.push({
      userId,
      questionId: String(a.questionId),
      topic: q.topic,
      isCorrect: opt.type === "correct",
      selectedType: opt.type,
      timeTaken: Math.min(Math.max(Number(a.timeTaken) || 30, 1), 600),
      createdAt: a.answeredAt ? new Date(a.answeredAt) : new Date(),
    });
  }
  if (docs.length) await Attempt.insertMany(docs);
  return { synced: docs.length, skipped: capped.length - docs.length };
}
