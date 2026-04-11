import express from "express";
import Joi from "joi";
import { register, login } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const r = express.Router();

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

r.post("/register", validate(registerSchema), register);
r.post("/login",    validate(loginSchema),    login);

export default r;
