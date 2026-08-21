// Integration audit for the 2026-08-21/22 feature batch, against a REAL
// in-memory MongoDB — validates actual schema compatibility (field names,
// casting, defaults) that unit-level model mocks cannot catch:
//   - Mistake notebook derived from real Attempt docs (and self-clearing)
//   - Today-plan queue built from real Question/UserProfile docs
//   - Assignment lifecycle: create by join code → student progress → teacher report
//   - Offline pack round-trip: build with answer key → sync graded server-side
//   - Career path + scholarship tracking persisted on the real User doc
//
// Run: npm run test:integration -- newFeatures.integration

import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User, Question, Attempt, UserProfile, SchoolGroup } from "../../models/index.js";
import { getMistakes } from "../../services/mistakeService.js";
import { getTodayPlan } from "../../services/dailyBriefService.js";
import { createAssignment, getStudentAssignments, getAssignmentReport } from "../../services/schoolGroupV2Service.js";
import { buildOfflinePack, syncOfflineAttempts } from "../../services/offlinePackService.js";
import { setCareerPath, toggleScholarship, getCareerState } from "../../services/careerService.js";

beforeAll(connectTestDB, 120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

const mkUser = (overrides = {}) =>
  User.create({
    name: "Asha", email: `asha_${Date.now()}_${Math.random()}@t.in`, password: "hashed",
    role: "student", grade: "10", examBoard: "CBSE", ...overrides,
  });

const mkQuestion = (topic, overrides = {}) =>
  Question.create({
    topic,
    questionText: `A question about ${topic}`,
    questionType: "mcq",
    difficulty: "easy",
    options: [
      { text: "right", type: "correct" },
      { text: "wrong", type: "calculation_error" },
    ],
    solutionSteps: ["step 1", "step 2"],
    ...overrides,
  });

describe("mistake notebook (real Attempt docs)", () => {
  test("wrong attempt appears; a later correct attempt clears it", async () => {
    const user = await mkUser();
    const q = await mkQuestion("Algebra");
    await Attempt.create({
      userId: String(user._id), questionId: String(q._id), topic: "Algebra",
      isCorrect: false, selectedType: "calculation_error", timeTaken: 30,
    });

    let mistakes = await getMistakes(String(user._id));
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0]).toMatchObject({
      questionId: String(q._id),
      selectedAnswer: "wrong",
      correctAnswer: "right",
    });
    expect(mistakes[0].whyWrong).toMatch(/Calculation slip/);

    await Attempt.create({
      userId: String(user._id), questionId: String(q._id), topic: "Algebra",
      isCorrect: true, selectedType: "correct", timeTaken: 20,
      createdAt: new Date(Date.now() + 1000),
    });
    mistakes = await getMistakes(String(user._id));
    expect(mistakes).toHaveLength(0);
  });
});

describe("today plan (real Question/UserProfile docs)", () => {
  test("queue contains playable question ids from the weakest topics", async () => {
    const user = await mkUser();
    await mkQuestion("Trigonometry");
    await mkQuestion("Polynomials");
    await UserProfile.create({
      userId: String(user._id),
      topicProgress: [
        { topic: "Trigonometry", accuracy: 0.2, attempts: 5, lastAttempted: new Date() },
        { topic: "Polynomials", accuracy: 0.5, attempts: 4, lastAttempted: new Date() },
      ],
    });

    const plan = await getTodayPlan(String(user._id));
    expect(plan.queue.length).toBeGreaterThanOrEqual(2);
    expect(plan.queue.every((s) => /^[a-f\d]{24}$/i.test(s.questionId))).toBe(true);
    expect(plan.queue.map((s) => s.topic)).toContain("Trigonometry");
    expect(plan.streak).toBeDefined();
  });
});

describe("assignment lifecycle (real Assignment/SchoolGroup docs)", () => {
  test("create by join code → student progress from attempts → teacher report", async () => {
    const teacher = await mkUser({ role: "teacher", name: "Mrs. Iyer" });
    const student = await mkUser({ name: "Ravi" });
    await SchoolGroup.create({
      schoolName: "DPS", createdBy: String(teacher._id),
      joinCode: "DPS10B", enrolledStudentIds: [String(student._id)],
    });
    const q = await mkQuestion("Algebra");

    const created = await createAssignment(String(teacher._id), {
      classCode: "dps10b", // case-insensitive
      topic: "Algebra",
      dueAt: new Date(Date.now() + 86400000),
    });
    expect(created.total).toBe(1);

    // Before attempting: 0 progress
    const group = await SchoolGroup.findOne({ joinCode: "DPS10B" }).lean();
    let [a] = await getStudentAssignments(String(student._id), String(group._id));
    expect(a).toMatchObject({ attempted: 0, completed: false, title: "Algebra practice" });

    // Student answers the assigned question correctly
    await Attempt.create({
      userId: String(student._id), questionId: String(q._id), topic: "Algebra",
      isCorrect: true, selectedType: "correct", timeTaken: 25,
      createdAt: new Date(Date.now() + 1000),
    });
    [a] = await getStudentAssignments(String(student._id), String(group._id));
    expect(a).toMatchObject({ attempted: 1, correct: 1, completed: true });

    const report = await getAssignmentReport(String(teacher._id), created.id);
    expect(report.completedCount).toBe(1);
    expect(report.students[0]).toMatchObject({ name: "Ravi", completed: true });
  });
});

describe("offline pack round-trip (real docs)", () => {
  test("pack carries the answer key; sync grades server-side into real Attempts", async () => {
    const user = await mkUser();
    const q = await mkQuestion("Trigonometry");
    await UserProfile.create({
      userId: String(user._id),
      topicProgress: [{ topic: "Trigonometry", accuracy: 0.3, attempts: 3 }],
    });

    const pack = await buildOfflinePack(String(user._id));
    expect(pack.questions).toHaveLength(1);
    expect(pack.questions[0]).toMatchObject({
      id: String(q._id), correctIndex: 0, solution: "step 1\nstep 2",
    });

    const result = await syncOfflineAttempts(String(user._id), [
      { questionId: String(q._id), selectedOptionIndex: 1, timeTaken: 40 }, // wrong option
    ]);
    expect(result).toEqual({ synced: 1, skipped: 0 });

    const saved = await Attempt.findOne({ userId: String(user._id) }).lean();
    expect(saved).toMatchObject({ isCorrect: false, selectedType: "calculation_error", topic: "Trigonometry" });

    // ...and the synced wrong answer now shows up in the mistake notebook
    const mistakes = await getMistakes(String(user._id));
    expect(mistakes).toHaveLength(1);
  });
});

describe("career path + scholarships (real User doc)", () => {
  test("path and tracked scholarships persist and round-trip", async () => {
    const user = await mkUser({ grade: "10" });
    await setCareerPath(String(user._id), "engineering_iit");
    await toggleScholarship(String(user._id), "imo_ioqm");

    const state = await getCareerState(String(user._id));
    expect(state.careerPath).toBe("engineering_iit");
    expect(state.scholarships.find((s) => s.id === "imo_ioqm")?.tracked).toBe(true);
    // grade filter live against the real doc: grade-8-only NMMS hidden for Class 10
    expect(state.scholarships.find((s) => s.id === "nmms")).toBeUndefined();

    await toggleScholarship(String(user._id), "imo_ioqm"); // untrack
    const after = await getCareerState(String(user._id));
    expect(after.scholarships.find((s) => s.id === "imo_ioqm")?.tracked).toBe(false);
  });
});
