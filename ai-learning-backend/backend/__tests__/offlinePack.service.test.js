import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockProfileFindOne   = jest.fn();
const mockQuestionFind     = jest.fn();
const mockAttemptInsertMany = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  UserProfile: { findOne: mockProfileFindOne },
  Question:    { find: mockQuestionFind },
  Attempt:     { insertMany: mockAttemptInsertMany },
}));

const { buildOfflinePack, syncOfflineAttempts } = await import("../services/offlinePackService.js");

const chain = (val) => {
  const c = { select: () => c, limit: () => c, lean: () => Promise.resolve(val) };
  return c;
};

const Q = (id, topic, correctFirst = true) => ({
  _id: id,
  questionText: `Question ${id}`,
  topic,
  subject: "Math",
  difficulty: "easy",
  options: correctFirst
    ? [{ text: "right", type: "correct" }, { text: "wrong", type: "concept_error" }]
    : [{ text: "wrong", type: "concept_error" }, { text: "right", type: "correct" }],
  solutionSteps: ["step 1"],
});

afterEach(() => jest.clearAllMocks());

describe("buildOfflinePack", () => {
  test("packs weakest topics with client-gradable answer key", async () => {
    mockProfileFindOne.mockReturnValue(chain({
      topicProgress: [
        { topic: "Trigonometry", accuracy: 0.2, attempts: 5 },
        { topic: "Algebra",      accuracy: 0.9, attempts: 9 },
      ],
    }));
    mockQuestionFind.mockReturnValue(chain([Q("q1", "Trigonometry"), Q("q2", "Algebra", false)]));

    const pack = await buildOfflinePack("u1");
    expect(pack.questions).toHaveLength(2);
    const q2 = pack.questions.find((q) => q.id === "q2");
    expect(q2.correctIndex).toBe(1);
    expect(q2.options).toEqual(["wrong", "right"]);
    expect(q2.solution).toBe("step 1");
    expect(pack.topics).toContain("Trigonometry");
  });

  test("caps questions per topic at 8", async () => {
    mockProfileFindOne.mockReturnValue(chain({
      topicProgress: [{ topic: "Algebra", accuracy: 0.5, attempts: 3 }],
    }));
    mockQuestionFind.mockReturnValue(chain(
      Array.from({ length: 20 }, (_, i) => Q(`q${i}`, "Algebra"))
    ));
    const pack = await buildOfflinePack("u1");
    expect(pack.questions).toHaveLength(8);
  });

  test("no practice history → empty pack", async () => {
    mockProfileFindOne.mockReturnValue(chain(null));
    const pack = await buildOfflinePack("u1");
    expect(pack.questions).toEqual([]);
    expect(mockQuestionFind).not.toHaveBeenCalled();
  });
});

describe("syncOfflineAttempts", () => {
  test("derives correctness server-side from the stored question", async () => {
    mockQuestionFind.mockReturnValue(chain([
      { _id: "q1", topic: "Algebra", options: [{ text: "right", type: "correct" }, { text: "wrong", type: "guessing" }] },
    ]));
    mockAttemptInsertMany.mockResolvedValue([]);

    const out = await syncOfflineAttempts("u1", [
      { questionId: "q1", selectedOptionIndex: 0, timeTaken: 20 },
      { questionId: "q1", selectedOptionIndex: 1 },
      { questionId: "gone", selectedOptionIndex: 0 }, // unknown question — skipped
    ]);
    expect(out).toEqual({ synced: 2, skipped: 1 });
    const docs = mockAttemptInsertMany.mock.calls[0][0];
    expect(docs[0]).toMatchObject({ userId: "u1", isCorrect: true, selectedType: "correct", topic: "Algebra" });
    expect(docs[1]).toMatchObject({ isCorrect: false, selectedType: "guessing" });
  });

  test("nothing valid → no insert", async () => {
    mockQuestionFind.mockReturnValue(chain([]));
    const out = await syncOfflineAttempts("u1", [{ questionId: "gone", selectedOptionIndex: 0 }]);
    expect(out).toEqual({ synced: 0, skipped: 1 });
    expect(mockAttemptInsertMany).not.toHaveBeenCalled();
  });
});
