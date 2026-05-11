/**
 * Board filter — strong separation between CBSE and ICSE content.
 *
 * Content topicId conventions:
 *   ICSE:  /^icse\d+_/   (e.g., icse10_ch1_vat_intro)
 *   CBSE:  everything else
 *
 * Question docs additionally carry { examBoard: "ICSE" | "CBSE" }.
 * NcertTopicContent / NcertChapter / Topic / Chapter rely on topicId/chapterId prefix.
 *
 * Default board for unspecified users is CBSE.
 */
import { User } from "../models/index.js";

const ICSE_REGEX = /^icse\d+_/;

export async function getUserBoard(req) {
  if (!req?.user?.id) return "CBSE";
  const user = await User.findById(req.user.id).select("examBoard").lean();
  return (user?.examBoard || "CBSE").toUpperCase();
}

/** Returns a mongoose filter clause that restricts by topicId/chapterId prefix to user's board */
export function boardIdFilter(userBoard, field = "topicId") {
  if ((userBoard || "CBSE").toUpperCase() === "ICSE") {
    return { [field]: { $regex: ICSE_REGEX } };
  }
  return { [field]: { $not: ICSE_REGEX } };
}

/** Returns a mongoose filter clause for Question collection (uses examBoard field) */
export function questionBoardFilter(userBoard) {
  if ((userBoard || "CBSE").toUpperCase() === "ICSE") {
    return { examBoard: "ICSE" };
  }
  // CBSE student: examBoard is "CBSE" or unset (legacy data)
  return { examBoard: { $in: ["CBSE", null, undefined, ""] } };
}

/** True if a topicId belongs to ICSE */
export function isIcseTopicId(topicId) {
  return ICSE_REGEX.test(String(topicId || ""));
}

/** Guard: throw if user board does not match the topicId's board */
export function assertBoardMatch(userBoard, topicId) {
  const isIcse = isIcseTopicId(topicId);
  const board = (userBoard || "CBSE").toUpperCase();
  if (isIcse && board !== "ICSE") return false;
  if (!isIcse && board === "ICSE") return false;
  return true;
}
