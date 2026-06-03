import { jest } from "@jest/globals";

// Mock everything proService.js imports so we can unit-test getPracticeList
// in isolation (no DB, no Redis, no sandbox).
const mockTrackLean   = jest.fn();
const mockExFind      = jest.fn();
const mockExFindLean  = jest.fn();
const mockExAggregate = jest.fn();
const mockIsEnrolled  = jest.fn();

jest.unstable_mockModule("../models/proModels.js", () => ({
  ProTrack: { findOne: (q) => ({ lean: () => mockTrackLean(q) }) },
  ProExercise: {
    find: (q) => {
      mockExFind(q);
      const chain = { select() { return chain; }, sort() { return chain; }, limit() { return chain; }, lean: () => mockExFindLean() };
      return chain;
    },
    aggregate: (p) => mockExAggregate(p),
  },
  ProModule: {}, ProTopic: {}, ProProject: {}, ProSubmission: {},
  ProProgress: {}, ProBookmark: {}, ProCertificate: {},
}));
jest.unstable_mockModule("../models/index.js", () => ({ User: {} }));
jest.unstable_mockModule("../utils/redisClient.js", () => ({ sessionGet: jest.fn(), sessionSet: jest.fn() }));
jest.unstable_mockModule("../services/codeExecutionService.js", () => ({ runTestCases: jest.fn() }));
jest.unstable_mockModule("../middleware/trackFilter.js", () => ({ isEnrolled: mockIsEnrolled, invalidateEnrolment: jest.fn() }));
jest.unstable_mockModule("../utils/eventTracker.js", () => ({ trackEvent: jest.fn() }));
jest.unstable_mockModule("../utils/logger.js", () => ({ default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() } }));

const { getPracticeList, getPatternQuiz } = await import("../services/proService.js");

afterEach(() => jest.clearAllMocks());

describe("getPracticeList (Track-2 practice filter)", () => {
  test("builds the trackKey + priority + pattern query and returns count/facets/exercises", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(true);
    mockExFindLean.mockResolvedValue([
      { exerciseId: "java_m30_t2_ex_3", priority: "P1", pattern: "sliding-window", leetcodeId: 209 },
      { exerciseId: "java_m30_t2_ex_4", priority: "P1", pattern: "sliding-window", leetcodeId: 3 },
    ]);
    mockExAggregate.mockResolvedValue([{ _id: "P1", count: 193 }, { _id: "P2", count: 151 }, { _id: "P3", count: 423 }]);

    const res = await getPracticeList("java", { priority: "P1", pattern: "sliding-window" }, "u1");

    expect(mockExFind).toHaveBeenCalledWith({ trackKey: "pro_java", priority: "P1", pattern: "sliding-window" });
    expect(res.count).toBe(2);
    expect(res.priorityFacets).toEqual({ P1: 193, P2: 151, P3: 423 });
    expect(res.exercises).toHaveLength(2);
  });

  test("omits priority/pattern from the query when not supplied", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(true);
    mockExFindLean.mockResolvedValue([]);
    mockExAggregate.mockResolvedValue([]);

    await getPracticeList("java", {}, "u1");

    expect(mockExFind).toHaveBeenCalledWith({ trackKey: "pro_java" });
  });

  test("throws 403 when the user is not enrolled", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(false);
    await expect(getPracticeList("java", {}, "u1")).rejects.toMatchObject({ statusCode: 403 });
  });

  test("throws 404 when the track does not exist", async () => {
    mockTrackLean.mockResolvedValue(null);
    await expect(getPracticeList("nope", {}, "u1")).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("getPatternQuiz (Track-2 'which pattern fits?' quiz)", () => {
  const POOL = [
    { exerciseId: "a", leetcodeId: 1, title: "A", pattern: "two-pointers" },
    { exerciseId: "b", leetcodeId: 2, title: "B", pattern: "sliding-window" },
    { exerciseId: "c", leetcodeId: 3, title: "C", pattern: "hashing" },
    { exerciseId: "d", leetcodeId: 4, title: "D", pattern: "binary-search" },
    { exerciseId: "e", leetcodeId: 5, title: "E", pattern: "dynamic-programming" },
  ];

  test("builds n MCQ questions, each with the answer among 4 shuffled choices", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(true);
    mockExFindLean.mockResolvedValue(POOL);

    const res = await getPatternQuiz("java", 3, "u1");

    expect(res.count).toBe(3);
    expect(res.patternCount).toBe(5);
    for (const q of res.questions) {
      expect(q.choices).toContain(q.answer);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4); // no duplicate choices
    }
  });

  test("caps questions at the pool size", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(true);
    mockExFindLean.mockResolvedValue(POOL.slice(0, 2));
    const res = await getPatternQuiz("java", 10, "u1");
    expect(res.count).toBe(2);
  });

  test("throws 403 when not enrolled", async () => {
    mockTrackLean.mockResolvedValue({ key: "pro_java", slug: "java", status: "live" });
    mockIsEnrolled.mockResolvedValue(false);
    await expect(getPatternQuiz("java", 5, "u1")).rejects.toMatchObject({ statusCode: 403 });
  });
});
