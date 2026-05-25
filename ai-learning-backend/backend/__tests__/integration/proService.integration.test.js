// Integration tests for services/proService.js — real in-memory Mongo,
// codeExecutionService mocked. Covers track listing, scoping by enrolment,
// exercise submission with progress updates, and enrol/idempotency.

import { jest, beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";

// Mock the sandbox so submitExercise doesn't try to reach Judge0.
const mockRunTestCases = jest.fn();
jest.unstable_mockModule("../../services/codeExecutionService.js", () => ({
  runCode: jest.fn(),
  runTestCases: mockRunTestCases,
}));

const { connectTestDB, disconnectTestDB, clearCollections } = await import("./_setup.js");

// IMPORTANT: proService must be imported AFTER the mock above is registered.
const svc       = await import("../../services/proService.js");
const { User }  = await import("../../models/index.js");
const {
  ProTrack, ProModule, ProTopic, ProExercise, ProProgress, ProSubmission,
} = await import("../../models/proModels.js");

beforeAll(connectTestDB, 120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(async () => {
  await clearCollections();
  mockRunTestCases.mockReset();
});

// ── fixture helpers ─────────────────────────────────────────────────────────
async function makeTrack(overrides = {}) {
  return ProTrack.create({
    key: "pro_java", slug: "java", name: "Java", language: "java",
    status: "live", ...overrides,
  });
}
async function makeModule(overrides = {}) {
  return ProModule.create({
    trackKey: "pro_java", moduleId: "java_m1", moduleNumber: 1,
    name: "Fundamentals", status: "live", ...overrides,
  });
}
async function makeTopic(overrides = {}) {
  return ProTopic.create({
    trackKey: "pro_java", moduleId: "java_m1",
    topicId: "java_m1_t1", topicNumber: 1, name: "Hello World", ...overrides,
  });
}
async function makeExercise(overrides = {}) {
  return ProExercise.create({
    trackKey: "pro_java", moduleId: "java_m1", topicId: "java_m1_t1",
    exerciseId: "java_m1_t1_ex_1", level: "warmup", type: "free_code",
    expectedSolution: "secret",
    testCases: [{ id: "c1", type: "must_contain", value: "Hello" }],
    xpReward: 10,
    ...overrides,
  });
}
async function makeUser({ enrolled = true } = {}) {
  return User.create({
    name: "T", email: `t-${Math.random()}@x`, password: "h",
    role: "student",
    tracks: enrolled ? [{ key: "pro_java", role: "learner", enrolledAt: new Date() }] : [],
  });
}

// ── Tracks ──────────────────────────────────────────────────────────────────
describe("listTracks", () => {
  test("returns only live tracks; marks enrolled flag per the caller", async () => {
    await makeTrack();
    await makeTrack({ key: "pro_python", slug: "python", name: "Python", status: "draft" });
    const u = await makeUser({ enrolled: true });
    const list = await svc.listTracks(u._id.toString());
    expect(list).toHaveLength(1); // only the live one
    expect(list[0]).toMatchObject({ key: "pro_java", enrolled: true });
  });
});

// ── getTrack ────────────────────────────────────────────────────────────────
describe("getTrack", () => {
  test("404 if slug missing", async () => {
    const u = await makeUser();
    await expect(svc.getTrack("nope", u._id.toString())).rejects.toMatchObject({ statusCode: 404 });
  });

  test("403 if not enrolled", async () => {
    await makeTrack();
    const u = await makeUser({ enrolled: false });
    await expect(svc.getTrack("java", u._id.toString())).rejects.toMatchObject({ statusCode: 403 });
  });

  test("returns track + module list when enrolled", async () => {
    await makeTrack();
    await makeModule();
    const u = await makeUser();
    const out = await svc.getTrack("java", u._id.toString());
    expect(out.key).toBe("pro_java");
    expect(out.modules).toHaveLength(1);
    expect(out.modules[0].moduleId).toBe("java_m1");
  });
});

// ── getExercise — must NOT leak expectedSolution / testCases ───────────────
describe("getExercise", () => {
  test("strips expectedSolution + testCases from response", async () => {
    await makeTrack();
    await makeExercise();
    const u = await makeUser();
    const ex = await svc.getExercise("java_m1_t1_ex_1", u._id.toString());
    expect(ex).not.toHaveProperty("expectedSolution");
    expect(ex).not.toHaveProperty("testCases");
    expect(ex.exerciseId).toBe("java_m1_t1_ex_1");
  });
});

// ── submitExercise — the meat of the test suite ────────────────────────────
describe("submitExercise", () => {
  beforeEach(async () => {
    await makeTrack();
    await makeExercise();
  });

  test("400 when code is empty", async () => {
    const u = await makeUser();
    await expect(svc.submitExercise({ userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("413 when code is too large", async () => {
    const u = await makeUser();
    await expect(svc.submitExercise({ userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "x".repeat(50_001) }))
      .rejects.toMatchObject({ statusCode: 413 });
  });

  test("403 when caller not enrolled in track", async () => {
    const u = await makeUser({ enrolled: false });
    await expect(svc.submitExercise({ userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "anything" }))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  test("passing submission updates ProProgress with XP", async () => {
    mockRunTestCases.mockResolvedValueOnce({
      sandboxResult: { stdout: "Hello, World!", stderr: "", exitCode: 0, timeMs: 50, memoryKb: 1024, status: "Accepted" },
      testResults:   [{ caseId: "c1", passed: true, message: "" }],
      passed: true,
    });
    const u = await makeUser();
    const { passed, xpAwarded } = await svc.submitExercise({
      userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "Hello",
    });
    expect(passed).toBe(true);
    expect(xpAwarded).toBe(10);

    const prog = await ProProgress.findOne({ userId: u._id.toString(), trackKey: "pro_java" }).lean();
    expect(prog.completedExercises).toContain("java_m1_t1_ex_1");
    expect(prog.totalXp).toBe(10);

    // ProSubmission written
    const sub = await ProSubmission.findOne({ userId: u._id.toString() }).lean();
    expect(sub).toBeTruthy();
    expect(sub.passed).toBe(true);
  });

  test("re-submitting a passing exercise does NOT double-count XP", async () => {
    mockRunTestCases.mockResolvedValue({
      sandboxResult: { stdout: "Hello!", stderr: "", exitCode: 0, timeMs: 50, memoryKb: 1024, status: "Accepted" },
      testResults:   [{ caseId: "c1", passed: true, message: "" }],
      passed: true,
    });
    const u = await makeUser();
    await svc.submitExercise({ userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "first" });
    await svc.submitExercise({ userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "second" });
    const prog = await ProProgress.findOne({ userId: u._id.toString(), trackKey: "pro_java" }).lean();
    // $addToSet keeps the exercise once; totalXp += 10 each time though.
    expect(prog.completedExercises).toHaveLength(1);
    expect(prog.totalXp).toBe(20); // two passes, +10 each — documented behaviour
  });

  test("failing submission records ProSubmission but does NOT update ProProgress", async () => {
    mockRunTestCases.mockResolvedValueOnce({
      sandboxResult: { stdout: "", stderr: "syntax error", exitCode: 1, timeMs: 30, memoryKb: 512, status: "Compilation Error" },
      testResults:   [{ caseId: "c1", passed: false, message: "syntax error" }],
      passed: false,
    });
    const u = await makeUser();
    const { passed, xpAwarded } = await svc.submitExercise({
      userId: u._id.toString(), exerciseId: "java_m1_t1_ex_1", code: "broken",
    });
    expect(passed).toBe(false);
    expect(xpAwarded).toBe(0);
    const prog = await ProProgress.findOne({ userId: u._id.toString(), trackKey: "pro_java" }).lean();
    expect(prog).toBeNull();
    const sub = await ProSubmission.findOne({ userId: u._id.toString() }).lean();
    expect(sub.passed).toBe(false);
  });
});

// ── Enrol ───────────────────────────────────────────────────────────────────
describe("enroll", () => {
  test("404 when trackKey doesn't exist", async () => {
    const u = await makeUser({ enrolled: false });
    await expect(svc.enroll(u._id.toString(), "pro_nonexistent")).rejects.toMatchObject({ statusCode: 404 });
  });

  test("idempotent: enrolling again is alreadyEnrolled:true with no User mutation", async () => {
    await makeTrack();
    const u = await makeUser({ enrolled: true });
    const result = await svc.enroll(u._id.toString(), "pro_java");
    expect(result.alreadyEnrolled).toBe(true);
    const after = await User.findById(u._id).lean();
    expect(after.tracks).toHaveLength(1); // still just one entry
  });

  test("new enrolment pushes to User.tracks AND creates a ProProgress doc", async () => {
    await makeTrack();
    const u = await makeUser({ enrolled: false });
    const result = await svc.enroll(u._id.toString(), "pro_java");
    expect(result.alreadyEnrolled).toBe(false);
    const after = await User.findById(u._id).lean();
    expect(after.tracks.map((t) => t.key)).toContain("pro_java");
    const prog = await ProProgress.findOne({ userId: u._id.toString(), trackKey: "pro_java" }).lean();
    expect(prog).toBeTruthy();
  });
});
