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

  // Fire-and-forget at 10% sampling — handles plan expiry check + DAU tracking in one DB write
  if (Math.random() < 0.10) {
    const today = new Date().toISOString().split("T")[0];
    User.findById(decoded.id).select("isPaid planExpiry lastActiveDate").lean().then((user) => {
      if (!user) return;
      const updates = {};
      if (user.lastActiveDate !== today) updates.lastActiveDate = today;
      if (user.isPaid && user.planExpiry && new Date(user.planExpiry) < new Date()) {
        updates.isPaid = false;
        updates.plan   = "free";
      }
      if (Object.keys(updates).length > 0) {
        User.findByIdAndUpdate(decoded.id, { $set: updates }).catch(() => {});
      }
    }).catch(() => {});
  }

  req.user = decoded;
  next();
};
