import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { validate, validateQuery } from "../middleware/validate.js";
import * as c from "../controllers/communityController.js";

const r = express.Router();

const objId = Joi.string().pattern(/^[a-f\d]{24}$/i);
const kind = Joi.string().valid("article", "question");
const tagsArr = Joi.array().items(Joi.string().max(40)).max(8);

const createSchema = Joi.object({
  kind: kind.required(),
  title: Joi.string().trim().min(1).max(200).required(),
  body: Joi.string().trim().min(1).max(20000).required(),
  tags: tagsArr,
});

const editSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  body: Joi.string().trim().min(1).max(20000),
  tags: tagsArr,
}).min(1);

const feedQuery = Joi.object({
  kind,
  tag: Joi.string().max(40),
  q: Joi.string().allow("").max(120),
  sort: Joi.string().valid("new", "top"),
  limit: Joi.number().integer().min(1).max(50),
  skip: Joi.number().integer().min(0),
});

const commentSchema = Joi.object({ body: Joi.string().trim().min(1).max(5000).required() });
const reportSchema = Joi.object({ reason: Joi.string().allow("").max(300) });
const idParams = Joi.object({ id: objId.required() });
const commentParams = Joi.object({ id: objId.required(), commentId: objId.required() });
const moderateSchema = Joi.object({
  action: Joi.string().valid("remove", "restore", "pin", "unpin", "clear-reports").required(),
});

// ── Feed + tags ──
r.get("/posts",      auth, validateQuery(feedQuery), c.list);
r.get("/tags",       auth, c.tags);
r.get("/posts/:id",  auth, c.get);

// ── Authoring (user-generated) ──
r.post("/posts",            auth, validate(createSchema), c.create);
r.patch("/posts/:id",       auth, validate(editSchema),   c.edit);
r.delete("/posts/:id",      auth, c.remove);

// ── Engagement ──
r.post("/posts/:id/upvote",                 auth, c.upvote);
r.post("/posts/:id/comments",               auth, validate(commentSchema), c.comment);
r.delete("/posts/:id/comments/:commentId",  auth, c.removeComment);
r.post("/posts/:id/report",                 auth, validate(reportSchema), c.report);

// ── Admin moderation ──
r.get("/admin/reports",            adminAuth, c.adminReports);
r.post("/admin/posts/:id/moderate", adminAuth, validate(moderateSchema), c.adminModerate);
r.delete("/admin/posts/:id",        adminAuth, c.adminRemove);

export default r;
