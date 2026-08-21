import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockUserFindById   = jest.fn();
const mockUserFind       = jest.fn();
const mockProfileFind    = jest.fn();
const mockGenerateTeacherDoc = jest.fn();
const mockGroupFindOne   = jest.fn();
const mockGroupFindById  = jest.fn();
const mockQuestionFind   = jest.fn();
const mockAttemptFind    = jest.fn();
const mockAssignmentCreate   = jest.fn();
const mockAssignmentFind     = jest.fn();
const mockAssignmentFindById = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  User:        { findById: mockUserFindById, find: mockUserFind },
  UserProfile: { find: mockProfileFind },
  SchoolGroup: { findOne: mockGroupFindOne, findById: mockGroupFindById },
  Question:    { find: mockQuestionFind },
  Attempt:     { find: mockAttemptFind },
}));
jest.unstable_mockModule("../models/schoolGroupV2Models.js", () => ({
  ClassChallenge: {}, TeacherPost: {}, Kudos: {}, SubjectFocus: {},
  ClassPreference: {}, ClassReport: {},
  Assignment: { create: mockAssignmentCreate, find: mockAssignmentFind, findById: mockAssignmentFindById },
  isoWeekKey: () => "2026-W34",
}));

jest.unstable_mockModule("../services/aiService.js", () => ({
  generateTeacherDoc: mockGenerateTeacherDoc,
}));

const { createAssignment, getStudentAssignments, getAssignmentReport, generateWorksheet, generateTeacherContent, getClassHeatmap } =
  await import("../services/schoolGroupV2Service.js");

const chain = (val) => {
  const c = { select: () => c, limit: () => c, sort: () => c, lean: () => Promise.resolve(val) };
  return c;
};

const DAY = 864e5;

afterEach(() => jest.clearAllMocks());

describe("createAssignment", () => {
  test("non-teacher is rejected with 403", async () => {
    mockUserFindById.mockReturnValue(chain({ name: "Kid", role: "student" }));
    await expect(createAssignment("u1", { classCode: "ABC123", topic: "Algebra", dueAt: new Date() }))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  test("teacher creates assignment with auto-picked questions", async () => {
    mockUserFindById.mockReturnValue(chain({ name: "Mrs. Iyer", role: "teacher" }));
    mockGroupFindOne.mockReturnValue(chain({ _id: "g1" }));
    mockQuestionFind.mockReturnValue(chain([{ _id: "q1" }, { _id: "q2" }]));
    mockAssignmentCreate.mockResolvedValue({
      _id: "a1", title: "Algebra practice", topic: "Algebra", questionIds: ["q1", "q2"], dueAt: new Date(),
    });

    const out = await createAssignment("t1", { classCode: "abc123", topic: "Algebra", dueAt: new Date() });
    expect(out.total).toBe(2);
    const created = mockAssignmentCreate.mock.calls[0][0];
    expect(created.schoolGroupId).toBe("g1");
    expect(created.questionIds).toEqual(["q1", "q2"]);
    expect(created.title).toBe("Algebra practice"); // default from topic
  });

  test("unknown class code → 404", async () => {
    mockUserFindById.mockReturnValue(chain({ name: "T", role: "teacher" }));
    mockGroupFindOne.mockReturnValue(chain(null));
    await expect(createAssignment("t1", { classCode: "NOPE", topic: "Algebra", dueAt: new Date() }))
      .rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("getStudentAssignments", () => {
  test("derives completion from attempts made after the assignment was created", async () => {
    const createdAt = new Date(Date.now() - 2 * DAY);
    mockAssignmentFind.mockReturnValue(chain([
      { _id: "a1", title: "HW", topic: "Algebra", teacherName: "T", questionIds: ["q1", "q2"], dueAt: new Date(Date.now() + DAY), createdAt },
    ]));
    mockAttemptFind.mockReturnValue(chain([
      { questionId: "q1", isCorrect: true,  createdAt: new Date(Date.now() - DAY) },      // counts
      { questionId: "q2", isCorrect: false, createdAt: new Date(Date.now() - 3 * DAY) },  // before assignment — ignored
    ]));

    const [a] = await getStudentAssignments("u1", "g1");
    expect(a.attempted).toBe(1);
    expect(a.correct).toBe(1);
    expect(a.completed).toBe(false);
    expect(a.overdue).toBe(false);
  });

  test("no assignments → empty array without querying attempts", async () => {
    mockAssignmentFind.mockReturnValue(chain([]));
    expect(await getStudentAssignments("u1", "g1")).toEqual([]);
    expect(mockAttemptFind).not.toHaveBeenCalled();
  });
});

describe("generateWorksheet", () => {
  test("non-teacher is rejected with 403", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "student" }));
    await expect(generateWorksheet("u1", { topic: "Algebra" })).rejects.toMatchObject({ statusCode: 403 });
  });

  test("teacher gets numbered questions with an answer key", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "teacher" }));
    mockQuestionFind.mockReturnValue(chain([
      {
        questionText: "What is 2+2?",
        difficulty: "easy",
        options: [{ text: "4", type: "correct" }, { text: "5", type: "calculation_error" }],
        solutionSteps: ["Add the numbers"],
      },
    ]));
    const ws = await generateWorksheet("t1", { topic: "Algebra", questionCount: 5 });
    expect(ws.count).toBe(1);
    expect(ws.questions[0]).toMatchObject({
      number: 1,
      questionText: "What is 2+2?",
      options: ["4", "5"],
      answer: "4",
    });
  });

  test("empty topic bank → 404", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "teacher" }));
    mockQuestionFind.mockReturnValue(chain([]));
    await expect(generateWorksheet("t1", { topic: "Nothing" })).rejects.toMatchObject({ statusCode: 404 });
  });
});

