import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id:               { type: String, required: true },
  source:           String,
  difficulty:       { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  type:             String,
  question:         { type: String, required: true },
  answer:           String,
  marks:            Number,
  skill_tested:     String,
  why_students_miss: String,
  depth_for_hard:   String,
}, { _id: false });

const topicSchema = new mongoose.Schema({
  id:                     { type: String, required: true },
  name:                   { type: String, required: true },
  prerequisite_knowledge: [String],
  key_formulas:           [mongoose.Schema.Types.Mixed],
  questions:              [questionSchema],
}, { _id: false });

const conceptSchema = new mongoose.Schema({
  id:     { type: String, required: true },
  name:   { type: String, required: true },
  definition: String,
  topics: [topicSchema],
}, { _id: false });

const subchapterSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  number:   String,
  title:    { type: String, required: true },
  concepts: [conceptSchema],
}, { _id: false });

const ncertChapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true, unique: true }, // e.g. "ch1"
  number:    { type: Number, required: true },
  title:     { type: String, required: true },
  overview:  { type: String, default: "" },
  board:     { type: String, default: "CBSE" },
  grade:     { type: String, default: "10" },
  subject:   { type: String, default: "Mathematics" },
  subchapters: [subchapterSchema],
}, { timestamps: true });

ncertChapterSchema.index({ board: 1, grade: 1, subject: 1, number: 1 }, { unique: true });

export const NcertChapter = mongoose.model("NcertChapter", ncertChapterSchema);
