import crypto    from "crypto";
import bcrypt    from "bcryptjs";
import jwt       from "jsonwebtoken";
import passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
  maxAge:   24 * 60 * 60 * 1000,
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  get secure()   { return isProd(); },
  get sameSite() { return isProd() ? "none" : "lax"; },
  maxAge:   30 * 24 * 60 * 60 * 1000,
  path:     "/api/auth",
};

const REFRESH_TTL = 30 * 24 * 60 * 60;

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

  try {
    const setCookie = res.getHeader?.("set-cookie");
    logger.debug("Issued auth cookies", {
      hasSetCookieHeader: Boolean(setCookie),
      setCookieCount: Array.isArray(setCookie) ? setCookie.length : (setCookie ? 1 : 0),
      sameSite: COOKIE_OPTS.sameSite,
      secure: COOKIE_OPTS.secure,
    });
  } catch { /* ignore */ }
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, jti: crypto.randomUUID() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function safeUser(user) {
  return {
    id:        user._id,
    name:      user.name,
    email:     user.email,
    role:      user.role      || "student",
    subject:   user.subject   || null,
    grade:     user.grade     || null,
    goal:      user.goal      || null,
    examDate:  user.examDate  || null,
    isPaid:    user.isPaid    || false,
    plan:      user.plan      || "free",
    planExpiry: user.planExpiry || null,
  };
}

const escHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function queueWelcomeEmail(user, { social = false } = {}) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const subject = social ? "Welcome to AILearn - Google sign-in confirmed" : "Welcome to AILearn";
  Promise.resolve(sendEmail({
    to:      user.email,
    subject,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#007AFF">Welcome, ${escHtml(user.name || "Student")}!</h2>
        <p>${social ? "Your Google sign-in is connected and your account is ready." : "Your account is ready. Start your learning journey now."}</p>
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
  }))
    .then(() => User.findByIdAndUpdate(user._id, { $set: { welcomeEmailSentAt: new Date() } }))
    .catch(err => logger.warn("Welcome email failed", { to: user.email, error: err.message }));
}

// ── register ──────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examDate, grade } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already registered", 409));

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, examDate, grade });
    await issueTokens(user, res);
    queueWelcomeEmail(user);

    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── login ─────────────────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_DURATION_MS   = 15 * 60 * 1000;

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+loginAttempts +lockUntil");

    const GENERIC = "Invalid email or password.";
    if (!user) return next(new AppError(GENERIC, 401));

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

    const user = await User.findById(userId).select("_id name email role subject grade goal examDate isPaid plan planExpiry").lean();
    if (!user) return res.status(401).json({ error: "User not found" });

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
    if (req.user?.jti && req.user?.exp) {
      const ttl = req.user.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) await sessionSet(`token_blacklist:${req.user.jti}`, "1", ttl);
    }

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

    if (!user) {
      return res.json({ data: { message: "If that email is registered, a reset link has been sent." } });
    }

    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.passwordResetToken   = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
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
    user.pwdChangedAt         = new Date();
    user.loginAttempts        = 0;
    user.lockUntil            = null;
    await user.save();

    res.json({ data: { message: "Password updated successfully. You can now sign in." } });
  } catch (err) {
    next(err);
  }
};

// ── Google OAuth (Passport) ───────────────────────────────────────────────────

// Called from server.js after dotenv.config() so env vars are available.
// ES module imports run before dotenv loads, so top-level process.env reads
// would see undefined — deferred init avoids that timing issue.
export function initPassport() {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  `${process.env.BACKEND_URL || "http://localhost:5001"}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email    = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name     = profile.displayName || "Student";

        if (!email) return done(new AppError("Google account has no email", 400));

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        let isNewUser = false;

        if (!user) {
          user = await User.create({
            name,
            email,
            googleId,
            password: crypto.randomBytes(32).toString("hex"),
          });
          isNewUser = true;
          logger.info("Google OAuth: new user created", { email });
        } else if (!user.googleId) {
          await User.findByIdAndUpdate(user._id, { googleId });
          user.googleId = googleId;
          logger.info("Google OAuth: linked googleId to existing user", { email });
        } else {
          logger.info("Google OAuth: existing user signed in", { email });
        }

        if (!user.welcomeEmailSentAt) {
          queueWelcomeEmail(user, { social: true });
        }

        const needsOnboarding = isNewUser || !user.examDate;
        return done(null, { user, needsOnboarding });
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((obj, done) => done(null, obj));
  passport.deserializeUser((obj, done) => done(null, obj));
  logger.info("Google OAuth strategy registered");
}

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

export const googleAuthCallback = [
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed` }),
  async (req, res) => {
    try {
      const { user, needsOnboarding } = req.user;
      await issueTokens(user, res);
      const dest = needsOnboarding ? "/onboarding" : "/";
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}${dest}`);
    } catch (err) {
      logger.error("googleAuthCallback error", { message: err.message });
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed`);
    }
  },
];

