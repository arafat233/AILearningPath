// Integration tests for pro-track polymorphic bookmarks against a real
// in-memory DB. Covers exercise + topic + project kinds.
import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";
import { ProExercise, ProTopic, ProProject, ProBookmark } from "../../models/proModels.js";
import { toggleBookmark, listBookmarks, isBookmarked } from "../../services/proService.js";

beforeAll(connectTestDB,  120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

async function makeEnrolledUser() {
  return User.create({
    name: "Bo", email: "b@test", password: "h",
    tracks: [{ key: "pro_java", role: "learner" }],
    activeTrack: "pro_java",
  });
}
async function makeExercise(exerciseId = "java_m1_t1_ex_1") {
  return ProExercise.create({
    exerciseId, trackKey: "pro_java",
    moduleId: "java_m1", topicId: "java_m1_t1",
    title: "Hello World", type: "code", level: "easy",
    difficulty: 0.3, xpReward: 10, starterCode: "", testCases: [],
  });
}
async function makeTopic(topicId = "java_m1_t1") {
  return ProTopic.create({
    topicId, trackKey: "pro_java",
    moduleId: "java_m1", topicNumber: 1,
    name: "Hello World", slug: "hello-world",
    teaching: {}, commonGaps: [], industryApplications: {}, interviewRelevance: {}, hook: {},
  });
}
async function makeProject(projectId = "java_m1_t1_pr_1") {
  return ProProject.create({
    projectId, trackKey: "pro_java",
    moduleId: "java_m1", topicId: "java_m1_t1",
    name: "Mini bank", scenario: "", description: "", requirements: [],
  });
}

describe("ProBookmark — exercise kind", () => {
  test("toggle adds/removes; isBookmarked reflects state", async () => {
    const u = await makeEnrolledUser();
    await makeExercise();
    const id = String(u._id);

    expect(await isBookmarked(id, "exercise", "java_m1_t1_ex_1")).toBe(false);

    let r = await toggleBookmark(id, "exercise", "java_m1_t1_ex_1");
    expect(r).toEqual({ bookmarked: true });
    expect(await isBookmarked(id, "exercise", "java_m1_t1_ex_1")).toBe(true);

    r = await toggleBookmark(id, "exercise", "java_m1_t1_ex_1");
    expect(r).toEqual({ bookmarked: false });
  });

  test("rejects when user is not enrolled in the exercise's track", async () => {
    const u = await User.create({ name: "Cleo", email: "c@test", password: "h" });
    await makeExercise();
    await expect(toggleBookmark(String(u._id), "exercise", "java_m1_t1_ex_1"))
      .rejects.toThrow(/not enrolled/i);
  });

  test("rejects when exercise doesn't exist", async () => {
    const u = await makeEnrolledUser();
    await expect(toggleBookmark(String(u._id), "exercise", "ghost_ex"))
      .rejects.toThrow(/not found/i);
  });
});

describe("ProBookmark — topic kind", () => {
  test("toggle adds/removes a topic bookmark", async () => {
    const u = await makeEnrolledUser();
    await makeTopic();
    const id = String(u._id);

    let r = await toggleBookmark(id, "topic", "java_m1_t1");
    expect(r).toEqual({ bookmarked: true });
    expect(await isBookmarked(id, "topic", "java_m1_t1")).toBe(true);

    r = await toggleBookmark(id, "topic", "java_m1_t1");
    expect(r).toEqual({ bookmarked: false });
  });

  test("rejects when topic doesn't exist", async () => {
    const u = await makeEnrolledUser();
    await expect(toggleBookmark(String(u._id), "topic", "ghost_topic"))
      .rejects.toThrow(/not found/i);
  });
});

describe("ProBookmark — project kind", () => {
  test("toggle adds/removes a project bookmark", async () => {
    const u = await makeEnrolledUser();
    await makeProject();
    const id = String(u._id);

    let r = await toggleBookmark(id, "project", "java_m1_t1_pr_1");
    expect(r).toEqual({ bookmarked: true });

    r = await toggleBookmark(id, "project", "java_m1_t1_pr_1");
    expect(r).toEqual({ bookmarked: false });
  });
});

describe("ProBookmark — listBookmarks (polymorphic join)", () => {
  test("returns all kinds, sorted newest first, with joined metadata", async () => {
    const u = await makeEnrolledUser();
    await makeExercise();
    await makeTopic();
    await makeProject();
    const id = String(u._id);

    await toggleBookmark(id, "exercise", "java_m1_t1_ex_1");
    await new Promise((r) => setTimeout(r, 5));
    await toggleBookmark(id, "topic", "java_m1_t1");
    await new Promise((r) => setTimeout(r, 5));
    await toggleBookmark(id, "project", "java_m1_t1_pr_1");

    const list = await listBookmarks(id, "pro_java");
    expect(list.length).toBe(3);
    expect(list[0].kind).toBe("project");      // newest first
    expect(list[1].kind).toBe("topic");
    expect(list[2].kind).toBe("exercise");

    // Each row carries joined metadata appropriate to its kind.
    const ex = list.find((r) => r.kind === "exercise");
    expect(ex.title).toBe("Hello World");
    expect(ex.level).toBe("easy");
    expect(ex.xpReward).toBe(10);

    const top = list.find((r) => r.kind === "topic");
    expect(top.title).toBe("Hello World");
    expect(top.moduleId).toBe("java_m1");

    const pr = list.find((r) => r.kind === "project");
    expect(pr.title).toBe("Mini bank");
  });
});

describe("ProBookmark — unknown kind + uniqueness", () => {
  test("rejects an unknown kind", async () => {
    const u = await makeEnrolledUser();
    await expect(toggleBookmark(String(u._id), "module", "x"))
      .rejects.toThrow(/unknown bookmark kind/i);
  });

  test("duplicate insert is prevented by the (userId, kind, refId) unique index", async () => {
    const u = await makeEnrolledUser();
    await makeExercise();
    const id = String(u._id);
    await ProBookmark.create({ userId: id, trackKey: "pro_java", kind: "exercise", refId: "java_m1_t1_ex_1" });
    await expect(
      ProBookmark.create({ userId: id, trackKey: "pro_java", kind: "exercise", refId: "java_m1_t1_ex_1" })
    ).rejects.toThrow(/duplicate|E11000/i);
  });
});
