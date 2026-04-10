import mongoose from "mongoose";

// A "slide" is one screen of learning content
const slideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["concept", "visual", "example", "shortcut", "mistake_warning"],
    default: "concept",
  },
  title: String,
  body: String,           // main explanation text
  visual: String,         // emoji or ASCII art string for visual context
  formula: String,        // optional formula string
  example: {
    problem: String,
    steps: [String],
    answer: String,
  },
  shortcut: String,       // quick tip
  warning: String,        // common mistake to avoid
});

const lessonSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subject: { type: String, default: "Math" },
  grade: { type: String, default: "10" },
  title: String,
  tagline: String,        // one-line hook: "Solve any linear equation in 3 steps"

  // Short version: 5-10 min
  shortLesson: {
    estimatedMinutes: { type: Number, default: 7 },
    keyIdea: String,      // the ONE thing to remember
    slides: [slideSchema],
  },

  // Long version: deep dive
  longLesson: {
    estimatedMinutes: { type: Number, default: 25 },
    slides: [slideSchema],
  },

  prerequisites: [String],
  createdAt: { type: Date, default: Date.now },
});

export const Lesson = mongoose.model("Lesson", lessonSchema);

// Track which lessons a user has completed
const lessonProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  mode: { type: String, enum: ["short", "long"], default: "short" },
  completedAt: { type: Date, default: Date.now },
  slideIndex: { type: Number, default: 0 }, // resume point
});

export const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);