// ── clerk social login (REMOVED — kept as stub to avoid import errors) ────────

export const clerkAuth = async (req, res, next) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) return next(new AppError("Missing Clerk session token", 400));

    if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY.startsWith("YOUR_")) {
      return next(new AppError("Clerk is not configured on this server", 503));
    }

    const origin = req.headers?.origin;
    logger.info("Clerk auth exchange started", { origin });

    const withTimeout = async (label, ms, fn) => {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), ms);
      try {
        return await fn(ctrl.signal);
      } catch (err) {
        if (err?.name === "AbortError") {
          throw new AppError(`${label} timed out after ${ms}ms`, 504);
        }
        throw err;
      } finally {
        clearTimeout(t);
      }
    };

    // ── Step 1: verify token ──────────────────────────────────────────────────
    logger.info("Clerk step 1: verifying token...");
    let payload;
    try {
      payload = await withTimeout("Clerk token verification", 12_000, async (signal) => {
        return await verifyToken(sessionToken, {
          secretKey: process.env.CLERK_SECRET_KEY,
          signal,
        });
      });
      logger.info("Clerk step 1: token verified OK", { sub: payload.sub });
    } catch (err) {
      logger.error("Clerk step 1 FAILED", { message: err.message, code: err.code });
      return next(new AppError("Google sign-in failed — token verification error", 401));
    }

    const clerkUserId = payload.sub;

    // ── Step 2: fetch Clerk user ──────────────────────────────────────────────
    logger.info("Clerk step 2: fetching clerk user...");
    let clerkUser;
    try {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      clerkUser = await withTimeout("Clerk user fetch", 12_000, async (signal) => {
        return await clerk.users.getUser(clerkUserId, { signal });
      });
      logger.info("Clerk step 2: user fetched OK", { email: clerkUser.emailAddresses?.[0]?.emailAddress });
    } catch (err) {
      logger.error("Clerk step 2 FAILED", { message: err.message, code: err.code });
      return next(new AppError("Google sign-in failed — could not fetch user", 401));
    }

    // ── Step 3: find or create user in DB ────────────────────────────────────
    logger.info("Clerk step 3: finding/creating user in DB...");
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) return next(new AppError("Clerk account has no verified email", 400));

    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "Student";

    let user = await User.findOne({ $or: [{ clerkId: clerkUserId }, { email: primaryEmail }] });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        name,
        email:    primaryEmail,
        clerkId:  clerkUserId,
        password: crypto.randomBytes(32).toString("hex"),
      });
      isNewUser = true;
      logger.info("Clerk step 3: new user created", { email: primaryEmail });
    } else if (!user.clerkId) {
      await User.findByIdAndUpdate(user._id, { clerkId: clerkUserId });
      user.clerkId = clerkUserId;
      logger.info("Clerk step 3: linked clerkId to existing user", { email: primaryEmail });
    } else {
      logger.info("Clerk step 3: existing user found", { email: primaryEmail });
    }

    if (!user.welcomeEmailSentAt) {
      queueWelcomeEmail(user, { social: true });
    }

    // ── Step 4: issue tokens ──────────────────────────────────────────────────
    logger.info("Clerk step 4: issuing tokens...");
    await issueTokens(user, res);

    logger.info("Clerk auth exchange completed", {
      userId: user._id?.toString?.() || String(user._id),
      email:  user.email,
    });

    const needsOnboarding = isNewUser || !user.examDate;
    res.json({ data: { user: safeUser(user), isNewUser, needsOnboarding } });

  } catch (err) {
    logger.error("clerkAuth unexpected error", { message: err.message, stack: err.stack });
    return next(new AppError("Google sign-in failed — please try again.", 401));
  }
};
