import { Attempt, Question } from "../models/index.js";

// selectedType on Attempt is the distractor category of the chosen option —
// it doubles as the "why you got this wrong" explanation.
const WHY_WRONG = {
  concept_error:     "Concept gap — the underlying idea isn't solid yet",
  calculation_error: "Calculation slip — right approach, wrong arithmetic",
  partial_logic:     "Partial logic — started right but didn't finish the reasoning",
  guessing:          "Guessed — no working shown toward the answer",
  misinterpretation: "Misread — the question asked something else",
};

// ponytail: fixed 3-day retry gap; wire to revisionService stages if retention data warrants
const RETRY_AFTER_DAYS = 3;
const RETRY_MS = RETRY_AFTER_DAYS * 864e5;

/**
 * Derive the mistake notebook from existing Attempt records — wrong answers
 * are already auto-saved on every submit, so no new collection is needed.
 * A question appears while its MOST RECENT attempt is wrong; answering it
 * correctly later removes it (self-cleaning).
 */
export const getMistakes = async (userId, { topic = null, limit = 50 } = {}) => {
  const filter = { userId };
  if (topic) filter.topic = topic;

  // Latest attempt per question decides still-wrong status.
  // ponytail: in-memory group over last 1000 attempts; move to an aggregation if users exceed that
  const attempts = await Attempt.find(filter)
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();

  const latestByQuestion = new Map();
  for (const a of attempts) {
    const qid = String(a.questionId);
    if (!latestByQuestion.has(qid)) latestByQuestion.set(qid, a);
  }
  const wrong = [...latestByQuestion.values()]
    .filter((a) => !a.isCorrect)
    .slice(0, limit);
  if (!wrong.length) return [];

  const questions = await Question.find({
    _id: { $in: wrong.map((a) => a.questionId) },
    deletedAt: null,
  })
    .select("questionText topic subject difficulty options correctAnswer conceptTested")
    .lean();
  const qById = new Map(questions.map((q) => [String(q._id), q]));

  const mistakes = [];
  for (const a of wrong) {
    const q = qById.get(String(a.questionId));
    if (!q) continue;
    const selected = (q.options || []).find((o) => o.type === a.selectedType);
    const correct = (q.options || []).find((o) => o.type === "correct");
    const wrongAt = new Date(a.createdAt);
    mistakes.push({
      questionId:    String(q._id),
      questionText:  q.questionText,
      topic:         q.topic,
      subject:       q.subject,
      conceptTested: q.conceptTested || null,
      difficulty:    a.difficulty || q.difficulty,
      selectedAnswer: selected?.text ?? null,
      correctAnswer:  correct?.text ?? q.correctAnswer ?? null,
      whyWrong:      WHY_WRONG[a.selectedType] || "Incorrect answer",
      wrongAt,
      retryDate:     new Date(wrongAt.getTime() + RETRY_MS),
      dueForRetry:   Date.now() >= wrongAt.getTime() + RETRY_MS,
    });
  }

  // Similar questions: same topic + difficulty, playable, excluding the mistake itself
  const topics = [...new Set(mistakes.map((m) => m.topic))];
  const pool = await Question.find({
    topic: { $in: topics },
    deletedAt: null,
    questionType: { $in: ["mcq", "assertion_reason", "case_based"] },
    "options.0": { $exists: true },
  })
    .select("topic difficulty")
    .limit(2000)
    .lean();

  for (const m of mistakes) {
    m.similarQuestionIds = pool
      .filter(
        (p) =>
          p.topic === m.topic &&
          p.difficulty === m.difficulty &&
          String(p._id) !== m.questionId
      )
      .slice(0, 3)
      .map((p) => String(p._id));
  }

  return mistakes;
};
