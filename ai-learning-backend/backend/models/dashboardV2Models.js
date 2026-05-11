import mongoose from "mongoose";

// Daily commitment — user pledges N minutes today
const dailyCommitmentSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  date:         { type: String, required: true }, // YYYY-MM-DD
  goalMinutes:  { type: Number, required: true, min: 5, max: 480 },
  doneMinutes:  { type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now },
});
dailyCommitmentSchema.index({ userId: 1, date: 1 }, { unique: true });
dailyCommitmentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
export const DailyCommitment = mongoose.model("DailyCommitment", dailyCommitmentSchema);

// Task snooze — push a recommended task to later
const taskSnoozeSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  taskId:    { type: String, required: true }, // composite client-side id
  reason:    { type: String, enum: ["later_today", "tomorrow", "this_week", "not_relevant"], default: "later_today" },
  snoozedUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});
taskSnoozeSchema.index({ userId: 1, snoozedUntil: 1 });
taskSnoozeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
export const TaskSnooze = mongoose.model("TaskSnooze", taskSnoozeSchema);

// Widget order preference — per-user dashboard layout
const widgetOrderSchema = new mongoose.Schema({
  userId:    { type: String, required: true, unique: true },
  order:     { type: [String], default: [] }, // ordered array of widget IDs
  hidden:    { type: [String], default: [] }, // widgets the user collapsed
  density:   { type: String, enum: ["comfortable", "compact"], default: "comfortable" },
  updatedAt: { type: Date, default: Date.now },
});
export const WidgetOrder = mongoose.model("WidgetOrder", widgetOrderSchema);
