import express from "express";
import { studyAdvice, usageInfo, cacheStats } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";
const r = express.Router();
r.get("/advice",      auth, studyAdvice);   // personalised study advice
r.get("/usage",       auth, usageInfo);     // how many AI calls used today
r.get("/cache-stats", auth, cacheStats);    // how many Claude calls saved (all users)
export default r;
