import { jest } from "@jest/globals";

const mockCreate = jest.fn();

jest.unstable_mockModule("@anthropic-ai/sdk", () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
// retrieveContext does a Mongo full-text RAG lookup — stub it so the unit
// tests never touch the DB (an unmocked call buffers ~10s then times out).
jest.unstable_mockModule("../utils/ragStore.js", () => ({
  retrieveContext: jest.fn(async () => ""),
}));

const {
  getSystemPrompt,
  getAIExplanation,
  generateAIQuestion,
  getStudyAdvice,
  generateHint,
  getChatResponse,
} = await import("../services/aiService.js");

afterEach(() => jest.clearAllMocks());

// ── getSystemPrompt ────────────────────────────────────────────────────────────

describe("getSystemPrompt — subject persona selection", () => {
  test("Math returns CBSE Class 10 Math prompt", () => {
    expect(getSystemPrompt("Math")).toContain("CBSE Class 10 Math");
  });

  test("Science returns Science teacher prompt", () => {
    expect(getSystemPrompt("Science")).toContain("Science");
  });

  test("English returns English teacher prompt", () => {
    expect(getSystemPrompt("English")).toContain("English");
  });

  test("Social Science returns Social Science teacher prompt", () => {
    expect(getSystemPrompt("Social Science")).toContain("Social Science");
  });

  test("Hindi returns Hindi teacher prompt", () => {
    expect(getSystemPrompt("Hindi")).toContain("Hindi");
  });

  test("unknown subject falls back to Math prompt", () => {
    expect(getSystemPrompt("Chemistry")).toContain("CBSE Class 10 Math");
  });

  test("no argument defaults to Math prompt", () => {
    expect(getSystemPrompt()).toContain("CBSE Class 10 Math");
  });

  test("each subject returns a distinct prompt", () => {
    const subjects = ["Math", "Science", "English", "Social Science", "Hindi"];
    const prompts = subjects.map(getSystemPrompt);
    const unique = new Set(prompts);
    expect(unique.size).toBe(subjects.length);
  });
});

// ── getAIExplanation ───────────────────────────────────────────────────────────

describe("getAIExplanation — fallback on API error", () => {
  test("returns { text: null, tokens: 0 } when Claude throws a generic error", async () => {
    mockCreate.mockRejectedValue(new Error("Internal Server Error"));
    const result = await getAIExplanation("What is 2+2?", "concept_error", "4");
    expect(result).toEqual({ text: null, tokens: 0 });
  });

  test("returns { text: null, tokens: 0 } on 500-status API error", async () => {
    const err = new Error("Service unavailable"); err.status = 500;
    mockCreate.mockRejectedValue(err);
    const result = await getAIExplanation("Q?", "calculation_error", "42", "Science");
    expect(result).toEqual({ text: null, tokens: 0 });
  });

  test("returns trimmed text and combined token count on success", async () => {
    mockCreate.mockResolvedValue({
      content: [{ text: "  You missed the concept of carrying.  " }],
      usage: { input_tokens: 50, output_tokens: 30 },
    });
    const result = await getAIExplanation("Q?", "concept_error", "42", "Math");
    expect(result.text).toBe("You missed the concept of carrying.");
    expect(result.tokens).toBe(80);
  });

  test("returns tokens: 0 when usage fields are missing", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "ok" }], usage: {} });
    const result = await getAIExplanation("Q?", "guessing", "A");
    expect(result.tokens).toBe(0);
  });

  test("returns text: null when content array is empty", async () => {
    mockCreate.mockResolvedValue({ content: [], usage: { input_tokens: 10, output_tokens: 5 } });
    const result = await getAIExplanation("Q?", "guessing", "A");
    expect(result.text).toBeNull();
  });
});

// ── generateAIQuestion ─────────────────────────────────────────────────────────

describe("generateAIQuestion — fallback on API error", () => {
  test("returns null when Claude throws", async () => {
    mockCreate.mockRejectedValue(new Error("timeout"));
    const result = await generateAIQuestion("Algebra", "concept_error");
    expect(result).toBeNull();
  });

  test("returns null when Claude returns invalid JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "not json" }] });
    const result = await generateAIQuestion("Algebra", "concept_error");
    expect(result).toBeNull();
  });

  test("returns parsed question object on valid JSON response", async () => {
    const q = {
      questionText: "Solve 2x = 4",
      options: [{ text: "2", type: "correct", logicTag: "correct_flow" }],
      solutionSteps: ["Divide both sides by 2"],
      expectedTime: 25,
      conceptTested: "Linear equations",
      shortcut: null,
    };
    mockCreate.mockResolvedValue({ content: [{ text: JSON.stringify(q) }] });
    const result = await generateAIQuestion("Algebra", "concept_error");
    expect(result).toMatchObject({ questionText: "Solve 2x = 4" });
  });

  test("strips ```json fences before parsing", async () => {
    const q = { questionText: "Q" };
    mockCreate.mockResolvedValue({
      content: [{ text: "```json\n" + JSON.stringify(q) + "\n```" }],
    });
    const result = await generateAIQuestion("Algebra", "concept_error");
    expect(result).toMatchObject({ questionText: "Q" });
  });
});

// ── getStudyAdvice ─────────────────────────────────────────────────────────────

describe("getStudyAdvice — fallback on API error", () => {
  test("returns null when Claude throws", async () => {
    mockCreate.mockRejectedValue(new Error("rate limit exceeded"));
    const result = await getStudyAdvice({ weakAreas: [], strongAreas: [] });
    expect(result).toBeNull();
  });

  test("returns trimmed advice text on success", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "  Focus on Algebra first.  " }] });
    const result = await getStudyAdvice({ weakAreas: ["Algebra"], strongAreas: [], accuracy: 0.6 });
    expect(result).toBe("Focus on Algebra first.");
  });

  test("uses examDate to compute daysLeft without throwing", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "advice" }] });
    const futureDate = new Date(Date.now() + 30 * 86400_000).toISOString();
    await expect(
      getStudyAdvice({ weakAreas: [], strongAreas: [], examDate: futureDate })
    ).resolves.toBe("advice");
  });
});

// ── generateHint ───────────────────────────────────────────────────────────────

describe("generateHint — fallback on API error", () => {
  test("returns null on API error", async () => {
    mockCreate.mockRejectedValue(new Error("error"));
    const result = await generateHint("What is x?", "Algebra");
    expect(result).toBeNull();
  });

  test("returns trimmed hint on success", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "  Think about the formula.  " }] });
    const result = await generateHint("What is x?", "Algebra", "Math");
    expect(result).toBe("Think about the formula.");
  });
});

// ── getChatResponse ────────────────────────────────────────────────────────────

describe("getChatResponse — fallback on API error", () => {
  test("returns null on API error", async () => {
    mockCreate.mockRejectedValue(new Error("connection reset"));
    const result = await getChatResponse([], "Explain this", "Algebra");
    expect(result).toBeNull();
  });

  test("includes only the last 8 history messages in the request", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "reply" }] });
    const longHistory = Array.from({ length: 12 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `message ${i}`,
    }));
    await getChatResponse(longHistory, "new question", "Algebra");
    const callMessages = mockCreate.mock.calls[0][0].messages;
    expect(callMessages.length).toBe(9); // 8 history + 1 new user message
  });

  test("returns trimmed reply on success", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "  Here is the answer.  " }] });
    const result = await getChatResponse([], "Explain x²", "Algebra");
    expect(result).toBe("Here is the answer.");
  });
});
