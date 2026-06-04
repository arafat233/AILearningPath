import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate, validateQuery } from "../middleware/validate.js";
import * as c from "../controllers/noteController.js";

const r = express.Router();

const objId = Joi.string().pattern(/^[a-f\d]{24}$/i);
const kind = Joi.string().valid("exercise", "topic", "lesson", "question", "project");
const scope = Joi.string().valid("pro", "k12");
const type = Joi.string().valid("note", "highlight");
const tagsArr = Joi.array().items(Joi.string().max(40)).max(12);

const createSchema = Joi.object({
  scope: scope.required(),
  kind: kind.required(),
  refId: Joi.string().min(1).max(160).required(),
  type: type.default("note"),
  trackKey: Joi.string().max(40).allow(null, ""),
  subject: Joi.string().allow("").max(60),
  title: Joi.string().allow("").max(300),
  url: Joi.string().allow("").max(500),
  body: Joi.string().allow("").max(8000),
  quote: Joi.string().allow("").max(2000),
  prefix: Joi.string().allow("").max(60),
  suffix: Joi.string().allow("").max(60),
  sectionKey: Joi.string().allow("").max(80),
  color: Joi.string().max(16),
  tags: tagsArr,
  pinned: Joi.boolean(),
});

const updateSchema = Joi.object({
  title: Joi.string().allow("").max(300),
  body: Joi.string().allow("").max(8000),
  color: Joi.string().max(16),
  tags: tagsArr,
  pinned: Joi.boolean(),
}).min(1);

const notebookQuery = Joi.object({
  q: Joi.string().allow("").max(120),
  scope, kind, type,
  trackKey: Joi.string().max(40),
  subject: Joi.string().max(60),
  tag: Joi.string().max(40),
  pinned: Joi.boolean(),
  limit: Joi.number().integer().min(1).max(100),
  skip: Joi.number().integer().min(0),
});

// ── Notebook (search/filter) + facets ──
r.get("/",      auth, validateQuery(notebookQuery), c.notebook);
r.get("/tags",  auth, c.tags);
r.get("/stats", auth, c.stats);

// ── Per-item (render notes/highlights on a source page) ──
r.get("/for/:kind/:refId", auth, c.listForItem);

// ── CRUD ──
r.post("/",      auth, validate(createSchema), c.create);
r.patch("/:id",  auth, validate(updateSchema), c.update);
r.delete("/:id", auth, c.remove);

export default r;
