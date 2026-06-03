/**
 * proService — business logic for the pro-track Java pilot.
 *
 * Controllers in controllers/proController.js are intentionally thin and
 * just call these functions. All DB access + sandbox orchestration lives
 * here.
 *
 * PRO_TRACK_PLAN.md §4.4 lists the consumer endpoints. Names map 1:1.
 */

import {
  ProTrack, ProModule, ProTopic, ProExercise, ProProject,
  ProSubmission, ProProgress, ProBookmark, ProCertificate,
} from "../models/proModels.js";
import { User } from "../models/index.js";
import { sessionGet, sessionSet } from "../utils/redisClient.js";
import { AppError } from "../utils/AppError.js";
import { runTestCases } from "./codeExecutionService.js";
import { isEnrolled, invalidateEnrolment } from "../middleware/trackFilter.js";
import { trackEvent } from "../utils/eventTracker.js";
import logger from "../utils/logger.js";

// ── Tracks ──────────────────────────────────────────────────────────────────

export async function listTracks(userId) {
  const [user, allLive] = await Promise.all([
    User.findById(userId).select("tracks").lean(),
    ProTrack.find({ status: "live" }).select("key slug name description language iconUrl coverUrl totalModules totalTopics totalExercises totalXp").sort({ name: 1 }).lean(),
  ]);
  const enrolled = new Set((user?.tracks || []).map((t) => t.key));
  return allLive.map((t) => ({ ...t, enrolled: enrolled.has(t.key) }));
}

