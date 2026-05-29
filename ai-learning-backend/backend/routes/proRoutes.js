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
import { requireEmailAllowlist } from "../middleware/featureFlag.js";

import * as ctrl from "../controllers/proController.js";
import {
  enrollBodySchema, submitBodySchema,
  trackSlugParamsSchema, trackKeyParamsSchema,
  moduleParamsSchema, topicParamsSchema, exerciseParamsSchema,
} from "../validators/proValidator.js";

const r = Router();

// Every route requires (a) a valid JWT and (b) the caller's email to be in
// PRO_TRACKS_ENABLED_FOR_EMAILS during the pilot.
r.use(auth);
r.use(requireEmailAllowlist("PRO_TRACKS_ENABLED_FOR_EMAILS"));

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

// ── Bookmarks (polymorphic over exercise / topic / project) ────────────────
r.post("/exercises/:exerciseId/bookmark", validateParams(exerciseParamsSchema), ctrl.toggleExerciseBookmark);
r.post("/topics/:topicId/bookmark",       validateParams(topicParamsSchema),    ctrl.toggleTopicBookmark);
// Project route ships with the project UI in a follow-up — the service
// + model already accept "project" kind, just needs a Joi params schema
// and a frontend bookmark button on the (not-yet-built) project view.
r.get("/bookmarks",                                                            ctrl.listBookmarks);

export default r;
