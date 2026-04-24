import mongoose from "mongoose";

// ==================== User ====================
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  clerkId:   { type: String, default: null, sparse: true }, // Clerk userId — set when Clerk auth is live
  examDate:  Date,
  subject:   { type: String, default: "Math" },
  grade:     { type: String, default: "10" },
  goal:      { type: String, default: "pass" },
  // Subscription fields
  isPaid:    { type: Boolean, default: false },
  plan:      { type: String, enum: ["free", "pro", "premium"], default: "free" },
  planExpiry: Date,
  aiCallsToday: { type: Number, default: 0 },
  aiCallsDate:  { type: String, default: "" }, // YYYY-MM-DD
  // Role-based access
  role: { type: String, enum: ["student", "admin", "parent", "teacher"], default: "student" },
  // Parent/teacher portal
  linkedStudents: [{ type: String }], // student userIds
  inviteCode:     { type: String, unique: true, sparse: true },
  // Password reset
  passwordResetToken:   { type: String, default: null },
  passwordResetExpires: { type: Date,   default: null },
  createdAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);

// ==================== Topic ====================
const topicSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  subject:        String,
  grade:          String,
  prerequisites:  [String],
  examFrequency:  { type: Number, default: 0.5 },
  estimatedHours: { type: Number, default: 2 },
  examMarks:      { type: Number, default: 5 },
  realWorldUse:   { type: String, default: "" },
  whyMatters:     { type: String, default: "" },
});
// Filtering by subject+grade (onboarding, settings dropdowns) and sorting by frequency
topicSchema.index({ subject: 1, grade: 1 });
topicSchema.index({ examFrequency: -1 });
export const Topic = mongoose.model("Topic", topicSchema);

// ==================== Question ====================
const questionSchema = new mongoose.Schema({
  topic:         { type: String, required: true },
  subtopic:      String,
  questionText:  { type: String, required: true },
  questionType:  { type: String, enum: ["mcq", "case_based", "assertion_reason", "pyq"], default: "mcq" },
  difficulty:    { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  difficultyScore: { type: Number, default: 0.5 },
  expectedTime:  { type: Number, default: 20 },
  conceptTested: String,
  prerequisites: [String],
  isAIGenerated: { type: Boolean, default: false },
  isFlagged:     { type: Boolean, default: false },
  isPYQ:         { type: Boolean, default: false },
  pyqYear:       Number,
  options: [{
    text:     String,
    type:     { type: String, enum: ["correct","concept_error","calculation_error","partial_logic","guessing","misinterpretation"] },
    logicTag: String,
  }],
  solutionSteps: [String],
  shortcut:      String,
  caseContext:   String,  // for case-based questions: the passage/scenario
  marks:         { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now },
});
// Practice adapter queries: find un-flagged questions by topic near a target difficulty
questionSchema.index({ topic: 1, difficultyScore: 1, isFlagged: 1 });
// AI-generated question lookup by topic
questionSchema.index({ topic: 1, isAIGenerated: 1 });
export const Question = mongoose.model("Question", questionSchema);

// ==================== Attempt ====================
const attemptSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  questionId:   String,
  topic:        String,
  isCorrect:    Boolean,
  selectedType: String,
  timeTaken:    Number,
  confidence:   { type: String, enum: ["low","medium","high"] },
  difficulty:   Number,
  examId:       String,
  createdAt:    { type: Date, default: Date.now },
});
// Most common queries: user's history sorted by date, and per-topic breakdown
attemptSchema.index({ userId: 1, createdAt: -1 });
attemptSchema.index({ userId: 1, topic: 1 });
export const Attempt = mongoose.model("Attempt", attemptSchema);

// ==================== SeenQuestion (exposure control) ====================
const seenQuestionSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  questionId: { type: String, required: true },
  topic:      String,
  seenAt:     { type: Date, default: Date.now },
});
seenQuestionSchema.index({ userId: 1, questionId: 1 }, { unique: true });
export const SeenQuestion = mongoose.model("SeenQuestion", seenQuestionSchema);

// ==================== Streak ====================
const streakSchema = new mongoose.Schema({
  userId:        { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: "" }, // YYYY-MM-DD
  updatedAt:     { type: Date, default: Date.now },
});
export const Streak = mongoose.model("Streak", streakSchema);

