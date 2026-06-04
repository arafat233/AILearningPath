import { jest } from "@jest/globals";

const mockCreate = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockCountDocuments = jest.fn();
const mockDistinct = jest.fn();
const mockDeleteOne = jest.fn();

jest.unstable_mockModule("../models/communityModels.js", () => ({
  CommunityPost: {
    create: mockCreate,
    find: mockFind,
    findById: mockFindById,
    findOneAndUpdate: mockFindOneAndUpdate,
    countDocuments: mockCountDocuments,
    distinct: mockDistinct,
    deleteOne: mockDeleteOne,
  },
}));

jest.unstable_mockModule("../models/index.js", () => ({
  User: { findById: () => ({ select: () => ({ lean: async () => ({ name: "Ada" }) }) }) },
}));

jest.unstable_mockModule("../utils/eventTracker.js", () => ({ trackEvent: jest.fn() }));

const svc = await import("../services/communityService.js");

// chainable find(...).sort().skip().limit().lean()
function chain(result) {
  const o = {};
  o.sort = () => o; o.skip = () => o; o.limit = () => o;
  o.lean = () => Promise.resolve(result);
  return o;
}
// chainable findOneAndUpdate(...).lean()  (with .catch)
function leanOf(result) {
  const p = Promise.resolve(result);
  return { lean: () => ({ catch: (fn) => p.catch(fn), then: (f, r) => p.then(f, r) }) };
}
// a fake mongoose doc for findById-based mutations
function fakeDoc(over = {}) {
  const doc = {
    _id: "p1", userId: "owner", authorName: "Ada", kind: "article",
    title: "T", body: "B", tags: [], upvoters: [], upvoteCount: 0,
    comments: [], commentCount: 0, views: 0, status: "published", pinned: false, reports: [],
    ...over,
  };
  doc.save = jest.fn(async () => doc);
  doc.toObject = () => ({ ...doc });
  // comments.id() / subdoc.deleteOne() support
  doc.comments.id = (cid) => doc.comments.find((c) => String(c._id) === String(cid)) || null;
  return doc;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCreate.mockImplementation(async (d) => ({ toObject: () => ({ _id: "p1", ...d }) }));
});

