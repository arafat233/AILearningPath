import { jest } from "@jest/globals";

const mockProfileFindOne = jest.fn();
const mockTopicFind      = jest.fn();
const mockUserFindById   = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  UserProfile: { findOne: (q) => ({ lean: () => mockProfileFindOne(q) }) },
  Topic:       { find:    (q) => ({ lean: () => mockTopicFind(q)      }) },
  User:        { findById: (id) => ({ select: () => ({ lean: () => Promise.resolve(mockUserFindById(id)) }) }) },
}));

const { predictExamScore } = await import("../services/predictionService.js");

const TOPIC_META = [
  { name: "Algebra",      examMarks: 8,  examFrequency: 0.8 },
  { name: "Geometry",     examMarks: 6,  examFrequency: 0.7 },
  { name: "Trigonometry", examMarks: 10, examFrequency: 0.9 },
];

afterEach(() => jest.clearAllMocks());

describe("predictExamScore — no practice data", () => {
  test("empty topicProgress → low confidence, nulls returned", async () => {
    mockProfileFindOne.mockResolvedValue({ topicProgress: [] });
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue(null);
    const r = await predictExamScore("u1");
    expect(r.confidence).toBe("low");
    expect(r.predictedMin).toBeNull();
    expect(r.predictedMax).toBeNull();
    expect(r.predictedGrade).toBeNull();
  });

  test("null profile → low confidence message returned", async () => {
    mockProfileFindOne.mockResolvedValue(null);
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue(null);
    const r = await predictExamScore("u1");
    expect(r.confidence).toBe("low");
    expect(r.breakdown).toHaveLength(0);
  });
});

describe("predictExamScore — with practice data", () => {
  function makeProfile(topics) {
    return { topicProgress: topics };
  }

  test("< 3 topics practiced → confidence low", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra", accuracy: 0.8, attempts: 5 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.confidence).toBe("low");
  });

  test("3–7 topics → confidence medium", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra",      accuracy: 0.7, attempts: 10 },
      { topic: "Geometry",     accuracy: 0.6, attempts: 8  },
      { topic: "Trigonometry", accuracy: 0.8, attempts: 12 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.confidence).toBe("medium");
  });

  test("8+ topics → confidence high", async () => {
    const progress = Array.from({ length: 9 }, (_, i) => ({
      topic: `Topic${i}`, accuracy: 0.75, attempts: 15,
    }));
    const topics = progress.map((p) => ({ name: p.topic, examMarks: 5, examFrequency: 0.5 }));
    mockProfileFindOne.mockResolvedValue(makeProfile(progress));
    mockTopicFind.mockResolvedValue(topics);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.confidence).toBe("high");
  });

  test("predictedMin and predictedMax stay within [0, 80]", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra",      accuracy: 1.0, attempts: 50 },
      { topic: "Geometry",     accuracy: 1.0, attempts: 50 },
      { topic: "Trigonometry", accuracy: 1.0, attempts: 50 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.predictedMin).toBeGreaterThanOrEqual(0);
    expect(r.predictedMax).toBeLessThanOrEqual(80);
  });

  test("zero accuracy → predictedMin === 0", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra", accuracy: 0, attempts: 5 },
      { topic: "Geometry", accuracy: 0, attempts: 5 },
      { topic: "Trigonometry", accuracy: 0, attempts: 5 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.predictedMin).toBe(0);
  });

  test("timeAdjustment +5 when daysLeft > 60", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra", accuracy: 0.5, attempts: 10 },
      { topic: "Geometry", accuracy: 0.5, attempts: 10 },
      { topic: "Trigonometry", accuracy: 0.5, attempts: 10 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    const examDate = new Date(Date.now() + 90 * 86400_000).toISOString();
    mockUserFindById.mockReturnValue({ examDate });

    const rFar = await predictExamScore("u1");

    mockUserFindById.mockReturnValue({ examDate: null }); // ~60 days default
    const rNeutral = await predictExamScore("u1");

    // Far exam should produce higher or equal midpoint (adjustment +5)
    const midFar     = (rFar.predictedMin     + rFar.predictedMax)     / 2;
    const midNeutral = (rNeutral.predictedMin + rNeutral.predictedMax) / 2;
    expect(midFar).toBeGreaterThanOrEqual(midNeutral);
  });

  test("timeAdjustment -5 when daysLeft < 7", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra", accuracy: 0.5, attempts: 10 },
      { topic: "Geometry", accuracy: 0.5, attempts: 10 },
      { topic: "Trigonometry", accuracy: 0.5, attempts: 10 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    const examSoon = new Date(Date.now() + 2 * 86400_000).toISOString();
    mockUserFindById.mockReturnValue({ examDate: examSoon });

    const rSoon = await predictExamScore("u1");

    mockUserFindById.mockReturnValue({ examDate: null });
    const rNeutral = await predictExamScore("u1");

    const midSoon    = (rSoon.predictedMin    + rSoon.predictedMax)    / 2;
    const midNeutral = (rNeutral.predictedMin + rNeutral.predictedMax) / 2;
    expect(midSoon).toBeLessThanOrEqual(midNeutral);
  });

  test("isHeuristic flag always true", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra", accuracy: 0.7, attempts: 10 },
      { topic: "Geometry", accuracy: 0.6, attempts: 8 },
      { topic: "Trigonometry", accuracy: 0.8, attempts: 12 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.isHeuristic).toBe(true);
    expect(r.disclaimer).toBeDefined();
  });

  test("topics not in topicMap are skipped silently", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "UnknownTopic", accuracy: 0.9, attempts: 20 },
      { topic: "Algebra",      accuracy: 0.8, attempts: 10 },
    ]));
    mockTopicFind.mockResolvedValue([{ name: "Algebra", examMarks: 8, examFrequency: 0.8 }]);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.breakdown.every((b) => b.topic !== "UnknownTopic")).toBe(true);
  });

  test("CBSE grade boundaries — A1 for pctMid ≥ 91", async () => {
    // accuracy = 1.0, no time penalty → raw ≈ 80 → pct ≈ 100
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra",      accuracy: 1.0, attempts: 50 },
      { topic: "Geometry",     accuracy: 1.0, attempts: 50 },
      { topic: "Trigonometry", accuracy: 1.0, attempts: 50 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.predictedGrade).toBe("A1");
  });

  test("CBSE grade boundaries — E for pctMid 0", async () => {
    mockProfileFindOne.mockResolvedValue(makeProfile([
      { topic: "Algebra",      accuracy: 0, attempts: 5 },
      { topic: "Geometry",     accuracy: 0, attempts: 5 },
      { topic: "Trigonometry", accuracy: 0, attempts: 5 },
    ]));
    mockTopicFind.mockResolvedValue(TOPIC_META);
    mockUserFindById.mockReturnValue({ examDate: null });
    const r = await predictExamScore("u1");
    expect(r.predictedGrade).toBe("E");
  });
});
