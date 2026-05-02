/**
 * Adaptive Recommender Service — Node.js port of recommender_engine.py
 *
 * Implements mastery tracking, fluke/stuck detection, routing-token resolution,
 * and prerequisite-gated topic recommendation using the fine-grained topic DAG.
 *
 * Data lives in MongoDB:
 *   UserTopicMastery — per-user, per-topicId state (attempts, mastery flags)
 *   Question         — questionId, topicId, difficulty, routing, timeThresholds
 *   Topic            — topicId, prerequisites, level (DAG)
 */

import { Question, Topic, UserTopicMastery } from "../models/index.js";
import { getDynamicQuestion, hasDynamicTemplate } from "./questionTemplateService.js";

// ── Mastery thresholds (from recommender_config.json) ────────────────────────
const MASTERY_CFG = {
  easy:   { minAttempts: 5, correctRequired: 4, window: 5 },
  medium: { minAttempts: 7, correctRequired: 5, window: 7, noMisconceptionIn: 3 },
  hard:   { minAttempts: 5, correctRequired: 3, window: 5, noFlukeIn: 3, minSecondsOnTopic: 480 },
};

// ── Pure helpers ─────────────────────────────────────────────────────────────

export function checkMastery(attemptsAtDiff, difficulty, secondsOnTopic = 0) {
  const cfg = MASTERY_CFG[difficulty];
  if (attemptsAtDiff.length < cfg.minAttempts) return false;

  const recent   = attemptsAtDiff.slice(-cfg.window);
  const nCorrect = recent.filter((a) => a.correct).length;

  if (difficulty === "easy") {
    return nCorrect >= cfg.correctRequired;
  }
  if (difficulty === "medium") {
    if (nCorrect < cfg.correctRequired) return false;
    const last3 = attemptsAtDiff.slice(-cfg.noMisconceptionIn);
    return !last3.some((a) => a.misconceptionId);
  }
  if (difficulty === "hard") {
    if (nCorrect < cfg.correctRequired) return false;
    if (secondsOnTopic < cfg.minSecondsOnTopic) return false;
    const last3 = attemptsAtDiff.slice(-cfg.noFlukeIn);
    return !last3.some((a) => a.flukeDetected);
  }
  return false;
}

export function detectFluke(question, correct, timeTakenSec, priorAttemptsAtDiff) {
  if (!correct) return false;
  const guessBelow = question?.timeThresholds?.guessBelow;
  if (guessBelow && timeTakenSec < guessBelow) return true;
  // Correct answer after 3 consecutive wrongs at same difficulty
  if (priorAttemptsAtDiff.length >= 3) {
    const last3 = priorAttemptsAtDiff.slice(-3);
    if (last3.every((a) => !a.correct)) return true;
  }
  return false;
}

// ── DB helpers ───────────────────────────────────────────────────────────────

async function getOrCreateMastery(userId, topicId) {
  let tm = await UserTopicMastery.findOne({ userId, topicId });
  if (!tm) {
    const topicDoc = await Topic.findOne({ topicId }).lean();
    tm = await UserTopicMastery.create({
      userId,
      topicId,
      chapterNumber: topicDoc?.chapterNumber ?? null,
    });
  }
  return tm;
}

function stripQuestion(q) {
  return {
    _id:             q._id,
    questionId:      q.questionId,
    questionText:    q.questionText,
    questionType:    q.questionType,
    options:         (q.options ?? []).map((o) => ({ text: o.text })),
    expectedTime:    q.expectedTime,
    difficultyScore: q.difficultyScore,
    difficulty:      q.difficulty,
    marks:           q.marks || 1,
    hintLevels:      q.hintLevels || [],
    timeThresholds:  q.timeThresholds,
  };
}

