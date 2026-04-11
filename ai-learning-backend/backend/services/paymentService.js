import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import logger from "../utils/logger.js";

// Plan definitions — single source of truth
export const PLANS = {
  pro: {
    name:        "Pro",
    price:       19900,      // paise (₹199)
    currency:    "INR",
    aiCalls:     100,        // per day
    durationDays: 30,
    features: [
      "100 AI explanations/day",
      "All 5 subjects",
      "Full textbook chapters",
      "Live competition",
      "Voice tutor",
      "Study planner",
      "Parent portal",
    ],
  },
  premium: {
    name:        "Premium",
    price:       49900,      // paise (₹499)
    currency:    "INR",
    aiCalls:     500,        // per day
    durationDays: 30,
    features: [
      "500 AI explanations/day",
      "Everything in Pro",
      "Priority AI responses",
      "Exam performance prediction",
      "Personalised daily brief",
      "Download question banks",
    ],
  },
};

function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new AppError("Payment gateway not configured", 503);
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Create a Razorpay order for the requested plan.
 * Returns { orderId, amount, currency, planKey, planName }
 */
export async function createOrder(userId, planKey) {
  const plan = PLANS[planKey];
  if (!plan) throw new AppError(`Unknown plan: ${planKey}`, 400);

  const razorpay = getRazorpay();
  const receipt  = `order_${userId}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount:   plan.price,
    currency: plan.currency,
    receipt,
    notes: { userId: userId.toString(), planKey },
  });

  logger.info("Razorpay order created", { orderId: order.id, userId, planKey });

  return {
    orderId:  order.id,
    amount:   plan.price,
    currency: plan.currency,
    planKey,
    planName: plan.name,
    keyId:    process.env.RAZORPAY_KEY_ID,
  };
}

/**
 * Verify Razorpay payment signature and upgrade the user's plan.
 * Throws AppError on tampered/invalid signature.
 */
export async function verifyPayment(userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature, planKey }) {
  const plan = PLANS[planKey];
  if (!plan) throw new AppError(`Unknown plan: ${planKey}`, 400);

  // Signature = HMAC-SHA256(orderId + "|" + paymentId, keySecret)
  const body      = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected  = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    logger.warn("Payment signature mismatch", { userId, razorpayOrderId });
    throw new AppError("Payment verification failed — invalid signature", 400);
  }

  // Upgrade user
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + plan.durationDays);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      isPaid:      true,
      plan:        planKey,
      planExpiry:  expiry,
      aiCallsToday: 0,   // reset daily counter on upgrade
    },
    { new: true, select: "name email plan planExpiry isPaid" }
  );

  if (!user) throw new AppError("User not found", 404);

  logger.info("Payment verified — plan upgraded", {
    userId, planKey, orderId: razorpayOrderId, paymentId: razorpayPaymentId, expiry,
  });

  return { user, expiresAt: expiry };
}

/**
 * Return current subscription status for the authenticated user.
 */
export async function getSubscription(userId) {
  const user = await User.findById(userId).select("name email plan planExpiry isPaid aiCallsToday aiCallsDate");
  if (!user) throw new AppError("User not found", 404);

  const now       = new Date();
  const isActive  = user.isPaid && user.planExpiry && user.planExpiry > now;
  const planInfo  = PLANS[user.plan] || null;

  return {
    plan:       user.plan,
    isPaid:     user.isPaid,
    isActive,
    planExpiry: user.planExpiry,
    aiCallsToday: user.aiCallsToday,
    planInfo,
  };
}
