/**
 * /api/v1/pro/* — pro-track Java pilot routes.
 *
 * Middleware stack (PRO_TRACK_PLAN.md §4.4):
 *   auth → requireEmailAllowlist → validate(Params|Body) → [rate limit] → controller
 *
 * The /enroll route specifically does NOT require enrolment (that's its
 * purpose). Every other route either takes a trackSlug/trackKey/moduleId/
 * topicId/exerciseId and the service layer (proService.js) verifies
 * enrolment internally via isEnrolled() — we don't need to redundantly
 * gate at the route level because services need the check anyway for
 * inline calls.
 */

import { Router } from "express";
import rateLimit from "express-rate-limit";

import { auth } from "../middleware/auth.js";
import { validate, validateParams } from "../middleware/validate.js";

import * as ctrl from "../controllers/proController.js";
import {
  enrollBodySchema, submitBodySchema, reviewBodySchema,
  trackSlugParamsSchema, trackKeyParamsSchema,
  moduleParamsSchema, topicParamsSchema, exerciseParamsSchema,
  tutorAskBodySchema, tutorRateBodySchema, sessionIdParamsSchema,
} from "../validators/proValidator.js";

const r = Router();

// Every route requires a valid JWT. Feature flag removed — Pro Java is now open to all.
r.use(auth);

// Submission-specific extra rate limit. Belt-and-braces with the per-user
// Redis limit in codeExecutionService — that one is per user; this one is
// per IP / unauthenticated bots that somehow get through.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many code submissions. Try again in an hour." },
});

// ── Track-level ─────────────────────────────────────────────────────────────
r.get("/tracks",                              ctrl.listTracks);
r.get("/tracks/:trackSlug",                   validateParams(trackSlugParamsSchema), ctrl.getTrack);
r.get("/tracks/:trackSlug/modules/:moduleId", validateParams(moduleParamsSchema),    ctrl.getModule);

// ── Topic-level ─────────────────────────────────────────────────────────────
r.get("/topics/:topicId",                     validateParams(topicParamsSchema),     ctrl.getTopic);
r.get("/topics/:topicId/exercises",           validateParams(topicParamsSchema),     ctrl.listExercisesForTopic);
// Problem-first reveal telemetry (ROADMAP G) — fired when a learner reveals
// a gated topic's approach.
r.post("/topics/:topicId/reveal",             validateParams(topicParamsSchema),     ctrl.recordReveal);

// ── Exercises ───────────────────────────────────────────────────────────────
r.get("/exercises/:exerciseId",               validateParams(exerciseParamsSchema),  ctrl.getExercise);
r.post(
  "/exercises/:exerciseId/submit",
  submitLimiter,
  validateParams(exerciseParamsSchema),
  validate(submitBodySchema),
  ctrl.submitExercise
);

// ── Progress + enrolment ────────────────────────────────────────────────────
r.get("/progress/:trackKey",                  validateParams(trackKeyParamsSchema),  ctrl.getProgress);
r.post("/enroll",                             validate(enrollBodySchema),            ctrl.enroll);

// ── Spaced repetition review queue (ROADMAP F) ───────────────────────────────
r.get("/review/due",                          ctrl.getDueReviews);
r.post("/review/:topicId",
  validateParams(topicParamsSchema),
  validate(reviewBodySchema),
  ctrl.recordReview
);

// ── AI Socratic Tutor ───────────────────────────────────────────────────────
// 10 q/hr per user enforced in tutorService via Redis; belt-and-braces IP
// limiter here in case Redis is unavailable.
const tutorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,                               // generous IP bucket; Redis does the tight user-level check
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many tutor requests. Try again in an hour." },
});

r.post("/tutor/ask",
  tutorLimiter,
  validate(tutorAskBodySchema),
  ctrl.tutorAsk
);
r.get("/tutor/session/:exerciseId",
  validateParams(exerciseParamsSchema),
  ctrl.tutorGetSession
);
r.post("/tutor/session/:sessionId/rate",
  validateParams(sessionIdParamsSchema),
  validate(tutorRateBodySchema),
  ctrl.tutorRateMessage
);

// ── Pattern Atlas ────────────────────────────────────────────────────────────
r.get("/pattern-atlas", ctrl.getPatternAtlas);

// ── Bookmarks (polymorphic over exercise / topic / project) ────────────────
r.post("/exercises/:exerciseId/bookmark", validateParams(exerciseParamsSchema), ctrl.toggleExerciseBookmark);
r.post("/topics/:topicId/bookmark",       validateParams(topicParamsSchema),    ctrl.toggleTopicBookmark);
// Project route ships with the project UI in a follow-up — the service
// + model already accept "project" kind, just needs a Joi params schema
// and a frontend bookmark button on the (not-yet-built) project view.
r.get("/bookmarks",                                                            ctrl.listBookmarks);

export default r;
