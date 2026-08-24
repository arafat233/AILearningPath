import { jest } from "@jest/globals";

const mockCreate   = jest.fn();
const mockRetrieve = jest.fn(async () => null);

jest.unstable_mockModule("@anthropic-ai/sdk", () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  })),
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));
jest.unstable_mockModule("../utils/ragStore.js", () => ({
  retrieveContext: mockRetrieve,
}));
// Mongo cache layer — mocked so tests never buffer on a disconnected mongoose
const mockDbFindOne = jest.fn(() => ({ lean: async () => null }));
jest.unstable_mockModule("../models/index.js", () => ({
  UserProfile:     { findOne: jest.fn(() => ({ lean: async () => null })) },
  Streak:          { findOne: jest.fn(() => ({ lean: async () => null })) },
  AIResponseCache: { findOne: mockDbFindOne, findOneAndUpdate: jest.fn(() => ({ catch: () => {} })) },
  // transitive imports of aiService's utils (aiMetrics, ragStore — mocked above anyway)
  AICallLog:       { create: jest.fn(async () => ({})) },
  NcertChunk:      { find: jest.fn() },
}));

const { generateTransformation, TRANSFORM_KINDS, getAIExplanation } = await import("../services/aiService.js");

afterEach(() => jest.clearAllMocks());

const FLASHCARDS = { cards: [{ front: "What is a prime?", back: "A number with exactly two factors." }] };

describe("generateTransformation", () => {
  test("exports the five expected kinds", () => {
    expect(TRANSFORM_KINDS.sort()).toEqual(["eli5", "examqs", "flashcards", "podcast", "revision"]);
  });

  test("unknown kind returns null without calling Claude", async () => {
    const out = await generateTransformation("Real Numbers", "haiku", "Math", "10");
    expect(out).toBeNull();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("parses valid JSON response into an object", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: JSON.stringify(FLASHCARDS) }], usage: { input_tokens: 10, output_tokens: 20 } });
    const out = await generateTransformation("Real Numbers T1", "flashcards", "Math", "10");
    expect(out.cards).toHaveLength(1);
    expect(out.cards[0].front).toMatch(/prime/);
  });

  test("strips ```json fences before parsing", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "```json\n" + JSON.stringify(FLASHCARDS) + "\n```" }], usage: {} });
    const out = await generateTransformation("Real Numbers T2", "flashcards", "Math", "10");
    expect(out.cards).toHaveLength(1);
  });

  test("returns null on malformed JSON", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: "not json at all" }], usage: {} });
    const out = await generateTransformation("Real Numbers T3", "flashcards", "Math", "10");
    expect(out).toBeNull();
  });

  test("returns null when Claude throws", async () => {
    mockCreate.mockRejectedValue(new Error("boom"));
    const out = await generateTransformation("Real Numbers T4", "eli5", "Math", "10");
    expect(out).toBeNull();
  });

  test("second identical call is served from cache — Claude called once", async () => {
    mockCreate.mockResolvedValue({ content: [{ text: JSON.stringify(FLASHCARDS) }], usage: {} });
    await generateTransformation("Polynomials cache-test", "flashcards", "Math", "10");
    const out2 = await generateTransformation("Polynomials cache-test", "flashcards", "Math", "10");
    expect(out2.cards).toHaveLength(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test("attaches a citation built from RAG chunk provenance", async () => {
    mockRetrieve.mockResolvedValueOnce({
      context: "chunk text",
      sources: [{ chapterNumber: 4, chapterTitle: "Quadratic Equations", conceptName: "Roots", source: null }],
    });
    mockCreate.mockResolvedValue({ content: [{ text: JSON.stringify(FLASHCARDS) }], usage: {} });
    const out = await generateTransformation("Quadratic Equations cite-test", "flashcards", "Math", "10");
    expect(out.citation).toMatch(/From NCERT/);
    expect(out.citation).toMatch(/Ch\.4/);
  });
});

describe("getAIExplanation — citation footer", () => {
  test("appends a citation line when RAG chunks grounded the answer", async () => {
    mockRetrieve.mockResolvedValueOnce({
      context: "chunk text",
      sources: [{ source: "NCERT Ch.4 Exercise 4.1" }],
    });
    mockCreate.mockResolvedValue({ content: [{ text: "You forgot the discriminant." }], usage: { input_tokens: 5, output_tokens: 5 } });
    const { text } = await getAIExplanation("Solve x²=4", "concept_error", "±2", "Math");
    expect(text).toMatch(/📖 From NCERT: NCERT Ch\.4 Exercise 4\.1/);
  });

  test("no citation line when RAG found nothing", async () => {
    mockRetrieve.mockResolvedValueOnce(null);
    mockCreate.mockResolvedValue({ content: [{ text: "A plain answer with no textbook grounding." }], usage: {} });
    const { text } = await getAIExplanation("Q?", "concept_error", "A", "Math");
    expect(text).toBe("A plain answer with no textbook grounding.");
  });
});
