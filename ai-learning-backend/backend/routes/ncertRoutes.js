import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  listNcertChapters, getNcertChapter, listNcertTopics, getNcertTopicContent,
  getStudiedTopics, toggleStudiedTopic,
  getNcertNote, saveNcertNote,
  getPaperQuestions, getMasteryTest, submitMasteryTest,
  listAvailableSubjects,
} from "../controllers/ncertController.js";

const r = Router();

r.get("/available-subjects",  auth, listAvailableSubjects);
r.get("/chapters",            auth, listNcertChapters);
r.get("/chapters/:chapterId", auth, getNcertChapter);
r.get("/topics",              auth, listNcertTopics);
r.get("/topics/:topicId",              auth, getNcertTopicContent);
r.get("/topics/:topicId/paper-questions", auth, getPaperQuestions);
r.get("/topics/:topicId/mastery-test",    auth, getMasteryTest);
r.post("/topics/:topicId/mastery-test/submit", auth, submitMasteryTest);
r.get("/studied",             auth, getStudiedTopics);
r.post("/studied/:topicId",   auth, toggleStudiedTopic);
r.get("/notes/:topicId",      auth, getNcertNote);
r.put("/notes/:topicId",      auth, saveNcertNote);

export default r;
