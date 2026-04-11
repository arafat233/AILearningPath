import { Router } from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as ctrl from "../controllers/paymentController.js";

const r = Router();

const createOrderSchema = Joi.object({
  planKey: Joi.string().valid("pro", "premium").required(),
});

const verifySchema = Joi.object({
  razorpayOrderId:   Joi.string().required(),
  razorpayPaymentId: Joi.string().required(),
  razorpaySignature: Joi.string().required(),
  planKey:           Joi.string().valid("pro", "premium").required(),
});

r.get("/plans",           ctrl.getPlans);                            // public
r.get("/subscription",    auth, ctrl.getSubscription);               // authenticated
r.post("/create-order",   auth, validate(createOrderSchema), ctrl.createOrder);
r.post("/verify",         auth, validate(verifySchema),      ctrl.verifyPayment);

export default r;
