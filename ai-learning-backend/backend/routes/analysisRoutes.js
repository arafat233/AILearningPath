import express from "express";
import { getReport } from "../controllers/analysisController.js";
import { auth } from "../middleware/auth.js";
const r = express.Router();
r.get("/report", auth, getReport);
export default r;
