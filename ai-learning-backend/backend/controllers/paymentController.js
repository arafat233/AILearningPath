import * as paymentService from "../services/paymentService.js";

export const getPlans = (_req, res) => {
  res.json({ data: paymentService.PLANS });
};

export const getSubscription = async (req, res, next) => {
  try {
    const result = await paymentService.getSubscription(req.user.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { planKey, couponCode } = req.body;
    const result = await paymentService.createOrder(req.user.id, planKey, couponCode || null);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(req.user.id, req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};
