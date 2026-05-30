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

// Pro certificate (computed, deprecated — use /certificates instead)
r.get("/certificate", auth, async (req, res, next) => {
  try {
    const { trackKey } = req.query;
    if (!trackKey) return res.status(400).json({ error: "trackKey required" });
    const data = await svc.getProCertificate(req.user.id, trackKey);
    res.json({ data });
  } catch (e) { next(e); }
});

// List user's module certificates
r.get("/certificates", auth, async (req, res, next) => {
  try {
    const { trackKey } = req.query;
    if (!trackKey) return res.status(400).json({ error: "trackKey required" });
    const certs = await svc.listUserCertificates(req.user.id, trackKey);
    res.json({ data: certs });
  } catch (e) { next(e); }
});

// Issue module certificate (on demand)
r.post("/certificates/issue", auth, async (req, res, next) => {
  try {
    const { trackKey, moduleId } = req.body;
    if (!trackKey || !moduleId) {
      return res.status(400).json({ error: "trackKey and moduleId required" });
    }
    const cert = await svc.issueModuleCertificate(req.user.id, trackKey, moduleId);
    res.json({ data: cert });
  } catch (e) { next(e); }
});

// Pro leaderboard
r.get("/leaderboard", auth, async (req, res, next) => {
  try {
    const { trackKey, limit } = req.query;
    if (!trackKey) return res.status(400).json({ error: "trackKey required" });
    const leaderboard = await svc.getProLeaderboard(trackKey, Math.min(parseInt(limit) || 20, 100));
    res.json({ data: leaderboard });
  } catch (e) { next(e); }
});

export default r;
