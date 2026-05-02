import { jest } from "@jest/globals";

const mockFindOneAndUpdate = jest.fn();
const mockFind             = jest.fn();
const mockNotify           = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  Badge:       { findOneAndUpdate: mockFindOneAndUpdate, find: mockFind },
  Streak:      {},
  UserProfile: {},
}));
jest.unstable_mockModule("../services/pushService.js", () => ({
  notifyParentsOfMilestone: mockNotify,
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const { checkAndAwardBadges, getUserBadges } = await import("../services/badgeService.js");

// Simulate new badge: updatedExisting = false
const newBadge   = () => ({ lastErrorObject: { updatedExisting: false } });
// Simulate already existed: updatedExisting = true
const existingBadge = () => ({ lastErrorObject: { updatedExisting: true } });

afterEach(() => jest.clearAllMocks());

describe("checkAndAwardBadges — streak badges", () => {
  test("streak 7 → awards streak_7", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { streak: 7 });
    expect(awarded).toContain("streak_7");
  });

  test("streak 30 → awards streak_7 and streak_30", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { streak: 30 });
    expect(awarded).toContain("streak_7");
    expect(awarded).toContain("streak_30");
  });

  test("streak 100 → awards all three streak badges", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { streak: 100 });
    expect(awarded).toContain("streak_7");
    expect(awarded).toContain("streak_30");
    expect(awarded).toContain("streak_100");
  });

  test("streak 6 → no streak badges", async () => {
    const awarded = await checkAndAwardBadges("u1", { streak: 6 });
    expect(awarded).toHaveLength(0);
    expect(mockFindOneAndUpdate).not.toHaveBeenCalled();
  });
});

describe("checkAndAwardBadges — question volume badges", () => {
  test("100 attempts → questions_100 awarded", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { totalAttempts: 100 });
    expect(awarded).toContain("questions_100");
  });

  test("500 attempts → questions_100 and questions_500 both awarded", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { totalAttempts: 500 });
    expect(awarded).toContain("questions_100");
    expect(awarded).toContain("questions_500");
  });

  test("99 attempts → no volume badge", async () => {
    const awarded = await checkAndAwardBadges("u1", { totalAttempts: 99 });
    expect(awarded).toHaveLength(0);
  });
});

describe("checkAndAwardBadges — exam badge", () => {
  test("examScore 100 → first_perfect_exam awarded", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { examScore: 100 });
    expect(awarded).toContain("first_perfect_exam");
  });

  test("examScore 99 → no perfect exam badge", async () => {
    const awarded = await checkAndAwardBadges("u1", { examScore: 99 });
    expect(awarded).toHaveLength(0);
  });
});

describe("checkAndAwardBadges — leaderboard badge", () => {
  test("rank 1 → top10_leaderboard", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { rank: 1 });
    expect(awarded).toContain("top10_leaderboard");
  });

  test("rank 10 → top10_leaderboard", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { rank: 10 });
    expect(awarded).toContain("top10_leaderboard");
  });

  test("rank 11 → no badge", async () => {
    const awarded = await checkAndAwardBadges("u1", { rank: 11 });
    expect(awarded).toHaveLength(0);
  });
});

describe("checkAndAwardBadges — concept master badge", () => {
  test("90%+ accuracy with 20+ attempts → concept_master_{topic}", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", {
      topic: "algebra", topicAccuracy: 0.9, topicAttempts: 20,
    });
    expect(awarded).toContain("concept_master_algebra");
  });

  test("90% accuracy but only 19 attempts → no badge", async () => {
    const awarded = await checkAndAwardBadges("u1", {
      topic: "algebra", topicAccuracy: 0.9, topicAttempts: 19,
    });
    expect(awarded).toHaveLength(0);
  });

  test("20+ attempts but only 89% accuracy → no badge", async () => {
    const awarded = await checkAndAwardBadges("u1", {
      topic: "algebra", topicAccuracy: 0.89, topicAttempts: 25,
    });
    expect(awarded).toHaveLength(0);
  });
});

describe("checkAndAwardBadges — duplicate prevention", () => {
  test("badge already exists → not included in returned array", async () => {
    mockFindOneAndUpdate.mockResolvedValue(existingBadge());
    mockNotify.mockResolvedValue(null);
    const awarded = await checkAndAwardBadges("u1", { streak: 7 });
    expect(awarded).toHaveLength(0);
  });

  test("duplicate key error (code 11000) → silently ignored, not re-thrown", async () => {
    const dup = new Error("dup key"); dup.code = 11000;
    mockFindOneAndUpdate.mockRejectedValue(dup);
    const awarded = await checkAndAwardBadges("u1", { streak: 7 });
    expect(awarded).toHaveLength(0); // no crash
  });
});

describe("checkAndAwardBadges — parent notifications", () => {
  test("new badge triggers notifyParentsOfMilestone (fire-and-forget)", async () => {
    mockFindOneAndUpdate.mockResolvedValue(newBadge());
    mockNotify.mockResolvedValue(null);
    await checkAndAwardBadges("u1", { streak: 7 });
    expect(mockNotify).toHaveBeenCalledWith("u1", "streak_7", {});
  });

  test("no new badges → notifyParentsOfMilestone not called", async () => {
    const awarded = await checkAndAwardBadges("u1", {});
    expect(awarded).toHaveLength(0);
    expect(mockNotify).not.toHaveBeenCalled();
  });
});

describe("getUserBadges", () => {
  test("maps badgeType to human-readable label", async () => {
    mockFind.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: () => Promise.resolve([
          { badgeType: "streak_7",           awardedAt: new Date() },
          { badgeType: "first_perfect_exam", awardedAt: new Date() },
          { badgeType: "concept_master_xyz", awardedAt: new Date() },
        ]),
      }),
    });
    const badges = await getUserBadges("u1");
    expect(badges[0].label).toBe("7-Day Streak");
    expect(badges[1].label).toBe("Perfect Exam");
    expect(badges[2].label).toBe("concept master xyz"); // unknown → humanised
  });
});
