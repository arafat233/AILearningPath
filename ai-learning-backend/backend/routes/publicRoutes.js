import { Router } from "express";
import { User, Attempt, AIUsageStats } from "../models/index.js";

const r = Router();

// In-memory cache — refreshed every 5 minutes so homepage loads fast without hammering DB
let _cache   = null;
let _cacheAt = 0;
const TTL = 5 * 60 * 1000;

r.get("/stats", async (req, res, next) => {
  try {
    if (_cache && Date.now() - _cacheAt < TTL) {
      return res.json(_cache);
    }

    const realUsers = { email: { $not: /stellar\.child$/ } };

    const [totalUsers, attemptAgg, aiAgg] = await Promise.all([
      User.countDocuments(realUsers),
      Attempt.aggregate([
        { $group: { _id: null, total: { $sum: 1 }, correct: { $sum: { $cond: ["$isCorrect", 1, 0] } } } },
      ]),
      AIUsageStats.aggregate([
        { $group: { _id: null, calls: { $sum: "$callsMade" } } },
      ]),
    ]);

    const total   = attemptAgg[0]?.total   || 0;
    const correct = attemptAgg[0]?.correct || 0;
    const acc     = total > 0 ? correct / total : 0;

    const avgGrade =
      total === 0  ? "—"  :
      acc >= 0.91  ? "A1" :
      acc >= 0.81  ? "A2" :
      acc >= 0.71  ? "B1" :
      acc >= 0.61  ? "B2" :
      acc >= 0.51  ? "C1" : "C2";

    _cache   = { totalUsers, aiHints: aiAgg[0]?.calls || 0, avgGrade };
    _cacheAt = Date.now();

    res.json(_cache);
  } catch (err) { next(err); }
});

// ── Free-tier Pro topic preview (D5.1) — no auth required ───────────────────
import * as proSvc from "../services/proService.js";

r.get("/pro/topics/:topicId", async (req, res, next) => {
  try {
    const data = await proSvc.getPublicTopic(req.params.topicId);
    res.json({ data });
  } catch (err) { next(err); }
});

r.get("/pro/topics/:topicId/exercises", async (req, res, next) => {
  try {
    const data = await proSvc.listPublicExercises(req.params.topicId);
    res.json({ data });
  } catch (err) { next(err); }
});

export default r;
