/**
 * Board filter — strong separation between board content.
 *
 * TopicId prefix → board mapping (board is always the first segment):
 *   icse_*      → ICSE    (e.g. icse_math10_ch1_gst_concepts)
 *   icse\d+_    → ICSE    (legacy format, e.g. icse10_ch1_vat_intro — kept until migration)
 *   ap_ssc_*    → AP_SSC  (Andhra Pradesh State Secondary Certificate)
 *   ssc_*       → SSC
 *   ib_*        → IB
 *   everything else → CBSE (sci_, sst_, ch\d+_, math\d+_, eng_, hin_, cbse_*)
 *
 * Question docs carry { examBoard } field.
 * NcertTopicContent / NcertChapter / Topic rely on topicId/chapterId prefix.
 *
 * Default board for unspecified users is CBSE.
 */
import { User } from "../models/index.js";

// Order matters — most specific first
const BOARD_PREFIX_RULES = [
  { regex: /^icse[_\d]/, board: "ICSE"   },  // matches icse_ (new) and icse10_ (legacy)
  { regex: /^ap_ssc_/,   board: "AP_SSC" },  // Andhra Pradesh SSC (Class 10 = NCERT)
  { regex: /^ssc_/,      board: "SSC"    },
  { regex: /^ib_/,       board: "IB"     },
  // Add future boards here:  { regex: /^state_ka_/, board: "STATE_KA" }
];

/** Derive board from topicId prefix. Returns null if unknown (treat as CBSE). */
export function boardFromTopicId(topicId) {
  if (!topicId) return null;
  for (const rule of BOARD_PREFIX_RULES) {
    if (rule.regex.test(topicId)) return rule.board;
  }
  return null; // CBSE or unknown
}

/** True if a topicId belongs to ICSE */
export function isIcseTopicId(topicId) {
  return boardFromTopicId(topicId) === "ICSE";
}

export async function getUserBoard(req) {
  if (!req?.user?.id) return "CBSE";
  const user = await User.findById(req.user.id).select("examBoard").lean();
  return (user?.examBoard || "CBSE").toUpperCase();
}

/** Returns a mongoose filter clause that restricts by topicId/chapterId prefix to user's board */
export function boardIdFilter(userBoard, field = "topicId") {
  const board = (userBoard || "CBSE").toUpperCase();
  const rule = BOARD_PREFIX_RULES.find(r => r.board === board);
  if (rule) return { [field]: { $regex: rule.regex } };
  // CBSE / default: exclude all known non-CBSE prefixes
  // Note: MongoDB $not cannot be combined with $in on regex — must use $and with individual $not clauses
  const excludes = BOARD_PREFIX_RULES.map(r => r.regex);
  return { $and: excludes.map(r => ({ [field]: { $not: r } })) };
}

/** Returns a mongoose filter clause for Question collection (uses examBoard field) */
export function questionBoardFilter(userBoard) {
  const board = (userBoard || "CBSE").toUpperCase();
  if (board === "CBSE") {
    // CBSE: examBoard is "CBSE" or unset (legacy data before examBoard field existed)
    return { examBoard: { $in: ["CBSE", null, undefined, ""] } };
  }
  return { examBoard: board };
}

/** Guard: returns true if user board matches the topicId's board */
export function assertBoardMatch(userBoard, topicId) {
  const topicBoard = boardFromTopicId(topicId) || "CBSE";
  const board = (userBoard || "CBSE").toUpperCase();
  return topicBoard === board;
}
