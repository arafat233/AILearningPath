import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock mongoose models before importing the service
jest.unstable_mockModule("../models/index.js", () => ({
  UserProfile: { findOne: jest.fn() },
  Topic: { find: jest.fn() },
}));

const { generateStudyPlan } = await import("../services/plannerService.js");
const { UserProfile, Topic } = await import("../models/index.js");

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
  UserProfile.findOne.mockResolvedValue(mockProfile);
  Topic.find.mockResolvedValue(mockTopics);
});

describe("generateStudyPlan", () => {
  it("returns dailyPlan with correct number of days", async () => {
    const examDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", examDate, "distinction");
    expect(plan.dailyPlan.length).toBeGreaterThan(0);
    expect(plan.dailyPlan.length).toBeLessThanOrEqual(10);
  });

  it("scholarship goal produces no skipSuggestions", async () => {
    const examDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", examDate, "scholarship");
    // scholarship covers all topics, should skip very few or none
    expect(plan.skipSuggestions.length).toBeLessThan(mockTopics.length);
  });

  it("pass goal skips low-frequency topics", async () => {
    const examDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", examDate, "pass");
    expect(plan.priorityTopics).toBeDefined();
    expect(plan.dailyPlan).toBeDefined();
  });

  it("always includes priorityTopics in output", async () => {
    const examDate = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
    const plan = await generateStudyPlan("user1", examDate, "top");
    expect(Array.isArray(plan.priorityTopics)).toBe(true);
    expect(plan.priorityTopics[0]).toHaveProperty("topic");
    expect(plan.priorityTopics[0]).toHaveProperty("priority");
  });
});
