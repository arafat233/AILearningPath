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
  ProSubmission, ProProgress, ProBookmark,
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
    .select("exerciseId level type title scenario instructions starterCode hints xpReward difficulty")
    .sort({ position: 1, exerciseId: 1 })
    .lean();
  await sessionSet(exCacheKey, exercises, 300);
  return exercises;
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
