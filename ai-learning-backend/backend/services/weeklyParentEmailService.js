import { User, UserProfile, Streak, Badge, Attempt } from "../models/index.js";
import { sendEmail } from "../utils/email.js";
import logger from "../utils/logger.js";

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

const escHtml = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pct = (n) => `${Math.round((n || 0) * 100)}%`;
const trendArrow = (curr, prev) => {
  if (prev == null || prev === 0) return "";
  const delta = curr - prev;
  if (delta > 3)  return `<span style="color:#34C759">▲ ${Math.round(delta)}%</span>`;
  if (delta < -3) return `<span style="color:#FF3B30">▼ ${Math.abs(Math.round(delta))}%</span>`;
  return `<span style="color:#8e8e93">→ steady</span>`;
};

async function buildStudentSummary(studentId) {
  const sevenDaysAgo     = new Date(Date.now() - 7  * 86400_000);
  const fourteenDaysAgo  = new Date(Date.now() - 14 * 86400_000);

  const [student, profile, streak, badges, weekAttempts, prevAttempts] = await Promise.all([
    User.findById(studentId).select("name grade subject").lean(),
    UserProfile.findOne({ userId: studentId }).lean(),
    Streak.findOne({ userId: studentId }).lean(),
    Badge.find({ userId: studentId, awardedAt: { $gte: sevenDaysAgo } }).lean(),
    Attempt.find({ userId: studentId, createdAt: { $gte: sevenDaysAgo } })
      .select("topic isCorrect createdAt").lean(),
    Attempt.find({ userId: studentId, createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } })
      .select("isCorrect").lean(),
  ]);

  if (!student) return null;

  const sessions = weekAttempts.length;
  const correct  = weekAttempts.filter((a) => a.isCorrect).length;
  const weekAcc  = sessions > 0 ? (correct / sessions) * 100 : 0;
  const prevAcc  = prevAttempts.length > 0
    ? (prevAttempts.filter((a) => a.isCorrect).length / prevAttempts.length) * 100
    : null;

  const topicsSet = new Set(weekAttempts.map((a) => a.topic).filter(Boolean));
  const topics    = [...topicsSet].slice(0, 5);

  const masteredTopics = (profile?.topicProgress || [])
    .filter((tp) => (tp.accuracy || 0) >= 0.75 && tp.lastAttempted && new Date(tp.lastAttempted) >= sevenDaysAgo)
    .map((tp) => tp.topic)
    .slice(0, 4);

  const weakTopics = (profile?.weakAreas || []).slice(0, 3);

  return {
    name:          student.name,
    grade:         student.grade,
    subject:       student.subject,
    sessions,
    weekAcc,
    prevAcc,
    streakDays:    streak?.currentStreak || 0,
    badges:        badges.map((b) => b.name || b.type || "Badge"),
    topics,
    masteredTopics,
    weakTopics,
    totalAttempts: profile?.totalAttempts || 0,
  };
}