// ==================== UserProfile ====================
const userProfileSchema = new mongoose.Schema({
  userId:         { type: String, required: true, unique: true },
  accuracy:       { type: Number, default: 0 },
  avgTime:        { type: Number, default: 0 },
  totalAttempts:  { type: Number, default: 0 },
  thinkingProfile: {
    type: String,
    enum: ["Guesser","Surface Learner","Overthinker","Pattern Recognizer","Deep Thinker"],
    default: "Surface Learner",
  },
  weakAreas:   [String],
  strongAreas: [String],
  behaviorStats: {
    guessing:           { type: Number, default: 0 },
    concept_error:      { type: Number, default: 0 },
    calculation_error:  { type: Number, default: 0 },
    partial_logic:      { type: Number, default: 0 },
    misinterpretation:  { type: Number, default: 0 },
  },
  confidenceAccuracy: {
    highConfidenceWrong: { type: Number, default: 0 },
    lowConfidenceRight:  { type: Number, default: 0 },
  },
  topicProgress: [{
    topic:         String,
    accuracy:      Number,
    attempts:      Number,
    lastAttempted: Date,
    nextRevision:  Date,
    revisionStage: { type: Number, default: 0 },
    difficulty:    { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  }],
  difficultyLevels: {
    type: Map,
    of: { type: Number, default: 1, min: 1, max: 4 },
    default: {},
  },
  updatedAt: { type: Date, default: Date.now },
});
export const UserProfile = mongoose.model("UserProfile", userProfileSchema);

// ==================== QuestionStats ====================
const questionStatsSchema = new mongoose.Schema({
  questionId:  { type: String, required: true, unique: true },
  attempts:    { type: Number, default: 0 },
  correct:     { type: Number, default: 0 },
  avgTime:     { type: Number, default: 0 },
  errorDistribution: {
    concept_error:     { type: Number, default: 0 },
    calculation_error: { type: Number, default: 0 },
    partial_logic:     { type: Number, default: 0 },
    guessing:          { type: Number, default: 0 },
    misinterpretation: { type: Number, default: 0 },
  },
  computedDifficulty: { type: Number, default: 0.5 },
  isBadQuestion:      { type: Boolean, default: false },
  updatedAt:          { type: Date, default: Date.now },
});
export const QuestionStats = mongoose.model("QuestionStats", questionStatsSchema);

// ==================== Exam ====================
const examSchema = new mongoose.Schema({
  title:          String,
  topic:          String,
  totalQuestions: { type: Number, default: 10 },
  duration:       { type: Number, default: 30 },
  negativeMarking: { type: Boolean, default: false },
  negativeValue:  { type: Number, default: 0.25 },
  questionDistribution: {
    easy:   { type: Number, default: 3 },
    medium: { type: Number, default: 5 },
    hard:   { type: Number, default: 2 },
  },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});
export const Exam = mongoose.model("Exam", examSchema);

// ==================== ExamAttempt ====================
const examAttemptSchema = new mongoose.Schema({
  userId:  String,
  examId:  String,
  answers: [{
    questionId:   String,
    questionText: String,
    isCorrect:    Boolean,
    difficulty:   Number,
    selectedType: String,
    selectedText: String,
    correctText:  String,
    solutionSteps: [String],
    timeTaken:    Number,
    marksAwarded: Number,
  }],
  rawScore:        { type: Number, default: 0 },
  normalizedScore: { type: Number, default: 0 },
  rank:      Number,
  percentile: Number,
  createdAt: { type: Date, default: Date.now },
});
// Leaderboard query (all attempts for an exam, sorted by rank)
// and exam history per user
examAttemptSchema.index({ examId: 1, rank: 1 });
examAttemptSchema.index({ userId: 1, createdAt: -1 });
export const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);

// ==================== StudyPlan ====================
const studyPlanSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  examDate: Date,
  totalDays: Number,
  dailyPlan: [{
    day:            Number,
    date:           Date,
    topics:         [String],
    estimatedHours: Number,
    completed:      { type: Boolean, default: false },
  }],
  priorityTopics: [{ topic: String, priority: Number, reason: String }],
  skipSuggestions: [{ topic: String, effort: String, marksLost: Number, reason: String }],
  createdAt: { type: Date, default: Date.now },
});
// One plan per user — fast lookup
studyPlanSchema.index({ userId: 1 });
export const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

