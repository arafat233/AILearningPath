import crypto    from "crypto";
import bcrypt    from "bcryptjs";
import jwt       from "jsonwebtoken";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { User }  from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { sendEmail } from "../utils/email.js";
import { sessionSet, sessionGet, sessionDel } from "../utils/redisClient.js";
import logger from "../utils/logger.js";

// ── helpers ───────────────────────────────────────────────────────────────────

const isProd = () => process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  get secure()   { return isProd(); },
  get sameSite() { return isProd() ? "none" : "lax"; },
  maxAge:   24 * 60 * 60 * 1000, // 1 day (access token)
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  get secure()   { return isProd(); },
  get sameSite() { return isProd() ? "none" : "lax"; },
  maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days
  path:     "/api/auth", // only sent to auth routes — not every request
};

const REFRESH_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

function makeRefreshToken() {
  const raw  = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

async function issueTokens(user, res) {
  const accessToken = signToken(user);

  const { raw, hash } = makeRefreshToken();
  await sessionSet(`refresh:${hash}`, user._id.toString(), REFRESH_TTL);

  res.cookie("token",        accessToken, COOKIE_OPTS);
  res.cookie("refreshToken", raw,         REFRESH_COOKIE_OPTS);
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, jti: crypto.randomUUID() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role || "student" };
}

const escHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// ── register ──────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examDate, grade } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already registered", 409));

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, examDate, grade });
    await issueTokens(user, res);

    // Welcome email — fire-and-forget so a delivery hiccup never blocks login
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    Promise.resolve(sendEmail({
      to:      user.email,
      subject: "Welcome to AILearn 🎉",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#007AFF">Welcome, ${escHtml(user.name)}!</h2>
          <p>Your account is ready. Start your learning journey now.</p>
          <a href="${frontendUrl}/dashboard"
             style="display:inline-block;background:#007AFF;color:#fff;padding:12px 24px;
                    border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0">
            Go to Dashboard
          </a>
          <p style="color:#888;font-size:13px">
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      `,
    })).catch(err => logger.warn("Welcome email failed", { to: user.email, error: err.message }));

    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── login ─────────────────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_DURATION_MS   = 15 * 60 * 1000; // 15 min

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+loginAttempts +lockUntil");

    // Generic message for both wrong email and wrong password — prevents user enumeration (SEC-01)
    const GENERIC = "Invalid email or password.";

    if (!user) return next(new AppError(GENERIC, 401));

    // Account lockout check (SEC-23)
    if (user.lockUntil && user.lockUntil > new Date()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return next(new AppError(`Account locked. Try again in ${mins} minute(s).`, 429));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const attempts = (user.loginAttempts || 0) + 1;
      const update   = { loginAttempts: attempts };
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      }
      await User.findByIdAndUpdate(user._id, { $set: update });
      return next(new AppError(GENERIC, 401));
    }

    // Reset lockout on successful login
    await User.findByIdAndUpdate(user._id, { $set: { loginAttempts: 0, lockUntil: null } });

    await issueTokens(user, res);
    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── refresh ───────────────────────────────────────────────────────────────────

export const refresh = async (req, res, next) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) return res.status(401).json({ error: "No refresh token" });

    const hash   = crypto.createHash("sha256").update(raw).digest("hex");
    const userId = await sessionGet(`refresh:${hash}`);
    if (!userId) return res.status(401).json({ error: "Refresh token invalid or expired" });

    const user = await User.findById(userId).select("_id name email role").lean();
    if (!user) return res.status(401).json({ error: "User not found" });

    // Rotate refresh token — old one is invalidated
    await sessionDel(`refresh:${hash}`);
    await issueTokens(user, res);
    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── logout ────────────────────────────────────────────────────────────────────

export const logout = async (req, res, next) => {
  try {
    // Blacklist the current access token's JTI
    if (req.user?.jti && req.user?.exp) {
      const ttl = req.user.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) await sessionSet(`token_blacklist:${req.user.jti}`, "1", ttl);
    }

    // Invalidate refresh token
    const rawRefresh = req.cookies?.refreshToken;
    if (rawRefresh) {
      const hash = crypto.createHash("sha256").update(rawRefresh).digest("hex");
      await sessionDel(`refresh:${hash}`);
    }

    res.clearCookie("token",        { httpOnly: true, sameSite: isProd() ? "none" : "lax", secure: isProd() });
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: isProd() ? "none" : "lax", secure: isProd(), path: "/api/auth" });
    res.json({ data: { message: "Logged out successfully." } });
  } catch (err) {
    next(err);
  }
};

// ── forgot password ───────────────────────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond 200 — never reveal whether the email exists
    if (!user) {
      return res.json({ data: { message: "If that email is registered, a reset link has been sent." } });
    }

    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.passwordResetToken   = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl    = `${frontendUrl}/reset-password/${rawToken}`;

    await sendEmail({
      to:      user.email,
      subject: "Reset your AILearn password",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#007AFF">Reset your password</h2>
          <p>Hi ${escHtml(user.name)},</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#007AFF;color:#fff;padding:12px 24px;
                    border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ data: { message: "If that email is registered, a reset link has been sent." } });
  } catch (err) {
    next(err);
  }
};

// ── reset password ────────────────────────────────────────────────────────────

export const resetPassword = async (req, res, next) => {
  try {
    const { token }    = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) return next(new AppError("Reset link is invalid or has expired. Please request a new one.", 400));

    user.password             = await bcrypt.hash(password, 10);
    user.passwordResetToken   = null;
    user.passwordResetExpires = null;
    user.pwdChangedAt         = new Date(); // invalidates all existing sessions (SEC-05)
    user.loginAttempts        = 0;
    user.lockUntil            = null;
    await user.save();

    res.json({ data: { message: "Password updated successfully. You can now sign in." } });
  } catch (err) {
    next(err);
  }
};

// ── clerk social login ────────────────────────────────────────────────────────
// Called after frontend completes Google OAuth via Clerk.
// Verifies the Clerk session token, finds or creates a User, issues our JWT cookie.

export const clerkAuth = async (req, res, next) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) return next(new AppError("Missing Clerk session token", 400));

    if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY.startsWith("YOUR_")) {
      return next(new AppError("Clerk is not configured on this server", 503));
    }

    // verifyToken is a top-level export — it's NOT a method on the clerk client
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    const clerkUserId = payload.sub;

    // Fetch the full Clerk user so we have name + email
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) return next(new AppError("Clerk account has no verified email", 400));

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Student";

    // Find existing user by clerkId, fall back to email match (links existing accounts)
    let user = await User.findOne({ $or: [{ clerkId: clerkUserId }, { email: primaryEmail }] });

    if (!user) {
      // New user — create account (no password needed for social login)
      user = await User.create({ name, email: primaryEmail, clerkId: clerkUserId, password: crypto.randomBytes(32).toString("hex") });
      logger.info("New user created via Clerk social login", { email: primaryEmail });

      // Welcome email
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      sendEmail({
        to:      user.email,
        subject: "Welcome to AILearn 🎉",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
            <h2 style="color:#007AFF">Welcome, ${escHtml(name)}!</h2>
            <p>Your account is ready. You signed in with Google — no password needed.</p>
            <a href="${frontendUrl}/dashboard"
               style="display:inline-block;background:#007AFF;color:#fff;padding:12px 24px;
                      border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0">
              Go to Dashboard
            </a>
          </div>
        `,
      }).catch(err => logger.warn("Clerk welcome email failed", { to: user.email, error: err.message }));
    } else if (!user.clerkId) {
      // Existing email/password user — link their Clerk ID going forward
      await User.findByIdAndUpdate(user._id, { clerkId: clerkUserId });
    }

    await issueTokens(user, res);
    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    logger.warn("clerkAuth error", { message: err.message, code: err.code });
    // Any error from verifyToken or the Clerk API means the session is bad
    return next(new AppError("Google sign-in failed — please try again.", 401));
  }
};
