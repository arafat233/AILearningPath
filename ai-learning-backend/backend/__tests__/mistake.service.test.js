import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockAttemptFind  = jest.fn();
const mockQuestionFind = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  Attempt:  { find: mockAttemptFind },
  Question: { find: mockQuestionFind },
}));

const { getMistakes } = await import("../services/mistakeService.js");

// Attempt.find().sort().limit().lean() chain
const attemptChain = (arr) => ({
  sort:  () => ({ limit: () => ({ lean: () => Promise.resolve(arr) }) }),
});
// Question.find().select().limit().lean() / .select().lean() chain
const questionChain = (arr) => {
  const chain = {
    select: () => chain,
    limit:  () => chain,
    lean:   () => Promise.resolve(arr),
  };
  return chain;
};

const DAY = 864e5;
const Q1 = {
  _id: "q1",
  questionText: "What is 2+2?",
  topic: "Algebra",
  subject: "Math",
  difficulty: "easy",
  conceptTested: "addition",
  options: [
    { text: "4", type: "correct" },
    { text: "5", type: "calculation_error" },
  ],
};

afterEach(() => jest.clearAllMocks());

describe("getMistakes", () => {
  test("wrong attempt → mistake with why-wrong, answers, retry date, similar questions", async () => {
    const wrongAt = new Date(Date.now() - 5 * DAY);
    mockAttemptFind.mockReturnValue(attemptChain([
      { questionId: "q1", isCorrect: false, selectedType: "calculation_error", difficulty: "easy", createdAt: wrongAt },
    ]));
    mockQuestionFind
      .mockReturnValueOnce(questionChain([Q1])) // mistake questions
      .mockReturnValueOnce(questionChain([      // similar pool
        { _id: "q1", topic: "Algebra", difficulty: "easy" },
        { _id: "q2", topic: "Algebra", difficulty: "easy" },
        { _id: "q3", topic: "Algebra", difficulty: "hard" },
      ]));

    const out = await getMistakes("u1");
    expect(out).toHaveLength(1);
    const m = out[0];
    expect(m.selectedAnswer).toBe("5");
    expect(m.correctAnswer).toBe("4");
    expect(m.whyWrong).toMatch(/Calculation slip/);
    expect(m.dueForRetry).toBe(true); // wrong 5 days ago > 3-day gap
    expect(m.retryDate.getTime()).toBe(wrongAt.getTime() + 3 * DAY);
    expect(m.similarQuestionIds).toEqual(["q2"]); // same topic+difficulty, not itself
  });

  test("question answered correctly later is excluded (latest attempt wins)", async () => {
    mockAttemptFind.mockReturnValue(attemptChain([
      // sorted newest-first, as the service queries
      { questionId: "q1", isCorrect: true,  selectedType: "correct",       createdAt: new Date() },
      { questionId: "q1", isCorrect: false, selectedType: "concept_error", createdAt: new Date(Date.now() - DAY) },
    ]));
    const out = await getMistakes("u1");
    expect(out).toEqual([]);
    expect(mockQuestionFind).not.toHaveBeenCalled();
  });

  test("no attempts → empty list", async () => {
    mockAttemptFind.mockReturnValue(attemptChain([]));
    expect(await getMistakes("u1")).toEqual([]);
  });

  test("deleted/missing question is skipped", async () => {
    mockAttemptFind.mockReturnValue(attemptChain([
      { questionId: "gone", isCorrect: false, selectedType: "guessing", createdAt: new Date() },
    ]));
    mockQuestionFind
      .mockReturnValueOnce(questionChain([]))
      .mockReturnValueOnce(questionChain([]));
    expect(await getMistakes("u1")).toEqual([]);
  });
});
