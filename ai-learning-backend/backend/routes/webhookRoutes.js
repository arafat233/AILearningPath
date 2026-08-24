import { Router } from "express";
import crypto from "crypto";
import { User, PaymentRecord } from "../models/index.js";
import { PLANS } from "../services/paymentService.js";
import { sendReceiptEmail } from "../utils/email.js";
import logger from "../utils/logger.js";

const r = Router();

// Razorpay sends webhooks signed with HMAC-SHA256 using RAZORPAY_WEBHOOK_SECRET.
// Must be registered at: https://dashboard.razorpay.com → Settings → Webhooks
r.post(
  "/razorpay",
  (req, res, next) => {
    let data = [];
    req.on("data", (chunk) => data.push(chunk));
    req.on("end", () => { req.rawBody = Buffer.concat(data); next(); });
  },
  async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      logger.warn("RAZORPAY_WEBHOOK_SECRET not set — ignoring webhook");
      return res.status(200).json({ ok: true });
    }

    const signature = req.headers["x-razorpay-signature"];
    const expected  = crypto.createHmac("sha256", secret).update(req.rawBody).digest("hex");
    if (signature !== expected) {
      logger.warn("Razorpay webhook signature mismatch");
      return res.status(400).json({ error: "Invalid signature" });
    }

    let event;
    try { event = JSON.parse(req.rawBody.toString()); }
    catch { return res.status(400).json({ error: "Invalid JSON" }); }

    const eventType = event.event;
    logger.info("Razorpay webhook received", { event: eventType });

    try {
      if (eventType === "payment.captured") {
        const payment = event.payload?.payment?.entity;
        if (!payment?.id) {
          logger.warn("payment.captured missing payment entity");
        } else {
          const existing = await PaymentRecord.findOne({ razorpayPaymentId: payment.id });
          if (existing) {
            logger.info("payment.captured already processed — skipping", { paymentId: payment.id });
          } else {
            const userId  = payment.notes?.userId;
            const planKey = payment.notes?.planKey;
            if (!userId || !planKey || !PLANS[planKey]) {
              logger.warn("payment.captured missing or invalid userId/planKey in notes", {
                paymentId: payment.id, notes: payment.notes,
              });
            } else {
              const plan   = PLANS[planKey];
              const expiry = new Date();
              expiry.setDate(expiry.getDate() + plan.durationDays);

              await PaymentRecord.findOneAndUpdate(
                { razorpayPaymentId: payment.id },
                {
                  userId,
                  razorpayOrderId:   payment.order_id || "",
                  razorpayPaymentId: payment.id,
                  planKey,
                  amount: payment.amount,
                  status: "captured",
                },
                { upsert: true, new: true }
              );
              await User.findByIdAndUpdate(userId, {
                isPaid: true, plan: planKey, planExpiry: expiry, aiCallsToday: 0,
              });

              const user = await User.findById(userId).select("name email");
              if (user) {
                sendReceiptEmail({
                  to: user.email, name: user.name, planName: plan.name,
                  amount: payment.amount, paymentId: payment.id, expiresAt: expiry,
                }).catch((err) => logger.warn("Webhook receipt email failed", { error: err.message }));
              }

              logger.info("payment.captured — user upgraded via webhook", {
                userId, planKey, paymentId: payment.id,
              });
            }
          }
        }
      }

      if (eventType === "payment.failed") {
        const payment = event.payload?.payment?.entity;
        const userId  = payment?.notes?.userId;
        logger.warn("Razorpay payment.failed", { paymentId: payment?.id, orderId: payment?.order_id, userId });
        // User was never upgraded (verifyPayment not called) — no plan change needed
      }

      if (eventType === "refund.processed") {
        const refund    = event.payload?.refund?.entity;
        const paymentId = refund?.payment_id;
        if (paymentId) {
          const record = await PaymentRecord.findOneAndUpdate(
            { razorpayPaymentId: paymentId },
            { $set: { status: "refunded" } },
            { new: true }
          );
          if (record) {
            await User.findByIdAndUpdate(record.userId, {
              $set: { isPaid: false, plan: "free", planExpiry: null },
            });
            logger.info("User downgraded after refund", { userId: record.userId, paymentId });
          } else {
            logger.warn("Refund for unknown payment", { paymentId });
          }
        }
      }
    } catch (err) {
      logger.error("Razorpay webhook processing error", { event: eventType, error: err.message });
      return res.status(500).json({ error: "Webhook processing failed" });
    }

    res.status(200).json({ ok: true });
  }
);

export default r;
