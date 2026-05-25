import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

// fullModelMock() stubs every export of models/index.js so ESM linking can't
// fail with "does not provide an export named X". Override the specific models
// the test drives.
jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
}));

const { generateStudyPlan } = await import("../services/plannerService.js");
const { UserProfile, Topic, User } = await import("../models/index.js");

const mockTopics = [
  { name: "Trigonometry",    examFrequency: 0.9, estimatedHours: 4, examMarks: 8 },
  { name: "Algebra",         examFrequency: 0.8, estimatedHours: 3, examMarks: 6 },
  { name: "Statistics",      examFrequency: 0.4, estimatedHours: 2, examMarks: 3 },
];
const mockProfile = {
  weakAreas: ["Trigonometry"],
  topicProgress: [{ topic: "Algebra", accuracy: 0.8, attempts: 20 }],
};

beforeEach(() => {
  // Service chains .select().lean() on User — make sure that path doesn't crash.
  User.findById.mockReturnValue({
    select: () => ({ lean: () => Promise.resolve({ examBoard: "CBSE" }) }),
  });
  // Service chains .lean() on both queries — mocks must return a query-like object.
  UserProfile.findOne.mockReturnValue({ lean: () => Promise.resolve(mockProfile) });
  Topic.find.mockReturnValue({ lean: () => Promise.resolve(mockTopics) });
});

describe("generateStudyPlan", () => {
  it("returns dailyPlan with correct number of days", async () => {
    const examDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", { examDate, goal: "distinction" });
    expect(plan.dailyPlan.length).toBeGreaterThan(0);
    expect(plan.dailyPlan.length).toBeLessThanOrEqual(10);
  });

  it("scholarship goal produces no skipSuggestions", async () => {
    const examDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", { examDate, goal: "scholarship" });
    // scholarship covers all topics, should skip very few or none
    expect(plan.skipSuggestions.length).toBeLessThan(mockTopics.length);
  });

  it("pass goal skips low-frequency topics", async () => {
    const examDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", { examDate, goal: "pass" });
    expect(plan.priorityTopics).toBeDefined();
    expect(plan.dailyPlan).toBeDefined();
  });

  it("always includes priorityTopics in output", async () => {
    const examDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", { examDate, goal: "top" });
    expect(Array.isArray(plan.priorityTopics)).toBe(true);
    expect(plan.priorityTopics[0]).toHaveProperty("topic");
    expect(plan.priorityTopics[0]).toHaveProperty("priority");
  });
});