function buildEmailHtml(parentName, summaries) {
  const studentBlocks = summaries
    .filter(Boolean)
    .filter((s) => s.sessions > 0 || s.totalAttempts > 0)
    .map((s) => {
      const accuracyRow = s.sessions > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#636366">
             Accuracy this week: <strong style="color:#1c1c1e">${Math.round(s.weekAcc)}%</strong>
             ${trendArrow(s.weekAcc, s.prevAcc)}
           </p>`
        : `<p style="margin:4px 0;font-size:14px;color:#8e8e93">No practice sessions this week</p>`;

      const topicsRow = s.topics.length > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#636366">
             Topics practised: <strong style="color:#1c1c1e">${s.topics.map(escHtml).join(", ")}</strong>
           </p>`
        : "";

      const masteredRow = s.masteredTopics.length > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#34C759">
             ✓ Mastered: ${s.masteredTopics.map(escHtml).join(", ")}
           </p>`
        : "";

      const weakRow = s.weakTopics.length > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#FF9500">
             ⚠ Needs work: ${s.weakTopics.map(escHtml).join(", ")}
           </p>`
        : "";

      const badgesRow = s.badges.length > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#AF52DE">
             🏅 Earned: ${s.badges.map(escHtml).join(", ")}
           </p>`
        : "";

      const streakRow = s.streakDays > 0
        ? `<p style="margin:4px 0;font-size:14px;color:#FF9500">🔥 ${s.streakDays}-day streak</p>`
        : "";

      return `
        <div style="border:1px solid #e5e5ea;border-radius:14px;padding:20px 24px;margin-bottom:16px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <div style="width:36px;height:36px;border-radius:50%;background:#007AFF;
                        display:flex;align-items:center;justify-content:center;
                        font-size:16px;font-weight:700;color:#fff;flex-shrink:0">
              ${escHtml(s.name.charAt(0).toUpperCase())}
            </div>
            <div>
              <p style="margin:0;font-size:16px;font-weight:700;color:#1c1c1e">${escHtml(s.name)}</p>
              <p style="margin:0;font-size:12px;color:#8e8e93">Class ${escHtml(s.grade)} · ${escHtml(s.subject)}</p>
            </div>
            ${s.sessions > 0 ? `<div style="margin-left:auto;background:#f2f2f7;border-radius:8px;padding:6px 12px;font-size:13px;font-weight:600;color:#636366">${s.sessions} question${s.sessions !== 1 ? "s" : ""} this week</div>` : ""}
          </div>
          ${accuracyRow}
          ${topicsRow}
          ${masteredRow}
          ${weakRow}
          ${badgesRow}
          ${streakRow}
        </div>
      `;
    });

  if (studentBlocks.length === 0) {
    studentBlocks.push(`
      <div style="background:#f2f2f7;border-radius:12px;padding:20px 24px;text-align:center;color:#636366;font-size:14px">
        Your linked student(s) haven't practised this week. Encourage them to do a session!
      </div>
    `);
  }

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1c1c1e">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
        <div style="width:36px;height:36px;border-radius:10px;background:#007AFF;
                    display:flex;align-items:center;justify-content:center;
                    font-size:18px;font-weight:700;color:#fff">A</div>
        <span style="font-size:15px;font-weight:700;color:#1c1c1e">AI Learning</span>
      </div>

      <h1 style="margin:0 0 6px;font-size:24px;font-weight:700">Weekly progress report 📊</h1>
      <p style="margin:0 0 24px;color:#636366;font-size:15px">
        Hi ${escHtml(parentName)}, here's how your child did this week (${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" })}).
      </p>

      ${studentBlocks.join("")}

      <div style="text-align:center;margin-top:28px">
        <a href="${frontendUrl()}/parent"
           style="display:inline-block;background:#007AFF;color:#fff;padding:14px 32px;
                  border-radius:12px;text-decoration:none;font-weight:600;font-size:15px">
          View full dashboard →
        </a>
      </div>

      <p style="margin-top:32px;font-size:12px;color:#8e8e93;text-align:center">
        AI Learning Platform · You're receiving this because you're a linked parent.<br>
        <a href="${frontendUrl()}/settings" style="color:#007AFF">Manage notification preferences</a>
      </p>
    </div>
  `;
}

export async function runWeeklyParentEmails() {
  logger.info("Running weekly parent email digest...");

  const oneWeekAgo = new Date(Date.now() - 7 * 86400_000);

  const parents = await User.find({
    role:           { $in: ["parent", "teacher"] },
    email:          { $exists: true, $ne: "" },
    linkedStudents: { $exists: true, $not: { $size: 0 } },
    $or: [
      { weeklyParentEmailSentAt: null },
      { weeklyParentEmailSentAt: { $lt: oneWeekAgo } },
    ],
  }).select("_id name email linkedStudents").lean();

  let sent = 0;
  for (const parent of parents) {
    try {
      const summaries = await Promise.all(
        (parent.linkedStudents || []).map((id) => buildStudentSummary(id).catch(() => null))
      );

      const html = buildEmailHtml(parent.name, summaries.filter(Boolean));

      await sendEmail({
        to:      parent.email,
        subject: `Weekly update: your child's learning progress 📊`,
        html,
      });

      await User.findByIdAndUpdate(parent._id, { $set: { weeklyParentEmailSentAt: new Date() } });
      sent++;
    } catch (err) {
      logger.warn("Weekly parent email failed", { to: parent.email, error: err.message });
    }
  }

  logger.info("Weekly parent emails sent", { sent, total: parents.length });
  return { sent, total: parents.length };
}
