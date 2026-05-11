import mongoose from "mongoose";

// ── Class challenge — collective goal ─────────────────────────────
const challengeSchema = new mongoose.Schema({
  schoolGroupId: { type: String, required: true, index: true },
  title:         { type: String, required: true, maxlength: 120 },
  description:   { type: String, default: "", maxlength: 500 },
  targetCount:   { type: Number, required: true, min: 1 },
  currentCount:  { type: Number, default: 0 },
  metric:        { type: String, enum: ["questions", "topics", "hours", "papers"], default: "questions" },
  subjectFocus:  { type: String, default: null },
  rewardText:    { type: String, default: "" }, // e.g. "Mrs. Iyer cancels Monday's surprise quiz"
  createdBy:     { type: String, required: true }, // teacher userId
  deadline:      { type: Date, required: true },
  contributors:  [{
    userId:    String,
    name:      String,
    count:     Number,
    _id: false,
  }],
  isActive:      { type: Boolean, default: true },
  createdAt:     { type: Date, default: Date.now },
});
challengeSchema.index({ schoolGroupId: 1, isActive: 1, deadline: 1 });
export const ClassChallenge = mongoose.model("ClassChallenge", challengeSchema);

// ── Teacher post / class announcement ─────────────────────────────
const teacherPostSchema = new mongoose.Schema({
  schoolGroupId: { type: String, required: true, index: true },
  teacherId:     { type: String, required: true },
  teacherName:   { type: String, default: "Class Teacher" },
  teacherRole:   { type: String, default: "Math · class teacher" },
  message:       { type: String, required: true, maxlength: 500 },
  readBy:        [{ type: String }],
  reactions:     {
    type: Map,
    of: { type: [String], default: [] }, // emoji → array of userIds
    default: {},
  },
  comments: [{
    userId:    String,
    name:      String,
    text:      String,
    at:        { type: Date, default: Date.now },
    _id: false,
  }],
  createdAt:     { type: Date, default: Date.now },
});
teacherPostSchema.index({ schoolGroupId: 1, createdAt: -1 });
export const TeacherPost = mongoose.model("TeacherPost", teacherPostSchema);

// ── Kudos — 1-tap encouragement between classmates ────────────────
const kudosSchema = new mongoose.Schema({
  fromId:   { type: String, required: true },
  toId:     { type: String, required: true },
  schoolGroupId: { type: String, required: true },
  emoji:    { type: String, default: "👏", maxlength: 4 },
  message:  { type: String, default: "", maxlength: 120 },
  createdAt:{ type: Date, default: Date.now },
});
kudosSchema.index({ toId: 1, createdAt: -1 });
kudosSchema.index({ fromId: 1, toId: 1, createdAt: -1 });
kudosSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
export const Kudos = mongoose.model("Kudos", kudosSchema);

// ── SubjectFocus — weekly theme set by teacher ────────────────────
const subjectFocusSchema = new mongoose.Schema({
  schoolGroupId: { type: String, required: true, index: true },
  weekKey:       { type: String, required: true },
  subject:       { type: String, required: true },
  topic:         { type: String, default: "" },
  createdAt:     { type: Date, default: Date.now },
});
subjectFocusSchema.index({ schoolGroupId: 1, weekKey: 1 }, { unique: true });
export const SubjectFocus = mongoose.model("SubjectFocus", subjectFocusSchema);

// ── ClassBlock — block/mute classmate, anonymous mode ─────────────
const classPreferenceSchema = new mongoose.Schema({
  userId:        { type: String, required: true, unique: true },
  anonymousMode: { type: Boolean, default: false },
  hideRank:      { type: Boolean, default: false },
  blockedIds:    [{ type: String }],
  mutedIds:      [{ type: String }],
});
export const ClassPreference = mongoose.model("ClassPreference", classPreferenceSchema);

// ── ClassReport — moderation ───────────────────────────────────────
const classReportSchema = new mongoose.Schema({
  reporterId:    { type: String, required: true },
  targetId:      { type: String, required: true },
  schoolGroupId: { type: String, required: true },
  reason:        { type: String, enum: ["harassment", "spam", "inappropriate", "cheating", "other"], required: true },
  note:          { type: String, default: "", maxlength: 500 },
  status:        { type: String, enum: ["open", "reviewed", "dismissed"], default: "open" },
  createdAt:     { type: Date, default: Date.now },
});
classReportSchema.index({ status: 1, createdAt: -1 });
export const ClassReport = mongoose.model("ClassReport", classReportSchema);

// ── Helpers ──────────────────────────────────────────────────────
export function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}
