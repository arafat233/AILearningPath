import { jest } from "@jest/globals";
import Joi from "joi";

const mockAggregate = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  Question: { aggregate: mockAggregate },
}));

// Passthrough mocks for auth + validate middleware
jest.unstable_mockModule("../middleware/auth.js", () => ({
  auth: (req, _res, next) => { req.user = { id: "u1", role: "student" }; next(); },
}));
jest.unstable_mockModule("../middleware/validate.js", () => ({
  validate: () => (_req, _res, next) => next(),
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

// Import router after mocks are registered
const { default: router } = await import("../routes/competitionRoutes.js");

// Extract the async route handler from the Express router
function getRouteHandler(expressRouter, method, path) {
  for (const layer of expressRouter.stack) {
    if (layer.route?.path === path && layer.route.methods[method]) {
      const stack = layer.route.stack;
      return stack[stack.length - 1].handle;
    }
  }
  return null;
}

function mockRes() {
  const res = { json: jest.fn(), status: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
}

const handler = getRouteHandler(router, "post", "/room-questions");

afterEach(() => jest.clearAllMocks());

// ── Joi schema validation ──────────────────────────────────────────────────────
// Mirror the schema from competitionRoutes.js to test it independently
const roomQuestionsSchema = Joi.object({
  topic: Joi.string().optional().allow(""),
  count: Joi.number().integer().min(1).max(50).optional(),
});

describe("roomQuestionsSchema — input validation", () => {
  test("valid: empty body (all fields optional)", () => {
    const { error } = roomQuestionsSchema.validate({});
    expect(error).toBeUndefined();
  });

  test("valid: topic string + count within 1-50 range", () => {
    const { error } = roomQuestionsSchema.validate({ topic: "Algebra", count: 20 });
    expect(error).toBeUndefined();
  });

  test("valid: empty string topic is allowed", () => {
    const { error } = roomQuestionsSchema.validate({ topic: "" });
    expect(error).toBeUndefined();
  });

  test("valid: count at minimum boundary (1)", () => {
    const { error } = roomQuestionsSchema.validate({ count: 1 });
    expect(error).toBeUndefined();
  });

  test("valid: count at maximum boundary (50)", () => {
    const { error } = roomQuestionsSchema.validate({ count: 50 });
    expect(error).toBeUndefined();
  });

  test("invalid: count of 0 is below minimum", () => {
    const { error } = roomQuestionsSchema.validate({ count: 0 });
    expect(error).toBeDefined();
  });

  test("invalid: count of 51 exceeds maximum", () => {
    const { error } = roomQuestionsSchema.validate({ count: 51 });
    expect(error).toBeDefined();
  });

  test("invalid: non-integer count is rejected", () => {
    const { error } = roomQuestionsSchema.validate({ count: 2.5 });
    expect(error).toBeDefined();
  });
});

// ── route handler — correct behaviour ─────────────────────────────────────────

describe("POST /room-questions — handler", () => {
  test("returns questions from Question.aggregate", async () => {
    const questions = [{ _id: "q1", questionText: "Q1", options: [{ text: "A" }] }];
    mockAggregate.mockResolvedValue(questions);

    const req = { body: { topic: "Algebra", count: 5 }, user: { id: "u1" } };
    const res = mockRes();
    await handler(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(questions);
  });

  test("includes topic filter when topic is provided", async () => {
    mockAggregate.mockResolvedValue([]);
    const req = { body: { topic: "Algebra" }, user: { id: "u1" } };
    await handler(req, mockRes(), jest.fn());

    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[0].$match).toMatchObject({ topic: "Algebra", deletedAt: null });
  });

  test("omits topic from filter when topic is not in body", async () => {
    mockAggregate.mockResolvedValue([]);
    const req = { body: { count: 10 }, user: { id: "u1" } };
    await handler(req, mockRes(), jest.fn());

    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[0].$match.topic).toBeUndefined();
    expect(pipeline[0].$match.deletedAt).toBeNull();
  });

  test("defaults sample size to 10 when count is not supplied", async () => {
    mockAggregate.mockResolvedValue([]);
    const req = { body: {}, user: { id: "u1" } };
    await handler(req, mockRes(), jest.fn());

    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[1].$sample.size).toBe(10);
  });

  test("uses the supplied count as sample size", async () => {
    mockAggregate.mockResolvedValue([]);
    const req = { body: { count: 25 }, user: { id: "u1" } };
    await handler(req, mockRes(), jest.fn());

    const pipeline = mockAggregate.mock.calls[0][0];
    expect(pipeline[1].$sample.size).toBe(25);
  });

  test("$project strips 'type' field from options — only exposes text", async () => {
    mockAggregate.mockResolvedValue([]);
    const req = { body: {}, user: { id: "u1" } };
    await handler(req, mockRes(), jest.fn());

    const pipeline = mockAggregate.mock.calls[0][0];
    const optionsProjection = pipeline[2].$project.options;
    expect(optionsProjection.$map.in).toEqual({ text: "$$o.text" });
    expect(optionsProjection.$map.in.type).toBeUndefined();
  });

  test("calls next(err) on aggregate failure", async () => {
    mockAggregate.mockRejectedValue(new Error("DB error"));
    const next = jest.fn();
    const req = { body: {}, user: { id: "u1" } };
    await handler(req, mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
