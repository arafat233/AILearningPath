import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as svc from "../services/lessonsV2Service.js";

const r = express.Router();

// One-shot dashboard payload
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const subject = req.query.subject || req.user?.subject || "Math";
    const grade   = req.query.grade   || req.user?.grade   || "10";
    const [continueCard, recent, recommended, chapters, masteryMap] = await Promise.all([
      svc.getContinueCard(req.user.id, subject),
      svc.getRecentTopics(req.user.id, subject),
      svc.getRecommendedTopics(req.user.id, subject, grade),
      svc.getChaptersMeta(subject, grade, req.user.id),
      svc.getTopicMasteryMap(req.user.id),
    ]);
    res.json({ data: { continueCard, recent, recommended, chapters, masteryMap } });
  } catch (e) { next(e); }
});

r.get("/search", auth, async (req, res, next) => {
  try {
    const { q, subject, grade } = req.query;
    res.json({ data: await svc.searchTopics(q, subject, grade, req.user?.id) });
  } catch (e) { next(e); }
});

r.get("/diagnostic/:topicId", auth, async (req, res, next) => {
  try { res.json({ data: await svc.getDiagnostic(req.params.topicId, req.user?.id) }); } catch (e) { next(e); }
});

const coStudySchema = Joi.object({
  topicId: Joi.string().required(),
  name:    Joi.string().max(80).optional(),
});
r.post("/co-study", auth, validate(coStudySchema), async (req, res, next) => {
  try {
    const token = svc.createCoStudyLink(req.user.id, req.body.topicId, req.body.name || "Topic");
    const base = process.env.FRONTEND_URL?.split(",")[0]?.trim() || "http://localhost:5173";
    res.json({ data: { token, url: `${base}/ncert/topics/${req.body.topicId}?co-study=${token}` } });
  } catch (e) { next(e); }
});

r.get("/co-study/:token", async (req, res, next) => {
  try {
    const info = svc.readCoStudyLink(req.params.token);
    if (!info) return res.status(404).json({ error: "Link expired" });
    res.json({ data: info });
  } catch (e) { next(e); }
});

export default r;