async function serveAtDifficulty(topicId, difficulty, reason, excludeIds = [], userId = null) {
  // Prefer dynamic variant when a template exists — each student gets a unique question
  if (userId && hasDynamicTemplate(topicId, difficulty)) {
    const tm         = await UserTopicMastery.findOne({ userId, topicId }).lean();
    const attemptN   = (tm?.attempts ?? []).filter((a) => a.difficulty === difficulty).length;
    const dynQ       = getDynamicQuestion(topicId, difficulty, String(userId), attemptN);
    if (dynQ) {
      return {
        action:   "serve_question",
        question: { ...dynQ, _isDynamic: true },
        reason:   `${reason} [dynamic variant]`,
      };
    }
  }

  const q = await Question.findOne({
    topicId,
    difficulty,
    isFlagged: { $ne: true },
    deletedAt:  null,
    ...(excludeIds.length ? { questionId: { $nin: excludeIds } } : {}),
  }).lean();

  if (!q) {
    // All questions seen — fall back to any question at this difficulty
    const fallback = await Question.findOne({ topicId, difficulty, isFlagged: { $ne: true }, deletedAt: null }).lean();
    if (!fallback) return { action: "no_questions", reason: `No ${difficulty} questions for ${topicId}.` };
    return { action: "serve_question", question: stripQuestion(fallback), reason: `${reason} (repeating)` };
  }
  return { action: "serve_question", question: stripQuestion(q), reason };
}

// ── Routing token resolution ─────────────────────────────────────────────────

