import { jest } from "@jest/globals";

const mockUserFind           = jest.fn();
const mockUserFindByIdUpdate = jest.fn();
const mockAttemptCount       = jest.fn();
const mockSendEmail          = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    find:             (q) => ({ select: (s) => ({ lean: () => mockUserFind(q, s) }) }),
    findByIdAndUpdate: mockUserFindByIdUpdate,
  },
  Attempt: { countDocuments: mockAttemptCount },
}));
jest.unstable_mockModule("../utils/email.js", () => ({
  sendEmail: mockSendEmail,
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const { runOnboardingEmails } = await import("../services/onboardingEmailService.js");

afterEach(() => jest.clearAllMocks());

function makeUser(overrides = {}) {
  return {
    _id: "u1", name: "Rahul", email: "rahul@test.com",
    subject: "Math", role: "student", goal: "pass",
    ...overrides,
  };
}

describe("runOnboardingEmails — Day-2 sequence", () => {
  test("user with 0 attempts → email sent, sent count = 1", async () => {
    mockUserFind.mockImplementation((query) => {
      // Return day-2 user on first call, empty on second (day-7)
      if (query.onboardingDay2SentAt === null) return Promise.resolve([makeUser()]);
      return Promise.resolve([]);
    });
    mockAttemptCount.mockResolvedValue(0);
    mockSendEmail.mockResolvedValue(null);
    mockUserFindByIdUpdate.mockResolvedValue(null);

    const { day2 } = await runOnboardingEmails();
    expect(day2).toBe(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const call = mockSendEmail.mock.calls[0][0];
    expect(call.to).toBe("rahul@test.com");
    expect(call.subject).toMatch(/practice/i);
  });

  test("user with >= 3 attempts → email skipped (already engaged), sent count = 0", async () => {
    mockUserFind.mockImplementation((query) => {
      if (query.onboardingDay2SentAt === null) return Promise.resolve([makeUser()]);
      return Promise.resolve([]);
    });
    mockAttemptCount.mockResolvedValue(3);
    mockUserFindByIdUpdate.mockResolvedValue(null);

    const { day2 } = await runOnboardingEmails();
    expect(day2).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
    // Should still mark the sentinel flag to avoid re-querying
    expect(mockUserFindByIdUpdate).toHaveBeenCalled();
  });

  test("no day-2 candidates → sent count = 0, no emails", async () => {
    mockUserFind.mockResolvedValue([]);
    const { day2 } = await runOnboardingEmails();
    expect(day2).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  test("sendEmail failure → logs warning but does not crash", async () => {
    mockUserFind.mockImplementation((query) => {
      if (query.onboardingDay2SentAt === null) return Promise.resolve([makeUser()]);
      return Promise.resolve([]);
    });
    mockAttemptCount.mockResolvedValue(0);
    mockSendEmail.mockRejectedValue(new Error("SMTP error"));
    mockUserFindByIdUpdate.mockResolvedValue(null);

    // Should not throw
    await expect(runOnboardingEmails()).resolves.not.toThrow();
  });
});

describe("runOnboardingEmails — Day-7 sequence", () => {
  test("inactive day-7 user → email sent, sent count = 1", async () => {
    mockUserFind.mockImplementation((query) => {
      if (query.onboardingDay7SentAt === null) return Promise.resolve([makeUser({ goal: "distinction" })]);
      return Promise.resolve([]);
    });
    mockAttemptCount.mockResolvedValue(2);
    mockSendEmail.mockResolvedValue(null);
    mockUserFindByIdUpdate.mockResolvedValue(null);

    const { day7 } = await runOnboardingEmails();
    expect(day7).toBe(1);
    const call = mockSendEmail.mock.calls[0][0];
    expect(call.to).toBe("rahul@test.com");
    expect(call.subject).toMatch(/miss/i);
  });

  test("no day-7 candidates → sent count = 0", async () => {
    mockUserFind.mockResolvedValue([]);
    const { day7 } = await runOnboardingEmails();
    expect(day7).toBe(0);
  });
});

describe("runOnboardingEmails — return structure", () => {
  test("returns { day2, day7 } object", async () => {
    mockUserFind.mockResolvedValue([]);
    const result = await runOnboardingEmails();
    expect(result).toHaveProperty("day2");
    expect(result).toHaveProperty("day7");
  });

  test("marks onboardingDay2SentAt on the user after sending", async () => {
    mockUserFind.mockImplementation((query) => {
      if (query.onboardingDay2SentAt === null) return Promise.resolve([makeUser()]);
      return Promise.resolve([]);
    });
    mockAttemptCount.mockResolvedValue(0);
    mockSendEmail.mockResolvedValue(null);
    mockUserFindByIdUpdate.mockResolvedValue(null);

    await runOnboardingEmails();
    expect(mockUserFindByIdUpdate).toHaveBeenCalledWith(
      "u1",
      { $set: { onboardingDay2SentAt: expect.any(Date) } }
    );
  });
});
