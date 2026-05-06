import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listNcertChapters, getNcertChapter, listNcertTopics, getNcertTopicContent, getStudiedTopics, toggleStudiedTopic } from "../controllers/ncertController.js";

const r = Router();

r.get("/chapters",            listNcertChapters);
r.get("/chapters/:chapterId", getNcertChapter);
r.get("/topics",              listNcertTopics);
r.get("/topics/:topicId",     getNcertTopicContent);
r.get("/studied",             auth, getStudiedTopics);
r.post("/studied/:topicId",   auth, toggleStudiedTopic);

export default r;
