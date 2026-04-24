import { jest } from "@jest/globals";

const mockStreakFindOne = jest.fn();
const mockStreakSave    = jest.fn();

jest.unstable_mockModule("../models/index.js", () => {
  function Streak(data) {
    Object.assign(this, data);
    this.save = mockStreakSave.mockResolvedValue(this);
  }
  Streak.findOne = mockStreakFindOne;
  return { Streak, Attempt: {} };
});

const { updateStreak, getStreak } = await import("../services/streakService.js");

const today     = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
const twoDaysAgo = new Date(Date.now() - 2 * 864e5).toISOString().split("T")[0];

afterEach(() => jest.clearAllMocks());

describe("updateStreak", () => {
  test("first-time user (no streak doc) → streak = 1", async () => {
    mockStreakFindOne.mockResolvedValue(null);
    const result = await updateStreak("u1");
    expect(result.streak).toBe(1);
    expect(result.isNew).toBe(true);
  });

  test("same day called twice → streak unchanged", async () => {
    const doc = { currentStreak: 5, longestStreak: 5, lastActiveDate: today, save: mockStreakSave };
    mockStreakFindOne.mockResolvedValue(doc);
    const result = await updateStreak("u1");
    expect(result.streak).toBe(5);
    expect(mockStreakSave).not.toHaveBeenCalled();
  });

  test("consecutive day → streak increments", async () => {
    const doc = { currentStreak: 3, longestStreak: 5, lastActiveDate: yesterday, updatedAt: null, save: mockStreakSave };
    mockStreakFindOne.mockResolvedValue(doc);
    const result = await updateStreak("u1");
    expect(result.streak).toBe(4);
    expect(mockStreakSave).toHaveBeenCalled();
  });

  test("gap > 1 day → streak resets to 1", async () => {
    const doc = { currentStreak: 10, longestStreak: 10, lastActiveDate: twoDaysAgo, updatedAt: null, save: mockStreakSave };
    mockStreakFindOne.mockResolvedValue(doc);
    const result = await updateStreak("u1");
    expect(result.streak).toBe(1);
  });

  test("new longest streak is recorded", async () => {
    const doc = { currentStreak: 10, longestStreak: 10, lastActiveDate: yesterday, updatedAt: null, save: mockStreakSave };
    mockStreakFindOne.mockResolvedValue(doc);
    const result = await updateStreak("u1");
    expect(result.longestStreak).toBe(11);
  });
});

describe("getStreak", () => {
  test("no streak doc → returns 0,0", async () => {
    mockStreakFindOne.mockResolvedValue(null);
    const result = await getStreak("u1");
    expect(result).toEqual({ streak: 0, longestStreak: 0 });
  });

  test("existing streak → returns values", async () => {
    mockStreakFindOne.mockResolvedValue({ currentStreak: 7, longestStreak: 15 });
    const result = await getStreak("u1");
    expect(result.streak).toBe(7);
    expect(result.longestStreak).toBe(15);
  });
});
