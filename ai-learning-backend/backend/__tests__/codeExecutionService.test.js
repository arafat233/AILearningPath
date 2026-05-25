// Unit tests for services/codeExecutionService.js — wrapper around the
// local Judge0 sandbox. Mocks global fetch + redisClient.incrBy so the
// suite runs without Docker / Redis.

import { jest, describe, test, expect, beforeEach, afterEach } from "@jest/globals";

const mockIncrBy = jest.fn();
jest.unstable_mockModule("../utils/redisClient.js", () => ({
  incrBy: mockIncrBy,
  sessionGet: jest.fn(),
  sessionSet: jest.fn(),
  sessionDel: jest.fn(),
}));

const { runCode, runTestCases, __test__ } =
  await import("../services/codeExecutionService.js");

const ok = (body) => ({ ok: true,  status: 200, json: () => Promise.resolve(body) });

beforeEach(() => {
  jest.clearAllMocks();
  // 1 = first call this hour/day — well under rate limit.
  mockIncrBy.mockResolvedValue(1);
  global.fetch = jest.fn();
});

afterEach(() => { delete global.fetch; });

describe("LANGUAGE_IDS map", () => {
  test("java → 62", () => expect(__test__.LANGUAGE_IDS.java).toBe(62));
});

describe("truncate", () => {
  test("strings under cap pass through unchanged", () => {
    expect(__test__.truncate("hello")).toBe("hello");
  });
  test("strings over 8KB get a [truncated] marker", () => {
    const big = "x".repeat(9000);
    const out = __test__.truncate(big);
    expect(out.length).toBeLessThanOrEqual(8192 + 50);
    expect(out).toMatch(/\[truncated\]$/);
  });
});

describe("runCode", () => {
  test("happy path → normalised result", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout:  "Hello, World!\n",
      stderr:  null,
      compile_output: null,
      exit_code: 0,
      time:    "0.150",
      memory:  4096,
      status:  { id: 3, description: "Accepted" },
    }));
    const result = await runCode({ userId: "u1", source: "...", language: "java" });
    expect(result.stdout).toBe("Hello, World!\n");
    expect(result.exitCode).toBe(0);
    expect(result.timeMs).toBe(150);
    expect(result.memoryKb).toBe(4096);
    expect(result.status).toBe("Accepted");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/submissions?base64_encoded=false&wait=true"),
      expect.objectContaining({ method: "POST" })
    );
  });

  test("network error → 503", async () => {
    global.fetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    await expect(runCode({ userId: "u1", source: "x", language: "java" }))
      .rejects.toMatchObject({ statusCode: 503 });
  });

  test("non-2xx response → 502", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) });
    await expect(runCode({ userId: "u1", source: "x", language: "java" }))
      .rejects.toMatchObject({ statusCode: 502 });
  });

  test("unsupported language → 400", async () => {
    await expect(runCode({ userId: "u1", source: "x", language: "rust" }))
      .rejects.toMatchObject({ statusCode: 400 });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("missing source → 400", async () => {
    await expect(runCode({ userId: "u1", source: "", language: "java" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("hourly rate limit exceeded → 429", async () => {
    // First incr (hour) returns 31 > 30 cap
    mockIncrBy.mockResolvedValueOnce(31).mockResolvedValueOnce(1);
    await expect(runCode({ userId: "u1", source: "x", language: "java" }))
      .rejects.toMatchObject({ statusCode: 429, message: expect.stringMatching(/hourly/i) });
  });

  test("daily rate limit exceeded → 429", async () => {
    // Hour ok (1), day blown (101 > 100)
    mockIncrBy.mockResolvedValueOnce(1).mockResolvedValueOnce(101);
    await expect(runCode({ userId: "u1", source: "x", language: "java" }))
      .rejects.toMatchObject({ statusCode: 429, message: expect.stringMatching(/daily/i) });
  });
});

describe("runTestCases", () => {
  test("must_contain — substring present → pass; absent → fail", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout: "anything", stderr: null, exit_code: 0, time: "0.1", memory: 1024,
      status: { id: 3, description: "Accepted" },
    }));
    const { testResults, passed } = await runTestCases({
      userId: "u1",
      source: "public class Greeting { ... }",
      language: "java",
      testCases: [
        { id: "c1", type: "must_contain", value: "public class Greeting" },
        { id: "c2", type: "must_contain", value: "private static void main" },
      ],
    });
    expect(testResults[0]).toMatchObject({ caseId: "c1", passed: true });
    expect(testResults[1]).toMatchObject({ caseId: "c2", passed: false });
    expect(passed).toBe(false);
  });

  test("must_compile pass when stderr clean", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout: "ok", stderr: "", compile_output: "", exit_code: 0, time: "0.1", memory: 1024,
      status: { id: 3, description: "Accepted" },
    }));
    const { testResults } = await runTestCases({
      userId: "u1", source: "x", language: "java",
      testCases: [{ id: "c1", type: "must_compile" }],
    });
    expect(testResults[0].passed).toBe(true);
  });

  test("must_compile fail when compile_output mentions 'compilation error'", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout: "", stderr: null, compile_output: "Main.java:1: error: compilation error",
      exit_code: 1, time: "0.1", memory: 0,
      status: { id: 6, description: "Compilation Error" },
    }));
    const { testResults } = await runTestCases({
      userId: "u1", source: "x", language: "java",
      testCases: [{ id: "c1", type: "must_compile" }],
    });
    expect(testResults[0].passed).toBe(false);
  });

  test("stdout_equals / stdout_contains", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout: "Hello, World!\n", stderr: null, exit_code: 0, time: "0.1", memory: 1024,
      status: { id: 3, description: "Accepted" },
    }));
    const { testResults, passed } = await runTestCases({
      userId: "u1", source: "x", language: "java",
      testCases: [
        { id: "eq",  type: "stdout_equals",   value: "Hello, World!" },
        { id: "ctn", type: "stdout_contains", value: "World" },
      ],
    });
    expect(testResults.map((c) => c.passed)).toEqual([true, true]);
    expect(passed).toBe(true);
  });

  test("unknown test type → caseId returned with passed:false", async () => {
    global.fetch.mockResolvedValueOnce(ok({
      stdout: "ok", stderr: null, exit_code: 0, time: "0.1", memory: 1024,
      status: { id: 3, description: "Accepted" },
    }));
    const { testResults, passed } = await runTestCases({
      userId: "u1", source: "x", language: "java",
      testCases: [{ id: "weird", type: "ast_check", value: "..." }],
    });
    expect(testResults[0]).toMatchObject({ caseId: "weird", passed: false });
    expect(passed).toBe(false);
  });
});
