import express from "express";
import { studyAdvice } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";
const r = express.Router();
r.get("/advice", auth, studyAdvice);
export default r;
