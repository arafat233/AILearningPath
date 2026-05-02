import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getPlacementQuiz, getPlacementStatus, scorePlacementQuiz } from "../controllers/placementController.js";

const r = Router();

r.get("/",        auth, getPlacementQuiz);
r.get("/status",  auth, getPlacementStatus);
r.post("/score",  auth, scorePlacementQuiz);

export default r;
