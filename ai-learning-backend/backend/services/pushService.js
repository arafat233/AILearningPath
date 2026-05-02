import webpush from "web-push";
import { User } from "../models/index.js";
import { getRevisionTopics } from "./revisionService.js";
import logger from "../utils/logger.js";

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
