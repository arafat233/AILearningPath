import { jest } from "@jest/globals";

const mockFindOne          = jest.fn();
const mockFindOneAndUpdate = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  UserProfile: {
    findOne:          mockFindOne,
    findOneAndUpdate: mockFindOneAndUpdate,
  },
}));

const { getRevisionTopics, markRevised } = await import("../services/revisionService.js");

afterEach(() => jest.clearAllMocks());

const daysAgo = (n) => new Date(Date.now() - n * 864e5);
const daysFrom = (n) => new Date(Date.now() + n * 864e5);

describe("getRevisionTopics", () => {
  test("no profile → returns empty array", async () => {
    mockFindOne.mockResolvedValue(null);
    expect(await getRevisionTopics("u1")).toEqual([]);
  });

  test("topic with nextRevision in the past → included in results", async () => {
    mockFindOne.mockResolvedValue({
      topicProgress: [{
        topic: "Algebra",
        lastAttempted: daysAgo(5),
        nextRevision:  daysAgo(1), // overdue
        revisionStage: 1,
        accuracy: 0.7,
        attempts: 3,
      }],
    });
    const result = await getRevisionTopics("u1");
    expect(result.length).toBe(1);
    expect(result[0].topic).toBe("Algebra");
  });

  test("topic with nextRevision in the future → NOT included", async () => {
    mockFindOne.mockResolvedValue({
      topicProgress: [{
        topic: "Geometry",
        lastAttempted: daysAgo(1),
        nextRevision:  daysFrom(3),
        revisionStage: 1,
        accuracy: 0.8,
        attempts: 2,
      }],
    });
    const result = await getRevisionTopics("u1");
    expect(result.length).toBe(0);
  });

  test("overdue topics sorted by priority descending", async () => {
    mockFindOne.mockResolvedValue({
      topicProgress: [
        { topic: "A", lastAttempted: daysAgo(10), nextRevision: daysAgo(8), revisionStage: 0, accuracy: 0.5, attempts: 1 },
        { topic: "B", lastAttempted: daysAgo(2),  nextRevision: daysAgo(1), revisionStage: 0, accuracy: 0.5, attempts: 1 },
      ],
    });
    const result = await getRevisionTopics("u1");
    expect(result[0].topic).toBe("A"); // higher priority
  });
});

describe("markRevised", () => {
  test("advances revisionStage and sets nextRevision in the future", async () => {
    mockFindOne.mockResolvedValue({
      topicProgress: [{ topic: "Algebra", revisionStage: 1 }],
    });
    mockFindOneAndUpdate.mockResolvedValue({});
    const result = await markRevised("u1", "Algebra");
    expect(result.nextRevision).toBeInstanceOf(Date);
    expect(result.nextRevision.getTime()).toBeGreaterThan(Date.now());
    expect(result.nextStage).toBe(2);
  });

  test("revisionStage capped at max interval index", async () => {
    mockFindOne.mockResolvedValue({
      topicProgress: [{ topic: "Trig", revisionStage: 4 }], // already at max
    });
    mockFindOneAndUpdate.mockResolvedValue({});
    const result = await markRevised("u1", "Trig");
    expect(result.nextStage).toBe(4); // stays at 4
  });
});
