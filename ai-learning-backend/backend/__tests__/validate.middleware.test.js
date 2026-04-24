import { jest } from "@jest/globals";
import Joi from "joi";
import { validate } from "../middleware/validate.js";

const schema = Joi.object({
  name:  Joi.string().required(),
  age:   Joi.number().required(),
});

function run(body) {
  const req  = { body };
  const res  = {};
  const next = jest.fn();
  validate(schema)(req, res, next);
  return next;
}

describe("validate middleware", () => {
  test("valid body → next() called with no args", () => {
    const next = run({ name: "Alice", age: 20 });
    expect(next).toHaveBeenCalledWith();
  });

  test("missing required field → next called with AppError 422", () => {
    const next = run({ name: "Alice" }); // missing age
    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(422);
  });

  test("unknown extra field → next called with AppError 422 (allowUnknown: false)", () => {
    const next = run({ name: "Alice", age: 20, extra: "bad" });
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(422);
  });

  test("wrong type → next called with AppError 422", () => {
    const next = run({ name: "Alice", age: "notanumber" });
    const err = next.mock.calls[0][0];
    expect(err.statusCode).toBe(422);
  });
});