async function resolveRouting(target, topicId, tm, reason, excludeIds, userId = null) {
  if (target === "next_difficulty_up") {
    const cur = tm.currentDifficulty;
    if (cur === "easy" && tm.mastery.easy) {
      return serveAtDifficulty(topicId, "medium", `${reason} Mastered easy → medium.`, excludeIds, userId);
    }
    if (cur === "medium" && tm.mastery.medium) {
      return serveAtDifficulty(topicId, "hard", `${reason} Mastered medium → hard.`, excludeIds, userId);
    }
    if (cur === "hard" && tm.mastery.hard) {
      return { action: "topic_mastered", topicId, reason: `${reason} Topic fully mastered.` };
    }
    return serveAtDifficulty(topicId, cur, `${reason} Continuing same difficulty.`, excludeIds, userId);
  }

  if (target === "topic_mastery_check") {
    if (tm.mastery.easy && tm.mastery.medium && tm.mastery.hard) {
      return { action: "topic_mastered", topicId, reason };
    }
    return serveAtDifficulty(topicId, tm.currentDifficulty, `${reason} Revising.`, excludeIds, userId);
  }

  if (target?.startsWith("next_hard_different_subtype")) {
    return serveAtDifficulty(topicId, "hard", `${reason} Different hard subtype.`, excludeIds, userId);
  }

  // Direct question ID pointer
  if (target?.startsWith("q_")) {
    const q = await Question.findOne({ questionId: target }).lean();
    if (q) return { action: "serve_question", question: stripQuestion(q), reason };
  }

  // Teaching content reference  (e.g. "ch1_s1_c1_t1:concept_video")
  if (target?.includes(":")) {
    return { action: "serve_teaching", target, reason };
  }

  // Unknown — fall back to current difficulty
  return serveAtDifficulty(topicId, tm.currentDifficulty, `${reason} (unknown routing target)`, excludeIds, userId);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Record an attempt, detect fluke/misconception, update mastery, advance difficulty.
 * Returns the recorded attempt plus updated mastery state.
 */
export async function recordAttempt(userId, topicId, questionId, correct, timeSec, selectedOptionIndex = null, hintsUsed = 0) {
  const question = await Question.findOne({ questionId }).lean();
  const difficulty = question?.difficulty || "easy";

  const tm = await getOrCreateMastery(userId, topicId);

  const priorAtDiff = tm.attempts.filter((a) => a.difficulty === difficulty);
  const flukeDetected = detectFluke(question, correct, timeSec, priorAtDiff);

  let misconceptionId = null;
  if (!correct && selectedOptionIndex != null && question?.options) {
    const opt = question.options[selectedOptionIndex];
    if (opt?.logicTag) misconceptionId = opt.logicTag;
  }

  tm.attempts.push({ questionId, correct, timeTakenSec: timeSec, difficulty, hintsUsed, flukeDetected, misconceptionId });
  tm.secondsOnTopic += timeSec;

  // Recompute mastery for the difficulty just answered
  const updatedAtDiff = tm.attempts.filter((a) => a.difficulty === difficulty);
  tm.mastery[difficulty] = checkMastery(updatedAtDiff, difficulty, tm.secondsOnTopic);

  // Advance current difficulty pointer if mastered
  if (tm.currentDifficulty === "easy"   && tm.mastery.easy)   tm.currentDifficulty = "medium";
  if (tm.currentDifficulty === "medium" && tm.mastery.medium) tm.currentDifficulty = "hard";

  tm.updatedAt = new Date();
  await tm.save();

  return {
    attempt: tm.attempts[tm.attempts.length - 1],
    mastery: tm.mastery,
    currentDifficulty: tm.currentDifficulty,
    flukeDetected,
  };
}

/**
 * Return the next question to serve for a given topicId.
 * Action types:
 *   serve_question  — { question }
 *   serve_teaching  — { target }  (teaching content ref)
 *   topic_mastered  — signal caller to call nextTopic()
 *   no_questions    — no questions available at all
 */
export async function nextQuestion(userId, topicId) {
  const tm = await getOrCreateMastery(userId, topicId);

  // Already fully mastered
  if (tm.mastery.easy && tm.mastery.medium && tm.mastery.hard) {
    return { action: "topic_mastered", topicId, reason: "All difficulties mastered." };
  }

  // Recently seen question IDs (last 20 in this topic) — avoid repeats
  const recentIds = tm.attempts.slice(-20).map((a) => a.questionId).filter(Boolean);

  // No attempts yet — start with first easy question
  if (tm.attempts.length === 0) {
    return serveAtDifficulty(topicId, "easy", "Starting topic — first easy question.", recentIds, userId);
  }

  const lastAttempt  = tm.attempts[tm.attempts.length - 1];
  // Dynamic questions don't have a DB questionId — skip DB lookup if it's a dynamic attempt
  const lastQuestion = lastAttempt.questionId?.startsWith("t_")
    ? null
    : await Question.findOne({ questionId: lastAttempt.questionId }).lean();

  if (!lastQuestion) {
    return serveAtDifficulty(topicId, tm.currentDifficulty, "Fallback — last question not found.", recentIds, userId);
  }

  const routing = lastQuestion.routing || {};

  // Priority order (from algorithm_spec / recommender_config):
  // 1. Fluke detected
  if (lastAttempt.flukeDetected && routing.ifFlukeDetected) {
    return resolveRouting(routing.ifFlukeDetected, topicId, tm, "Fluke detected — verify.", recentIds, userId);
  }
  // 2. Stuck (3+ hints used and wrong)
  if (!lastAttempt.correct && lastAttempt.hintsUsed >= 3 && routing.ifStuck) {
    return { action: "serve_teaching", target: routing.ifStuck, reason: "User stuck — redirecting to teaching." };
  }
  // 3. Correct
  if (lastAttempt.correct && routing.ifCorrect) {
    return resolveRouting(routing.ifCorrect, topicId, tm, "Correct — advancing.", recentIds, userId);
  }
  // 4. Wrong
  if (!lastAttempt.correct && routing.ifWrong) {
    return resolveRouting(routing.ifWrong, topicId, tm, "Wrong — practicing easier/prereq.", recentIds, userId);
  }

  // No routing rule — serve next at current difficulty
  return serveAtDifficulty(topicId, tm.currentDifficulty, "No routing rule matched.", recentIds, userId);
}

/**
 * Recommend the next topic for a user based on DAG prerequisites and mastery state.
 * Action types:
 *   continue_topic    — resume an in-progress topic
 *   recommend_new     — start a new eligible topic (all prereqs mastered)
 *   recommend_starter — start a level-0 foundational topic
 *   all_complete      — all 43 topics mastered
 */
export async function nextTopic(userId) {
  const allMastery = await UserTopicMastery.find({ userId }).lean();

  const masteredSet    = new Set(allMastery.filter((tm) => tm.mastery.easy && tm.mastery.medium && tm.mastery.hard).map((tm) => tm.topicId));
  const inProgressTids = allMastery.filter((tm) => (tm.mastery.easy || tm.mastery.medium) && !(tm.mastery.easy && tm.mastery.medium && tm.mastery.hard)).map((tm) => tm.topicId);

  // 1. Continue in-progress topic (lowest DAG level first)
  if (inProgressTids.length > 0) {
    const topics = await Topic.find({ topicId: { $in: inProgressTids } }).lean();
    topics.sort((a, b) => (a.level ?? 99) - (b.level ?? 99));
    if (topics[0]) {
      const t = topics[0];
      return { action: "continue_topic", topicId: t.topicId, topicName: t.name, level: t.level,
               reason: `Continue in-progress: ${t.name}` };
    }
  }

  // 2. Find eligible new topics (all prereqs mastered, not yet started or mastered)
  const allTopics = await Topic.find({ topicId: { $ne: null } }).lean();
  const startedSet = new Set(allMastery.map((tm) => tm.topicId));

  const eligible = allTopics.filter((t) =>
    !masteredSet.has(t.topicId) &&
    !startedSet.has(t.topicId) &&
    (t.prerequisites || []).every((p) => masteredSet.has(p))
  );

  if (eligible.length > 0) {
    eligible.sort((a, b) => (a.level ?? 99) - (b.level ?? 99));
    const t = eligible[0];
    return { action: "recommend_new", topicId: t.topicId, topicName: t.name, level: t.level,
             reason: `Next available: ${t.name}` };
  }

  // 3. Fallback to any level-0 topic not yet started
  const starter = allTopics.find((t) => (t.level ?? 99) === 0 && !startedSet.has(t.topicId));
  if (starter) {
    return { action: "recommend_starter", topicId: starter.topicId, topicName: starter.name, level: 0,
             reason: `Start with foundational: ${starter.name}` };
  }

  return { action: "all_complete", reason: "All available topics mastered!" };
}

/**
 * Initialise UserTopicMastery rows based on placement quiz results.
 * Called by placementController after scoring.
 *
 * placementByTopic: { topicId → label }
 * Labels (from placement_quiz_scorer.py):
 *   mastered_through_medium — easy=true, medium=true, start at hard
 *   mastered_easy           — easy=true, start at medium
 *   partial_familiarity     — no mastery, start at easy (default — skip)
 *   novice                  — no mastery, start at easy (default — skip)
 */
export async function applyPlacementResults(userId, placementByTopic) {
  const ops = [];

  for (const [topicId, label] of Object.entries(placementByTopic)) {
    if (label === "partial_familiarity" || label === "novice") continue;

    const chMatch     = topicId.match(/^ch(\d+)_/);
    const chapterNumber = chMatch ? parseInt(chMatch[1], 10) : null;

    const masteryPatch =
      label === "mastered_through_medium"
        ? { "mastery.easy": true, "mastery.medium": true, currentDifficulty: "hard" }
        : { "mastery.easy": true, currentDifficulty: "medium" }; // mastered_easy

    ops.push({
      updateOne: {
        filter: { userId, topicId },
        update: {
          $set:         { ...masteryPatch, updatedAt: new Date() },
          $setOnInsert: { userId, topicId, chapterNumber },
        },
        upsert: true,
      },
    });
  }

  if (ops.length > 0) await UserTopicMastery.bulkWrite(ops, { ordered: false });
}
