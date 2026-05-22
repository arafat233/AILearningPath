import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

// Set fake VAPID keys before import so ensureVapid() succeeds
process.env.VAPID_PUBLIC_KEY  = "BIIGtest_public_key_stub";
process.env.VAPID_PRIVATE_KEY = "test_private_key_stub";
process.env.VAPID_EMAIL       = "mailto:test@example.com";

const mockSendNotification       = jest.fn();
const mockWebpushSetVapidDetails  = jest.fn();
const mockUserFind               = jest.fn();
const mockUserFindById           = jest.fn();
const mockUserFindByIdAndUpdate  = jest.fn();
const mockGetRevisionTopics      = jest.fn();

jest.unstable_mockModule("web-push", () => ({
  default: {
    setVapidDetails:  mockWebpushSetVapidDetails,
    sendNotification: mockSendNotification,
  },
}));

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  User: {
    find:            (q) => ({ select: () => ({ lean: () => mockUserFind(q) }) }),
    findById:        (id) => ({ select: () => ({ lean: () => mockUserFindById(id) }) }),
    findByIdAndUpdate: mockUserFindByIdAndUpdate,
  },
}));

jest.unstable_mockModule("../services/revisionService.js", () => ({
  getRevisionTopics: mockGetRevisionTopics,
}));

jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const {
  sendPush,
  sendRevisionReminders,
  sendStudyReminders,
  notifyParentsOfMilestone,
} = await import("../services/pushService.js");

afterEach(() => jest.clearAllMocks());

// ── sendPush ───────────────────────────────────────────────────────────────────

describe("sendPush", () => {
  test("calls webpush.sendNotification with JSON-stringified payload", async () => {
    mockSendNotification.mockResolvedValue({ statusCode: 201 });
    const sub = { endpoint: "https://fcm.test/push/1", keys: {} };
    await sendPush(sub, { title: "Hello", body: "World" });

    expect(mockSendNotification).toHaveBeenCalledWith(
      sub,
      JSON.stringify({ title: "Hello", body: "World" })
    );
  });
});

// ── sendRevisionReminders ──────────────────────────────────────────────────────

