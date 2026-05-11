import mongoose from "mongoose";
import crypto from "crypto";

// ── ArenaRating: ELO-style per-user rating + counters ─────────────────
const arenaRatingSchema = new mongoose.Schema({
  userId:        { type: String, required: true, unique: true },
  rating:        { type: Number, default: 1200 }, // ELO start
  points:        { type: Number, default: 0 },    // weekly + season cumulative
  weeklyPoints:  { type: Number, default: 0 },
  weekKey:       { type: String, default: "" },   // "2026-W19" — used to reset weeklyPoints
  wins:          { type: Number, default: 0 },
  losses:        { type: Number, default: 0 },
  draws:         { type: Number, default: 0 },
  matchesPlayed: { type: Number, default: 0 },
  winStreak:     { type: Number, default: 0 },
  bestWinStreak: { type: Number, default: 0 },
  accuracy:      { type: Number, default: 0 },    // 0..1, rolling
  totalCorrect:  { type: Number, default: 0 },
  totalAnswered: { type: Number, default: 0 },
  beginnerProtection: { type: Boolean, default: true }, // off after 10 matches
  updatedAt:     { type: Date, default: Date.now },
});
arenaRatingSchema.index({ rating: -1 });
arenaRatingSchema.index({ weekKey: 1, weeklyPoints: -1 });
export const ArenaRating = mongoose.model("ArenaRating", arenaRatingSchema);

// ── Room: open match room ─────────────────────────────────────────────
const roomSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true }, // e.g. "MATH-7392"
  topic:         { type: String, required: true },
  subject:       { type: String, default: "Math" },
  difficulty:    { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  capacity:      { type: Number, default: 4, min: 2, max: 8 },
  visibility:    { type: String, enum: ["public", "private"], default: "public" },
  hostId:        { type: String, required: true },
  status:        { type: String, enum: ["lobby", "live", "finished"], default: "lobby" },
  participants: [{
    userId:    String,
    name:      String,
    rating:    Number,
    score:     { type: Number, default: 0 },
    correct:   { type: Number, default: 0 },
    answered:  { type: Number, default: 0 },
    ready:     { type: Boolean, default: false },
    joinedAt:  { type: Date, default: Date.now },
    _id: false,
  }],
  questionIds:   [{ type: String }], // mongo IDs; populated on start
  startedAt:     { type: Date, default: null },
  endedAt:       { type: Date, default: null },
  createdAt:     { type: Date, default: Date.now },
});
roomSchema.index({ status: 1, visibility: 1, createdAt: -1 });
export const Room = mongoose.model("Room", roomSchema);

// ── Match: completed 1v1 / multi result history ──────────────────────
const matchSchema = new mongoose.Schema({
  roomCode:      { type: String, required: true },
  topic:         String,
  subject:       String,
  difficulty:    String,
  startedAt:     Date,
  endedAt:       { type: Date, default: Date.now },
  durationSec:   Number,
  participants: [{
    userId:  String,
    name:    String,
    score:   Number,
    correct: Number,
    answered:Number,
    rank:    Number,
    ratingChange: Number,
    _id: false,
  }],
});
matchSchema.index({ "participants.userId": 1, endedAt: -1 });
export const Match = mongoose.model("Match", matchSchema);

// ── DailyQuest: 3 daily competition quests ───────────────────────────
const dailyQuestSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  date:      { type: String, required: true }, // YYYY-MM-DD
  quests: [{
    id:       String,
    label:    String,
    target:   Number,
    progress: { type: Number, default: 0 },
    rewardXP: Number,
    completed:{ type: Boolean, default: false },
    _id: false,
  }],
});
dailyQuestSchema.index({ userId: 1, date: 1 }, { unique: true });
dailyQuestSchema.index({ date: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
export const DailyQuest = mongoose.model("DailyQuest", dailyQuestSchema);

// ── MatchReport: opponent reports ────────────────────────────────────
const matchReportSchema = new mongoose.Schema({
  reporterId:  { type: String, required: true },
  targetId:    { type: String, required: true },
  matchId:     { type: String, required: true },
  reason:      { type: String, enum: ["cheating", "bad_sport", "afk", "other"], required: true },
  note:        { type: String, default: "", maxlength: 500 },
  status:      { type: String, enum: ["open", "reviewed", "dismissed"], default: "open" },
  createdAt:   { type: Date, default: Date.now },
});
export const MatchReport = mongoose.model("MatchReport", matchReportSchema);

// ── Helpers ─────────────────────────────────────────────────────────
const SUBJECT_PREFIX = { Math: "MATH", Science: "SCI", English: "ENG", "Social Science": "SST", Hindi: "HIN" };
export function makeRoomCode(subject = "Math") {
  const prefix = SUBJECT_PREFIX[subject] || "ROOM";
  const num = crypto.randomInt(1000, 9999);
  return `${prefix}-${num}`;
}

export function tierFromRating(rating) {
  if (rating < 1000) return { name: "Bronze",   color: "#a16207", min: 0    };
  if (rating < 1300) return { name: "Silver",   color: "#94a3b8", min: 1000 };
  if (rating < 1600) return { name: "Gold",     color: "#eab308", min: 1300 };
  if (rating < 1900) return { name: "Platinum", color: "#06b6d4", min: 1600 };
  if (rating < 2200) return { name: "Diamond",  color: "#a855f7", min: 1900 };
  return { name: "Master",   color: "#f97316", min: 2200 };
}

export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
