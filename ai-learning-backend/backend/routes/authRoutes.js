import { Router } from "express";
import Joi from "joi";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const r = Router();

const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(80).required(),
  email:    Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
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
  password: Joi.string().min(6).required(),
});

r.post("/register",             validate(registerSchema), register);
r.post("/login",                validate(loginSchema),    login);
r.post("/forgot-password",      validate(forgotSchema),   forgotPassword);
r.post("/reset-password/:token", validate(resetSchema),   resetPassword);

export default r;
