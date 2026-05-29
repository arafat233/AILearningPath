/**
 * /api/v1/pro-analytics/* — analytics for pro-track users.
 *
 * Thin route: all business logic lives in proAnalyticsService.js.
 * Route: auth only (no email allowlist — enrolled users are already verified
 * on the service layer via isEnrolled).
 */

import express from "express";
import { auth } from "../middleware/auth.js";
import * as svc from "../services/proAnalyticsService.js";

const r = express.Router();

// One-shot dashboard
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const { trackKey } = req.query;
    const data = await svc.getProAnalyticsDashboard(req.user.id, trackKey || null);
    if (!data) {
      return res.json({ data: null, error: "No pro track enrolled." });
    }
    res.json({ data });
  } catch (e) { next(e); }
});

// Pro certificate
r.get("/certificate", auth, async (req, res, next) => {
  try {
    const { trackKey } = req.query;
    if (!trackKey) return res.status(400).json({ error: "trackKey required" });
    const data = await svc.getProCertificate(req.user.id, trackKey);
    res.json({ data });
  } catch (e) { next(e); }
});

export default r;
