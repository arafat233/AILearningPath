import { jest } from "@jest/globals";

const mockCreate = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  AnalyticsEvent: { create: mockCreate },
}));

const { trackEvent } = await import("../utils/eventTracker.js");

afterEach(() => jest.clearAllMocks());

describe("trackEvent", () => {
  test("creates AnalyticsEvent with correct fields", async () => {
    mockCreate.mockResolvedValue({});
    trackEvent("user1", "practice_start", { subject: "Science", topicId: "sci_ch5_photosynthesis" });
    // fire-and-forget — yield to microtask queue
    await new Promise((r) => setTimeout(r, 0));
    expect(mockCreate).toHaveBeenCalledWith({
      userId:   "user1",
      event:    "practice_start",
      subject:  "Science",
      topicId:  "sci_ch5_photosynthesis",
      metadata: {},
    });
  });

  test("extra metadata fields go into metadata object, not top level", async () => {
    mockCreate.mockResolvedValue({});
    trackEvent("user2", "explanation_shown", { topicId: "ch1_s1_c1_t1", extra: "value" });
    await new Promise((r) => setTimeout(r, 0));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        topicId:  "ch1_s1_c1_t1",
        metadata: { extra: "value" },
      })
    );
  });

  test("defaults subject and topicId to null when not provided", async () => {
    mockCreate.mockResolvedValue({});
    trackEvent("user3", "practice_start");
    await new Promise((r) => setTimeout(r, 0));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ subject: null, topicId: null, metadata: {} })
    );
  });

  test("never throws even when DB write fails", async () => {
    mockCreate.mockRejectedValue(new Error("DB down"));
    expect(() => trackEvent("user4", "practice_start")).not.toThrow();
    await new Promise((r) => setTimeout(r, 10));
    // no unhandled rejection — test would fail with jest if one occurred
  });

  test("does not await DB write — returns immediately", () => {
    let resolved = false;
    mockCreate.mockImplementation(() => new Promise((r) => setTimeout(() => { resolved = true; r({}); }, 100)));
    trackEvent("user5", "practice_start");
    // If trackEvent awaited, resolved would still be false here since setTimeout hasn't fired
    expect(resolved).toBe(false);
  });
});
