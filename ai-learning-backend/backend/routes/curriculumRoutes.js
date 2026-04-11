import { Router } from "express";
import { listChapters, getChapter, listSubjects } from "../controllers/curriculumController.js";

const r = Router();

r.get("/subjects",       listSubjects);
r.get("/",               listChapters);
r.get("/:chapterNumber", getChapter);

export default r;
