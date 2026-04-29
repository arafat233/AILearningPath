import { Router } from "express";
import { listNcertChapters, getNcertChapter, getNcertTopicContent } from "../controllers/ncertController.js";

const r = Router();

r.get("/chapters",          listNcertChapters);
r.get("/chapters/:chapterId", getNcertChapter);
r.get("/topics/:topicId",   getNcertTopicContent);

export default r;
