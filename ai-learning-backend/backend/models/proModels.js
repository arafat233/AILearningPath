/**
 * Pro track models — Java pilot (PRO_TRACK_PLAN.md §4.1).
 *
 * Why a new file (decision #1, locked 2026-05-25):
 *   NEW `Pro*` models live alongside the existing `Ncert*` models, no
 *   inheritance, no shared collection. Keeps the school content
 *   pipeline and the professional pipeline cleanly separated so a
 *   change to one can't accidentally rewrite the other.
 *
 * All seven schemas in one file for now — split into separate files
 * only if any one grows beyond a few hundred lines.
 *
 * topicId / chapterId / exerciseId / projectId naming convention
 * (mirrors the school side):
 *   trackKey      = "pro_<lang>"            e.g. "pro_java"
 *   moduleId      = "<lang>_m<N>"           e.g. "java_m1"
 *   topicId       = "<lang>_m<N>_t<N>"      e.g. "java_m1_t1"
 *   exerciseId    = "<lang>_m<N>_t<N>_ex_<N>"
 *   projectId     = "<lang>_m<N>_t<N>_pr_<N>"
 */

import mongoose from "mongoose";

const { Schema, Types } = mongoose;

// ── ProTrack ────────────────────────────────────────────────────────────────
const proTrackSchema = new Schema({
  key:           { type: String, required: true, unique: true, index: true }, // "pro_java"
  slug:          { type: String, required: true, unique: true },               // "java"
  name:          { type: String, required: true },                              // "Java — From Zero to Job-Ready"
  description:   { type: String, default: "" },
  language:      { type: String, required: true },                              // "java"
  iconUrl:       { type: String, default: null },
  coverUrl:      { type: String, default: null },
  totalModules:    { type: Number, default: 0 },
  totalTopics:     { type: Number, default: 0 },
  totalExercises:  { type: Number, default: 0 },
  totalXp:         { type: Number, default: 0 },
  status:        { type: String, enum: ["draft", "live"], default: "draft" },
}, { timestamps: true });

// ── ProModule ───────────────────────────────────────────────────────────────
const proModuleSchema = new Schema({
  trackKey:      { type: String, required: true, index: true },                 // ref ProTrack.key
  moduleId:      { type: String, required: true, unique: true },                // "java_m1"
  moduleNumber:  { type: Number, required: true },
  name:          { type: String, required: true },
  slug:          { type: String, default: "" },
  description:   { type: String, default: "" },
  estimatedHours:{ type: Number, default: 0 },
  prerequisites: [{ type: String }],                                            // [moduleId, ...]
  status:        { type: String, enum: ["draft", "live"], default: "draft" },
}, { timestamps: true });
proModuleSchema.index({ trackKey: 1, moduleNumber: 1 });

// ── ProTopic ────────────────────────────────────────────────────────────────
// Carries the full teaching payload (mirrors NcertTopicContent's shape for
// continuity with the existing rendering patterns).
const proTopicSchema = new Schema({
  trackKey:             { type: String, required: true, index: true },
  moduleId:             { type: String, required: true, index: true },
  topicId:              { type: String, required: true, unique: true },         // "java_m1_t1"
  topicNumber:          { type: Number, required: true },
  name:                 { type: String, required: true },
  slug:                 { type: String, default: "" },
  // Raw blocks lifted from the source topic.json — kept as Mixed so the
  // shape can vary across authors without a schema migration each time.
  metadata:             { type: Schema.Types.Mixed, default: {} },
  hook:                 { type: Schema.Types.Mixed, default: {} },
  teaching:             { type: Schema.Types.Mixed, default: {} },
  industryApplications: { type: Schema.Types.Mixed, default: {} },
  interviewRelevance:   { type: Schema.Types.Mixed, default: {} },
  commonGaps:           { type: Schema.Types.Mixed, default: {} },
  prerequisites:        [{ type: String }],                                     // [topicId, ...]
  estimatedMinutes:     { type: Number, default: 0 },
  difficulty:           { type: Number, default: 0.3 },                         // 0..1
  xpReward:             { type: Number, default: 0 },
}, { timestamps: true });
proTopicSchema.index({ trackKey: 1, moduleId: 1, topicNumber: 1 });

