/**
 * Unit tests for services/interviewService.js
 * Mocks: @anthropic-ai/sdk, redisClient, ProInterviewSession
 */
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

const mockIncrBy = jest.fn().mockResolvedValue(1);
jest.unstable_mockModule("../utils/redisClient.js", () => ({
  incrBy: mockIncrBy,
  sessionGet: jest.fn(), sessionSet: jest.fn(),
}));

const mockCreate = jest.fn();
jest.unstable_mockModule("@anthropic-ai/sdk", () => ({
  default: class { messages = { create: mockCreate }; },
}));

const mockSessionCreate = jest.fn();
const mockFindOne       = jest.fn();
const mockSave          = jest.fn();

jest.unstable_mockModule("../models/proModels.js", () => ({
  ProInterviewSession: {
    create:  mockSessionCreate,
    findOne: mockFindOne,
  },
  ProTutorSession: { findOne: jest.fn() },
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
}));

const { listProblems, getProblem, sendMessage, endSession } =
  await import("../services/interviewService.js");

// ── Helpers ───────────────────────────────────────────────────────────────────

function fakeSession(overrides = {}) {
  return {
    _id: "sess1", userId: "u1", problemId: "prob_001", status: "active",
    startedAt: new Date(), transcript: [],
    save: mockSave, toObject() { return { ...this }; },
    ...overrides,
  };
}

const goodReply = { content: [{ text: "What edge cases have you considered?" }] };

beforeEach(() => {
  jest.clearAllMocks();
  mockIncrBy.mockResolvedValue(1);
  mockSave.mockResolvedValue(undefined);
  mockCreate.mockResolvedValue(goodReply);
});

// ── Problem bank ──────────────────────────────────────────────────────────────

describe("listProblems()", () => {
  test("returns 25 problems by default", () => {
    expect(listProblems()).toHaveLength(25);
  });

  test("filters by difficulty", () => {
    const easy = listProblems({ difficulty: "easy" });
    expect(easy.every(p => p.difficulty === "easy")).toBe(true);
    expect(easy.length).toBeGreaterThan(0);
  });

  test("filters by topic", () => {
    const trees = listProblems({ topic: "trees" });
    expect(trees.every(p => p.topic === "trees")).toBe(true);
    expect(trees).toHaveLength(5);
  });

  test("does not expose followUps to client", () => {
    const problems = listProblems();
    expect(problems.every(p => !("followUps" in p))).toBe(true);
  });
});

describe("getProblem()", () => {
  test("returns problem by ID", () => {
    const p = getProblem("prob_001");
    expect(p.id).toBe("prob_001");
    expect(p.title).toBeTruthy();
  });

  test("throws 404 for unknown ID", () => {
    expect(() => getProblem("prob_999")).toThrow(expect.objectContaining({ statusCode: 404 }));
  });
});

// ── sendMessage ───────────────────────────────────────────────────────────────

describe("sendMessage()", () => {
  test("rejects when session is ended", async () => {
    mockFindOne.mockResolvedValue(fakeSession({ status: "ended" }));
    await expect(sendMessage({ userId: "u1", sessionId: "s1", content: "hi" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("rejects when session not found", async () => {
    mockFindOne.mockResolvedValue(null);
    await expect(sendMessage({ userId: "u1", sessionId: "bad", content: "hi" }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  test("appends user + interviewer messages and saves", async () => {
    const session = fakeSession();
    mockFindOne.mockResolvedValue(session);
    const result = await sendMessage({ userId: "u1", sessionId: "s1", content: "My approach is..." });
    expect(session.transcript).toHaveLength(2);
    expect(session.transcript[0].role).toBe("user");
    expect(session.transcript[1].role).toBe("interviewer");
    expect(mockSave).toHaveBeenCalled();
    expect(result.reply).toContain("edge cases");
  });

  test("silence probe does NOT add user message", async () => {
    const session = fakeSession();
    mockFindOne.mockResolvedValue(session);
    await sendMessage({ userId: "u1", sessionId: "s1", content: "", silenceProbe: true });
    expect(session.transcript).toHaveLength(1); // only interviewer
    expect(session.transcript[0].role).toBe("interviewer");
  });

  test("throws 503 when Claude fails", async () => {
    mockFindOne.mockResolvedValue(fakeSession());
    mockCreate.mockRejectedValue(new Error("API down"));
    await expect(sendMessage({ userId: "u1", sessionId: "s1", content: "hello" }))
      .rejects.toMatchObject({ statusCode: 503 });
  });

  test("rejects when message cap reached", async () => {
    const session = fakeSession({ transcript: Array(40).fill({ role: "user", content: "x" }) });
    mockFindOne.mockResolvedValue(session);
    await expect(sendMessage({ userId: "u1", sessionId: "s1", content: "hi" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });
});

// ── endSession ────────────────────────────────────────────────────────────────

describe("endSession()", () => {
  test("returns existing result when already ended", async () => {
    const session = fakeSession({ status: "ended", rubric: { overall: 3.5 } });
    mockFindOne.mockResolvedValue(session);
    const result = await endSession({ userId: "u1", sessionId: "s1" });
    expect(result.problem).toBeTruthy(); // sanitized problem attached
    expect(mockCreate).not.toHaveBeenCalled(); // no extra Claude call
  });

  test("calls Claude for rubric and marks session ended", async () => {
    const session = fakeSession({ transcript: [{ role: "user", content: "Two pointers" }] });
    mockFindOne.mockResolvedValue(session);
    // Claude returns valid JSON rubric
    mockCreate.mockResolvedValue({ content: [{ text: JSON.stringify({
      scores: { clarifying_questions: 3, approach_communication: 4, code_quality: 3, complexity_awareness: 2, curveball_handling: 3 },
      strengths: ["Good approach"], improvements: ["Mention complexity"], summary: "Solid attempt.",
    }) }] });
    const result = await endSession({ userId: "u1", sessionId: "s1", code: "int[] two = {};", scratchpad: "" });
    expect(session.status).toBe("ended");
    expect(session.rubric).toBeTruthy();
    expect(session.rubric.overall).toBeCloseTo(3, 0);
    expect(mockSave).toHaveBeenCalled();
    expect(result.problem).toBeTruthy();
  });

  test("session ends even when rubric Claude call fails", async () => {
    const session = fakeSession();
    mockFindOne.mockResolvedValue(session);
    mockCreate.mockRejectedValue(new Error("Claude down"));
    const result = await endSession({ userId: "u1", sessionId: "s1" });
    expect(session.status).toBe("ended");
    expect(session.rubric).toBeNull();
    expect(result.problem).toBeTruthy();
  });
});