// ==================== WeeklyLeaderboard ====================
const weeklyLeaderboardSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  topic:     String,
  week:      { type: String, required: true }, // "2025-W20"
  score:     { type: Number, default: 0 },
  accuracy:  { type: Number, default: 0 },
  rank:      Number,
  percentile: Number,
  createdAt: { type: Date, default: Date.now },
});
weeklyLeaderboardSchema.index({ week: 1, score: -1 });
// Fast upsert lookup when updating a user's weekly best score
weeklyLeaderboardSchema.index({ userId: 1, week: 1 }, { unique: true });
export const WeeklyLeaderboard = mongoose.model("WeeklyLeaderboard", weeklyLeaderboardSchema);

// ==================== AIResponseCache (permanent DB cache) ====================
// Stores every Claude response keyed by question+mistakeType
// Shared across ALL users — if 1000 students get the same question wrong the same
// way, Claude is called ONCE. Every future request hits this cache instead.
const aiResponseCacheSchema = new mongoose.Schema({
  cacheKey:    { type: String, required: true, unique: true }, // hash of questionText+mistakeType
  questionSnippet: String,   // first 120 chars of question (for debugging)
  mistakeType: String,
  response:    { type: String, required: true },  // Claude's explanation
  hitCount:    { type: Number, default: 0 },      // how many times this was reused
  savedCalls:  { type: Number, default: 0 },      // Claude calls avoided
  createdAt:   { type: Date, default: Date.now },
  lastHitAt:   { type: Date, default: Date.now },
  expiresAt:   { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }, // 90 days
});
aiResponseCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-purge old entries
export const AIResponseCache = mongoose.model("AIResponseCache", aiResponseCacheSchema);

// ==================== ErrorMemory (per-user per-topic mistake tracking) ====================
const errorMemorySchema = new mongoose.Schema({
  userId:      { type: String, required: true },
  topic:       { type: String, required: true },
  mistakeType: { type: String, required: true },
  count:       { type: Number, default: 1 },
  lastSeen:    { type: Date,   default: Date.now },
  questionSnippets: [String],
});
errorMemorySchema.index({ userId: 1, topic: 1, mistakeType: 1 }, { unique: true });
export const ErrorMemory = mongoose.model("ErrorMemory", errorMemorySchema);

// ==================== AIUsageStats (per-user daily tracking) ====================
const aiUsageStatsSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  date:      { type: String, required: true }, // YYYY-MM-DD
  callsMade: { type: Number, default: 0 },
  callsSaved:{ type: Number, default: 0 },     // cache hits today
  tokensUsed:{ type: Number, default: 0 },
});
aiUsageStatsSchema.index({ userId: 1, date: 1 }, { unique: true });
export const AIUsageStats = mongoose.model("AIUsageStats", aiUsageStatsSchema);

// ==================== Badge (achievements) ====================
const badgeSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  badgeType: { type: String, required: true },
  // streak_7 | streak_30 | streak_100 | first_perfect_exam | questions_100 | questions_500
  // top10_leaderboard | concept_master_{topic}
  awardedAt: { type: Date, default: Date.now },
  meta:      { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { topic: "Trigonometry" }
});
badgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true });
export const Badge = mongoose.model("Badge", badgeSchema);

// ==================== DoubtThread (multi-turn chat per question) ====================
const doubtThreadSchema = new mongoose.Schema({
  userId:     { type: String, required: true },
  questionId: { type: String, required: true },
  topic:      { type: String },
  subject:    { type: String, default: "Math" },
  messages: [{
    role:      { type: String, enum: ["user", "assistant"], required: true },
    content:   { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt:  { type: Date, default: Date.now },
  updatedAt:  { type: Date, default: Date.now },
});
doubtThreadSchema.index({ userId: 1, questionId: 1 });
export const DoubtThread = mongoose.model("DoubtThread", doubtThreadSchema);

// ==================== PushSubscription (PWA push) ====================
const pushSubscriptionSchema = new mongoose.Schema({
  userId:       { type: String, required: true },
  subscription: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt:    { type: Date, default: Date.now },
});
pushSubscriptionSchema.index({ userId: 1 });
export const PushSubscription = mongoose.model("PushSubscription", pushSubscriptionSchema);
