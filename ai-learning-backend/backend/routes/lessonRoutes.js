import express from "express";
import { getLesson, listLessons, saveProgress } from "../controllers/lessonController.js";
import { auth } from "../middleware/auth.js";

const r = express.Router();
r.get("/", auth, listLessons);
r.get("/:topic", auth, getLesson);
r.post("/progress", auth, saveProgress);
export default r;
