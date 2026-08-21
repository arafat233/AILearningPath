import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockProfileFindOne = jest.fn();
const mockUserFindById   = jest.fn();
const mockTopicFind      = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  UserProfile: { findOne: mockProfileFindOne },
  User:        { findById: mockUserFindById },
  Topic:       { find: mockTopicFind },
}));
jest.unstable_mockModule("../models/practiceFeedbackModels.js", () => ({
  ErrorLabel: {}, SkipReason: {}, QuestionReport: {},
}));
jest.unstable_mockModule("../models/bookmarkModels.js", () => ({
  BookmarkReview: {}, BookmarkCollection: {}, TopicBookmark: {}, SectionBookmark: {},
}));
jest.unstable_mockModule("../models/lessonModel.js", () => ({
  LessonProgress: {}, Lesson: {},
}));

const { getReadiness } = await import("../services/analyticsV2Service.js");

const chain = (val) => {
  const c = { select: () => c, lean: () => Promise.resolve(val) };
  return c;
};

const TOPICS = [
  { name: "Algebra",      subject: "Math",    examFrequency: 1.0 },
  { name: "Trigonometry", subject: "Math",    examFrequency: 1.0 },
  { name: "Optics",       subject: "Science", examFrequency: 0.5 },
];

beforeEach(() => {
  mockUserFindById.mockReturnValue(chain({ examBoard: "CBSE", grade: "10", goal: "" }));
  mockTopicFind.mockReturnValue(chain(TOPICS));
});

afterEach(() => jest.clearAllMocks());

describe("getReadiness", () => {
  test("weighted per-subject roll-up with coverage penalty + weakest topics", async () => {
    mockProfileFindOne.mockReturnValue(chain({
      topicProgress: [
        { topic: "Algebra",      accuracy: 0.8, attempts: 10 },
        { topic: "Trigonometry", accuracy: 0.2, attempts: 5 },
      ],
    }));
    const out = await getReadiness("u1");
    // Math: (0.8·1 + 0.2·1) / 2 = 50%; Science has no attempts → excluded
    expect(out.subjects).toHaveLength(1);
    const math = out.subjects[0];
    expect(math.subject).toBe("Math");
    expect(math.readiness).toBe(50);
    expect(math.coveredTopics).toBe(2);
    expect(math.totalTopics).toBe(2);
    expect(math.weakestTopics[0].topic).toBe("Trigonometry");
    expect(math.label).toBe("CBSE Math");
  });

  test("uncovered topics drag readiness down (coverage penalty)", async () => {
    mockProfileFindOne.mockReturnValue(chain({
      topicProgress: [{ topic: "Algebra", accuracy: 1.0, attempts: 10 }],
    }));
    const out = await getReadiness("u1");
    // 100% on Algebra but Trigonometry never attempted → (1·1)/(1+1) = 50%
    expect(out.subjects[0].readiness).toBe(50);
  });

  test("JEE goal produces JEE-labelled scores", async () => {
    mockUserFindById.mockReturnValue(chain({ examBoard: "CBSE", grade: "10", goal: "Competitive (JEE / NEET)" }));
    mockProfileFindOne.mockReturnValue(chain({
      topicProgress: [{ topic: "Algebra", accuracy: 0.6, attempts: 3 }],
    }));
    const out = await getReadiness("u1");
    expect(out.exam).toBe("JEE");
    expect(out.subjects[0].label).toBe("JEE Math");
  });

  test("no attempted topics → null", async () => {
    mockProfileFindOne.mockReturnValue(chain({ topicProgress: [] }));
    expect(await getReadiness("u1")).toBeNull();
  });
});
