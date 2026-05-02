import webpush from "web-push";
import { User } from "../models/index.js";
import { getRevisionTopics } from "./revisionService.js";
import logger from "../utils/logger.js";

const MILESTONE_LABELS = {
  streak_7:           { emoji: "🔥", text: "7-day streak!" },
  streak_30:          { emoji: "🔥", text: "30-day streak!" },
  streak_100:         { emoji: "🏆", text: "100-day streak!" },
  questions_100:      { emoji: "📚", text: "100 questions answered!" },
  questions_500:      { emoji: "🌟", text: "500 questions answered!" },
  first_perfect_exam: { emoji: "🎯", text: "Perfect exam score!" },
  top10_leaderboard:  { emoji: "🏅", text: "Top 10 on the leaderboard!" },
};

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return true;
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:admin@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  vapidConfigured = true;
  return true;
}

export async function sendPush(subscription, payload) {
  if (!ensureVapid()) throw new Error("VAPID keys not configured");
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

// Notify all linked parents of a student milestone (badge earned, streak hit, concept mastered).
// Fire-and-forget — callers should not await this.
export async function notifyParentsOfMilestone(studentId, badgeType, meta = {}) {
  if (!ensureVapid()) return;
  try {
    const student = await User.findById(studentId).select("name").lean();
    if (!student) return;

    const label = MILESTONE_LABELS[badgeType];
    const isConcept = badgeType.startsWith("concept_master_");
    const title = label
      ? `${label.emoji} ${student.name} earned: ${label.text}`
      : isConcept
        ? `✓ ${student.name} mastered ${meta.topic || "a topic"}!`
        : `🏅 ${student.name} earned a new badge!`;

    const parents = await User.find({
      linkedStudents: studentId.toString(),
      "pushSubscription.endpoint": { $exists: true, $ne: null },
    }).select("_id pushSubscription").lean();

    for (const parent of parents) {
      sendPush(parent.pushSubscription, {
        title,
        body:  "Tap to view their progress →",
        icon:  "/icon-192.png",
        url:   "/parent",
        tag:   `milestone-${studentId}-${badgeType}`,
      }).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await User.findByIdAndUpdate(parent._id, { $unset: { pushSubscription: 1 } }).catch(() => {});
        }
      });
    }
  } catch (err) {
    logger.warn("notifyParentsOfMilestone failed", { studentId, badgeType, err: err.message });
  }
}

// Daily job: find users with push subscriptions whose revisions are due and notify them
export async function sendRevisionReminders() {
  if (!ensureVapid()) {
    logger.warn("VAPID keys not set — skipping revision push notifications");
    return { sent: 0, failed: 0 };
  }

  const users = await User.find({ "pushSubscription.endpoint": { $exists: true, $ne: null } })
    .select("_id pushSubscription")
    .lean();

  let sent = 0, failed = 0;

  for (const user of users) {
    try {
      const due = await getRevisionTopics(user._id.toString());
      if (!due.length) continue;

      const topicList = due.slice(0, 3).map((t) => t.topic).join(", ");
      await sendPush(user.pushSubscription, {
        title: `${due.length} revision${due.length > 1 ? "s" : ""} due today`,
        body:  `Topics: ${topicList}`,
        icon:  "/icon-192.png",
        url:   "/planner",
        tag:   "revision-reminder",
        action: "Open Planner",
      });
      sent++;
    } catch (err) {
      failed++;
      // 410 Gone / 404 = subscription expired or revoked — remove it to stop future attempts
      if (err.statusCode === 410 || err.statusCode === 404) {
        await User.findByIdAndUpdate(user._id, { $unset: { pushSubscription: 1 } }).catch(() => {});
      } else {
        logger.warn("Push notification failed", { userId: user._id, err: err.message });
      }
    }
  }

  logger.info("Revision push notifications completed", { sent, failed });
  return { sent, failed };
}
