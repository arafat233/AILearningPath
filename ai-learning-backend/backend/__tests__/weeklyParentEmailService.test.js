import { jest } from "@jest/globals";

const mockUserFind              = jest.fn();
const mockUserFindById          = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
const mockUserProfileFindOne    = jest.fn();
const mockStreakFindOne         = jest.fn();
const mockBadgeFind             = jest.fn();
const mockAttemptFind           = jest.fn();
const mockSendEmail             = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  User: {
    find:            (q) => ({ select: () => ({ lean: () => mockUserFind(q) }) }),
    findById:        (id) => ({ select: () => ({ lean: () => mockUserFindById(id) }) }),
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
  },
  UserProfile: { findOne: () => ({ lean: () => mockUserProfileFindOne() }) },
  Streak:      { findOne: () => ({ lean: () => mockStreakFindOne() }) },
  Badge:       { find:    () => ({ lean: () => mockBadgeFind() }) },
  Attempt:     { find:    () => ({ select: () => ({ lean: () => mockAttemptFind() }) }) },
}));

jest.unstable_mockModule("../utils/email.js", () => ({
  sendEmail: mockSendEmail,
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const { runWeeklyParentEmails } = await import("../services/weeklyParentEmailService.js");

afterEach(() => jest.clearAllMocks());

// Common student data helpers
function setupStudent({ sessions = 0, correct = 0 } = {}) {
  mockUserFindById.mockResolvedValue({ name: "Arjun", grade: "10", subject: "Math" });
  mockUserProfileFindOne.mockResolvedValue({ topicProgress: [], weakAreas: [], totalAttempts: 5 });
  mockStreakFindOne.mockResolvedValue({ currentStreak: 3 });
  mockBadgeFind.mockResolvedValue([]);
  // First Attempt.find = weekAttempts, second = prevAttempts
  let callCount = 0;
  mockAttemptFind.mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      return Array(sessions).fill(0).map((_, i) => ({
        topic: "Algebra", isCorrect: i < correct, createdAt: new Date(),
      }));
    }
    return [];
  });
}

// ── returns correct totals ─────────────────────────────────────────────────────

describe("runWeeklyParentEmails — return values", () => {
  test("returns { sent: 0, total: 0 } when no eligible parents exist", async () => {
    mockUserFind.mockResolvedValue([]);
    const result = await runWeeklyParentEmails();
    expect(result).toEqual({ sent: 0, total: 0 });
  });

  test("returns total equal to the number of parents found", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Dad",  email: "dad@test.com",  linkedStudents: ["s1"] },
      { _id: "p2", name: "Mum",  email: "mum@test.com",  linkedStudents: ["s2"] },
    ]);
    setupStudent({ sessions: 5, correct: 3 });
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    const result = await runWeeklyParentEmails();
    expect(result.total).toBe(2);
  });
});

// ── sendEmail invocation ───────────────────────────────────────────────────────

describe("runWeeklyParentEmails — email sending", () => {
  test("calls sendEmail once per eligible parent", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "parent@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent({ sessions: 3, correct: 2 });
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "parent@test.com" })
    );
  });

  test("email subject mentions 'Weekly update'", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "parent@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent();
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    const emailArg = mockSendEmail.mock.calls[0][0];
    expect(emailArg.subject).toMatch(/weekly update/i);
  });

  test("HTML email includes the parent's name", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Najeeb", email: "n@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent({ sessions: 2, correct: 1 });
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    const html = mockSendEmail.mock.calls[0][0].html;
    expect(html).toContain("Najeeb");
  });

  test("HTML email includes student name", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "p@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent({ sessions: 2, correct: 2 });
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    const html = mockSendEmail.mock.calls[0][0].html;
    expect(html).toContain("Arjun");
  });
});

// ── weeklyParentEmailSentAt update ────────────────────────────────────────────

describe("runWeeklyParentEmails — timestamps", () => {
  test("updates weeklyParentEmailSentAt after successful send", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "p@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent();
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      "p1",
      expect.objectContaining({ $set: expect.objectContaining({ weeklyParentEmailSentAt: expect.any(Date) }) })
    );
  });

  test("does NOT update timestamp if sendEmail fails", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "p@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent();
    mockSendEmail.mockRejectedValue(new Error("SMTP error"));

    await runWeeklyParentEmails();

    expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
  });
});

// ── student with no sessions ───────────────────────────────────────────────────

describe("runWeeklyParentEmails — inactive students", () => {
  test("still sends email when student has 0 sessions (shows no-practice block)", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "Parent", email: "p@test.com", linkedStudents: ["s1"] },
    ]);
    setupStudent({ sessions: 0 });
    // Override totalAttempts to 0 so the student is filtered out of normal blocks
    // and the "no practice" fallback renders
    mockUserProfileFindOne.mockResolvedValue({ topicProgress: [], weakAreas: [], totalAttempts: 0 });
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await runWeeklyParentEmails();

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const html = mockSendEmail.mock.calls[0][0].html;
    expect(html).toContain("haven");
    expect(html).toContain("practised");
  });
});

// ── error resilience ───────────────────────────────────────────────────────────

describe("runWeeklyParentEmails — error resilience", () => {
  test("continues to next parent if buildStudentSummary throws", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "p1", name: "P1", email: "p1@test.com", linkedStudents: ["bad-id"] },
      { _id: "p2", name: "P2", email: "p2@test.com", linkedStudents: ["s1"] },
    ]);
    // First call throws (for p1's bad student), second call works (for p2's student)
    let callCount = 0;
    mockUserFindById.mockImplementation(() => {
      callCount++;
      if (callCount === 1) throw new Error("Student not found");
      return { name: "Arjun", grade: "10", subject: "Math" };
    });
    mockUserProfileFindOne.mockResolvedValue({ topicProgress: [], weakAreas: [], totalAttempts: 0 });
    mockStreakFindOne.mockResolvedValue(null);
    mockBadgeFind.mockResolvedValue([]);
    mockAttemptFind.mockResolvedValue([]);
    mockSendEmail.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    const result = await runWeeklyParentEmails();

    // At least one email was sent (p2 succeeded)
    expect(result.sent).toBeGreaterThanOrEqual(1);
  });
});
