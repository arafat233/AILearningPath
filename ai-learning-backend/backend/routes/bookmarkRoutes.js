import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as c from "../controllers/bookmarkController.js";

const r = express.Router();

const objId = Joi.string().pattern(/^[a-f\d]{24}$/i);
const memberKind = Joi.string().valid("question", "topic", "section");

const rateSchema = Joi.object({
  questionId: objId.required(),
  rating: Joi.number().integer().min(0).max(3).required(),
});
const masterySchema = Joi.object({
  questionId: objId.required(),
  mastered: Joi.boolean().required(),
});
const noteSchema = Joi.object({
  questionId: objId.required(),
  note: Joi.string().allow("").max(280),
});
const colCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(60).required(),
  emoji: Joi.string().max(4).optional(),
  color: Joi.string().max(12).optional(),
});
const colUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(60).optional(),
  emoji: Joi.string().max(4).optional(),
  color: Joi.string().max(12).optional(),
  order: Joi.number().integer().min(0).optional(),
});
const colReorderSchema = Joi.object({
  orderedIds: Joi.array().items(objId).max(50).required(),
});
const memberSchema = Joi.object({
  kind: memberKind.required(),
  refId: Joi.string().min(1).max(120).required(),
});
const bulkAddSchema = Joi.object({
  items: Joi.array().items(memberSchema).max(200).required(),
});
const topicUpsertSchema = Joi.object({
  topicId: Joi.string().min(1).max(120).required(),
  name: Joi.string().allow("").max(200),
  subject: Joi.string().allow("").max(60),
  isLesson: Joi.boolean().optional(),
  smartCol: Joi.string().allow(null, "").max(60).optional(),
});
const sectionUpsertSchema = Joi.object({
  bmId: Joi.string().min(1).max(200).required(),
  topicId: Joi.string().min(1).max(120).required(),
  label: Joi.string().allow("").max(200),
  sectionKey: Joi.string().allow("").max(40),
});
const idsSchema = Joi.object({
  ids: Joi.array().items(objId).max(200).required(),
});
const idsMasterySchema = Joi.object({
  ids: Joi.array().items(objId).max(200).required(),
  mastered: Joi.boolean().required(),
});

// ── Public share (no auth) — must come BEFORE /:id ───────────────────
r.get("/share/:token", c.getShared);

// ── Reviews / mastery / notes ────────────────────────────────────────
r.get("/reviews",          auth, c.getReviews);
r.post("/reviews/rate",    auth, validate(rateSchema), c.rate);
r.post("/reviews/mastery", auth, validate(masterySchema), c.setMastery);
r.post("/reviews/note",    auth, validate(noteSchema), c.setNote);
r.get("/due",              auth, c.dueQueue);
r.get("/smart",            auth, c.smart);

// ── Bulk ─────────────────────────────────────────────────────────────
r.post("/bulk/remove",  auth, validate(idsSchema), c.bulkRemove);
r.post("/bulk/mastery", auth, validate(idsMasterySchema), c.bulkMastery);

// ── Topic / Section bookmark mirror ──────────────────────────────────
r.get("/topics",                auth, c.listTopics);
r.post("/topics",               auth, validate(topicUpsertSchema), c.upsertTopic);
r.delete("/topics/:topicId",    auth, c.removeTopic);
r.get("/sections",              auth, c.listSections);
r.post("/sections",             auth, validate(sectionUpsertSchema), c.upsertSection);
r.delete("/sections/:bmId",     auth, c.removeSection);

// ── Collections ──────────────────────────────────────────────────────
r.get("/collections",                       auth, c.listCols);
r.post("/collections",                      auth, validate(colCreateSchema), c.createCol);
r.patch("/collections/reorder",             auth, validate(colReorderSchema), c.reorderCols);
r.patch("/collections/:id",                 auth, validate(colUpdateSchema), c.updateCol);
r.delete("/collections/:id",                auth, c.deleteCol);
r.post("/collections/:id/members",          auth, validate(memberSchema), c.addToCol);
r.post("/collections/:id/members/remove",   auth, validate(memberSchema), c.removeFromCol);
r.post("/collections/:id/members/bulk",     auth, validate(bulkAddSchema), c.bulkAddToCol);
r.post("/collections/:id/share",            auth, c.share);
r.delete("/collections/:id/share",          auth, c.unshare);
r.get("/collections/:id/export",            auth, c.exportCol);
r.post("/collections/:id/ai-summary",       auth, c.aiSummary);

export default r;
