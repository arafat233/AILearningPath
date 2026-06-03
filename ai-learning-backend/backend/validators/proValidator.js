/**
 * Joi schemas for /api/v1/pro/* routes.
 *
 * Each export is mounted via the `validate(...)` middleware in routes/
 * proRoutes.js. Schemas validate `req.body` for POST/PUT and `req.params`
 * for path-bound IDs.
 */

import Joi from "joi";

// trackKey format: lowercase letters / digits / underscores, starts with
// "pro_". Slug is the same but without the "pro_" prefix.
const trackKeyPattern  = /^pro_[a-z][a-z0-9_]*$/;
const trackSlugPattern = /^[a-z][a-z0-9_]*$/;
// The optional (_\d+)? after _m\d+ allows decimal/minor modules such as
// "java_m30_5" (the 2D-Array module that slots between m30 and m31). Without it
// the whole m30_5 module 422s on these param routes.
const moduleIdPattern  = /^[a-z][a-z0-9_]*_m\d+(_\d+)?$/;
const topicIdPattern   = /^[a-z][a-z0-9_]*_m\d+(_\d+)?_t\d+$/;
// Accepts _ex_N (code exercises) and _pm_N (pattern_match exercises)
const exerciseIdPattern = /^[a-z][a-z0-9_]*_m\d+(_\d+)?_t\d+_(ex|pm)_\d+$/;
const objectIdPattern   = /^[a-f0-9]{24}$/;

// ── Body schemas ────────────────────────────────────────────────────────────

export const enrollBodySchema = Joi.object({
  trackKey: Joi.string().pattern(trackKeyPattern).required(),
});

export const submitBodySchema = Joi.object({
  // Single bounded string; sandboxed downstream. Length cap mirrors the
  // 50 KB guard in proService.submitExercise (the service still re-checks).
  code: Joi.string().min(1).max(50_000).required(),
});

// Spaced repetition review outcome (ROADMAP F). trackKey + a binary rating.
export const reviewBodySchema = Joi.object({
  trackKey: Joi.string().pattern(trackKeyPattern).required(),
  rating:   Joi.string().valid("got_it", "rusty").required(),
});

// ── Param schemas ───────────────────────────────────────────────────────────

export const trackSlugParamsSchema = Joi.object({
  trackSlug: Joi.string().pattern(trackSlugPattern).required(),
});

export const trackKeyParamsSchema = Joi.object({
  trackKey: Joi.string().pattern(trackKeyPattern).required(),
});

export const moduleParamsSchema = Joi.object({
  trackSlug: Joi.string().pattern(trackSlugPattern).required(),
  moduleId:  Joi.string().pattern(moduleIdPattern).required(),
});

export const topicParamsSchema = Joi.object({
  topicId: Joi.string().pattern(topicIdPattern).required(),
});

export const exerciseParamsSchema = Joi.object({
  exerciseId: Joi.string().pattern(exerciseIdPattern).required(),
});

// Track-2 practice filter (Must-Do path / by-pattern). Both optional.
export const practiceQuerySchema = Joi.object({
  priority: Joi.string().valid("P1", "P2", "P3"),
  pattern:  Joi.string().pattern(/^[a-z][a-z0-9-]{1,40}$/),
});

// Track-2 "which pattern fits?" quiz — number of questions (optional).
export const patternQuizQuerySchema = Joi.object({
  n: Joi.number().integer().min(1).max(20),
});

// ── Projects ─────────────────────────────────────────────────────────────────

const projectIdPattern = /^[a-z][a-z0-9_]*_m\d+(_\d+)?_t\d+_proj(_\d+)?$/;

export const projectParamsSchema = Joi.object({
  projectId: Joi.string().pattern(projectIdPattern).required(),
});

export const submitProjectBodySchema = Joi.object({
  code:        Joi.string().min(1).max(50_000).required(),
  checkedReqs: Joi.array().items(Joi.string().max(60)).max(20).default([]),
});

// ── Discussions (D5.3) ───────────────────────────────────────────────────────

export const discussionBodySchema = Joi.object({
  body: Joi.string().trim().min(1).max(5000).required(),
});

export const threadIdParamsSchema = Joi.object({
  threadId: Joi.string().pattern(objectIdPattern).required(),
});

// ── Tutor ───────────────────────────────────────────────────────────────────

export const tutorAskBodySchema = Joi.object({
  exerciseId:  Joi.string().pattern(exerciseIdPattern).required(),
  studentCode: Joi.string().max(10_000).allow("").default(""),
  question:    Joi.string().min(1).max(2_000).required(),
});

export const tutorRateBodySchema = Joi.object({
  messageIndex: Joi.number().integer().min(0).required(),
  rating:       Joi.number().valid(1, -1).required(),
});

export const sessionIdParamsSchema = Joi.object({
  sessionId: Joi.string().pattern(objectIdPattern).required(),
});
