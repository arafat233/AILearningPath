import { Router } from "express";
import Joi from "joi";
import rateLimit from "express-rate-limit";
import { register, login, logout, refresh, forgotPassword, resetPassword, googleAuth, googleAuthCallback } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";

const r = Router();

// SEC-02: Tight limiter for login — 10 attempts per 15 min per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
});

// SEC-19: Tight limiter for forgot-password — 5 per hour per IP
const forgotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many reset requests. Please try again in an hour." },
});

const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(80).required(),
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(), // raised from 6 to 8
  examDate: Joi.date().iso().optional(),
  grade:    Joi.string().optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const forgotSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

const resetSchema = Joi.object({
  password: Joi.string().min(8).required(),
});

r.post("/register",              validate(registerSchema),             register);
r.post("/login",                 loginLimiter, validate(loginSchema),  login);
r.post("/logout",                auth,                                  logout);
r.post("/refresh",                                                      refresh); // no auth — access token may be expired
r.post("/forgot-password",       forgotLimiter, validate(forgotSchema), forgotPassword);
r.post("/reset-password/:token", validate(resetSchema),                 resetPassword);
r.get("/google",          googleAuth);
r.get("/google/callback", googleAuthCallback);

export default r;
