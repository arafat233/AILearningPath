import jwt from "jsonwebtoken";
import { sessionGet } from "../utils/redisClient.js";
import { User } from "../models/index.js";

export const auth = async (req, res, next) => {
  // Accept token from httpOnly cookie (primary) or Authorization header (fallback for API tools / curl)
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  // SEC-04: Check token blacklist (set on logout)
  if (decoded.jti) {
    const blacklisted = await sessionGet(`token_blacklist:${decoded.jti}`).catch(() => null);
    if (blacklisted) return res.status(401).json({ error: "Token has been revoked" });
  }

  // SEC-05: Reject tokens issued before a password reset
  if (decoded.iat) {
    const user = await User.findById(decoded.id).select("pwdChangedAt").lean().catch(() => null);
    if (user?.pwdChangedAt) {
      const changedAt = Math.floor(new Date(user.pwdChangedAt).getTime() / 1000);
      if (decoded.iat < changedAt) {
        return res.status(401).json({ error: "Password changed — please log in again" });
      }
    }
  }

  req.user = decoded;
  next();
};
