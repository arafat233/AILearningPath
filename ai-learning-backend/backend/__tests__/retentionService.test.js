import { jest } from "@jest/globals";

// ── Mock dependencies ─────────────────────────────────────────────────────────

const mockUserFind         = jest.fn();
const mockAttemptDistinct  = jest.fn();
const mockAttemptFind      = jest.fn();
const mockAttemptAggregate = jest.fn();
const mockAICallDistinct   = jest.fn();
const mockEventFind        = jest.fn();
const mockAttemptExists    = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    find: mockUserFind,
  },
  Attempt: {
    distinct:  mockAttemptDistinct,
    find:      mockAttemptFind,
    aggregate: mockAttemptAggregate,
    exists:    mockAttemptExists,
  },
  AICallLog: {
    distinct: mockAICallDistinct,
  },
  AnalyticsEvent: {
    find: mockEventFind,
  },
}));

const svc = await import("../services/retentionService.js");

// ── Helpers ───────────────────────────────────────────────────────────────────

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000);

function makeUser(daysAgoN) {
  const createdAt = daysAgo(daysAgoN);
  return { _id: { toString: () => `u${daysAgoN}` }, createdAt, isPaid: false };
}

afterEach(() => jest.clearAllMocks());

// ── getConversionFunnel ───────────────────────────────────────────────────────

describe("getConversionFunnel", () => {
  test("returns all zeros when no signups in last 30d", async () => {
    mockUserFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve([]) }) });
    const result = await svc.getConversionFunnel();
    expect(result.signups).toBe(0);
    expect(result.activated).toBe(0);
    expect(result.converted).toBe(0);
    expect(result.activationRate).toBe(0);
  });

  test("calculates activation rate correctly", async () => {
    const users = [
      { _id: { toString: () => "u1" }, isPaid: false },
      { _id: { toString: () => "u2" }, isPaid: false },
      { _id: { toString: () => "u3" }, isPaid: true  },
      { _id: { toString: () => "u4" }, isPaid: false },
    ];
    mockUserFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve(users) }) });
    mockAttemptDistinct.mockResolvedValue(["u1", "u2"]);   // 2 activated
    mockAICallDistinct.mockResolvedValue(["u1"]);           // 1 AI engaged

    const result = await svc.getConversionFunnel();

    expect(result.signups).toBe(4);
    expect(result.activated).toBe(2);
    expect(result.aiEngaged).toBe(1);
    expect(result.converted).toBe(1);                          // 1 user with isPaid:true
    expect(result.activationRate).toBe(50.0);
    expect(result.conversionRate).toBe(25.0);
  });

  test("aiEngagementRate is percentage of activated, not signups", async () => {
    const users = Array.from({ length: 10 }, (_, i) => ({
      _id: { toString: () => `u${i}` }, isPaid: false,
    }));
    mockUserFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve(users) }) });
    mockAttemptDistinct.mockResolvedValue(["u0", "u1", "u2", "u3", "u4"]); // 5 activated
    mockAICallDistinct.mockResolvedValue(["u0", "u1"]);                     // 2 AI-engaged (out of 5 activated)

    const result = await svc.getConversionFunnel();

    expect(result.aiEngagementRate).toBe(40.0);  // 2/5 activated = 40%
    expect(result.activationRate).toBe(50.0);    // 5/10 = 50%
  });
});

// ── getTopTopics ──────────────────────────────────────────────────────────────

describe("getTopTopics", () => {
  test("returns aggregation result directly", async () => {
    const mockResult = [
      { topic: "Algebra", attempts: 150, accuracy: 72 },
      { topic: "Polynomials", attempts: 80, accuracy: 55 },
    ];
    mockAttemptAggregate.mockResolvedValue(mockResult);

    const result = await svc.getTopTopics();

    expect(result).toEqual(mockResult);
    expect(mockAttemptAggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ $limit: 10 }),
      ])
    );
  });
});

// ── getAIRetryRate ────────────────────────────────────────────────────────────

describe("getAIRetryRate", () => {
  test("returns zeros when no explanation events", async () => {
    mockEventFind.mockReturnValue({
      select: jest.fn().mockReturnValue({ lean: () => Promise.resolve([]) }),
    });

    const result = await svc.getAIRetryRate();

    expect(result.explanations).toBe(0);
    expect(result.retried).toBe(0);
    expect(result.rate).toBe(0);
  });

  test("counts only events where user practiced same topic within 24h", async () => {
    const t = new Date();
    const events = [
      { userId: "u1", topicId: "sci_ch5", createdAt: t },
      { userId: "u2", topicId: "sci_ch6", createdAt: t },
    ];
    mockEventFind.mockReturnValue({
      select: jest.fn().mockReturnValue({ lean: () => Promise.resolve(events) }),
    });
    // u1 retried, u2 did not
    mockAttemptExists
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const result = await svc.getAIRetryRate();

    expect(result.explanations).toBe(2);
    expect(result.retried).toBe(1);
    expect(result.rate).toBe(50.0);
  });

  test("passes correct date window to Attempt.exists", async () => {
    const explanationTime = new Date("2026-05-01T10:00:00Z");
    mockEventFind.mockReturnValue({
      select: jest.fn().mockReturnValue({
        lean: () => Promise.resolve([
          { userId: "u1", topicId: "ch1_s1_c1_t1", createdAt: explanationTime },
        ]),
      }),
    });
    mockAttemptExists.mockResolvedValue(false);

    await svc.getAIRetryRate();

    const callArgs = mockAttemptExists.mock.calls[0][0];
    expect(callArgs.userId).toBe("u1");
    expect(callArgs.topic).toBe("ch1_s1_c1_t1");
    // window should start after the explanation
    expect(callArgs.createdAt.$gt).toEqual(explanationTime);
    // window should end 24h later
    const expectedEnd = new Date(explanationTime.getTime() + 24 * 3600_000);
    expect(callArgs.createdAt.$lte).toEqual(expectedEnd);
  });
});

// ── getRetentionMetrics (integration of all) ──────────────────────────────────

describe("getRetentionMetrics", () => {
  test("returns retention, funnel, topTopics, aiRetry as a bundle", async () => {
    // Minimal mocks to make it not crash
    mockUserFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve([]) }) });
    mockAttemptFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve([]) }) });
    mockAttemptDistinct.mockResolvedValue([]);
    mockAICallDistinct.mockResolvedValue([]);
    mockAttemptAggregate.mockResolvedValue([]);
    mockEventFind.mockReturnValue({ select: jest.fn().mockReturnValue({ lean: () => Promise.resolve([]) }) });

    const result = await svc.getRetentionMetrics();

    expect(result).toHaveProperty("retention");
    expect(result).toHaveProperty("funnel");
    expect(result).toHaveProperty("topTopics");
    expect(result).toHaveProperty("aiRetry");
    expect(result.retention).toHaveProperty("d1");
    expect(result.retention).toHaveProperty("d7");
    expect(result.retention).toHaveProperty("d30");
  });
});
