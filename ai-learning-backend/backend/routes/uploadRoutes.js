import express from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { userOrIpKey } from "../utils/rateLimitKey.js";
import * as c from "../controllers/uploadController.js";

// Mounted BEFORE the global express.json() (100kb) — PDFs arrive as base64.
// 12MB JSON cap ≈ 8MB raw file (the service enforces the raw cap too).
const r = express.Router();
r.use(express.json({ limit: "12mb" }));

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  keyGenerator: userOrIpKey,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads. Try again in an hour." },
});

const createSchema = Joi.object({
  name:       Joi.string().trim().min(1).max(200).required(),
  mime:       Joi.string().valid("application/pdf", "text/plain", "text/markdown").required(),
  dataBase64: Joi.string().base64().max(11_500_000).when("mime", {
    is: "application/pdf", then: Joi.required(), otherwise: Joi.forbidden(),
  }),
  text:       Joi.string().max(2_000_000).when("mime", {
    is: "application/pdf", then: Joi.forbidden(), otherwise: Joi.required(),
  }),
  subject:    Joi.string().trim().max(100).optional().allow(""),
});

r.post("/", auth, uploadLimiter, validate(createSchema), c.create);
r.get("/", auth, c.list);
r.delete("/:id", auth, c.remove);

export default r;
