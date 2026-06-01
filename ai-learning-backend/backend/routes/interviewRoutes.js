/**
 * /api/v1/pro/interview/* — Interview Simulator routes (ROADMAP H).
 *
 * listProblems is intentionally auth-free so the landing page can show
 * the problem picker before the user logs in.
 * All session routes require a valid JWT.
 */
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import * as ctrl from "../controllers/interviewController.js";

const r = Router();

// Problem bank — no auth required (just shows metadata, no solutions)
r.get("/problems", ctrl.listProblems);

// Session routes — auth required
r.use(auth);

r.post("/sessions",                          ctrl.createSession);
r.get ("/sessions/:sessionId",               ctrl.getSession);
r.post("/sessions/:sessionId/message",       ctrl.sendMessage);
r.post("/sessions/:sessionId/end",           ctrl.endSession);
r.get ("/history",                           ctrl.listHistory);

export default r;
