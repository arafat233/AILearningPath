import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as ctrl from "../controllers/paymentController.js";
import { validateCoupon, computeDiscount } from "../services/couponService.js";
import { PLANS } from "../services/paymentService.js";
import { AppError } from "../utils/AppError.js";

const r = Router();

const VALID_PLANS = ["pro", "pro_annual", "premium", "premium_annual"];

const createOrderSchema = Joi.object({
  planKey:    Joi.string().valid(...VALID_PLANS).required(),
  couponCode: Joi.string().max(32).uppercase().allow("").optional(),
});

const verifySchema = Joi.object({
  razorpayOrderId:   Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
  planKey:           Joi.string().valid(...VALID_PLANS).required(),
});

const couponCheckSchema = Joi.object({
  code:    Joi.string().max(32).required(),
  planKey: Joi.string().valid(...VALID_PLANS).required(),
});

r.get("/plans",           ctrl.getPlans);                            // public
r.get("/subscription",    auth, ctrl.getSubscription);               // authenticated
r.post("/create-order",   auth, validate(createOrderSchema), ctrl.createOrder);
r.post("/verify",         auth, validate(verifySchema),      ctrl.verifyPayment);

// Validate coupon without creating an order — used by frontend to preview discount
r.post("/validate-coupon", auth, validate(couponCheckSchema), async (req, res, next) => {
  try {
    const { code, planKey } = req.body;
    const plan   = PLANS[planKey];
    if (!plan) return next(new AppError(`Unknown plan: ${planKey}`, 400));
    const coupon = await validateCoupon(code, planKey);
    const { discountAmount, finalPrice, discountLabel } = computeDiscount(coupon, plan.price);
    res.json({ data: { valid: true, discountAmount, finalPrice, discountLabel, originalPrice: plan.price } });
  } catch (err) { next(err); }
});

export default r;
