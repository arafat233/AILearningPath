import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockMasteryFind = jest.fn();
const mockUserFindById = jest.fn();
const mockNcertFind = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  UserTopicMastery: { find: mockMasteryFind },
  User: { findById: mockUserFindById },
}));
jest.unstable_mockModule("../models/ncertTopicContentModel.js", () => ({
  NcertTopicContent: { find: mockNcertFind },
}));
jest.unstable_mockModule("../models/lessonModel.js", () => ({
  Lesson: {}, LessonProgress: {},
}));
jest.unstable_mockModule("../services/revisionService.js", () => ({
  getRevisionTopics: jest.fn().mockResolvedValue([{ topic: "Real Numbers" }]),
}));

const { getMasteryMapView } = await import("../services/lessonsV2Service.js");

const chain = (val) => {
  const c = { select: () => c, sort: () => c, limit: () => c, lean: () => Promise.resolve(val) };
  return c;
};

beforeEach(() => {
  mockUserFindById.mockReturnValue(chain({ examBoard: "CBSE" }));
  mockNcertFind.mockReturnValue(chain([
    { topicId: "t1", name: "Real Numbers",   chapterNumber: 1 },
    { topicId: "t2", name: "Polynomials",    chapterNumber: 2 },
    { topicId: "t3", name: "Linear Eqns",    chapterNumber: 2 },
    { topicId: "t4", name: "Quadratics",     chapterNumber: 4 },
    { topicId: "t5", name: "Progressions",   chapterNumber: 5 },
  ]));
  mockMasteryFind.mockReturnValue(chain([
    { topicId: "t1", mastery: { hard: true }, attempts: [] },                                  // mastered + revision due → needs_revision
    { topicId: "t2", mastery: { easy: true }, attempts: [] },                                  // learning
    { topicId: "t3", mastery: { easy: true }, attempts: [{ correct: false }, { correct: false }, { correct: false }] }, // weak
    { topicId: "t4", mastery: { hard: true }, attempts: [] },                                  // mastered (not due)
    // t5 → not_started
  ]));
});

afterEach(() => jest.clearAllMocks());

describe("getMasteryMapView", () => {
  test("maps every topic to one of the 5 states, grouped by chapter", async () => {
    const out = await getMasteryMapView("u1", "Science", "10");
    expect(out.counts).toEqual({ not_started: 1, learning: 1, weak: 1, mastered: 1, needs_revision: 1 });

    const byId = {};
    for (const ch of out.chapters) for (const t of ch.topics) byId[t.topicId] = t.state;
    expect(byId).toEqual({
      t1: "needs_revision", // mastered but the revision engine says it's due
      t2: "learning",
      t3: "weak",
      t4: "mastered",
      t5: "not_started",
    });

    expect(out.chapters.map((c) => c.chapterNumber)).toEqual([1, 2, 4, 5]);
    expect(out.chapters[1].topics).toHaveLength(2); // chapter 2 has two topics
  });

  test("no topics → empty map", async () => {
    mockNcertFind.mockReturnValue(chain([]));
    const out = await getMasteryMapView("u1", "Science", "10");
    expect(out.chapters).toEqual([]);
  });
});
