/**
 * featureFlag middleware — gates a route behind an env-var email allowlist.
 *
 * PRO_TRACK_PLAN.md decision #5 (locked 2026-05-25):
 *   Pilot is INTERNAL ONLY. Anyone whose User.email is not in
 *   PRO_TRACKS_ENABLED_FOR_EMAILS gets 403 on /api/v1/pro/*.
 *
 * Usage:
 *   import { requireEmailAllowlist } from "../middleware/featureFlag.js";
 *
 *   r.use(auth);
 *   r.use(requireEmailAllowlist("PRO_TRACKS_ENABLED_FOR_EMAILS"));
 *
 * Allowlist syntax (comma-separated, case-insensitive, whitespace tolerant):
 *   PRO_TRACKS_ENABLED_FOR_EMAILS=najeebarafat@gmail.com, salma@stellar.dev
 *
 * If the env var is unset OR empty → route is closed to EVERYONE (403).
 * If the env var contains a single literal "*" → flag is OFF, route open
 * to any authenticated user (post-pilot launch path).
 */

import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

const TTL_MS = 60_000;
const cache = new Map(); // userId → { allowed, expiresAt }

function parseAllowlist(envKey) {
  const raw = (process.env[envKey] || "").trim();
  if (!raw) return { open: false, set: new Set() };
  if (raw === "*") return { open: true, set: new Set() };
  const set = new Set(
    raw.split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
  return { open: false, set };
}

export function requireEmailAllowlist(envKey) {
  return async (req, res, next) => {
    try {
      const { open, set } = parseAllowlist(envKey);
      if (open) return next();
      if (set.size === 0) {
        return next(new AppError("This feature is not enabled.", 403));
      }

      const userId = req.parentUserId || req.user?.id;
      if (!userId) return next(new AppError("Authentication required.", 401));

      const cached = cache.get(userId);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.allowed ? next() : next(new AppError("This feature is not enabled for your account.", 403));
      }

      const user = await User.findById(userId).select("email").lean();
      const allowed = !!user?.email && set.has(user.email.trim().toLowerCase());
      cache.set(userId, { allowed, expiresAt: Date.now() + TTL_MS });
      if (!allowed) return next(new AppError("This feature is not enabled for your account.", 403));
      next();
    } catch (err) { next(err); }
  };
}
