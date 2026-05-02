import { jest } from "@jest/globals";

const mockGetCached    = jest.fn();
const mockSetCache     = jest.fn();
const mockGetAIExplanation = jest.fn();
const mockUserFindById = jest.fn();
const mockUserFindOneAndUpdate = jest.fn();
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
  User:            { findById: mockUserFindById, findOneAndUpdate: mockUserFindOneAndUpdate },
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
  plan: "free",
  ...overrides,
});
// Both checkAndIncrementUsage and getUsageCount use findById().select().lean()
const selectLeanReturn = (doc) => ({
  select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) }),
});
// Keep old name for backwards compat in smartAIExplanation tests
const selectReturn = selectLeanReturn;

beforeEach(() => {
  mockAIResponseCacheFAU.mockResolvedValue({});
  mockAIUsageStatsFAU.mockResolvedValue({});
  mockAIResponseCacheFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
  mockGetCached.mockReturnValue(null);
  // Default: user under limit — findById returns doc, findOneAndUpdate returns updated doc
  mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ aiCallsToday: 0 })));
  mockUserFindOneAndUpdate.mockResolvedValue({ aiCallsToday: 1 });
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
    mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ aiCallsToday: 10 })));
    mockUserFindOneAndUpdate.mockResolvedValue(null); // atomic update condition not met
    const result = await smartAIExplanation("u1", "Rate limited Q?", "concept_error", "A", []);
    expect(result).toContain("daily AI explanation limit");
    expect(mockGetAIExplanation).not.toHaveBeenCalled();
  });
});

// ── checkAndIncrementUsage ─────────────────────────────────────────

describe("checkAndIncrementUsage", () => {
  beforeEach(() => {
    // Default: atomic findOneAndUpdate succeeds (returns a doc)
    mockUserFindOneAndUpdate.mockResolvedValue({ aiCallsToday: 1 });
  });

  test("user not found (findById returns null) → returns false", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(null));
    expect(await checkAndIncrementUsage("missing")).toBe(false);
  });

  test("free user at limit (10) → findOneAndUpdate returns null → returns false", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ aiCallsToday: 10 })));
    mockUserFindOneAndUpdate.mockResolvedValue(null); // condition not met → null
    expect(await checkAndIncrementUsage("u1")).toBe(false);
  });

  test("free user under limit → findOneAndUpdate returns updated doc → returns true", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ aiCallsToday: 5 })));
    mockUserFindOneAndUpdate.mockResolvedValue({ aiCallsToday: 6 });
    expect(await checkAndIncrementUsage("u1")).toBe(true);
  });

  test("paid pro user at free limit (10) but under pro limit (100) → returns true", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ isPaid: true, plan: "pro", aiCallsToday: 10 })));
    mockUserFindOneAndUpdate.mockResolvedValue({ aiCallsToday: 11 });
    expect(await checkAndIncrementUsage("u1")).toBe(true);
  });

  test("new day → atomic update resets and increments → returns true", async () => {
    mockUserFindById.mockReturnValue(selectLeanReturn(userDoc({ aiCallsToday: 10, aiCallsDate: "2000-01-01" })));
    mockUserFindOneAndUpdate.mockResolvedValue({ aiCallsToday: 1 });
    expect(await checkAndIncrementUsage("u1")).toBe(true);
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

// ── checkAndIncrementUsage — concurrency simulation ───────────────
// The atomic $cond findOneAndUpdate fix must prevent over-counting when
// multiple requests race. These tests simulate MongoDB's serial write
// processing with a stateful mock: the closure counter only advances
// while below the limit, so concurrent JS calls cannot sneak extra
// increments through regardless of scheduling order.

describe("checkAndIncrementUsage — concurrency simulation", () => {
  test("15 concurrent free-user calls at 0/10 → exactly 10 succeed, 5 rejected", async () => {
    let atomicCount = 0;
    const LIMIT = 10;

    mockUserFindById.mockReturnValue(
      selectLeanReturn(userDoc({ aiCallsToday: 0, plan: "free" }))
    );
    mockUserFindOneAndUpdate.mockImplementation(async () => {
      if (atomicCount < LIMIT) { atomicCount++; return { aiCallsToday: atomicCount }; }
      return null;
    });

    const results = await Promise.all(
      Array.from({ length: 15 }, () => checkAndIncrementUsage("u1"))
    );

    expect(results.filter(Boolean)).toHaveLength(LIMIT);
    expect(results.filter(r => !r)).toHaveLength(5);
    expect(atomicCount).toBe(LIMIT); // counter never exceeded the limit
  });

  test("10 concurrent calls with 2 slots remaining (8/10) → exactly 2 succeed", async () => {
    let atomicCount = 8;
    const LIMIT = 10;

    mockUserFindById.mockReturnValue(
      selectLeanReturn(userDoc({ aiCallsToday: 8, plan: "free" }))
    );
    mockUserFindOneAndUpdate.mockImplementation(async () => {
      if (atomicCount < LIMIT) { atomicCount++; return { aiCallsToday: atomicCount }; }
      return null;
    });

    const results = await Promise.all(
      Array.from({ length: 10 }, () => checkAndIncrementUsage("u1"))
    );

    expect(results.filter(Boolean)).toHaveLength(2);
    expect(results.filter(r => !r)).toHaveLength(8);
    expect(atomicCount).toBe(LIMIT);
  });

  test("15 concurrent pro-user calls at 0/100 → all 15 succeed (well under limit)", async () => {
    let atomicCount = 0;
    const LIMIT = 100;

    mockUserFindById.mockReturnValue(
      selectLeanReturn(userDoc({ aiCallsToday: 0, isPaid: true, plan: "pro" }))
    );
    mockUserFindOneAndUpdate.mockImplementation(async () => {
      if (atomicCount < LIMIT) { atomicCount++; return { aiCallsToday: atomicCount }; }
      return null;
    });

    const results = await Promise.all(
      Array.from({ length: 15 }, () => checkAndIncrementUsage("u1"))
    );

    expect(results.filter(Boolean)).toHaveLength(15);
    expect(atomicCount).toBe(15);
  });

  test("user already at free limit → all concurrent calls rejected, counter unchanged", async () => {
    let atomicCount = 10;
    const LIMIT = 10;

    mockUserFindById.mockReturnValue(
      selectLeanReturn(userDoc({ aiCallsToday: 10, plan: "free" }))
    );
    mockUserFindOneAndUpdate.mockImplementation(async () => {
      if (atomicCount < LIMIT) { atomicCount++; return { aiCallsToday: atomicCount }; }
      return null;
    });

    const results = await Promise.all(
      Array.from({ length: 5 }, () => checkAndIncrementUsage("u1"))
    );

    expect(results.every(r => !r)).toBe(true);
    expect(atomicCount).toBe(LIMIT); // never went above 10
  });

  test("mixed: 20 concurrent premium-user calls at 490/500 → exactly 10 succeed", async () => {
    let atomicCount = 490;
    const LIMIT = 500;

    mockUserFindById.mockReturnValue(
      selectLeanReturn(userDoc({ aiCallsToday: 490, isPaid: true, plan: "premium" }))
    );
    mockUserFindOneAndUpdate.mockImplementation(async () => {
      if (atomicCount < LIMIT) { atomicCount++; return { aiCallsToday: atomicCount }; }
      return null;
    });

    const results = await Promise.all(
      Array.from({ length: 20 }, () => checkAndIncrementUsage("u1"))
    );

    expect(results.filter(Boolean)).toHaveLength(10);
    expect(results.filter(r => !r)).toHaveLength(10);
    expect(atomicCount).toBe(LIMIT);
  });
});
