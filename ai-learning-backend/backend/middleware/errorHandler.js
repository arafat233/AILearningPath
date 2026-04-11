import { AppError } from "../utils/AppError.js";

// Standardised error response shape — always { error: string, ...optional }
// Operational errors (AppError) → surface message to client
// Programmer errors / unknown → generic 500, log details server-side only
export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ error: message });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ error: `${field} already exists` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") return res.status(401).json({ error: "Invalid token" });
  if (err.name === "TokenExpiredError")  return res.status(401).json({ error: "Token expired" });

  // Unknown — don't leak internals
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
};
