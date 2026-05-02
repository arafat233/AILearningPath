import jwt from "jsonwebtoken";
import { sessionGet } from "../utils/redisClient.js";
import { User } from "../models/index.js";
import logger from "../utils/logger.js";

export const auth = async (req, res, next) => {
  // Accept token from httpOnly cookie (primary) or Authorization header (fallback for API tools / curl)
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Auth rejected: no token", {
      path: req.originalUrl,
      origin: req.headers?.origin,
      hasCookieHeader: Boolean(req.headers?.cookie),
      cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
    });
    return res.status(401).json({ error: "No token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    logger.warn("Auth rejected: invalid token", {
      path: req.originalUrl,
      origin: req.headers?.origin,
      hasCookieHeader: Boolean(req.headers?.cookie),
    });
    return res.status(401).json({ error: "Invalid token" });
  }

  // SEC-04: Check token blacklist (set on logout)
  if (decoded.jti) {
    const blacklisted = await sessionGet(`token_blacklist:${decoded.jti}`).catch(() => null);
    if (blacklisted) return res.status(401).json({ error: "Token has been revoked" });
  }

  // SEC-05: Reject tokens issued before a password reset.
  // pwdChangedAt is embedded in the JWT payload — no DB call needed for this check.
  if (decoded.iat && decoded.pwdChangedAt && decoded.iat < decoded.pwdChangedAt) {
    return res.status(401).json({ error: "Password changed — please log in again" });
  }

  // Auto-downgrade expired paid plans — fire-and-forget, does not block the request.
  // Only run this check occasionally (1-in-20 chance) to avoid a DB hit on every request.
  if (Math.random() < 0.05) {
    User.findById(decoded.id).select("isPaid planExpiry").lean().then((user) => {
      if (user?.isPaid && user?.planExpiry && new Date(user.planExpiry) < new Date()) {
        User.findByIdAndUpdate(decoded.id, { $set: { isPaid: false, plan: "free" } }).catch(() => {});
      }
    }).catch(() => {});
  }

  req.user = decoded;
  next();
};
