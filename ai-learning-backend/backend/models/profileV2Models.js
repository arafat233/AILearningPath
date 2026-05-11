import mongoose from "mongoose";

// ==================== MoodCheckin ====================
// One row per user per day (max). Captures self-reported mood/energy.
const moodCheckinSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date:   { type: String, required: true }, // YYYY-MM-DD
  mood:   { type: String, enum: ["great", "ok", "low"], required: true },
  note:   { type: String, default: "", maxlength: 200 },
  createdAt: { type: Date, default: Date.now },
});
moodCheckinSchema.index({ userId: 1, date: 1 }, { unique: true });
moodCheckinSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });
export const MoodCheckin = mongoose.model("MoodCheckin", moodCheckinSchema);

// ==================== ActiveSession ====================
// Best-effort log of recent JWT-issuing sessions (after login). Lets the user see
// "where am I logged in" and revoke. TTL-purged after 30 days of inactivity.
const activeSessionSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  ua:         { type: String, default: "" }, // user agent string
  ip:         { type: String, default: "" },
  device:     { type: String, default: "" }, // parsed device name
  lastSeenAt: { type: Date,   default: Date.now },
  createdAt:  { type: Date,   default: Date.now },
});
activeSessionSchema.index({ userId: 1, lastSeenAt: -1 });
activeSessionSchema.index({ lastSeenAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
export const ActiveSession = mongoose.model("ActiveSession", activeSessionSchema);

// ==================== Certificate ====================
// Stub model — in real deployment AdminCertificates would seed these. Used to display
// "earned certificates" on Profile.
const certificateSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  title:     { type: String, required: true },
  subject:   { type: String, default: "" },
  topicId:   { type: String, default: "" },
  awardedAt: { type: Date,   default: Date.now },
  meta:      { type: mongoose.Schema.Types.Mixed, default: {} },
});
certificateSchema.index({ userId: 1, awardedAt: -1 });
export const Certificate = mongoose.model("Certificate", certificateSchema);
