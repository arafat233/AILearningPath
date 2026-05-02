import Razorpay from "razorpay";
import crypto from "crypto";
import { User, PaymentRecord } from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { sessionSet, sessionGet, sessionDel } from "../utils/redisClient.js";
import logger from "../utils/logger.js";
import { sendReceiptEmail } from "../utils/email.js";
import { validateCoupon, computeDiscount, redeemCoupon } from "./couponService.js";

// Plan definitions — single source of truth
export const PLANS = {
  pro: {
    name:        "Pro",
    price:       19900,      // paise (₹199/month)
    currency:    "INR",
    aiCalls:     100,
    durationDays: 30,
    badge:       null,
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
  pro_annual: {
    name:        "Pro Annual",
    price:       179900,     // paise (₹1,799/year — 25% off monthly)
    currency:    "INR",
    aiCalls:     100,
    durationDays: 365,
    badge:       "Save 25%",
    features: [
      "Everything in Pro",
      "2 months free vs monthly",
      "Priority support",
    ],
  },
  premium: {
    name:        "Premium",
    price:       49900,      // paise (₹499/month)
    currency:    "INR",
    aiCalls:     500,
    durationDays: 30,
    badge:       null,
    features: [
      "500 AI explanations/day",
      "Everything in Pro",
      "Priority AI responses",
      "Exam performance prediction",
      "Personalised daily brief",
      "Download question banks",
    ],
  },
  premium_annual: {
    name:        "Premium Annual",
    price:       449900,     // paise (₹4,499/year — 25% off monthly)
    currency:    "INR",
    aiCalls:     500,
    durationDays: 365,
    badge:       "Save 25%",
    features: [
      "Everything in Premium",
      "2 months free vs monthly",
      "Priority support",
    ],
  },
};

function getRazorpay() {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new AppError("Payment gateway not configured", 503);
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// SEC-07: planKey is stored server-side against orderId — client cannot swap plans
const orderPlanKey    = (orderId) => `order_plan:${orderId}`;
const orderCouponKey  = (orderId) => `order_coupon:${orderId}`;
const ORDER_TTL       = 30 * 60; // 30 min — Razorpay orders expire in 15 min by default

export async function createOrder(userId, planKey, couponCode = null) {
  const plan = PLANS[planKey];
  if (!plan) throw new AppError(`Unknown plan: ${planKey}`, 400);

  let finalPrice    = plan.price;
  let discountAmount = 0;
  let discountLabel  = null;
  let couponId       = null;

  if (couponCode) {
    const coupon = await validateCoupon(couponCode, planKey);
    ({ discountAmount, finalPrice, discountLabel } = computeDiscount(coupon, plan.price));
    couponId = coupon._id.toString();
  }

  const razorpay = getRazorpay();
  const receipt  = `order_${userId}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount:   finalPrice,
    currency: plan.currency,
    receipt,
    notes: { userId: userId.toString(), planKey },
  });

  // Store planKey + coupon info in Redis — verifyPayment reads from here, ignoring client input
  await sessionSet(orderPlanKey(order.id), planKey, ORDER_TTL);
  if (couponId) {
    await sessionSet(orderCouponKey(order.id), JSON.stringify({ couponId, discountAmount }), ORDER_TTL);
  }

  logger.info("Razorpay order created", { orderId: order.id, userId, planKey, finalPrice, couponCode: couponCode || null });

  return {
    orderId:       order.id,
    amount:        finalPrice,
    originalPrice: plan.price,
    discountAmount,
    discountLabel,
    currency:      plan.currency,
    planKey,
    planName:      plan.name,
    // SECURITY: only the public key_id is sent here — NEVER include key_secret
    keyId:         process.env.RAZORPAY_KEY_ID,
  };
}

export async function verifyPayment(userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  // SEC-07: Fetch planKey from Redis — never trust client-supplied planKey
  const planKey = await sessionGet(orderPlanKey(razorpayOrderId));
  if (!planKey) throw new AppError("Order not found or expired. Please create a new order.", 400);

  const plan = PLANS[planKey];
  if (!plan) throw new AppError(`Invalid plan on file: ${planKey}`, 400);

  // Signature = HMAC-SHA256(orderId + "|" + paymentId, keySecret)
  const body     = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpaySignature) {
    logger.warn("Payment signature mismatch", { userId, razorpayOrderId });
    throw new AppError("Payment verification failed — invalid signature", 400);
  }

  // Clean up order keys + redeem coupon if used
  const couponRaw = await sessionGet(orderCouponKey(razorpayOrderId));
  await Promise.all([
    sessionDel(orderPlanKey(razorpayOrderId)),
    sessionDel(orderCouponKey(razorpayOrderId)),
  ]);

  const couponData = couponRaw ? JSON.parse(couponRaw) : null;
  if (couponData?.couponId) {
    await redeemCoupon(couponData.couponId);
  }

  // Upgrade user (also mark referral as rewarded if applicable)
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + plan.durationDays);

  const fullUser = await User.findById(userId).select("name email plan planExpiry isPaid referredBy referralRewarded");
  if (!fullUser) throw new AppError("User not found", 404);

  await User.findByIdAndUpdate(userId, {
    isPaid:           true,
    plan:             planKey,
    planExpiry:       expiry,
    aiCallsToday:     0,
    referralRewarded: true,
  });

  // Referral reward — 30 free days added to referrer when referred user first upgrades
  if (fullUser.referredBy && !fullUser.referralRewarded) {
    try {
      const referrer = await User.findById(fullUser.referredBy).select("isPaid plan planExpiry");
      if (referrer) {
        const base = referrer.isPaid && referrer.planExpiry > new Date()
          ? referrer.planExpiry
          : new Date();
        const newExpiry = new Date(base);
        newExpiry.setDate(newExpiry.getDate() + 30);
        await User.findByIdAndUpdate(fullUser.referredBy, {
          isPaid:          true,
          plan:            referrer.isPaid ? referrer.plan : "pro",
          planExpiry:      newExpiry,
          $inc:            { referralCount: 1 },
        });
        logger.info("Referral reward granted", { referrerId: fullUser.referredBy, referredUserId: userId, bonusDays: 30 });
      }
    } catch (e) {
      logger.warn("Referral reward failed — non-critical", { error: e.message });
    }
  }

  const user = await User.findById(userId).select("name email plan planExpiry isPaid");
  if (!user) throw new AppError("User not found", 404);

  await PaymentRecord.create({
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    planKey,
    amount: couponData?.discountAmount
      ? plan.price - couponData.discountAmount
      : plan.price,
    status: "captured",
  });

  // Fire-and-forget receipt email — don't block the response if email fails
  Promise.resolve(
    sendReceiptEmail({
      to:        user.email,
      name:      user.name,
      planName:  plan.name,
      amount:    plan.price,
      paymentId: razorpayPaymentId,
      expiresAt: expiry,
    })
  ).catch((err) => logger.warn("Receipt email failed", { userId, error: err.message }));

  logger.info("Payment verified — plan upgraded", {
    userId, planKey, orderId: razorpayOrderId, paymentId: razorpayPaymentId, expiry,
  });

  return { user, expiresAt: expiry };
}

export async function getSubscription(userId) {
  const user = await User.findById(userId).select("name email plan planExpiry isPaid aiCallsToday aiCallsDate trialExpiry");
  if (!user) throw new AppError("User not found", 404);

  const now          = new Date();
  const isActive     = user.isPaid && user.planExpiry && user.planExpiry > now;
  const trialActive  = !user.isPaid && user.trialExpiry && user.trialExpiry > now;
  const planInfo     = PLANS[user.plan] || null;
  const trialDaysLeft = trialActive
    ? Math.ceil((user.trialExpiry - now) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    plan:          user.plan,
    isPaid:        user.isPaid,
    isActive,
    planExpiry:    user.planExpiry,
    aiCallsToday:  user.aiCallsToday,
    planInfo,
    trialActive,
    trialExpiry:   user.trialExpiry,
    trialDaysLeft,
  };
}