export async function getTrack(trackSlug, userId) {
  const track = await ProTrack.findOne({ slug: trackSlug, status: "live" }).lean();
  if (!track) throw new AppError("Track not found.", 404);
  if (!(await isEnrolled(userId, track.key))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const modules = await ProModule.find({ trackKey: track.key, status: "live" })
    .select("moduleId moduleNumber name slug description estimatedHours prerequisites")
    .sort({ moduleNumber: 1 })
    .lean();
  // Per-module topic count — one aggregation, used by ProCourseLanding to
  // show "5 topics" per module card without N round-trips.
  const topicCounts = await ProTopic.aggregate([
    { $match: { trackKey: track.key } },
    { $group: { _id: "$moduleId", count: { $sum: 1 } } },
  ]);
  const countByModuleId = new Map(topicCounts.map((t) => [t._id, t.count]));
  const modulesWithCounts = modules.map((m) => ({
    ...m,
    topicsCount: countByModuleId.get(m.moduleId) || 0,
  }));
  return { ...track, modules: modulesWithCounts };
}

// Track-2 practice list — flat, filterable view across the whole track for the
// "Must-Do" path (priority=P1) and pattern drills. Lightweight projection; the
// solution/test internals are never included (same anti-cheat stance as the
// single-exercise endpoint).
export async function getPracticeList(trackSlug, { priority, pattern } = {}, userId) {
  const track = await ProTrack.findOne({ slug: trackSlug, status: "live" }).lean();
  if (!track) throw new AppError("Track not found.", 404);
  if (!(await isEnrolled(userId, track.key))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const q = { trackKey: track.key };
  if (priority) q.priority = priority;
  if (pattern) q.pattern = pattern;
  const exercises = await ProExercise.find(q)
    .select("exerciseId topicId moduleId title level type priority pattern leetcodeId difficulty xpReward position")
    .sort({ moduleId: 1, position: 1 })
    .limit(1200)
    .lean();
  // Facet counts (for the filter chips) — over the whole track, not the filtered set.
  const facetAgg = await ProExercise.aggregate([
    { $match: { trackKey: track.key, priority: { $ne: null } } },
    { $group: { _id: "$priority", count: { $sum: 1 } } },
  ]);
  const priorityFacets = Object.fromEntries(facetAgg.map((f) => [f._id, f.count]));
  return { count: exercises.length, priorityFacets, exercises };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Track-2 "which pattern fits?" quiz. Samples n recognizable problems (real
// LeetCode-tagged code exercises) and builds multiple-choice questions: the
// correct `pattern` plus 3 distractor patterns. The answer is included so the
// UI can grade instantly — pattern tags are not secret (low-stakes learning quiz).
export async function getPatternQuiz(trackSlug, n, userId) {
  const track = await ProTrack.findOne({ slug: trackSlug, status: "live" }).lean();
  if (!track) throw new AppError("Track not found.", 404);
  if (!(await isEnrolled(userId, track.key))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const pool = await ProExercise.find({
    trackKey: track.key, type: "code_scratch",
    pattern: { $ne: null }, leetcodeId: { $ne: null },
  }).select("exerciseId leetcodeId title pattern").lean();

  const allPatterns = [...new Set(pool.map((e) => e.pattern))];
  const questions = shuffle(pool).slice(0, n).map((e) => {
    const distractors = shuffle(allPatterns.filter((p) => p !== e.pattern)).slice(0, 3);
    return {
      exerciseId: e.exerciseId,
      leetcodeId: e.leetcodeId,
      title: e.title,
      choices: shuffle([e.pattern, ...distractors]),
      answer: e.pattern,
    };
  });
  return { count: questions.length, patternCount: allPatterns.length, questions };
}

// ── Modules ─────────────────────────────────────────────────────────────────

export async function getModule(trackSlug, moduleId, userId) {
  const track = await ProTrack.findOne({ slug: trackSlug }).lean();
  if (!track) throw new AppError("Track not found.", 404);
  if (!(await isEnrolled(userId, track.key))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const module = await ProModule.findOne({ moduleId, trackKey: track.key }).lean();
  if (!module) throw new AppError("Module not found.", 404);
  const topics = await ProTopic.find({ moduleId, trackKey: track.key })
    .select("topicId topicNumber name slug estimatedMinutes difficulty xpReward")
    .sort({ topicNumber: 1 })
    .lean();
  return { ...module, topics };
}

// ── Topics ──────────────────────────────────────────────────────────────────

export async function getTopic(topicId, userId) {
  const cacheKey = `pro:topic:${topicId}`;
  let topic = await sessionGet(cacheKey);
  if (!topic) {
    topic = await ProTopic.findOne({ topicId }).lean();
    if (topic) await sessionSet(cacheKey, topic, 300); // 5 min — topic content is static
  }
  if (!topic) throw new AppError("Topic not found.", 404);
  if (!(await isEnrolled(userId, topic.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  trackEvent(userId, "pro.topic_viewed", { topicId, trackKey: topic.trackKey, moduleId: topic.moduleId });
  return topic;
}

export async function listExercisesForTopic(topicId, userId) {
  // Re-use the cached topic for the enrollment check (avoids a second DB hit)
  const topicCacheKey = `pro:topic:${topicId}`;
  let topic = await sessionGet(topicCacheKey);
  if (!topic) {
    topic = await ProTopic.findOne({ topicId }).lean();
    if (topic) await sessionSet(topicCacheKey, topic, 300);
  }
  if (!topic) throw new AppError("Topic not found.", 404);
  if (!(await isEnrolled(userId, topic.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }

  const exCacheKey = `pro:exercises:${topicId}`;
  const cached = await sessionGet(exCacheKey);
  if (cached) return cached;

  const exercises = await ProExercise.find({ topicId })
    .select("exerciseId level type title scenario instructions starterCode blanks hints xpReward difficulty priority pattern leetcodeId")
    .sort({ position: 1, exerciseId: 1 })
    .lean();
  await sessionSet(exCacheKey, exercises, 300);
  return exercises;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export async function getProject(projectId, userId) {
  const project = await ProProject.findOne({ projectId }).lean();
  if (!project) throw new AppError("Project not found.", 404);
  if (!(await isEnrolled(userId, project.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  trackEvent(userId, "pro.project_viewed", { projectId, trackKey: project.trackKey });
  return project;
}

// Projects are self-assessed: no Judge0. XP = sum of checked requirement weights.
export async function submitProject({ userId, projectId, code, checkedReqs = [] }) {
  if (!code || code.length === 0) throw new AppError("Code is required.", 400);
  if (code.length > 50_000) throw new AppError("Submission too large (>50KB).", 413);

  const project = await ProProject.findOne({ projectId }).lean();
  if (!project) throw new AppError("Project not found.", 404);
  if (!(await isEnrolled(userId, project.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }

  const checkedSet = new Set(checkedReqs);
  const xpAwarded  = (project.requirements || [])
    .filter(r => checkedSet.has(r.id))
    .reduce((sum, r) => sum + (r.weight || 0), 0);

  // Store as a ProSubmission (projectId path, no exerciseId)
  await ProSubmission.create({
    userId,
    trackKey:   project.trackKey,
    projectId,
    code,
    language:   "java",
    sandboxResult: { stdout: "", stderr: "", exitCode: 0, timeMs: 0, memoryKb: 0, status: "self_assessed" },
    testResults:   checkedReqs.map(id => ({ caseId: id, passed: true, message: "" })),
    passed: checkedReqs.length > 0,
    xpAwarded,
  });

  // Award XP to ProProgress
  if (xpAwarded > 0) {
    await ProProgress.updateOne(
      { userId, trackKey: project.trackKey },
      { $inc: { totalXp: xpAwarded }, $set: { lastActivityAt: new Date() } },
      { upsert: true }
    );
  }

  trackEvent(userId, "pro.project_submitted", {
    projectId, trackKey: project.trackKey, xpAwarded, checkedCount: checkedReqs.length,
  });

  return { xpAwarded, checkedCount: checkedReqs.length, totalReqs: project.requirements?.length ?? 0 };
}

// ── Exercises ───────────────────────────────────────────────────────────────

export async function getExercise(exerciseId, userId) {
  const ex = await ProExercise.findOne({ exerciseId }).lean();
  if (!ex) throw new AppError("Exercise not found.", 404);
  if (!(await isEnrolled(userId, ex.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  trackEvent(userId, "pro.exercise_started", {
    exerciseId, trackKey: ex.trackKey, topicId: ex.topicId, level: ex.level, type: ex.type,
  });
  // Strip expectedSolution + testCases from the client response — those
  // are graded server-side; never exposed.
  const { expectedSolution: _es, testCases: _tc, ...safe } = ex;
  return safe;
}

export async function submitExercise({ userId, exerciseId, code }) {
  if (!code || typeof code !== "string" || code.length === 0) {
    throw new AppError("Code is required.", 400);
  }
  if (code.length > 50_000) {
    throw new AppError("Submission too large (>50KB).", 413);
  }

  const ex = await ProExercise.findOne({ exerciseId }).lean();
  if (!ex) throw new AppError("Exercise not found.", 404);
  if (!(await isEnrolled(userId, ex.trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }

  const track = await ProTrack.findOne({ key: ex.trackKey }).select("language").lean();
  const language = track?.language || "java";

  const t0 = Date.now();
  const { sandboxResult, testResults, passed } = await runTestCases({
    userId,
    source: code,
    language,
    testCases: ex.testCases || [],
  });
  const durationMs = Date.now() - t0;

  const xpAwarded = passed ? (ex.xpReward || 0) : 0;

  // Record submission. PII guard: the user code is stored on ProSubmission
  // with a 30-day TTL (defined on the schema in models/proModels.js).
  await ProSubmission.create({
    userId,
    trackKey:   ex.trackKey,
    exerciseId,
    code,
    language,
    sandboxResult,
    testResults,
    passed,
    xpAwarded,
  });

  // Update progress (idempotent — completedExercises is a set)
  if (passed) {
    // Fetch current progress to compute streak change
    const progress = await ProProgress.findOne({ userId, trackKey: ex.trackKey });

    // Streak logic: compare lastActivityAt to today's date
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = progress?.lastActivityAt
      ? new Date(progress.lastActivityAt).toISOString().slice(0, 10)
      : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Compute new streak
    let newStreak = progress?.currentStreak || 0;
    let newLongest = progress?.longestStreak || 0;

    if (lastDate === today) {
      // Already counted today — no change to streak
    } else if (lastDate === yesterday) {
      // Extend streak
      newStreak += 1;
      newLongest = Math.max(newLongest, newStreak);
    } else {
      // Reset streak (gap > 1 day or first activity)
      newStreak = 1;
      newLongest = Math.max(newLongest, 1);
    }

    await ProProgress.findOneAndUpdate(
      { userId, trackKey: ex.trackKey },
      {
        $addToSet: { completedExercises: exerciseId },
        $inc:      { totalXp: xpAwarded },
        $set:      {
          lastActivityAt: new Date(),
          currentStreak: newStreak,
          longestStreak: newLongest,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Spaced repetition (F1): if this pass completes the whole topic, seed a
    // review entry. The $ne guard makes the $push idempotent + race-safe so a
    // topic is never queued twice.
    try {
      const topicExercises = await ProExercise.find({ topicId: ex.topicId }).select("exerciseId").lean();
      const prog = await ProProgress.findOne({ userId, trackKey: ex.trackKey }).select("completedExercises").lean();
      const doneSet = new Set(prog?.completedExercises || []);
      const topicComplete = topicExercises.length > 0 && topicExercises.every((e) => doneSet.has(e.exerciseId));
      if (topicComplete) {
        const now = new Date();
        await ProProgress.updateOne(
          { userId, trackKey: ex.trackKey, "topicReviews.topicId": { $ne: ex.topicId } },
          { $push: { topicReviews: { topicId: ex.topicId, completedAt: now, lastReviewedAt: now, intervalDays: 1, reps: 0 } } }
        );
      }
    } catch (err) {
      logger.warn("[pro] topic review seed skipped", { userId, topicId: ex.topicId, err: err.message });
    }
  }

  logger.info("[pro] exercise submission", {
    userId, exerciseId, passed,
    casesPassed: testResults.filter((t) => t.passed).length,
    casesTotal:  testResults.length,
  });

  // Analytics — fire-and-forget. attempts = total ProSubmission rows
  // for this user × exercise, which is INCLUDING the row we just wrote.
  const attempts = await ProSubmission.countDocuments({ userId, exerciseId }).catch(() => 0);
  trackEvent(userId, "pro.code_submitted", {
    exerciseId, trackKey: ex.trackKey, language, durationMs,
    sandboxStatus: sandboxResult.status,
    sandboxTimeMs: sandboxResult.timeMs,
  });
  if (passed) {
    trackEvent(userId, "pro.exercise_passed", { exerciseId, trackKey: ex.trackKey, attempts, xpAwarded });

    // Check if all exercises in this module's topics are now complete — issue certificate
    try {
      const [topics, progress] = await Promise.all([
        ProTopic.find({ moduleId: ex.moduleId }).select("topicId").lean(),
        ProProgress.findOne({ userId, trackKey: ex.trackKey }).select("completedExercises").lean(),
      ]);

      const topicIds = topics.map((t) => t.topicId);
      const allExercisesInModule = await ProExercise.find({ topicId: { $in: topicIds } }).select("exerciseId").lean();
      const completedSet = new Set([...progress?.completedExercises || [], exerciseId]); // include the one we just passed

      const allModuleExercisesComplete = allExercisesInModule.every((ex) => completedSet.has(ex.exerciseId));

      if (allModuleExercisesComplete) {
        // Issue certificate for this module
        await issueModuleCertificate(userId, ex.trackKey, ex.moduleId).catch((err) => {
          logger.warn("[pro] certificate issuance skipped", { userId, moduleId: ex.moduleId, reason: err.message });
        });
      }
    } catch (err) {
      logger.warn("[pro] certificate auto-issue error", { userId, moduleId: ex.moduleId, err: err.message });
      // Non-fatal — continue even if cert issuance fails
    }
  } else {
    // Best-guess failure reason for analytics: first failing testcase, else
    // sandboxStatus (Compilation Error / Time Limit Exceeded / etc.)
    const firstFail = testResults.find((t) => !t.passed);
    const reason = firstFail?.message?.slice(0, 200) || sandboxResult.status || "unknown";
    trackEvent(userId, "pro.exercise_failed", { exerciseId, trackKey: ex.trackKey, attempts, reason });
  }

  return { sandboxResult, testResults, passed, xpAwarded };
}

// ── Progress ────────────────────────────────────────────────────────────────

export async function getProgress(userId, trackKey) {
  if (!(await isEnrolled(userId, trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const prog = await ProProgress.findOne({ userId, trackKey }).lean();
  return prog || {
    userId,
    trackKey,
    completedTopics: [],
    completedExercises: [],
    totalXp: 0,
    currentStreak: 0,
    lastActivityAt: null,
  };
}

// ── Spaced repetition (ROADMAP F) ─────────────────────────────────────────────
const SM2_LADDER = [1, 3, 7, 14, 30, 90]; // days
const DAY_MS = 86_400_000;

// Advance to the next rung; cap at 90d. Tolerant of off-ladder values.
function nextInterval(current) {
  const idx = SM2_LADDER.indexOf(current);
  if (idx === -1) return SM2_LADDER.find((d) => d > current) || 90;
  return SM2_LADDER[Math.min(idx + 1, SM2_LADDER.length - 1)];
}

// Topics whose lastReviewedAt + intervalDays has elapsed, newest-overdue first.
export async function getDueReviews(userId, trackKey) {
  if (!(await isEnrolled(userId, trackKey))) throw new AppError("Not enrolled in this track.", 403);
  const prog = await ProProgress.findOne({ userId, trackKey }).select("topicReviews").lean();
  const reviews = prog?.topicReviews || [];
  const now = Date.now();
  const due = reviews.filter((r) => new Date(r.lastReviewedAt).getTime() + (r.intervalDays || 1) * DAY_MS <= now);
  if (!due.length) return [];

  const topics = await ProTopic.find({ topicId: { $in: due.map((r) => r.topicId) } })
    .select("topicId moduleId name topicNumber").lean();
  const byId = new Map(topics.map((t) => [t.topicId, t]));

  return due
    .map((r) => {
      const t = byId.get(r.topicId);
      if (!t) return null; // topic deleted / renamed — skip
      const dueAt = new Date(r.lastReviewedAt).getTime() + (r.intervalDays || 1) * DAY_MS;
      return {
        topicId: r.topicId, name: t.name, moduleId: t.moduleId,
        intervalDays: r.intervalDays || 1, reps: r.reps || 0,
        overdueDays: Math.max(0, Math.floor((now - dueAt) / DAY_MS)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.overdueDays - a.overdueDays);
}

// SM-2 lite: "got_it" advances the ladder, "rusty" resets to 1 day.
export async function recordReview(userId, trackKey, topicId, rating) {
  if (!(await isEnrolled(userId, trackKey))) throw new AppError("Not enrolled in this track.", 403);
  if (!["got_it", "rusty"].includes(rating)) throw new AppError("rating must be got_it or rusty.", 400);

  const prog = await ProProgress.findOne({ userId, trackKey });
  if (!prog) throw new AppError("No progress found.", 404);
  const entry = (prog.topicReviews || []).find((r) => r.topicId === topicId);
  if (!entry) throw new AppError("Topic is not in your review queue.", 404);

  const now = new Date();
  if (rating === "got_it") {
    entry.intervalDays = nextInterval(entry.intervalDays || 1);
    entry.reps = (entry.reps || 0) + 1;
  } else {
    entry.intervalDays = 1;
    entry.reps = 0;
  }
  entry.lastReviewedAt = now;
  prog.markModified("topicReviews");
  await prog.save();

  trackEvent(userId, "pro.review_recorded", { trackKey, topicId, rating, intervalDays: entry.intervalDays });
  return {
    topicId,
    intervalDays: entry.intervalDays,
    reps: entry.reps,
    nextDue: new Date(now.getTime() + entry.intervalDays * DAY_MS),
  };
}

// ── Problem-first reveal (ROADMAP G) ─────────────────────────────────────────
// Fire-and-forget telemetry when a learner reveals a gated topic's approach.
export async function recordReveal(userId, topicId) {
  const topic = await ProTopic.findOne({ topicId }).select("trackKey moduleId").lean();
  if (!topic) throw new AppError("Topic not found.", 404);
  trackEvent(userId, "pro.topic_revealed", { topicId, trackKey: topic.trackKey, moduleId: topic.moduleId });
  return { ok: true };
}

// ── Certificates ────────────────────────────────────────────────────────────

export async function issueModuleCertificate(userId, trackKey, moduleId) {
  if (!(await isEnrolled(userId, trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }

  // Load module + all topics + all exercises
  const [module, topics] = await Promise.all([
    ProModule.findOne({ moduleId }).lean(),
    ProTopic.find({ moduleId }).lean(),
  ]);

  if (!module) throw new AppError("Module not found.", 404);
  if (topics.length === 0) throw new AppError("Module has no topics.", 400);

  // Get all exercises for this module's topics
  const topicIds = topics.map((t) => t.topicId);
  const exercises = await ProExercise.find({ topicId: { $in: topicIds } }).lean();

  if (exercises.length === 0) throw new AppError("Module has no exercises.", 400);

  // Get user's progress
  const progress = await ProProgress.findOne({ userId, trackKey }).lean();
  if (!progress) throw new AppError("No progress found.", 404);

  const completedSet = new Set(progress.completedExercises || []);
  const allCompleted = exercises.every((ex) => completedSet.has(ex.exerciseId));

  if (!allCompleted) {
    throw new AppError("Not all exercises in this module are complete.", 400);
  }

  // Issue certificate (upsert — idempotent)
  const { nanoid } = await import("nanoid");
  const certId = nanoid();
  const cert = await ProCertificate.findOneAndUpdate(
    { userId, trackKey, moduleId },
    {
      $set: {
        certId,
        userId,
        trackKey,
        moduleId,
        moduleName: module.name,
        issuedAt: new Date(),
        totalXp: progress.totalXp,
        completedExercises: completedSet.size,
      },
    },
    { upsert: true, new: true }
  );

  logger.info("[pro] certificate issued", { userId, moduleId, certId });
  trackEvent(userId, "pro.certificate_issued", { trackKey, moduleId, certId });

  return cert;
}

export async function listUserCertificates(userId, trackKey) {
  if (!(await isEnrolled(userId, trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  return ProCertificate.find({ userId, trackKey }).sort({ issuedAt: -1 }).lean();
}

// ── Enrolment ───────────────────────────────────────────────────────────────

export async function enroll(userId, trackKey) {
  const track = await ProTrack.findOne({ key: trackKey, status: "live" }).lean();
  if (!track) throw new AppError("Track not found.", 404);

  // Already enrolled?
  const existing = await User.findOne(
    { _id: userId, "tracks.key": trackKey },
    { _id: 1 }
  ).lean();
  if (existing) {
    invalidateEnrolment(userId, trackKey);
    return { trackKey, alreadyEnrolled: true };
  }

  // Only flip activeTrack when the user has no active choice yet (null/empty).
  // A school user with activeTrack="school" + empty tracks[] (legacy data)
  // must NOT be yanked into pro mode just because their tracks array is
  // empty — preserve any explicit choice the user or migration already set.
  const userBefore = await User.findById(userId).select("activeTrack tracks").lean();
  const shouldFlipActive = !userBefore?.activeTrack;
  const update = {
    $push: {
      tracks: {
        key:        trackKey,
        role:       "learner",
        enrolledAt: new Date(),
      },
    },
  };
  if (shouldFlipActive) update.$set = { activeTrack: trackKey };
  await User.updateOne({ _id: userId }, update);
  // Initialise progress doc (no-op if it already exists).
  await ProProgress.findOneAndUpdate(
    { userId, trackKey },
    { $setOnInsert: { totalXp: 0, currentStreak: 0 } },
    { upsert: true }
  );
  invalidateEnrolment(userId, trackKey);
  logger.info("[pro] enrolment", { userId, trackKey });
  trackEvent(userId, "pro.enrolled", { trackKey });
  return { trackKey, alreadyEnrolled: false };
}

// ── Bookmarks ───────────────────────────────────────────────────────────────

// Per-kind resolver: returns the track this item belongs to, or null if
// the item doesn't exist. Keeps toggleBookmark dispatch-free at call sites.
async function trackKeyForRef(kind, refId) {
  if (kind === "exercise") {
    const ex = await ProExercise.findOne({ exerciseId: refId }).select("trackKey").lean();
    return ex?.trackKey ?? null;
  }
  if (kind === "topic") {
    const t = await ProTopic.findOne({ topicId: refId }).select("trackKey").lean();
    return t?.trackKey ?? null;
  }
  if (kind === "project") {
    const p = await ProProject.findOne({ projectId: refId }).select("trackKey").lean();
    return p?.trackKey ?? null;
  }
  return null;
}

// Toggle: returns { bookmarked } after the change.
export async function toggleBookmark(userId, kind, refId) {
  if (!["exercise", "topic", "project"].includes(kind)) {
    throw new AppError("Unknown bookmark kind.", 400);
  }
  const trackKey = await trackKeyForRef(kind, refId);
  if (!trackKey) throw new AppError(`${kind} not found.`, 404);
  if (!(await isEnrolled(userId, trackKey))) {
    throw new AppError("Not enrolled in this track.", 403);
  }
  const existing = await ProBookmark.findOne({ userId, kind, refId }).select("_id").lean();
  if (existing) {
    await ProBookmark.deleteOne({ userId, kind, refId });
    trackEvent(userId, "pro.bookmark_removed", { kind, refId, trackKey });
    return { bookmarked: false };
  }
  await ProBookmark.create({ userId, trackKey, kind, refId });
  trackEvent(userId, "pro.bookmark_added", { kind, refId, trackKey });
  return { bookmarked: true };
}

// Returns the user's bookmarks for a track, joined with the appropriate
// metadata per kind so the list view can render titles + paths without
// N+1 calls. Sorted newest first.
export async function listBookmarks(userId, trackKey) {
  const rows = await ProBookmark.find({ userId, trackKey }).sort({ savedAt: -1 }).lean();
  if (rows.length === 0) return [];

  const idsByKind = { exercise: [], topic: [], project: [] };
  for (const r of rows) if (idsByKind[r.kind]) idsByKind[r.kind].push(r.refId);

  const [exs, tops, projs] = await Promise.all([
    idsByKind.exercise.length
      ? ProExercise.find({ exerciseId: { $in: idsByKind.exercise } })
          .select("exerciseId topicId moduleId title level xpReward").lean()
      : [],
    idsByKind.topic.length
      ? ProTopic.find({ topicId: { $in: idsByKind.topic } })
          .select("topicId moduleId name trackKey").lean()
      : [],
    idsByKind.project.length
      ? ProProject.find({ projectId: { $in: idsByKind.project } })
          .select("projectId topicId moduleId name").lean()
      : [],
  ]);
  const exById   = new Map(exs.map((e) => [e.exerciseId, e]));
  const topById  = new Map(tops.map((t) => [t.topicId, t]));
  const projById = new Map(projs.map((p) => [p.projectId, p]));

  return rows.map((r) => {
    if (r.kind === "exercise") {
      const ex = exById.get(r.refId) || null;
      return {
        kind: "exercise", refId: r.refId, savedAt: r.savedAt, note: r.note,
        title: ex?.title || r.refId,
        moduleId: ex?.moduleId || null,
        topicId:  ex?.topicId  || null,
        level:    ex?.level    || null,
        xpReward: ex?.xpReward || 0,
      };
    }
    if (r.kind === "topic") {
      const t = topById.get(r.refId) || null;
      return {
        kind: "topic", refId: r.refId, savedAt: r.savedAt, note: r.note,
        title: t?.name || r.refId,
        moduleId: t?.moduleId || null,
        topicId:  r.refId,
      };
    }
    // project
    const p = projById.get(r.refId) || null;
    return {
      kind: "project", refId: r.refId, savedAt: r.savedAt, note: r.note,
      title: p?.name || r.refId,
      moduleId: p?.moduleId || null,
      topicId:  p?.topicId  || null,
    };
  });
}

export async function isBookmarked(userId, kind, refId) {
  const found = await ProBookmark.exists({ userId, kind, refId });
  return !!found;
}

// ── Free-tier public access (D5.1) ──────────────────────────────────────────
// No auth required — only serves topics with freeAccess:true.

export async function getPublicTopic(topicId) {
  const topic = await ProTopic.findOne({ topicId, freeAccess: true }).lean();
  if (!topic) throw new AppError("Topic not available for public access.", 403);
  return topic;
}

export async function listPublicExercises(topicId) {
  const topic = await ProTopic.findOne({ topicId, freeAccess: true }).select("topicId").lean();
  if (!topic) throw new AppError("Topic not available for public access.", 403);
  return ProExercise.find({ topicId })
    .select("exerciseId level type title scenario instructions starterCode blanks hints xpReward difficulty priority pattern leetcodeId")
    .sort({ position: 1, exerciseId: 1 })
    .lean();
}

// ── Pattern Atlas (D3.4) ─────────────────────────────────────────────────────
// Returns all pattern_match exercises grouped by their correct pattern ID,
// enriched with topic names. Used by the /pro/java/patterns page.
export async function getPatternAtlas(trackKey) {
  const exercises = await ProExercise.find({ trackKey, type: "pattern_match" })
    .select("exerciseId topicId moduleId title testCases level")
    .lean();

  // Group by correct pattern (testCases[0].correct)
  const byPattern = {};
  for (const ex of exercises) {
    const correct = ex.testCases?.[0]?.correct;
    if (!correct) continue;
    if (!byPattern[correct]) byPattern[correct] = [];
    byPattern[correct].push({
      exerciseId: ex.exerciseId,
      topicId:    ex.topicId,
      moduleId:   ex.moduleId,
      title:      ex.title,
      level:      ex.level,
    });
  }

  // Enrich with topic names
  const topicIds = [...new Set(exercises.map(e => e.topicId))];
  const topics = await ProTopic.find({ topicId: { $in: topicIds } })
    .select("topicId name moduleId")
    .lean();
  const topicMap = Object.fromEntries(topics.map(t => [t.topicId, { name: t.name, moduleId: t.moduleId }]));

  return { byPattern, topicMap, totalExercises: exercises.length };
}
