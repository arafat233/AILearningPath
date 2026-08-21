import express from "express";
import rateLimit from "express-rate-limit";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { AppError } from "../utils/AppError.js";
import { solveImageDoubt } from "../services/aiService.js";
import { checkAndIncrementUsage } from "../services/aiRouter.js";

// Mounted BEFORE the global express.json() (100kb cap) — photos need more room.
const r = express.Router();
r.use(express.json({ limit: "6mb" }));

const imageDoubtLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many photo doubts. Try again in an hour." },
});

// ~5.6MB base64 ≈ 4.2MB raw image (under Claude's 5MB/image cap)
const schema = Joi.object({
  image:   Joi.string().pattern(/^data:image\/(jpeg|png|webp);base64,/).max(5_600_000).required(),
  prompt:  Joi.string().trim().max(500).optional().allow(""),
  subject: Joi.string().max(100).optional().allow(""),
  mode:    Joi.string().valid("full", "hint", "socratic", "shortcut").optional(),
  lang:    Joi.string().valid("en", "hi", "hinglish").optional(),
});

r.post("/", auth, imageDoubtLimiter, validate(schema), async (req, res, next) => {
  try {
    const allowed = await checkAndIncrementUsage(req.user.id);
    if (!allowed) return next(new AppError("Daily AI limit reached. Upgrade for more.", 429));

    const match = req.body.image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!match) return next(new AppError("Invalid image", 400));
    const [, mediaType, data] = match;

    const reply = await solveImageDoubt(
      data, mediaType, req.body.prompt, req.body.subject || "Math",
      req.user.id, { mode: req.body.mode, lang: req.body.lang }
    );
    if (!reply) return next(new AppError("Couldn't read that photo. Try a clearer, well-lit picture.", 500));
    res.json({ data: { reply } });
  } catch (err) {
    next(err);
  }
});

export default r;
