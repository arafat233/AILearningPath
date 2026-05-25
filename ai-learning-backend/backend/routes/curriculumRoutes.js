import { Router } from "express";
import { optionalAuth } from "../middleware/auth.js";
import { listChapters, getChapter, listSubjects } from "../controllers/curriculumController.js";

const r = Router();

// optionalAuth so that:
//  - logged-in users (including parents viewing-as-child) get actAsChild swap
//  - anonymous browsers can still see the catalogue with explicit query params
r.get("/subjects",       optionalAuth, listSubjects);
r.get("/",               optionalAuth, listChapters);
r.get("/:chapterNumber", optionalAuth, getChapter);

export default r;
