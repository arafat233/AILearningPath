import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as svc from "../services/profileV2Service.js";

const r = express.Router();

// Public — must be before authenticated routes that share /profile prefix
r.get("/public/:slug", async (req, res, next) => {
  try { res.json({ data: await svc.getPublicProfile(req.params.slug) }); } catch (e) { next(e); }
});

r.get("/heatmap",       auth, async (req, res, next) => { try { res.json({ data: await svc.getActivityHeatmap(req.user.id) }); } catch (e) { next(e); } });
r.get("/subjects",      auth, async (req, res, next) => { try { res.json({ data: await svc.getSubjectBreakdown(req.user.id) }); } catch (e) { next(e); } });
r.get("/level",         auth, async (req, res, next) => { try { res.json({ data: await svc.getLevelInfo(req.user.id) }); } catch (e) { next(e); } });
r.get("/goal-progress", auth, async (req, res, next) => { try { res.json({ data: await svc.getGoalProgress(req.user.id) }); } catch (e) { next(e); } });
r.get("/activity",      auth, async (req, res, next) => { try { res.json({ data: await svc.getRecentActivity(req.user.id) }); } catch (e) { next(e); } });
r.get("/next-badge",    auth, async (req, res, next) => { try { res.json({ data: await svc.getNextBadge(req.user.id) }); } catch (e) { next(e); } });
r.get("/best-window",   auth, async (req, res, next) => { try { res.json({ data: await svc.getBestLearningWindow(req.user.id) }); } catch (e) { next(e); } });
r.get("/timeline",      auth, async (req, res, next) => { try { res.json({ data: await svc.getAchievementTimeline(req.user.id) }); } catch (e) { next(e); } });
r.get("/sessions",      auth, async (req, res, next) => { try { res.json({ data: await svc.getActiveSessions(req.user.id) }); } catch (e) { next(e); } });
r.delete("/sessions/:id", auth, async (req, res, next) => { try { await svc.revokeSession(req.user.id, req.params.id); res.json({ data: { ok: true } }); } catch (e) { next(e); } });
r.get("/certificates",  auth, async (req, res, next) => { try { res.json({ data: await svc.listCertificates(req.user.id) }); } catch (e) { next(e); } });
r.get("/classmate-compare", auth, async (req, res, next) => { try { res.json({ data: await svc.getClassmateCompare(req.user.id) }); } catch (e) { next(e); } });
r.get("/mood",          auth, async (req, res, next) => { try { res.json({ data: await svc.getMoodHistory(req.user.id) }); } catch (e) { next(e); } });

const moodSchema = Joi.object({
  mood: Joi.string().valid("great", "ok", "low").required(),
  note: Joi.string().allow("").max(200).optional(),
});
r.post("/mood",         auth, validate(moodSchema), async (req, res, next) => { try { res.json({ data: await svc.upsertMood(req.user.id, req.body.mood, req.body.note) }); } catch (e) { next(e); } });

const settingsSchema = Joi.object({
  avatarDataUrl: Joi.string().allow(null, "").max(100 * 1024).optional(),
  manifesto: Joi.string().allow("").max(200).optional(),
  locale:    Joi.string().valid("en", "hi").optional(),
  timezone:  Joi.string().max(60).optional(),
  theme:     Joi.string().valid("light", "dark", "system").optional(),
  density:   Joi.string().valid("comfortable", "compact").optional(),
  notifPrefs: Joi.object({
    push:   Joi.boolean().optional(),
    email:  Joi.boolean().optional(),
    streak: Joi.boolean().optional(),
    exam:   Joi.boolean().optional(),
  }).optional(),
  twoFactorEnabled: Joi.boolean().optional(),
});
r.patch("/settings",    auth, validate(settingsSchema), async (req, res, next) => { try { res.json({ data: await svc.updateSettings(req.user.id, req.body) }); } catch (e) { next(e); } });

const publicSchema = Joi.object({
  enabled:   Joi.boolean().optional(),
  slug:      Joi.string().max(40).allow("").optional(),
  manifesto: Joi.string().allow("").max(200).optional(),
});
r.patch("/public",      auth, validate(publicSchema), async (req, res, next) => { try { res.json({ data: await svc.setPublicProfile(req.user.id, req.body) }); } catch (e) { next(e); } });

const visibilitySchema = Joi.object({
  parentId: Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
  scores:   Joi.boolean().required(),
  streak:   Joi.boolean().required(),
  chats:    Joi.boolean().required(),
});
r.patch("/parent-visibility", auth, validate(visibilitySchema), async (req, res, next) => {
  try {
    const { parentId, ...vis } = req.body;
    await svc.updateParentVisibility(req.user.id, parentId, vis);
    res.json({ data: { ok: true } });
  } catch (e) { next(e); }
});

r.get("/export",        auth, async (req, res, next) => {
  try {
    const data = await svc.exportUserData(req.user.id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="stellar-data-${new Date().toISOString().slice(0,10)}.json"`);
    res.send(JSON.stringify(data, null, 2));
  } catch (e) { next(e); }
});

export default r;
