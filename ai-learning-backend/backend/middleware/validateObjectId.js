import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

// SEC-20: Validates that a route param is a valid MongoDB ObjectId before any DB query.
// Usage: r.get("/:id", validateObjectId("id"), handler)
export const validateObjectId = (paramName = "id") => (req, _res, next) => {
  const value = req.params[paramName];
  if (!mongoose.isValidObjectId(value)) {
    return next(new AppError(`Invalid ${paramName}`, 400));
  }
  next();
};
