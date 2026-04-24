import { jest } from "@jest/globals";

const mockGetCached    = jest.fn();
const mockSetCache     = jest.fn();
const mockGetAIExplanation = jest.fn();
const mockUserFindById = jest.fn();
const mockAIResponseCacheFindOne  = jest.fn();
const mockAIResponseCacheFAU      = jest.fn();
const mockAIUsageStatsFAU         = jest.fn();

jest.unstable_mockModule("../utils/cache.js", () => ({
  getCached: mockGetCached,
  setCache:  mockSetCache,
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { warn: jest.fn(), info: jest.fn() },
}));

jest.unstable_mockModule("../models/index.js", () => ({
  User:            { findById: mockUserFindById },
  AIResponseCache: { findOne: mockAIResponseCacheFindOne, findOneAndUpdate: mockAIResponseCacheFAU },
  AIUsageStats:    { findOneAndUpdate: mockAIUsageStatsFAU },
}));

jest.unstable_mockModule("../services/aiService.js", () => ({
  getAIExplanation: mockGetAIExplanation,
  getStudyAdvice:   jest.fn(),
}));

const { smartAIExplanation, checkAndIncrementUsage, getUsageCount } =
  await import("../services/aiRouter.js");

const today = () => new Date().toISOString().split("T")[0];
const userDoc = (overrides = {}) => ({
  isPaid: false, aiCallsToday: 0, aiCallsDate: today(),
  save: jest.fn().mockResolvedValue({}),
  ...overrides,
});
// checkAndIncrementUsage: findById().select() — no .lean()
const selectReturn = (doc) => ({ select: jest.fn().mockResolvedValue(doc) });
// getUsageCount: findById().select().lean()
const selectLeanReturn = (doc) => ({
  select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) }),
});

beforeEach(() => {
  // These are called fire-and-forget with .catch() — must return a Promise
  mockAIResponseCacheFAU.mockResolvedValue({});
  mockAIUsageStatsFAU.mockResolvedValue({});
  // AIResponseCache.findOne(...).lean() — needs chained mock
  mockAIResponseCacheFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
  mockGetCached.mockReturnValue(null);
});

afterEach(() => jest.clearAllMocks());

// ── smartAIExplanation ─────────────────────────────────────────────

describe("smartAIExplanation", () => {
  test("Layer 1 — correct answer → returns null, no AI call", async () => {
    const result = await smartAIExplanation("u1", "Q?", "correct", "A", []);
    expect(result).toBeNull();
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });

  test("Layer 2 — has solution steps → returns formatted steps, no AI call", async () => {
    const result = await smartAIExplanation("u1", "Q?", "concept_error", "A", ["Step 1", "Step 2"]);
    expect(result).toContain("1. Step 1");
    expect(result).toContain("2. Step 2");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });

  test("Layer 3 — static mistake type → returns static string, no AI call", async () => {
    const result = await smartAIExplanation("u1", "Q?", "calculation_error", "A", []);
    expect(result).toContain("arithmetic");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });

  // concept_error is not in STATIC_RESPONSES, so it reaches the cache layers
  test("Layer 4 — in-memory cache hit → returns cached, no AI call", async () => {
    mockGetCached.mockReturnValue("Cached explanation");
    const result = await smartAIExplanation("u1", "Novel concept Q?", "concept_error", "A", []);
    expect(result).toBe("Cached explanation");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });

  test("Layer 5 — DB cache hit → returns DB response, no AI call", async () => {
    mockGetCached.mockReturnValue(null);
    mockAIResponseCacheFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ response: "DB cached explanation" }) });
    const result = await smartAIExplanation("u1", "DB cached Q?", "concept_error", "A", []);
    expect(result).toBe("DB cached explanation");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });

  test("Layer 6 — user at daily limit → returns quota message, no AI call", async () => {
    mockGetCached.mockReturnValue(null);
    // DB cache miss — must also use chained mock
    mockAIResponseCacheFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    mockUserFindById.mockReturnValue(selectReturn(userDoc({ aiCallsToday: 10 })));
    const result = await smartAIExplanation("u1", "Rate limited Q?", "concept_error", "A", []);
    expect(result).toContain("free AI explanations");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });
});

// ── checkAndIncrementUsage ─────────────────────────────────────────

describe("checkAndIncrementUsage", () => {
  test("user not found → returns false", async () => {
    mockUserFindById.mockReturnValue(selectReturn(null));
    expect(await checkAndIncrementUsage("missing")).toBe(false);
  });

  test("free user at limit (10) → returns false, does not increment", async () => {
    mockUserFindById.mockReturnValue(selectReturn(userDoc({ aiCallsToday: 10 })));
    expect(await checkAndIncrementUsage("u1")).toBe(false);
  });

  test("free user under limit → increments counter and returns true", async () => {
    const doc = userDoc({ aiCallsToday: 5 });
    mockUserFindById.mockReturnValue(selectReturn(doc));
    const result = await checkAndIncrementUsage("u1");
    expect(result).toBe(true);
    expect(doc.aiCallsToday).toBe(6);
  });

  test("paid user at free limit (10) but under pro limit (100) → returns true", async () => {
    const doc = userDoc({ isPaid: true, aiCallsToday: 10 });
    mockUserFindById.mockReturnValue(selectReturn(doc));
    expect(await checkAndIncrementUsage("u1")).toBe(true);
  });

  test("new day → resets counter to 0 before incrementing", async () => {
    const doc = userDoc({ aiCallsToday: 10, aiCallsDate: "2000-01-01" });
    mockUserFindById.mockReturnValue(selectReturn(doc));
    const result = await checkAndIncrementUsage("u1");
    expect(result).toBe(true);
    expect(doc.aiCallsToday).toBe(1);
  });
});

// ── getUsageCount ──────────────────────────────────────────────────

describe("getUsageCount", () => {
  test("user not found → returns defaults (0 used, 10 limit)", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(null));
    const result = await getUsageCount("missing");
    expect(result).toEqual({ used: 0, limit: 10, remaining: 10 });
  });

  test("free user → limit 10, used and remaining correct", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(
      { isPaid: false, aiCallsToday: 4, aiCallsDate: today() }
    ));
    const result = await getUsageCount("u1");
    expect(result.limit).toBe(10);
    expect(result.used).toBe(4);
    expect(result.remaining).toBe(6);
  });

  test("paid user → limit 100", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(
      { isPaid: true, aiCallsToday: 20, aiCallsDate: today() }
    ));
    const result = await getUsageCount("u1");
    expect(result.limit).toBe(100);
    expect(result.remaining).toBe(80);
  });

  test("aiCallsDate is stale day → used reported as 0", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(
      { isPaid: false, aiCallsToday: 7, aiCallsDate: "2000-01-01" }
    ));
    const result = await getUsageCount("u1");
    expect(result.used).toBe(0);
    expect(result.remaining).toBe(10);
  });
});
