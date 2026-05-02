import { User, Attempt } from "../models/index.js";
import { sendEmail } from "../utils/email.js";
import logger from "../utils/logger.js";

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const escHtml = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Day-2: "Get started" nudge — sent to users who registered 2+ days ago and have < 3 attempts
async function sendDay2Emails() {
  const cutoffFrom = new Date(Date.now() - 3 * 86400_000); // registered > 2 days ago
  const cutoffTo   = new Date(Date.now() - 2 * 86400_000); // but not more than 3 days

  const candidates = await User.find({
    createdAt:          { $gte: cutoffFrom, $lte: cutoffTo },
    onboardingDay2SentAt: null,
    role:               "student",
  }).select("_id name email subject").lean();

  let sent = 0;
  for (const user of candidates) {
    // Skip if they've already done 3+ practice attempts (already engaged)
    const attempts = await Attempt.countDocuments({ userId: user._id.toString() });
    if (attempts >= 3) {
      await User.findByIdAndUpdate(user._id, { $set: { onboardingDay2SentAt: new Date() } });
      continue;
    }

    const subject = user.subject || "Math";
    await sendEmail({
      to: user.email,
      subject: "Your first practice session is waiting 📚",
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1e">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">Hey ${escHtml(user.name)}, ready to start? 🎯</h2>
          <p style="margin:0 0 20px;color:#636366;font-size:15px;line-height:1.6">
            You signed up for AILearn but haven't tried a practice session yet.
            It only takes 5 minutes — and your AI tutor is already set up for <strong>${escHtml(subject)}</strong>.
          </p>
          <a href="${frontendUrl()}/practice"
             style="display:inline-block;background:#007AFF;color:#fff;padding:14px 28px;
                    border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px">
            Start your first practice →
          </a>
          <p style="color:#8e8e93;font-size:13px;margin:0">
            Your AI tutor will ask you questions, spot your weak areas, and give you a personalised study plan —
            all in your first session.
          </p>
        </div>
      `,
    }).catch((err) => logger.warn("Day-2 email failed", { to: user.email, error: err.message }));

    await User.findByIdAndUpdate(user._id, { $set: { onboardingDay2SentAt: new Date() } });
    sent++;
  }
  return sent;
}

// Day-7: "Come back" email — sent to users who registered 7+ days ago and haven't been active in 5 days
async function sendDay7Emails() {
  const cutoffFrom  = new Date(Date.now() - 9 * 86400_000); // registered > 7 days ago
  const cutoffTo    = new Date(Date.now() - 7 * 86400_000);
  const activeAfter = new Date(Date.now() - 5 * 86400_000).toISOString().split("T")[0];

  const candidates = await User.find({
    createdAt:           { $gte: cutoffFrom, $lte: cutoffTo },
    onboardingDay7SentAt: null,
    role:                "student",
    $or: [
      { aiCallsDate: { $lt: activeAfter } },
      { aiCallsDate: { $exists: false } },
      { aiCallsDate: "" },
    ],
  }).select("_id name email subject goal").lean();

  let sent = 0;
  for (const user of candidates) {
    const attempts = await Attempt.countDocuments({ userId: user._id.toString() });
    const subject = user.subject || "Math";
    const goalLabel = { pass: "pass your exam", distinction: "score 75%+", top: "top 90%+", scholarship: "get a scholarship" }[user.goal] || "do well in exams";

    await sendEmail({
      to: user.email,
      subject: "Miss us? Your study plan is still waiting 📖",
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1c1c1e">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700">Hey ${escHtml(user.name)}, we miss you! 👋</h2>
          <p style="margin:0 0 16px;color:#636366;font-size:15px;line-height:1.6">
            You set a goal to <strong>${escHtml(goalLabel)}</strong> — and your AI tutor is ready to help.
            ${attempts === 0 ? "You haven't tried a practice session yet." : `You've done ${attempts} questions — keep the momentum going!`}
          </p>
          <div style="background:#f2f2f7;border-radius:12px;padding:20px 24px;margin-bottom:24px">
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1c1c1e">Where to pick up:</p>
            <ul style="margin:0;padding-left:20px;color:#636366;font-size:14px;line-height:2">
              <li>📝 <a href="${frontendUrl()}/practice" style="color:#007AFF">Practice ${escHtml(subject)} questions</a></li>
              <li>📅 <a href="${frontendUrl()}/planner" style="color:#007AFF">Check your study planner</a></li>
              <li>🔖 <a href="${frontendUrl()}/lessons" style="color:#007AFF">Read a short lesson</a></li>
            </ul>
          </div>
          <a href="${frontendUrl()}/practice"
             style="display:inline-block;background:#007AFF;color:#fff;padding:14px 28px;
                    border-radius:12px;text-decoration:none;font-weight:600;font-size:15px">
            Resume studying →
          </a>
        </div>
      `,
    }).catch((err) => logger.warn("Day-7 email failed", { to: user.email, error: err.message }));

    await User.findByIdAndUpdate(user._id, { $set: { onboardingDay7SentAt: new Date() } });
    sent++;
  }
  return sent;
}

export async function runOnboardingEmails() {
  logger.info("Running onboarding email sequence...");
  const [day2, day7] = await Promise.all([sendDay2Emails(), sendDay7Emails()]);
  logger.info("Onboarding emails sent", { day2, day7 });
  return { day2, day7 };
}
