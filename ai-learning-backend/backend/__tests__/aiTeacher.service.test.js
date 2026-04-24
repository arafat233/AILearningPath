import { generateTeacherMessage, getDailyMessage } from "../services/aiTeacherService.js";

const baseProfile = (overrides = {}) => ({
  accuracy: 0.6,
  totalAttempts: 20,
  behaviorStats: {},
  weakAreas: [],
  thinkingProfile: undefined,
  ...overrides,
});

describe("generateTeacherMessage", () => {
  test("totalAttempts < 5 → welcome type regardless of accuracy", () => {
    const result = generateTeacherMessage(baseProfile({ totalAttempts: 3 }));
    expect(result.type).toBe("welcome");
  });

  test("high guessing rate (>40% of attempts) → warning type", () => {
    const result = generateTeacherMessage(baseProfile({ totalAttempts: 20, behaviorStats: { guessing: 9 } }));
    expect(result.type).toBe("warning");
  });

  test("high concept_error rate (>35% of attempts) → redirect type with topic", () => {
    const result = generateTeacherMessage(baseProfile({
      totalAttempts: 20,
      behaviorStats: { guessing: 0, concept_error: 8 },
      weakAreas: ["Algebra"],
    }));
    expect(result.type).toBe("redirect");
    expect(result.topic).toBe("Algebra");
  });

  test("accuracy >0.8 and totalAttempts >20 → challenge type", () => {
    const result = generateTeacherMessage(baseProfile({ accuracy: 0.85, totalAttempts: 30 }), {}, "distinction");
    expect(result.type).toBe("challenge");
  });

  test("scholarship goal + high accuracy → challenge message includes percentage", () => {
    const result = generateTeacherMessage(baseProfile({ accuracy: 0.92, totalAttempts: 50 }), {}, "scholarship");
    expect(result.type).toBe("challenge");
    expect(result.message).toContain("92%");
  });

  test("session accuracy ≥80% → praise type", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: { guessing: 0, concept_error: 0 } }),
      { questionsAnswered: 5, sessionCorrect: 4 }
    );
    expect(result.type).toBe("praise");
  });

  test("session accuracy <40% → support type", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: { guessing: 0, concept_error: 0 } }),
      { questionsAnswered: 10, sessionCorrect: 2 }
    );
    expect(result.type).toBe("support");
  });

  test("weak areas present (no active session) → focus type with topic", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: {}, weakAreas: ["Geometry"] })
    );
    expect(result.type).toBe("focus");
    expect(result.topic).toBe("Geometry");
  });

  test("scholarship urgency shows in focus message", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: {}, weakAreas: ["Trigonometry"] }),
      {}, "scholarship"
    );
    expect(result.message).toContain("cannot afford gaps");
  });

  test("known thinkingProfile with no other triggers → profile type", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: {}, weakAreas: [], thinkingProfile: "Guesser" })
    );
    expect(result.type).toBe("profile");
    expect(result.message.toLowerCase()).toContain("guess");
  });

  test("unknown thinkingProfile → default continue message", () => {
    const result = generateTeacherMessage(
      baseProfile({ behaviorStats: {}, weakAreas: [], thinkingProfile: "UnknownType" })
    );
    expect(result.type).toBe("profile");
    expect(result.message).toContain("consistent");
  });
});

describe("getDailyMessage", () => {
  test("streak > 0 → includes streak count", () => {
    const profile = { weakAreas: [] };
    const msg = getDailyMessage(profile, 5);
    expect(msg).toContain("5-day streak");
  });

  test("has weak areas → includes priority topic", () => {
    const profile = { weakAreas: ["Probability"] };
    const msg = getDailyMessage(profile, 0);
    expect(msg).toContain("Probability");
  });

  test("no weak areas → generic consistency message", () => {
    const profile = { weakAreas: [] };
    const msg = getDailyMessage(profile, 0);
    expect(msg).toContain("consistency");
  });
});
