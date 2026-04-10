import express from "express";
import { getPlan, markDayComplete } from "../controllers/plannerController.js";
import { auth } from "../middleware/auth.js";
const r = express.Router();
r.get("/", auth, getPlan);
r.post("/complete", auth, markDayComplete);
export default r;
