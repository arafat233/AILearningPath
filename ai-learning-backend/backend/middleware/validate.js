import Joi from "joi";
import { AppError } from "../utils/AppError.js";

// Validate req.body against a Joi schema.
// Returns 422 with the first validation message on failure.
export const validate = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: true, allowUnknown: false });
  if (error) return next(new AppError(error.details[0].message, 422));
  next();
};
