import express from "express";
import { auth } from "../middleware/auth.js";
import { listTopics, listYears, listQuestions, getQuestion } from "../controllers/pyqController.js";

const r = express.Router();

r.get("/topics",    auth, listTopics);
r.get("/years",     auth, listYears);
r.get("/",          auth, listQuestions);
r.get("/:id",       auth, getQuestion);

export default r;