// ── ProExercise ─────────────────────────────────────────────────────────────
const proExerciseSchema = new Schema({
  trackKey:        { type: String, required: true, index: true },
  moduleId:        { type: String, required: true, index: true },
  topicId:         { type: String, required: true, index: true },
  exerciseId:      { type: String, required: true, unique: true },              // "java_m1_t1_ex_1"
  // 1-based display order within a topic; lower = shown first. Set by the
  // seed from the array index in exercises.json, so reordering the JSON
  // array reorders the UI without renaming any exerciseId (URLs stable).
  position:        { type: Number, default: 0, index: true },
  level:           { type: String, enum: ["warmup", "easy", "medium", "hard"], required: true },
  // NOTE: enum kept loose since pilot content uses code_scratch / predict_output /
  // debug / fill_blank — Mongoose enum was the wrong allowlist. Allow any string;
  // the frontend dispatches on this value.
  type:            { type: String, required: true },
  title:           { type: String, default: "" },
  scenario:        { type: String, default: "" },
  instructions:    { type: String, default: "" },
  starterCode:     { type: String, default: "" },
  expectedSolution:{ type: String, default: "" },
  blanks:          [{ type: Schema.Types.Mixed }],
  testCases:       [{ type: Schema.Types.Mixed }],                              // [{ type, must_contain, must_compile, ... }]
  hints:           [{ type: String }],
  xpReward:        { type: Number, default: 0 },
  difficulty:      { type: Number, default: 0.3 },
}, { timestamps: true });

// ── ProProject ──────────────────────────────────────────────────────────────
const proProjectSchema = new Schema({
  trackKey:       { type: String, required: true, index: true },
  moduleId:       { type: String, required: true, index: true },
  topicId:        { type: String, required: true, index: true },
  projectId:      { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  scenario:       { type: String, default: "" },
  description:    { type: String, default: "" },
  requirements:   [{
    id:          { type: String },
    description: { type: String },
    weight:      { type: Number, default: 1 },
    _id: false,
  }],
  estimatedMinutes: { type: Number, default: 0 },
  difficulty:       { type: Number, default: 0.5 },
}, { timestamps: true });

// ── ProSubmission ───────────────────────────────────────────────────────────
// 30-day TTL — PRO_TRACK_PLAN.md §6 risk table (privacy: never keep user code
// indefinitely on disk).
const proSubmissionSchema = new Schema({
  userId:        { type: String, required: true, index: true },
  trackKey:      { type: String, required: true },
  exerciseId:    { type: String, default: null },
  projectId:     { type: String, default: null },
  code:          { type: String, required: true },
  language:      { type: String, required: true },
  sandboxResult: {
    stdout:   { type: String, default: "" },
    stderr:   { type: String, default: "" },
    exitCode: { type: Number, default: null },
    timeMs:   { type: Number, default: null },
    memoryKb: { type: Number, default: null },
    status:   { type: String, default: "" },
    _id: false,
  },
  testResults:   [{
    caseId:  { type: String },
    passed:  { type: Boolean },
    message: { type: String, default: "" },
    _id: false,
  }],
  passed:        { type: Boolean, default: false },
  xpAwarded:     { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // 30-day TTL
});
proSubmissionSchema.index({ userId: 1, createdAt: -1 });

// ── ProProgress ─────────────────────────────────────────────────────────────
const proProgressSchema = new Schema({
  userId:            { type: String, required: true, index: true },
  trackKey:          { type: String, required: true, index: true },
  completedTopics:   [{ type: String }],
  completedExercises:[{ type: String }],
  totalXp:           { type: Number, default: 0 },
  currentStreak:     { type: Number, default: 0 },
  lastActivityAt:    { type: Date, default: null },
}, { timestamps: true });
proProgressSchema.index({ userId: 1, trackKey: 1 }, { unique: true });

// ── Exports ─────────────────────────────────────────────────────────────────
export const ProTrack      = mongoose.model("ProTrack",      proTrackSchema);
export const ProModule     = mongoose.model("ProModule",     proModuleSchema);
export const ProTopic      = mongoose.model("ProTopic",      proTopicSchema);
export const ProExercise   = mongoose.model("ProExercise",   proExerciseSchema);
export const ProProject    = mongoose.model("ProProject",    proProjectSchema);
export const ProSubmission = mongoose.model("ProSubmission", proSubmissionSchema);
export const ProProgress   = mongoose.model("ProProgress",   proProgressSchema);
