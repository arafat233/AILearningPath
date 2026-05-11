import mongoose from "mongoose";

// ── QuestionReport ────────────────────────────────────────────────────
// User-reported issues with a question. Distinct from `flag` which only
// sets a boolean. Reports capture WHY and feed an admin queue.
const questionReportSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  questionId: { type: String, required: true },
  reason: {
    type: String,
    enum: ["wrong_answer", "confusing_wording", "broken_image", "off_syllabus", "duplicate", "other"],
    required: true,
  },
  note:       { type: String, default: "", maxlength: 500 },
  status:     { type: String, enum: ["open", "resolved", "rejected"], default: "open" },
  createdAt:  { type: Date, default: Date.now },
});
questionReportSchema.index({ status: 1, createdAt: -1 });
questionReportSchema.index({ questionId: 1, status: 1 });
export const QuestionReport = mongoose.model("QuestionReport", questionReportSchema);

// ── SkipReason ─────────────────────────────────────────────────────────
// Captures why a user skipped a question. Lightweight, TTL-purged.
const skipReasonSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  questionId: { type: String, required: true },
  reason: {
    type: String,
    enum: ["dont_know", "too_easy", "confusing", "bad_question", "no_time"],
    required: true,
  },
  createdAt:  { type: Date, default: Date.now },
});
skipReasonSchema.index({ userId: 1, createdAt: -1 });
skipReasonSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
export const SkipReason = mongoose.model("SkipReason", skipReasonSchema);

// ── ErrorLabel ─────────────────────────────────────────────────────────
// User-self-labeled error reason (after seeing the correct answer).
// Richer than the auto-classified `selectedType` on Attempt.
const errorLabelSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  questionId: { type: String, required: true },
  label: {
    type: String,
    enum: ["misread", "calc_slip", "concept_gap", "stuck_step", "guessed", "other"],
    required: true,
  },
  createdAt:  { type: Date, default: Date.now },
});
errorLabelSchema.index({ userId: 1, createdAt: -1 });
errorLabelSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });
export const ErrorLabel = mongoose.model("ErrorLabel", errorLabelSchema);
