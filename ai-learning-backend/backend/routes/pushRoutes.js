import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { User } from "../models/index.js";
import { sendRevisionReminders } from "../services/pushService.js";
import { adminAuth } from "../middleware/adminAuth.js";

const r = express.Router();

const subscribeSchema = Joi.object({
  endpoint: Joi.string().uri().required(),
  expirationTime: Joi.any().optional(),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth:   Joi.string().required(),
  }).required(),
});

// Public: frontend needs this to build the subscription before the user is known
r.get("/vapid-public-key", (_req, res) => {
  res.json({ data: { key: process.env.VAPID_PUBLIC_KEY || null } });
});

// Save push subscription for the logged-in user
r.post("/subscribe", auth, validate(subscribeSchema), async (req, res, next) => {
  try {
    const { endpoint, keys, expirationTime } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      pushSubscription: { endpoint, keys, expirationTime: expirationTime || null },
    });
    res.json({ data: { subscribed: true } });
  } catch (err) { next(err); }
});

// Remove push subscription
r.delete("/subscribe", auth, async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $unset: { pushSubscription: 1 } });
    res.json({ data: { subscribed: false } });
  } catch (err) { next(err); }
});

// Admin: manually trigger revision reminders (for testing)
r.post("/send-revision-reminders", adminAuth, async (_req, res, next) => {
  try {
    const result = await sendRevisionReminders();
    res.json({ data: result });
  } catch (err) { next(err); }
});

export default r;
