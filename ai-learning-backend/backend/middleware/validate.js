import Joi from "joi";
import { AppError } from "../utils/AppError.js";

// Validate req.body against a Joi schema.
// Returns 422 with the first validation message on failure.
export const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: true, allowUnknown: false });
  if (error) return next(new AppError(error.details[0].message, 422));
  next();
};

// Validate req.params against a Joi schema. Path-segment guards stop garbage
// like "../etc/passwd" before it reaches Mongo / the sandbox / a regex.
export const validateParams = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: true, allowUnknown: false });
  if (error) return next(new AppError(error.details[0].message, 422));
  next();
};

// Validate req.query against a Joi schema (filters / pagination). Validated in
// place without reassigning req.query (read-only in newer Express); unknown
// query keys are allowed (cache-busters etc).
export const validateQuery = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.query, { abortEarly: true, allowUnknown: true });
  if (error) return next(new AppError(error.details[0].message, 422));
  next();
};
