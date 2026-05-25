/**
 * trackFilter middleware — track-level access control for /api/v1/pro/*.
 *
 * Modelled on utils/boardFilter.js (which enforces CBSE/ICSE/AP_SSC content
 * isolation). Where boardFilter scopes content by examBoard, trackFilter
 * scopes it by track enrolment (User.tracks[].key — added 2026-05-25 in
 * the User schema).
 *
 * Two helpers:
 *
 *   requireEnrolled(trackKeyParam)
 *     Express middleware that reads the trackKey from req.params (or
 *     derives it from the path) and 403s the request if the authenticated
 *     user has no User.tracks entry with that key.
 *
 *   isEnrolled(userId, trackKey)
 *     Plain function for services that need the check inline (without
 *     binding it to a route).
 *
 * Caches enrolment checks in-process for 60 s. The cache key is
 * `${userId}::${trackKey}` so unenrolling immediately after enrolling
 * still respects the most-recent state within reason.
 */

import { User } from "../models/index.js";
import { AppError } from "../utils/AppError.js";

const TTL_MS = 60_000;
const cache = new Map(); // "userId::trackKey" → { enrolled, expiresAt }

export async function isEnrolled(userId, trackKey) {
  if (!userId || !trackKey) return false;
  const key = `${userId}::${trackKey}`;
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.enrolled;

  const u = await User.findOne(
    { _id: userId, "tracks.key": trackKey },
    { _id: 1 }
  ).lean();
  const enrolled = !!u;
  cache.set(key, { enrolled, expiresAt: Date.now() + TTL_MS });
  return enrolled;
}

// Express middleware. `paramName` is the request-param that carries the
// track key — usually "trackKey" or "trackSlug" (translated → key by the
// controller before calling this).
export function requireEnrolled(getTrackKey) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError("Authentication required.", 401));

      const trackKey = typeof getTrackKey === "function"
        ? getTrackKey(req)
        : req.params[getTrackKey];

      if (!trackKey) return next(new AppError("Missing track identifier.", 400));

      if (!(await isEnrolled(userId, trackKey))) {
        return next(new AppError("Not enrolled in this track.", 403));
      }
      next();
    } catch (err) { next(err); }
  };
}

// Invalidate the cache for one user — call after enrol/unenrol/remove so
// the next request reflects the new state without waiting for TTL.
export function invalidateEnrolment(userId, trackKey = null) {
  if (!userId) return;
  if (trackKey) {
    cache.delete(`${userId}::${trackKey}`);
    return;
  }
  for (const k of cache.keys()) {
    if (k.startsWith(`${userId}::`)) cache.delete(k);
  }
}
