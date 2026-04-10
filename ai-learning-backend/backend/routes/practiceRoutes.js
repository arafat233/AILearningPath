import express from "express";
import { startTopic, submitAnswer, getTeacherMessage } from "../controllers/practiceController.js";
import { auth } from "../middleware/auth.js";
const r = express.Router();
r.post("/start", auth, startTopic);
r.post("/submit", auth, submitAnswer);
r.get("/teacher", auth, getTeacherMessage);
export default r;
