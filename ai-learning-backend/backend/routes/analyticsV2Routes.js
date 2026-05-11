import express from "express";
import { auth } from "../middleware/auth.js";
import * as svc from "../services/analyticsV2Service.js";

const r = express.Router();

// One-shot dashboard
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const { subject } = req.query;
    const [persona, radar, predicted, mistakeByTopic, timeOfDay, calibration, thisWeek, heatmap, qTypes, difficulty, retest, mockPaper, anomalies, insights, fingerprint] = await Promise.all([
      svc.getPersona(req.user.id),
      svc.getRadar(req.user.id, subject),
      svc.getPredictedBreakdown(req.user.id, subject || "Math"),
      svc.getMistakeByTopic(req.user.id, subject),
      svc.getTimeOfDayCorrelation(req.user.id, subject),
      svc.getCalibrationCurve(req.user.id, subject),
      svc.getThisWeek(req.user.id, subject),
      svc.getTopicHeatmap(req.user.id, subject),
      svc.getQuestionTypeBreakdown(req.user.id, subject),
      svc.getDifficultyDistribution(req.user.id, subject),
      svc.getRetestRecs(req.user.id),
      svc.getMockPaperReadiness(req.user.id),
      svc.getAnomalies(req.user.id),
      svc.getInsights(req.user.id, subject),
      svc.getBehaviourFingerprint(req.user.id, subject),
    ]);
    res.json({ data: {
      persona, radar, predicted, mistakeByTopic, timeOfDay, calibration, thisWeek,
      heatmap, qTypes, difficulty, retest, mockPaper, anomalies, insights, fingerprint,
    } });
  } catch (e) { next(e); }
});

export default r;
