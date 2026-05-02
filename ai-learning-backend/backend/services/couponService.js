import { Coupon } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

export async function validateCoupon(code, planKey) {
  const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
  if (!coupon) throw new AppError("Invalid coupon code", 400);

  const now = new Date();
  if (coupon.validUntil && coupon.validUntil < now) throw new AppError("Coupon has expired", 400);
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) throw new AppError("Coupon usage limit reached", 400);
  if (coupon.planFilter.length > 0 && !coupon.planFilter.includes(planKey)) {
    throw new AppError("Coupon is not valid for this plan", 400);
  }

  return coupon;
}

export function computeDiscount(coupon, basePrice) {
  let discountAmount;
  if (coupon.discountType === "percent") {
    discountAmount = Math.round(basePrice * coupon.discountValue / 100);
  } else {
    discountAmount = coupon.discountValue; // paise
  }
  // Never reduce below ₹1 (100 paise) — Razorpay minimum
  discountAmount = Math.min(discountAmount, basePrice - 100);
  const finalPrice = basePrice - discountAmount;

  const discountLabel = coupon.discountType === "percent"
    ? `${coupon.discountValue}% off`
    : `₹${(coupon.discountValue / 100).toFixed(0)} off`;

  return { discountAmount, finalPrice, discountLabel };
}

// Atomic increment — safe under concurrent requests
export async function redeemCoupon(couponId) {
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
}
