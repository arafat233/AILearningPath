import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockProfileFindOne = jest.fn();
const mockQuestionFind   = jest.fn();
const mockSeenFind       = jest.fn();
const mockTopicFind      = jest.fn();
const mockUserFindById   = jest.fn();
const mockStudyPlanFindOne = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  UserProfile:  { findOne: mockProfileFindOne },
  Question:     { find: mockQuestionFind },
  SeenQuestion: { find: mockSeenFind },
  Topic:        { find: mockTopicFind },
  User:         { findById: mockUserFindById },
  StudyPlan:    { findOne: mockStudyPlanFindOne },
}));

const mockGetStreakStatus = jest.fn();
jest.unstable_mockModule("../services/streakService.js", () => ({
  getStreakStatus: mockGetStreakStatus,
}));
const mockGetContinueCard = jest.fn();
jest.unstable_mockModule("../services/lessonsV2Service.js", () => ({
  getContinueCard: mockGetContinueCard,
}));
jest.unstable_mockModule("../services/revisionService.js", () => ({
  getRevisionTopics: jest.fn().mockResolvedValue([
    { topic: "Trigonometry", daysSince: 4, accuracy: 60 },
  ]),
}));

const { getTodayPlan } = await import("../services/dailyBriefService.js");

const chain = (arr) => {
  const c = { select: () => c, limit: () => c, sort: () => c, lean: () => Promise.resolve(arr) };
  return c;
};

beforeEach(() => {
  mockProfileFindOne.mockReturnValue(chain({
    topicProgress: [
      { topic: "Algebra",  accuracy: 0.3, attempts: 5 },
      { topic: "Geometry", accuracy: 0.5, attempts: 4 },
    ],
  }));
  mockStudyPlanFindOne.mockReturnValue(chain(null));
  mockUserFindById.mockReturnValue(chain({ examBoard: "CBSE" }));
  mockTopicFind.mockReturnValue(chain([]));
  mockSeenFind.mockReturnValue(chain([]));
  mockQuestionFind.mockReturnValue(chain([{ _id: "q1" }]));
  mockGetStreakStatus.mockResolvedValue({ currentStreak: 3 });
  mockGetContinueCard.mockResolvedValue({ topic: "Circles", percent: 40 });
});

afterEach(() => jest.clearAllMocks());

describe("getTodayPlan", () => {
  test("returns queue of real question IDs for weak + revision topics, streak, next lesson", async () => {
    const plan = await getTodayPlan("u1");
    // 2 weak topics + 1 distinct revision topic, each with a question
    expect(plan.queue).toHaveLength(3);
    expect(plan.queue.map((s) => s.kind)).toEqual(["weak_topic", "weak_topic", "revision"]);
    expect(plan.queue.every((s) => s.questionId === "q1")).toBe(true);
    expect(plan.streak).toEqual({ currentStreak: 3 });
    expect(plan.nextLesson).toEqual({ topic: "Circles", percent: 40 });
    expect(plan.brief.weakTopics).toHaveLength(2);
  });

  test("topic with no playable questions is dropped from the queue", async () => {
    mockQuestionFind.mockReturnValue(chain([]));
    const plan = await getTodayPlan("u1");
    expect(plan.queue).toEqual([]);
  });
});
