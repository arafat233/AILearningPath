import { jest } from "@jest/globals";

/**
 * Test helper — a complete stand-in for models/index.js.
 *
 * Several suites mock "../models/index.js" with jest.unstable_mockModule and an
 * inline factory listing only the models they drive. When the service under
 * test (or one of its transitive imports) imports a model the factory omits,
 * ESM linking fails the whole suite with:
 *   SyntaxError: The requested module '../models/index.js'
 *               does not provide an export named 'X'
 *
 * fullModelMock() returns every model as a generic jest-mock stub. Spread it
 * FIRST in the factory, then override the models the test actually drives:
 *
 *   jest.unstable_mockModule("../models/index.js", () => ({
 *     ...fullModelMock(),
 *     Question: { find: myQuestionFind },   // test-specific override wins
 *   }));
 *
 * Keep MODEL_NAMES in sync with the `export const X = mongoose.model(...)`
 * lines in models/index.js.
 */

const MODEL_NAMES = [
  "User", "SchoolGroup", "Topic", "Question", "Attempt", "SeenQuestion",
  "Streak", "UserProfile", "QuestionStats", "Exam", "ExamAttempt", "StudyPlan",
  "WeeklyLeaderboard", "AIResponseCache", "ErrorMemory", "AIUsageStats", "Badge",
  "DoubtThread", "NcertChunk", "PushSubscription", "PaymentRecord", "SavedNote",
  "Coupon", "UserTopicMastery", "LinkRequest", "NcertNote", "AICallLog",
  "AIFeedback", "AnalyticsEvent",
];

const STATIC_METHODS = [
  "find", "findOne", "findById", "findByIdAndUpdate", "findByIdAndDelete",
  "findOneAndUpdate", "findOneAndDelete", "create", "insertMany", "updateOne",
  "updateMany", "deleteOne", "deleteMany", "countDocuments",
  "estimatedDocumentCount", "aggregate", "bulkWrite", "distinct", "exists",
  "populate", "save",
];

export function fullModelMock() {
  const out = {};
  for (const name of MODEL_NAMES) {
    const stub = {};
    for (const fn of STATIC_METHODS) stub[fn] = jest.fn();
    out[name] = stub;
  }
  return out;
}
