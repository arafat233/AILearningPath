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
const moduleIdPattern  = /^[a-z][a-z0-9_]*_m\d+$/;
const topicIdPattern   = /^[a-z][a-z0-9_]*_m\d+_t\d+$/;
const exerciseIdPattern = /^[a-z][a-z0-9_]*_m\d+_t\d+_ex_\d+$/;

// ── Body schemas ────────────────────────────────────────────────────────────

export const enrollBodySchema = Joi.object({
  trackKey: Joi.string().pattern(trackKeyPattern).required(),
});

export const submitBodySchema = Joi.object({
  // Single bounded string; sandboxed downstream. Length cap mirrors the
  // 50 KB guard in proService.submitExercise (the service still re-checks).
  code: Joi.string().min(1).max(50_000).required(),
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
