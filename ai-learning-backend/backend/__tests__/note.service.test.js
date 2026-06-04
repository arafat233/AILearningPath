import { jest } from "@jest/globals";

const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockDeleteOne = jest.fn();
const mockCountDocuments = jest.fn();
const mockDistinct = jest.fn();

jest.unstable_mockModule("../models/noteModels.js", () => ({
  Note: {
    create: mockCreate,
    find: mockFind,
    findOneAndUpdate: mockFindOneAndUpdate,
    deleteOne: mockDeleteOne,
    countDocuments: mockCountDocuments,
    distinct: mockDistinct,
  },
}));

const svc = await import("../services/noteService.js");

// chainable Note.find(...).sort().skip().limit().lean()
function chain(result) {
  const o = {};
  o.sort = () => o; o.skip = () => o; o.limit = () => o;
  o.lean = () => Promise.resolve(result);
  return o;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCreate.mockImplementation(async (doc) => ({ toObject: () => ({ _id: "x", ...doc }) }));
});

describe("noteService.createNote", () => {
  test("rejects a highlight with no quote", async () => {
    await expect(svc.createNote("u1", { scope: "pro", kind: "exercise", refId: "e1", type: "highlight", quote: "  " }))
      .rejects.toMatchObject({ statusCode: 400 });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("rejects a note with no body", async () => {
    await expect(svc.createNote("u1", { scope: "k12", kind: "lesson", refId: "l1", type: "note", body: "" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  test("creates a highlight when a quote is present", async () => {
    const out = await svc.createNote("u1", { scope: "pro", kind: "exercise", refId: "e1", type: "highlight", quote: "binary search" });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(out.quote).toBe("binary search");
  });

  test("normalises tags: trims, lowercases, strips #, dedupes", async () => {
    await svc.createNote("u1", { scope: "pro", kind: "topic", refId: "t1", body: "x", tags: ["#DP", "dp", "  Greedy ", "dp"] });
    const passed = mockCreate.mock.calls[0][0];
    expect(passed.tags).toEqual(["dp", "greedy"]);
  });
});

describe("noteService.listNotebook", () => {
  test("applies a case-insensitive $or regex when q is given", async () => {
    mockFind.mockReturnValue(chain([{ _id: "1" }]));
    mockCountDocuments.mockResolvedValue(1);
    await svc.listNotebook("u1", { q: "kadane", scope: "pro" });
    const filterArg = mockFind.mock.calls[0][0];
    expect(filterArg.userId).toBe("u1");
    expect(filterArg.scope).toBe("pro");
    expect(Array.isArray(filterArg.$or)).toBe(true);
  });

  test("plain list (no q) filters without $or", async () => {
    mockFind.mockReturnValue(chain([]));
    mockCountDocuments.mockResolvedValue(0);
    await svc.listNotebook("u1", { kind: "lesson" });
    const filterArg = mockFind.mock.calls[0][0];
    expect(filterArg.$or).toBeUndefined();
    expect(filterArg.kind).toBe("lesson");
  });
});

describe("noteService.updateNote / deleteNote ownership", () => {
  test("updateNote throws 404 when the note isn't found for this user", async () => {
    mockFindOneAndUpdate.mockReturnValue({ lean: () => Promise.resolve(null) });
    await expect(svc.updateNote("u1", "507f1f77bcf86cd799439011", { body: "y" }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  test("deleteNote throws 404 when nothing was deleted", async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 0 });
    await expect(svc.deleteNote("u1", "507f1f77bcf86cd799439011"))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  test("deleteNote succeeds when a doc is removed", async () => {
    mockDeleteOne.mockResolvedValue({ deletedCount: 1 });
    await expect(svc.deleteNote("u1", "507f1f77bcf86cd799439011")).resolves.toEqual({ deleted: true });
  });
});