describe("generateTeacherContent", () => {
  const setupClass = () => {
    mockUserFindById.mockReturnValue(chain({ role: "teacher" }));
    mockGroupFindOne.mockReturnValue(chain({ _id: "g1", schoolName: "DPS", enrolledStudentIds: ["s1"] }));
    mockUserFind.mockReturnValue(chain([{ _id: "s1", name: "Asha" }]));
    mockProfileFind.mockReturnValue(chain([
      { userId: "s1", accuracy: 0.8, totalAttempts: 40, weakAreas: ["Trigonometry"], strongAreas: ["Algebra"] },
    ]));
  };

  test("non-teacher is rejected with 403", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "student" }));
    await expect(generateTeacherContent("u1", { kind: "class_summary", classCode: "ABC" }))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  test("class summary feeds real per-student stats to the AI", async () => {
    setupClass();
    mockGenerateTeacherDoc.mockResolvedValue("Class is doing well.");
    const out = await generateTeacherContent("t1", { kind: "class_summary", classCode: "ABC" });
    expect(out.text).toBe("Class is doing well.");
    const stats = mockGenerateTeacherDoc.mock.calls[0][1];
    expect(stats).toMatch(/Asha: accuracy 80% over 40 questions/);
    expect(stats).toMatch(/weak: Trigonometry/);
  });

  test("parent note requires a student that exists in the class", async () => {
    setupClass();
    await expect(generateTeacherContent("t1", { kind: "parent_note", classCode: "ABC", studentName: "Nobody" }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  test("AI failure surfaces as 503, not a silent empty doc", async () => {
    setupClass();
    mockGenerateTeacherDoc.mockResolvedValue(null);
    await expect(generateTeacherContent("t1", { kind: "remedial_plan", classCode: "ABC" }))
      .rejects.toMatchObject({ statusCode: 503 });
  });
});

describe("getClassHeatmap", () => {
  test("students × topics grid; unattempted cells are null", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "teacher" }));
    mockGroupFindOne.mockReturnValue(chain({ _id: "g1", enrolledStudentIds: ["s1", "s2"] }));
    mockUserFind.mockReturnValue(chain([{ _id: "s1", name: "Asha" }, { _id: "s2", name: "Ravi" }]));
    mockProfileFind.mockReturnValue(chain([
      { userId: "s1", topicProgress: [
        { topic: "Algebra", accuracy: 0.9, attempts: 10 },
        { topic: "Trigonometry", accuracy: 0.3, attempts: 5 },
      ] },
      { userId: "s2", topicProgress: [{ topic: "Algebra", accuracy: 0.5, attempts: 4 }] },
    ]));

    const out = await getClassHeatmap("t1", "ABC");
    expect(out.topics[0]).toBe("Algebra"); // most-covered topic first
    const asha = out.rows.find((r) => r.name === "Asha");
    const ravi = out.rows.find((r) => r.name === "Ravi");
    expect(asha.cells[out.topics.indexOf("Algebra")]).toBe(90);
    expect(asha.cells[out.topics.indexOf("Trigonometry")]).toBe(30);
    expect(ravi.cells[out.topics.indexOf("Trigonometry")]).toBeNull(); // never attempted
  });

  test("non-teacher is rejected with 403", async () => {
    mockUserFindById.mockReturnValue(chain({ role: "student" }));
    await expect(getClassHeatmap("u1", "ABC")).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe("getAssignmentReport", () => {
  test("only the owning teacher can view the report", async () => {
    mockAssignmentFindById.mockReturnValue(chain({ _id: "a1", teacherId: "t1", questionIds: ["q1"], createdAt: new Date() }));
    await expect(getAssignmentReport("someone-else", "a1")).rejects.toMatchObject({ statusCode: 403 });
  });

  test("per-student completion rows", async () => {
    const createdAt = new Date(Date.now() - DAY);
    mockAssignmentFindById.mockReturnValue(chain({
      _id: "a1", teacherId: "t1", title: "HW", topic: "Algebra",
      questionIds: ["q1", "q2"], dueAt: new Date(), createdAt,
    }));
    mockGroupFindById.mockReturnValue(chain({ enrolledStudentIds: ["s1", "s2"] }));
    mockUserFind.mockReturnValue(chain([{ _id: "s1", name: "Asha" }, { _id: "s2", name: "Ravi" }]));
    mockAttemptFind.mockReturnValue(chain([
      { userId: "s1", questionId: "q1", isCorrect: true },
      { userId: "s1", questionId: "q2", isCorrect: true },
    ]));

    const out = await getAssignmentReport("t1", "a1");
    expect(out.completedCount).toBe(1);
    expect(out.students[0]).toMatchObject({ name: "Asha", completed: true, correct: 2 });
    expect(out.students[1]).toMatchObject({ name: "Ravi", completed: false, attempted: 0 });
  });
});
