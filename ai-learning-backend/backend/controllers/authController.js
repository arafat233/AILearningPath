import crypto    from "crypto";
import bcrypt    from "bcryptjs";
import jwt       from "jsonwebtoken";
import { User }  from "../models/index.js";
import { AppError } from "../utils/AppError.js";
import { sendEmail } from "../utils/email.js";

// ── helpers ───────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role || "student" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role || "student" };
}

// ── register ──────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { name, email, password, examDate, grade } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new AppError("Email already registered", 409));

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, examDate, grade });
    res.json({ data: { token: signToken(user), user: safeUser(user) } });
  } catch (err) {
    next(err);
  }
};

// ── login ─────────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("No account found with this email. Please create an account first.", 404));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new AppError("Incorrect password. Please try again.", 401));

    res.json({ data: { token: signToken(user), user: safeUser(user) } });
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

    // Generate a random token, hash it for storage
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
          <p>Hi ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#007AFF;color:#fff;padding:12px 24px;
                    border-radius:10px;text-decoration:none;font-weight:600;margin:16px 0">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px">
            If you didn't request this, you can safely ignore this email.
          </p>
          <p style="color:#bbb;font-size:11px">Link: ${resetUrl}</p>
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
      passwordResetExpires: { $gt: new Date() }, // not expired
    });

    if (!user) return next(new AppError("Reset link is invalid or has expired. Please request a new one.", 400));

    user.password             = await bcrypt.hash(password, 10);
    user.passwordResetToken   = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ data: { message: "Password updated successfully. You can now sign in." } });
  } catch (err) {
    next(err);
  }
};
