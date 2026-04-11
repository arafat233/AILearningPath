// Operational errors (predictable, user-facing) — pass to next(new AppError(...))
// Programmer errors (bugs) — let them crash so the global handler catches them
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
