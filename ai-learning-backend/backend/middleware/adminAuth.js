import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { sessionGet, sessionSet } from "../utils/redisClient.js";
import logger from "../utils/logger.js";
import { TOKEN_COOKIE } from "../utils/cookieNames.js";

const ROLE_CACHE_TTL = 300; // 5 min — invalidate manually on role change

export const adminAuth = async (req, res, next) => {
  // Mirror auth.js — cookie first (SEC-03), Authorization header as fallback
  const token =
    req.cookies?.[TOKEN_COOKIE] ||
    req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  try {
    // Re-check role from MongoDB on every request — never trust JWT role alone.
    // Cached in Redis for 5 min so DB is not hit on every request.
    const cacheKey = `admin_role:${decoded.id}`;
    let role = await sessionGet(cacheKey);

    if (!role) {
      const user = await User.findById(decoded.id).select("role").lean();
      if (!user) return res.status(401).json({ error: "User not found" });
      role = user.role;
      await sessionSet(cacheKey, role, ROLE_CACHE_TTL);
      logger.debug("Admin role fetched from DB", { userId: decoded.id, role });
    }

    if (role !== "admin") {
      logger.warn("Non-admin attempted admin route", { userId: decoded.id, role });
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    logger.error("adminAuth DB check failed", { err: err.message });
    next(err);
  }
};
