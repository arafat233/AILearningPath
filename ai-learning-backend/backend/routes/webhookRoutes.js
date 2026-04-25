import { Router } from "express";
import crypto from "crypto";
import { Webhook } from "svix";
import { User } from "../models/index.js";
import logger from "../utils/logger.js";

const r = Router();

// Clerk sends webhooks signed with CLERK_WEBHOOK_SECRET via Svix.
// express.raw() is applied per-route so the rest of the app keeps express.json().
r.post(
  "/clerk",
  (req, res, next) => {
    // Buffer the raw body so Svix can verify the signature
    let data = [];
    req.on("data", (chunk) => data.push(chunk));
    req.on("end", () => {
      req.rawBody = Buffer.concat(data);
      next();
    });
  },
  async (req, res) => {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      logger.warn("CLERK_WEBHOOK_SECRET not set — ignoring webhook");
      return res.status(200).json({ ok: true });
    }

    const wh = new Webhook(secret);
    let event;
    try {
      event = wh.verify(req.rawBody, {
        "svix-id":        req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    } catch (err) {
      logger.warn("Clerk webhook signature invalid", { error: err.message });
      return res.status(400).json({ error: "Invalid webhook signature" });
    }

    const { type, data } = event;
    logger.info("Clerk webhook received", { type, clerkId: data.id });

    try {
      if (type === "user.created") {
        const email = data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id
        )?.email_address;
        const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Student";

        if (email) {
          // Upsert — link clerkId if user exists by email, create if new
          await User.findOneAndUpdate(
            { email },
            { $setOnInsert: { name, email, password: crypto.randomBytes(32).toString("hex") }, $set: { clerkId: data.id } },
            { upsert: true, new: true }
          );
          logger.info("User synced from Clerk webhook", { email, clerkId: data.id });
        }
      }

      if (type === "user.updated") {
        const email = data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id
        )?.email_address;
        const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined;

        const update = { clerkId: data.id };
        if (name) update.name = name;

        if (email) await User.findOneAndUpdate({ email }, { $set: update });
        else await User.findOneAndUpdate({ clerkId: data.id }, { $set: update });

        logger.info("User updated from Clerk webhook", { clerkId: data.id });
      }

      if (type === "user.deleted") {
        // Soft-delete: just remove the clerkId link; keep learning data intact
        await User.findOneAndUpdate({ clerkId: data.id }, { $set: { clerkId: null } });
        logger.info("User unlinked from Clerk webhook", { clerkId: data.id });
      }
    } catch (err) {
      logger.error("Clerk webhook DB error", { type, error: err.message });
      return res.status(500).json({ error: "Webhook processing failed" });
    }

    res.status(200).json({ ok: true });
  }
);

export default r;
