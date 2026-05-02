import crypto from "crypto";
import { CSRF_COOKIE } from "../utils/cookieNames.js";

const COOKIE_NAME = CSRF_COOKIE;
const HEADER_NAME = "x-csrf-token";
const isProd = process.env.NODE_ENV === "production";

export const setCsrfCookie = (res) => {
  const token = crypto.randomBytes(24).toString("hex");
  res.cookie(COOKIE_NAME, token, {
    httpOnly: false,                    // JS must be able to read it
    sameSite: isProd ? "none" : "lax",
    secure:   isProd,
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days — match JWT TTL
  });
  return token;
};

// Double-submit cookie: attacker can't read the cookie value cross-origin,
// so matching header === cookie proves the request came from our JS.
// Only enforced in production (SameSite: none exposes cookies cross-origin).
export const csrfProtect = (req, res, next) => {
  if (!isProd) return next();
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const headerToken = req.headers[HEADER_NAME];
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: "CSRF token invalid" });
  }
  next();
};
