import mongoose from "mongoose";
import crypto from "crypto";

// ==================== BookmarkCollection ====================
// Custom user-created folders for organising bookmarks.
// memberRefs holds polymorphic ids: questionId (Mongo _id) | topicId (string) | sectionBookmarkId.
const collectionSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  name:      { type: String, required: true, maxlength: 60 },
  emoji:     { type: String, default: "📁", maxlength: 4 },
  color:     { type: String, default: "#007AFF", maxlength: 12 },
  order:     { type: Number, default: 0 },
  memberRefs: [{
    kind: { type: String, enum: ["question", "topic", "section"], required: true },
    refId: { type: String, required: true }, // questionId Mongo _id, topicId string, or section bookmark id
    addedAt: { type: Date, default: Date.now },
    _id: false,
  }],
  shareToken:  { type: String, default: null },
  sharedAt:    { type: Date, default: null },
  aiSummary:   { type: String, default: null }, // cached AI summary
  aiSummaryAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
collectionSchema.index({ userId: 1, order: 1 });
collectionSchema.index({ shareToken: 1 }, { sparse: true });
export const BookmarkCollection = mongoose.model("BookmarkCollection", collectionSchema);

// ==================== BookmarkReview (SM-2 spaced repetition state) ====================
// One row per (user, question). Tracks SuperMemo SM-2 schedule.
// rating: 0=again, 1=hard, 2=good, 3=easy
const reviewSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  questionId:    { type: String, required: true },  // Mongo _id of Question (string)
  easeFactor:    { type: Number, default: 2.5 },     // SM-2 EF, min 1.3
  intervalDays:  { type: Number, default: 0 },       // current interval
  repetitions:   { type: Number, default: 0 },       // successful in a row
  lastReviewedAt:{ type: Date, default: null },
  dueAt:         { type: Date, default: () => new Date() },
  lastRating:    { type: Number, default: null },    // 0..3
  reviewCount:   { type: Number, default: 0 },
  wrongCount:    { type: Number, default: 0 },       // # times rated "again" — drives "Frequently wrong"
  mastered:      { type: Boolean, default: false },
  masteredAt:    { type: Date, default: null },
  note:          { type: String, default: "", maxlength: 280 }, // "why I saved this"
  createdAt:     { type: Date, default: Date.now },
  updatedAt:     { type: Date, default: Date.now },
});
reviewSchema.index({ userId: 1, questionId: 1 }, { unique: true });
reviewSchema.index({ userId: 1, dueAt: 1 });
reviewSchema.index({ userId: 1, mastered: 1 });
reviewSchema.index({ userId: 1, wrongCount: -1 });
export const BookmarkReview = mongoose.model("BookmarkReview", reviewSchema);

// ==================== TopicBookmark ====================
// Server-side mirror of localStorage stellar_topic_bookmarks
const topicBookmarkSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  topicId:  { type: String, required: true },
  name:     { type: String, default: "" },
  subject:  { type: String, default: "" },
  isLesson: { type: Boolean, default: false },
  note:     { type: String, default: "", maxlength: 280 },
  smartCol: { type: String, default: null },
  savedAt:  { type: Date, default: Date.now },
});
topicBookmarkSchema.index({ userId: 1, topicId: 1 }, { unique: true });
topicBookmarkSchema.index({ userId: 1, savedAt: -1 });
export const TopicBookmark = mongoose.model("TopicBookmark", topicBookmarkSchema);

// ==================== SectionBookmark ====================
// Server-side mirror of localStorage stellar_section_bookmarks
const sectionBookmarkSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  bmId:      { type: String, required: true }, // composite id used by Learn page
  topicId:   { type: String, required: true },
  label:     { type: String, default: "" },
  sectionKey:{ type: String, default: "" }, // hook|plain|feynman|...
  note:      { type: String, default: "", maxlength: 280 },
  savedAt:   { type: Date, default: Date.now },
});
sectionBookmarkSchema.index({ userId: 1, bmId: 1 }, { unique: true });
sectionBookmarkSchema.index({ userId: 1, savedAt: -1 });
export const SectionBookmark = mongoose.model("SectionBookmark", sectionBookmarkSchema);

// ==================== Helper: fresh share token ====================
export function makeShareToken() {
  return crypto.randomBytes(12).toString("base64url");
}
