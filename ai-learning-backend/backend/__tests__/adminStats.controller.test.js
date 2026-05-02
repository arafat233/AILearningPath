import { jest } from "@jest/globals";

// ── Model mocks ───────────────────────────────────────────────────────────────
const mockUserCountDocuments  = jest.fn();
const mockUserAggregate       = jest.fn();
const mockQuestionCount       = jest.fn();
const mockAttemptCount        = jest.fn();
const mockAttemptAggregate    = jest.fn();
const mockPaymentAggregate    = jest.fn();
const mockGetCacheStats       = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    countDocuments: mockUserCountDocuments,
    aggregate:      mockUserAggregate,
  },
  Question:      { countDocuments: mockQuestionCount },
  Attempt: {
    countDocuments: mockAttemptCount,
    aggregate:      mockAttemptAggregate,
  },
  PaymentRecord: { aggregate: mockPaymentAggregate },
}));
jest.unstable_mockModule("../services/aiRouter.js", () => ({
  getCacheStats: mockGetCacheStats,
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const { getAdminStats, getAnalytics } = await import("../controllers/admin/adminStatsController.js");

// Express mock helpers
function mockRes() {
  const res = { json: jest.fn(), status: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

afterEach(() => jest.clearAllMocks());

describe("getAdminStats", () => {
  test("returns correct stat shape", async () => {
    mockUserCountDocuments.mockResolvedValue(200);
    mockQuestionCount.mockResolvedValue(900);
    mockAttemptCount.mockResolvedValue(5000);
    mockGetCacheStats.mockReturnValue({ hitRate: 0.82 });
    mockUserAggregate.mockResolvedValue([
      { _id: "free", count: 150 },
      { _id: "pro",  count: 40  },
    ]);

    const req = { user: { id: "admin1" } };
    const res = mockRes();
    await getAdminStats(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalUsers:     expect.any(Number),
        totalQuestions: expect.any(Number),
        totalAttempts:  expect.any(Number),
      })
    );
  });

  test("plan breakdown groups correctly", async () => {
    mockUserCountDocuments.mockResolvedValue(100);
    mockQuestionCount.mockResolvedValue(100);
    mockAttemptCount.mockResolvedValue(100);
    mockGetCacheStats.mockReturnValue({});
    mockUserAggregate.mockResolvedValue([
      { _id: "free",    count: 70 },
      { _id: "pro",     count: 20 },
      { _id: "premium", count: 10 },
    ]);

    const res = mockRes();
    await getAdminStats({}, res, jest.fn());

    const body = res.json.mock.calls[0][0];
    expect(body.planBreakdown.free).toBe(70);
    expect(body.planBreakdown.pro).toBe(20);
  });
});

describe("getAnalytics", () => {
  function setupAnalyticsMocks({
    newUserTrend = [],
    revenueTrend = [],
    attemptTrend = [],
  } = {}) {
    // getAnalytics calls countDocuments 5x: totalUsers, paidUsers, dau, mau, usersBeforeD7
    let callIdx = 0;
    mockUserCountDocuments.mockImplementation(() => {
      const results = [500, 50, 40, 200, 300];
      return Promise.resolve(results[callIdx++] ?? 0);
    });
    mockUserAggregate.mockResolvedValue(newUserTrend);
    mockPaymentAggregate.mockResolvedValue(revenueTrend);
    mockAttemptAggregate.mockResolvedValue(attemptTrend);
  }

  test("returns summary + trends structure", async () => {
    setupAnalyticsMocks();
    const res = mockRes();
    await getAnalytics({}, res, jest.fn());
    const body = res.json.mock.calls[0][0];
    expect(body).toHaveProperty("summary");
    expect(body).toHaveProperty("trends");
    expect(body.trends).toHaveProperty("newUsers");
    expect(body.trends).toHaveProperty("revenue");
    expect(body.trends).toHaveProperty("attempts");
  });

  test("trends arrays are 30 entries (zero-filled)", async () => {
    setupAnalyticsMocks({ newUserTrend: [], revenueTrend: [], attemptTrend: [] });
    const res = mockRes();
    await getAnalytics({}, res, jest.fn());
    const { trends } = res.json.mock.calls[0][0];
    expect(trends.newUsers).toHaveLength(30);
    expect(trends.revenue).toHaveLength(30);
    expect(trends.attempts).toHaveLength(30);
  });

  test("revenue is converted from paise to rupees", async () => {
    const today = new Date().toISOString().slice(0, 10);
    setupAnalyticsMocks({
      revenueTrend: [{ _id: today, revenue: 19900 }],
    });
    const res = mockRes();
    await getAnalytics({}, res, jest.fn());
    const { trends } = res.json.mock.calls[0][0];
    const dayWithRevenue = trends.revenue.find((d) => d.value > 0);
    if (dayWithRevenue) {
      expect(dayWithRevenue.value).toBeCloseTo(199, 0);
    }
  });

  test("conversionRate = paidUsers / totalUsers × 100", async () => {
    let callIdx = 0;
    // totalUsers=100, paidUsers=25, dau=10, mau=50, usersBeforeD7=80
    mockUserCountDocuments.mockImplementation(() =>
      Promise.resolve([100, 25, 10, 50, 80][callIdx++] ?? 0)
    );
    mockUserAggregate.mockResolvedValue([]);
    mockPaymentAggregate.mockResolvedValue([]);
    mockAttemptAggregate.mockResolvedValue([]);

    const res = mockRes();
    await getAnalytics({}, res, jest.fn());
    const { summary } = res.json.mock.calls[0][0];
    expect(summary.conversionRate).toBeCloseTo(25, 0);
  });
});
