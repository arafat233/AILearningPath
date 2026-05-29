import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sessionGet } from "../utils/redisClient.js";
import { User } from "../models/index.js";
import logger from "../utils/logger.js";
import { TOKEN_COOKIE } from "../utils/cookieNames.js";

// Routes where the x-child-id "view as child" swap must NEVER apply, because
// the route legitimately needs the PARENT identity (link management, parental
// controls, billing, admin operations, parent feedback, push subscriptions).
// Match on req.originalUrl prefix — this runs from per-route middleware so
// req.path alone won't include the mounted prefix.
const CHILD_SWAP_SKIP_PREFIXES = [
  "/api/portal",
  "/api/admin",
  "/api/auth",
  "/api/webhooks",
  "/api/public",
  "/api/feedback",
  "/api/push",
  "/api/v1/parent",
  "/api/v1/payment",
  "/api/payment",
  "/api/user/children",  // managing the children list itself must stay parent-scoped
  "/api/user/me",        // parent's own identity / Settings edits must not be swapped
  // NOTE 2026-05-26 — PRO_TRACK_PLAN decision #8 (pro = parent only) reversed.
  // Removed "/api/v1/pro" from the skip list so children can have their own
  // pro_* enrolments, progress, and submissions. The pilot allowlist still
  // gates on the parent's email (featureFlag.js uses req.parentUserId fallback).
];

// In-process cache of (parentId, childId) → owns?  Avoids a DB lookup on every
// authenticated request. Small TTL because linkedStudents changes rarely but
// must reflect un-linking quickly.
const ownershipCache = new Map();
const OWNERSHIP_TTL_MS = 60_000;

async function parentOwnsChild(parentId, childId) {
  const key = `${parentId}::${childId}`;
  const cached = ownershipCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.ok;
  const ok = await User.exists({ _id: parentId, linkedStudents: childId }).then(Boolean);
  ownershipCache.set(key, { ok, expiresAt: Date.now() + OWNERSHIP_TTL_MS });
  return ok;
}

// If the request carries an x-child-id header AND the path isn't in the skip
// list AND the parent (req.user) owns that child, swap req.user.id to the
// child's id and stash the original parent id on req.parentUserId. Every
// downstream controller that reads req.user.id then transparently sees the
// child as the actor — no per-controller change needed.
async function maybeSwapToChild(req) {
  const childId = req.headers["x-child-id"];
  if (!childId) return;
  if (!mongoose.isValidObjectId(childId)) return;
  if (CHILD_SWAP_SKIP_PREFIXES.some((p) => req.originalUrl.startsWith(p))) return;
  const parentId = req.user?.id;
  if (!parentId || String(parentId) === String(childId)) return;
  const owns = await parentOwnsChild(parentId, childId).catch(() => false);
  if (!owns) return;
  req.parentUserId = parentId;
  req.user = { ...req.user, id: String(childId) };
}

export const auth = async (req, res, next) => {
  // Accept token from httpOnly cookie (primary) or Authorization header (fallback for API tools / curl)
  const token =
    req.cookies?.[TOKEN_COOKIE] ||
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
  await maybeSwapToChild(req);
  next();
};

// Sets req.user if a valid token is present, but never blocks the request.
// Used on routes that are public but personalised when logged in.
export const optionalAuth = async (req, _res, next) => {
  const token =
    req.cookies?.[TOKEN_COOKIE] ||
    req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.jti) {
      const blacklisted = await sessionGet(`token_blacklist:${decoded.jti}`).catch(() => null);
      if (blacklisted) return next();
    }
    req.user = decoded;
    await maybeSwapToChild(req);
  } catch { /* invalid token — treat as unauthenticated */ }
  next();
};