describe("sendRevisionReminders", () => {
  test("returns { sent: 0, failed: 0 } when no users have subscriptions", async () => {
    mockUserFind.mockResolvedValue([]);
    const result = await sendRevisionReminders();
    expect(result).toEqual({ sent: 0, failed: 0 });
  });

  test("skips users with no due revisions", async () => {
    mockUserFind.mockResolvedValue([{ _id: "u1", pushSubscription: { endpoint: "ep1", keys: {} } }]);
    mockGetRevisionTopics.mockResolvedValue([]);
    const result = await sendRevisionReminders();
    expect(result.sent).toBe(0);
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  test("sends push to users with due revisions", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "u1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    mockGetRevisionTopics.mockResolvedValue([
      { topic: "Algebra" }, { topic: "Geometry" }, { topic: "Stats" },
    ]);
    mockSendNotification.mockResolvedValue({ statusCode: 201 });

    const result = await sendRevisionReminders();

    expect(result.sent).toBe(1);
    expect(mockSendNotification).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(mockSendNotification.mock.calls[0][1]);
    expect(payload.title).toContain("3 revisions");
    expect(payload.body).toContain("Algebra");
  });

  test("removes expired subscription on 410 error and counts as failed", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "u1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    mockGetRevisionTopics.mockResolvedValue([{ topic: "Algebra" }]);
    const goneErr = new Error("Gone"); goneErr.statusCode = 410;
    mockSendNotification.mockRejectedValue(goneErr);
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    const result = await sendRevisionReminders();

    expect(result.failed).toBe(1);
    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ $unset: { pushSubscription: 1 } })
    );
  });

  test("counts send errors as failed without throwing", async () => {
    mockUserFind.mockResolvedValue([
      { _id: "u1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    mockGetRevisionTopics.mockResolvedValue([{ topic: "Algebra" }]);
    mockSendNotification.mockRejectedValue(new Error("Network error"));

    const result = await sendRevisionReminders();
    expect(result.failed).toBe(1);
    expect(result.sent).toBe(0);
  });
});

// ── sendStudyReminders ─────────────────────────────────────────────────────────

describe("sendStudyReminders", () => {
  test("returns { sent: 0 } when no parents have subscriptions", async () => {
    mockUserFind.mockResolvedValue([]);
    const result = await sendStudyReminders();
    expect(result).toEqual({ sent: 0 });
  });

  test("skips reminders whose time does not match current time", async () => {
    const now = new Date();
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const wrongTime = HH === "00" ? "01:00" : "00:00";

    mockUserFind.mockResolvedValue([
      {
        _id: "p1",
        name: "Parent",
        pushSubscription: { endpoint: "ep1", keys: {} },
        studyReminders: [{ time: wrongTime, studentId: "s1", days: [] }],
        linkedStudents: ["s1"],
      },
    ]);

    const result = await sendStudyReminders();
    expect(result.sent).toBe(0);
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  test("sends reminder when time matches and no day filter", async () => {
    const now = new Date();
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${HH}:${MM}`;

    // We need to mock User.find to return both the parents query AND the student names query
    let callCount = 0;
    mockUserFind.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // Parents query
        return [
          {
            _id: "p1",
            name: "Parent",
            pushSubscription: { endpoint: "ep1", keys: {} },
            studyReminders: [{ time: currentTime, studentId: "s1", days: [] }],
            linkedStudents: ["s1"],
          },
        ];
      }
      // Student names query
      return [{ _id: "s1", name: "Arjun" }];
    });
    mockSendNotification.mockResolvedValue({ statusCode: 201 });

    const result = await sendStudyReminders();
    expect(result.sent).toBe(1);
    const payload = JSON.parse(mockSendNotification.mock.calls[0][1]);
    expect(payload.title).toContain("Arjun");
  });
});

// ── notifyParentsOfMilestone ───────────────────────────────────────────────────

describe("notifyParentsOfMilestone", () => {
  test("does nothing if student is not found", async () => {
    mockUserFindById.mockResolvedValue(null);
    await notifyParentsOfMilestone("s1", "streak_7");
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  test("does nothing if no parents have push subscriptions", async () => {
    mockUserFindById.mockResolvedValue({ name: "Priya" });
    mockUserFind.mockResolvedValue([]);
    await notifyParentsOfMilestone("s1", "streak_7");
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  test("sends push to each linked parent with a known milestone label", async () => {
    mockUserFindById.mockResolvedValue({ name: "Priya" });
    mockUserFind.mockResolvedValue([
      { _id: "p1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    mockSendNotification.mockResolvedValue({ statusCode: 201 });

    await notifyParentsOfMilestone("s1", "streak_7");

    const payload = JSON.parse(mockSendNotification.mock.calls[0][1]);
    expect(payload.title).toContain("Priya");
    expect(payload.title).toContain("7-day streak!");
  });

  test("removes expired parent subscription on 410 and continues", async () => {
    mockUserFindById.mockResolvedValue({ name: "Priya" });
    mockUserFind.mockResolvedValue([
      { _id: "p1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    const goneErr = new Error("Gone"); goneErr.statusCode = 410;
    mockSendNotification.mockRejectedValue(goneErr);
    mockUserFindByIdAndUpdate.mockResolvedValue({});

    await notifyParentsOfMilestone("s1", "streak_7");
    // Flush the fire-and-forget .catch() handler (it's a microtask not awaited by the function)
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(
      "p1",
      expect.objectContaining({ $unset: { pushSubscription: 1 } })
    );
  });

  test("handles unknown badge type with generic title", async () => {
    mockUserFindById.mockResolvedValue({ name: "Priya" });
    mockUserFind.mockResolvedValue([
      { _id: "p1", pushSubscription: { endpoint: "ep1", keys: {} } },
    ]);
    mockSendNotification.mockResolvedValue({ statusCode: 201 });

    await notifyParentsOfMilestone("s1", "unknown_badge");

    const payload = JSON.parse(mockSendNotification.mock.calls[0][1]);
    expect(payload.title).toContain("Priya");
  });
});
