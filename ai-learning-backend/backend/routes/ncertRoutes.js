import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  listNcertChapters, getNcertChapter, listNcertTopics, getNcertTopicContent,
  getStudiedTopics, toggleStudiedTopic,
  getNcertNote, saveNcertNote,
  getPaperQuestions,
} from "../controllers/ncertController.js";

const r = Router();

r.get("/chapters",            listNcertChapters);
r.get("/chapters/:chapterId", getNcertChapter);
r.get("/topics",              listNcertTopics);
r.get("/topics/:topicId",              getNcertTopicContent);
r.get("/topics/:topicId/paper-questions", getPaperQuestions);
r.get("/studied",             auth, getStudiedTopics);
r.post("/studied/:topicId",   auth, toggleStudiedTopic);
r.get("/notes/:topicId",      auth, getNcertNote);
r.put("/notes/:topicId",      auth, saveNcertNote);

export default r;
