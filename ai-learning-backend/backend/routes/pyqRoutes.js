import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { listTopics, listYears, listQuestions, listChapters, getQuestion } from "../controllers/pyqController.js";
import {
  getHighFrequencyTopics, repeatLikelihood, getSolveRates, getSolvedStatus,
  getTopicAppearances, buildMockFromFilters, getTopicProgress,
} from "../services/pyqV2Service.js";

const r = express.Router();

// ── v2: dashboard payload (high-freq topics + topic progress) ─────
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const subject = req.query.subject || "Mathematics";
    const grade   = req.query.grade   || "10";
    const [hf, progress, appearances] = await Promise.all([
      getHighFrequencyTopics({ subject, grade }),
      getTopicProgress(req.user.id, { subject, grade }),
      getTopicAppearances({ subject, grade }),
    ]);
    res.json({ data: { highFrequency: hf, progress, appearances } });
  } catch (e) { next(e); }
});

// ── v2: enrich a question list with solveRate + likelihood + status ──
r.post("/enrich", auth, async (req, res, next) => {
  try {
    const { questionIds = [], subject = "Mathematics", grade = "10" } = req.body || {};
    if (!questionIds.length) return res.json({ data: {} });
    const [solveRates, solved, appearances, hf] = await Promise.all([
      getSolveRates(questionIds),
      getSolvedStatus(req.user.id, questionIds),
      getTopicAppearances({ subject, grade }),
      getHighFrequencyTopics({ subject, grade }),
    ]);
    res.json({ data: { solveRates, solved, appearances, yearCount: hf.yearCount } });
  } catch (e) { next(e); }
});

// ── v2: build a mock paper from current filters ───────────────────
const mockSchema = Joi.object({
  subject:  Joi.string().optional(),
  grade:    Joi.string().optional(),
  year:     Joi.number().integer().optional(),
  years:    Joi.array().items(Joi.number().integer()).max(20).optional(),
  topics:   Joi.array().items(Joi.string()).max(20).optional(),
  chapters: Joi.array().items(Joi.number().integer()).max(20).optional(),
  limit:    Joi.number().integer().min(5).max(50).optional(),
});
r.post("/mock-from-filters", auth, validate(mockSchema), async (req, res, next) => {
  try { res.json({ data: await buildMockFromFilters(req.body) }); } catch (e) { next(e); }
});

// Existing
r.get("/topics",    auth, listTopics);
r.get("/years",     auth, listYears);
r.get("/chapters",  auth, listChapters);
r.get("/",          auth, listQuestions);
r.get("/:id",       auth, getQuestion);

export default r;

// Re-export helpers for the frontend
export { repeatLikelihood };
