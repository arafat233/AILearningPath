import { jest } from "@jest/globals";

const mockUserProfileFindOne = jest.fn();
const mockQuestionFindOne    = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  UserProfile: { findOne: mockUserProfileFindOne },
  Question:    { findOne: mockQuestionFindOne },
}));

const { checkFoundation } = await import("../services/foundationService.js");

afterEach(() => jest.clearAllMocks());

// ── no prerequisites ───────────────────────────────────────────────────────────

describe("checkFoundation — topics with no prerequisites", () => {
  test("returns redirect:false for a topic not in the prerequisite map", async () => {
    const result = await checkFoundation("u1", "Unknown Topic");
    expect(result).toEqual({ redirect: false });
  });

  test("does not query Question when topic has no prerequisites", async () => {
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: [] });
    await checkFoundation("u1", "Unknown Topic");
    expect(mockQuestionFindOne).not.toHaveBeenCalled();
  });
});

// ── missing or empty profile ───────────────────────────────────────────────────

describe("checkFoundation — user profile handling", () => {
  test("returns redirect:false when UserProfile is not found", async () => {
    mockUserProfileFindOne.mockResolvedValue(null);
    const result = await checkFoundation("u1", "Quadratic Equations");
    expect(result).toEqual({ redirect: false });
  });

  test("returns redirect:false when weakAreas is empty", async () => {
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: [] });
    const result = await checkFoundation("u1", "Quadratic Equations");
    expect(result).toEqual({ redirect: false });
  });

  test("returns redirect:false when weakAreas does not overlap with prerequisites", async () => {
    // Quadratic Equations prereqs: ["Linear Equations", "Factorization", "Algebra Basics"]
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Trigonometry"] });
    const result = await checkFoundation("u1", "Quadratic Equations");
    expect(result).toEqual({ redirect: false });
  });
});

// ── redirect with a weak prerequisite ─────────────────────────────────────────

describe("checkFoundation — redirecting to a foundation topic", () => {
  test("returns redirect:true when a prerequisite matches a weakArea", async () => {
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Factorization"] });
    mockQuestionFindOne.mockResolvedValue({ _id: "q1", questionText: "Factorise x²+2x" });

    const result = await checkFoundation("u1", "Quadratic Equations");

    expect(result.redirect).toBe(true);
    expect(result.foundationTopic).toBe("Factorization");
    expect(result.message).toContain("Factorization");
    expect(result.message).toContain("Quadratic Equations");
    expect(result.question).toMatchObject({ _id: "q1" });
  });

  test("returns the first matching prerequisite in map order", async () => {
    // Quadratic Equations prereqs in order: ["Linear Equations", "Factorization", "Algebra Basics"]
    // "Linear Equations" not weak; "Factorization" IS weak → should redirect to Factorization
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Factorization", "Algebra Basics"] });
    mockQuestionFindOne.mockResolvedValue({ _id: "q2" });

    const result = await checkFoundation("u1", "Quadratic Equations");

    expect(result.foundationTopic).toBe("Factorization");
  });

  test("Trigonometry redirects to Geometry Basics when weak", async () => {
    // Trigonometry prereqs: ["Geometry Basics", "Algebra Basics", "Coordinate Geometry"]
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Geometry Basics"] });
    mockQuestionFindOne.mockResolvedValue({ _id: "q3" });

    const result = await checkFoundation("u1", "Trigonometry");

    expect(result.redirect).toBe(true);
    expect(result.foundationTopic).toBe("Geometry Basics");
  });

  test("Coordinate Geometry redirects to Linear Equations when weak", async () => {
    // Coord Geometry prereqs: ["Geometry Basics", "Linear Equations"]
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Linear Equations"] });
    mockQuestionFindOne.mockResolvedValue({ _id: "q4" });

    const result = await checkFoundation("u1", "Coordinate Geometry");

    expect(result.redirect).toBe(true);
    expect(result.foundationTopic).toBe("Linear Equations");
  });

  test("question can be null if no foundation question exists in DB", async () => {
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Algebra Basics"] });
    mockQuestionFindOne.mockResolvedValue(null);

    const result = await checkFoundation("u1", "Quadratic Equations");

    expect(result.redirect).toBe(true);
    expect(result.question).toBeNull();
  });
});

// ── query correctness ──────────────────────────────────────────────────────────

describe("checkFoundation — DB query correctness", () => {
  test("queries Question with deletedAt: null filter", async () => {
    mockUserProfileFindOne.mockResolvedValue({ weakAreas: ["Algebra Basics"] });
    mockQuestionFindOne.mockResolvedValue({ _id: "q5" });

    await checkFoundation("u1", "Factorization");

    expect(mockQuestionFindOne).toHaveBeenCalledWith(
      expect.objectContaining({ deletedAt: null })
    );
  });
});