describe("createPost", () => {
  test("rejects invalid kind", async () => {
    await expect(svc.createPost("u1", { kind: "blog", title: "x", body: "y" }))
      .rejects.toMatchObject({ statusCode: 400 });
    expect(mockCreate).not.toHaveBeenCalled();
  });
  test("rejects empty title", async () => {
    await expect(svc.createPost("u1", { kind: "article", title: "  ", body: "y" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });
  test("rejects empty body", async () => {
    await expect(svc.createPost("u1", { kind: "question", title: "x", body: "" }))
      .rejects.toMatchObject({ statusCode: 400 });
  });
  test("creates and shapes, normalising tags", async () => {
    const out = await svc.createPost("u1", { kind: "article", title: "Hi", body: "Body", tags: ["#DP", "dp", " Greedy ", "dp"] });
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const saved = mockCreate.mock.calls[0][0];
    expect(saved.tags).toEqual(["dp", "greedy"]);   // lowercased, #-stripped, deduped
    expect(saved.authorName).toBe("Ada");
    expect(out.isMine).toBe(true);
    expect(out.upvotes).toBe(0);
    expect(out.kind).toBe("article");
  });
});

describe("listPosts", () => {
  test("filters by status=published + kind + tag; default sort=new", async () => {
    mockFind.mockReturnValue(chain([{ _id: "a", kind: "article", title: "A", upvoters: ["x"], comments: [] }]));
    mockCountDocuments.mockResolvedValue(1);
    const out = await svc.listPosts("u1", { kind: "article", tag: "#DP", limit: 10 });
    const filter = mockFind.mock.calls[0][0];
    expect(filter.status).toBe("published");
    expect(filter.kind).toBe("article");
    expect(filter.tags).toBe("dp");
    expect(out.total).toBe(1);
    expect(out.items[0].upvotes).toBe(1);
  });
  test("search adds a regex $or", async () => {
    mockFind.mockReturnValue(chain([]));
    mockCountDocuments.mockResolvedValue(0);
    await svc.listPosts("u1", { q: "binary" });
    const filter = mockFind.mock.calls[0][0];
    expect(Array.isArray(filter.$or)).toBe(true);
  });
});

describe("getPost", () => {
  test("404 when not found", async () => {
    mockFindOneAndUpdate.mockReturnValue(leanOf(null));
    await expect(svc.getPost("u1", "missing")).rejects.toMatchObject({ statusCode: 404 });
  });
  test("increments views and returns full shape with comments", async () => {
    mockFindOneAndUpdate.mockReturnValue(leanOf({
      _id: "p1", kind: "question", title: "Q", body: "full body", userId: "owner",
      upvoters: ["u1"], comments: [{ _id: "c1", userId: "u1", authorName: "Me", body: "hi", createdAt: new Date() }], reports: [],
    }));
    const out = await svc.getPost("u1", "p1");
    expect(mockFindOneAndUpdate.mock.calls[0][1]).toEqual({ $inc: { views: 1 } });
    expect(out.body).toBe("full body");
    expect(out.upvotedByMe).toBe(true);
    expect(out.comments[0].isMine).toBe(true);
  });
});

describe("toggleUpvote", () => {
  test("adds an upvote when absent, then removes when present", async () => {
    const doc = fakeDoc({ upvoters: [] });
    mockFindById.mockResolvedValue(doc);
    let res = await svc.toggleUpvote("u1", "p1");
    expect(res).toEqual({ upvotes: 1, upvotedByMe: true });
    expect(doc.upvoters).toContain("u1");
    res = await svc.toggleUpvote("u1", "p1");
    expect(res).toEqual({ upvotes: 0, upvotedByMe: false });
  });
});

describe("deletePost", () => {
  test("rejects a non-owner", async () => {
    mockFindById.mockReturnValue({ select: () => ({ lean: async () => ({ userId: "owner" }) }) });
    await expect(svc.deletePost("intruder", "p1")).rejects.toMatchObject({ statusCode: 403 });
    expect(mockDeleteOne).not.toHaveBeenCalled();
  });
  test("owner can delete", async () => {
    mockFindById.mockReturnValue({ select: () => ({ lean: async () => ({ userId: "owner" }) }) });
    mockDeleteOne.mockResolvedValue({ deletedCount: 1 });
    expect(await svc.deletePost("owner", "p1")).toEqual({ deleted: true });
  });
});

describe("addComment", () => {
  test("rejects empty body", async () => {
    await expect(svc.addComment("u1", "p1", "   ")).rejects.toMatchObject({ statusCode: 400 });
  });
  test("appends a comment and bumps commentCount", async () => {
    const doc = fakeDoc({ comments: [] });
    mockFindById.mockResolvedValue(doc);
    const out = await svc.addComment("u1", "p1", "great post");
    expect(doc.comments).toHaveLength(1);
    expect(doc.commentCount).toBe(1);
    expect(out.comments[0].body).toBe("great post");
  });
});

describe("reportPost", () => {
  test("dedupes a repeat report by the same user", async () => {
    const doc = fakeDoc({ reports: [{ userId: "u1", reason: "spam" }] });
    mockFindById.mockResolvedValue(doc);
    const out = await svc.reportPost("u1", "p1", "again");
    expect(out).toEqual({ reported: true, already: true });
    expect(doc.reports).toHaveLength(1);
  });
  test("records a new report", async () => {
    const doc = fakeDoc({ reports: [] });
    mockFindById.mockResolvedValue(doc);
    const out = await svc.reportPost("u2", "p1", "off-topic");
    expect(out).toEqual({ reported: true });
    expect(doc.reports).toHaveLength(1);
  });
});

describe("moderate", () => {
  test("unknown action → 400", async () => {
    mockFindById.mockResolvedValue(fakeDoc());
    await expect(svc.moderate("admin", "p1", "nuke")).rejects.toMatchObject({ statusCode: 400 });
  });
  test("remove sets status=removed; pin sets pinned=true", async () => {
    const doc = fakeDoc();
    mockFindById.mockResolvedValue(doc);
    let res = await svc.moderate("admin", "p1", "remove");
    expect(res.status).toBe("removed");
    res = await svc.moderate("admin", "p1", "pin");
    expect(res.pinned).toBe(true);
  });
});
