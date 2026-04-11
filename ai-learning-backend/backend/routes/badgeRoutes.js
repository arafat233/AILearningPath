import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getUserBadges } from "../services/badgeService.js";

const r = Router();

r.get("/", auth, async (req, res, next) => {
  try {
    const badges = await getUserBadges(req.user.id);
    res.json(badges);
  } catch (err) { next(err); }
});

export default r;
