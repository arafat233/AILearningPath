import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as svc from "../services/competitionV2Service.js";

const r = express.Router();

// One-shot dashboard
r.get("/dashboard", auth, async (req, res, next) => {
  try {
    const me = await import("../models/index.js").then((m) => m.User.findById(req.user.id).select("grade").lean());
    const [arena, leaderboard, rooms, history, quests, champion] = await Promise.all([
      svc.getArena(req.user.id),
      svc.getWeeklyLeaderboard(req.user.id, me?.grade || null),
      svc.listOpenRooms(),
      svc.getMatchHistory(req.user.id, 5),
      svc.getDailyQuests(req.user.id),
      svc.getChampion(),
    ]);
    res.json({ data: { arena, leaderboard, rooms, history, quests, champion } });
  } catch (e) { next(e); }
});

const createRoomSchema = Joi.object({
  topic:      Joi.string().min(1).max(200).required(),
  subject:    Joi.string().valid("Math", "Science", "English", "Social Science", "Hindi").optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
  capacity:   Joi.number().integer().min(2).max(8).optional(),
  visibility: Joi.string().valid("public", "private").optional(),
});
r.post("/rooms", auth, validate(createRoomSchema), async (req, res, next) => {
  try { res.json({ data: await svc.createRoom(req.user.id, req.body) }); } catch (e) { next(e); }
});

r.get("/rooms",       auth, async (req, res, next) => { try { res.json({ data: await svc.listOpenRooms() }); } catch (e) { next(e); } });
r.get("/rooms/:code", auth, async (req, res, next) => { try { res.json({ data: await svc.getRoomLive(req.params.code) }); } catch (e) { next(e); } });
r.post("/rooms/:code/join",  auth, async (req, res, next) => { try { res.json({ data: await svc.joinRoom(req.user.id, req.params.code) }); } catch (e) { next(e); } });
r.post("/rooms/:code/leave", auth, async (req, res, next) => { try { res.json({ data: await svc.leaveRoom(req.user.id, req.params.code) }); } catch (e) { next(e); } });
r.post("/rooms/:code/ready", auth, async (req, res, next) => { try { res.json({ data: await svc.readyUp(req.user.id, req.params.code) }); } catch (e) { next(e); } });
r.post("/rooms/:code/start", auth, async (req, res, next) => { try { res.json({ data: await svc.startMatch(req.user.id, req.params.code) }); } catch (e) { next(e); } });

const answerSchema = Joi.object({
  questionId: Joi.string().required(),
  isCorrect:  Joi.boolean().required(),
  timeTaken:  Joi.number().integer().min(0).max(600).required(),
});
r.post("/rooms/:code/answer", auth, validate(answerSchema), async (req, res, next) => {
  try { res.json({ data: await svc.recordAnswer(req.user.id, req.params.code, req.body) }); } catch (e) { next(e); }
});

r.post("/rooms/:code/finish", auth, async (req, res, next) => {
  try { res.json({ data: await svc.finishMatch(req.params.code) }); } catch (e) { next(e); }
});

r.post("/quick-match", auth, async (req, res, next) => {
  try { res.json({ data: await svc.quickMatch(req.user.id, req.body?.subject) }); } catch (e) { next(e); }
});

r.get("/history",  auth, async (req, res, next) => { try { res.json({ data: await svc.getMatchHistory(req.user.id) }); } catch (e) { next(e); } });
r.get("/quests",   auth, async (req, res, next) => { try { res.json({ data: await svc.getDailyQuests(req.user.id) }); } catch (e) { next(e); } });

const reportSchema = Joi.object({
  targetId: Joi.string().required(),
  matchId:  Joi.string().required(),
  reason:   Joi.string().valid("cheating", "bad_sport", "afk", "other").required(),
  note:     Joi.string().allow("").max(500).optional(),
});
r.post("/report", auth, validate(reportSchema), async (req, res, next) => {
  try { res.json({ data: await svc.reportOpponent(req.user.id, req.body.targetId, req.body.matchId, req.body.reason, req.body.note) }); } catch (e) { next(e); }
});

export default r;
