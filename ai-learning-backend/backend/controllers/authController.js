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
import { setCsrfCookie } from "../middleware/csrf.js";
import { TOKEN_COOKIE, REFRESH_COOKIE } from "../utils/cookieNames.js";

// ── helpers ───────────────────────────────────────────────────────────────────

const isProd = () => process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  httpOnly: true,
  get secure()   { return isProd(); },
  get sameSite() { return isProd() ? "none" : "lax"; },
  maxAge:   24 * 60 * 60 * 1000,
  path:     "/",   // required for __Host- prefix
};

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  get secure()   { return isProd(); },
  get sameSite() { return isProd() ? "none" : "lax"; },
  get domain()   { return isProd() && process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : undefined; },
  maxAge:   30 * 24 * 60 * 60 * 1000,
  path:     "/api/auth",
};

const REFRESH_TTL = 30 * 24 * 60 * 60;

// Token family tracking — format: "<40-random-hex>:<32-familyId-hex>"
// The familyId is embedded in the raw token so reuse can be detected after rotation.
function makeRefreshToken(familyId) {
  const random   = crypto.randomBytes(40).toString("hex");
  const fid      = familyId || crypto.randomBytes(16).toString("hex");
  const raw      = `${random}:${fid}`;
  const hash     = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash, familyId: fid };
}

function parseRefreshToken(raw) {
  const colon = raw.lastIndexOf(":");
  if (colon === -1) return { random: raw, familyId: null };
  return { random: raw.slice(0, colon), familyId: raw.slice(colon + 1) };
}

async function issueTokens(user, res, familyId) {
  const accessToken = signToken(user);
  const { raw, hash, familyId: fid } = makeRefreshToken(familyId);
  await Promise.all([
    sessionSet(`refresh:${hash}`, JSON.stringify({ userId: user._id.toString(), familyId: fid }), REFRESH_TTL),
    sessionSet(`family:${fid}`, user._id.toString(), REFRESH_TTL),
  ]);
  res.cookie(TOKEN_COOKIE,   accessToken, COOKIE_OPTS);
  res.cookie(REFRESH_COOKIE, raw,         REFRESH_COOKIE_OPTS);

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
    {
      id:           user._id,
      role:         user.role || "student",
      // Embed pwdChangedAt so auth middleware can validate without a DB call
      pwdChangedAt: user.pwdChangedAt ? Math.floor(new Date(user.pwdChangedAt).getTime() / 1000) : 0,
      jti:          crypto.randomUUID(),
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

function safeUser(user) {
  const now           = new Date();
  const trialActive   = user.trialExpiry && user.trialExpiry > now;
  return {
    id:          user._id,
    name:        user.name,
    email:       user.email,
    role:        user.role       || "student",
    subject:     user.subject    || null,
    grade:       user.grade      || null,
    goal:        user.goal       || null,
    examDate:    user.examDate   || null,
    isPaid:      user.isPaid     || false,
    plan:        user.plan       || "free",
    planExpiry:  user.planExpiry || null,
    trialExpiry: user.trialExpiry || null,
    trialActive: !!trialActive,
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
    const { name, email, password, examDate, grade, referralCode } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already registered", 409));

    const hashed     = await bcrypt.hash(password, 12);
    const trialExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7-day Pro trial

    // Referral: look up the user whose inviteCode matches
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ inviteCode: referralCode.toUpperCase() }).select("_id");
      if (referrer) referredBy = referrer._id.toString();
    }

    const user = await User.create({ name, email, password: hashed, examDate, grade, trialExpiry, referredBy });
    await issueTokens(user, res);
    setCsrfCookie(res);
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
    setCsrfCookie(res);
    res.json({ data: { user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── refresh ───────────────────────────────────────────────────────────────────

export const refresh = async (req, res, next) => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE];
    if (!raw) return res.status(401).json({ error: "No refresh token" });

    const { familyId } = parseRefreshToken(raw);
    const hash         = crypto.createHash("sha256").update(raw).digest("hex");
    const stored       = await sessionGet(`refresh:${hash}`);

    if (!stored) {
      // Token hash not found — check if the family is still active (indicates reuse)
      if (familyId) {
        const familyUserId = await sessionGet(`family:${familyId}`);
        if (familyUserId) {
          // Reuse of a rotated token detected — invalidate the whole family
          await sessionDel(`family:${familyId}`);
          logger.warn("Refresh token reuse detected — family invalidated", { familyId, userId: familyUserId });
        }
      }
      return res.status(401).json({ error: "Refresh token invalid or expired" });
    }

    let userId;
    let storedFamilyId = familyId;
    try {
      const parsed = JSON.parse(stored);
      userId        = parsed.userId;
      storedFamilyId = parsed.familyId || familyId;
    } catch {
      userId = stored; // backwards compat with old plain-string tokens
    }

    const user = await User.findById(userId).select("_id name email role subject grade goal examDate isPaid plan planExpiry").lean();
    if (!user) return res.status(401).json({ error: "User not found" });

    await sessionDel(`refresh:${hash}`);
    await issueTokens(user, res, storedFamilyId);
    setCsrfCookie(res);
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

    const rawRefresh = req.cookies?.[REFRESH_COOKIE];
    if (rawRefresh) {
      const hash   = crypto.createHash("sha256").update(rawRefresh).digest("hex");
      const stored = await sessionGet(`refresh:${hash}`);
      await sessionDel(`refresh:${hash}`);
      // Also invalidate the family so all rotated tokens in this session are gone
      try {
        const { familyId } = JSON.parse(stored || "{}");
        if (familyId) await sessionDel(`family:${familyId}`);
      } catch {}
    }

    res.clearCookie(TOKEN_COOKIE,   { httpOnly: true, sameSite: isProd() ? "none" : "lax", secure: isProd(), path: "/" });
    res.clearCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: isProd() ? "none" : "lax", secure: isProd(), path: "/api/auth" });
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

    user.password             = await bcrypt.hash(password, 12);
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
      setCsrfCookie(res);
      const dest = needsOnboarding ? "/onboarding" : "/";
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}${dest}`);
    } catch (err) {
      logger.error("googleAuthCallback error", { message: err.message });
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed`);
    }
  },
];

