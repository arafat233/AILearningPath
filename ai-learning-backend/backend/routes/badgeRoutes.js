import { Router } from "express";
import auth from "../middleware/auth.js";
import { getUserBadges } from "../services/badgeService.js";

const r = Router();

r.get("/", auth, async (req, res) => {
  try {
    const badges = await getUserBadges(req.user.id);
    res.json(badges);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default r;
