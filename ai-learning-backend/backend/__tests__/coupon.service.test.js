import { jest } from "@jest/globals";

const mockFindOne           = jest.fn();
const mockFindById          = jest.fn();
const mockFindOneAndUpdate  = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  Coupon: {
    findOne:          mockFindOne,
    findById:         mockFindById,
    findOneAndUpdate: mockFindOneAndUpdate,
  },
}));

const { validateCoupon, computeDiscount, redeemCoupon } =
  await import("../services/couponService.js");

afterEach(() => jest.clearAllMocks());

// ── validateCoupon ────────────────────────────────────────────────────────────

describe("validateCoupon", () => {
  const base = {
    code: "SAVE20", isActive: true,
    validUntil: null, maxUses: 0, usedCount: 0, planFilter: [],
  };

  test("valid code with no restrictions → returns coupon", async () => {
    mockFindOne.mockResolvedValue(base);
    const result = await validateCoupon("SAVE20", "pro");
    expect(result).toEqual(base);
  });

  test("unknown / inactive code → throws 400", async () => {
    mockFindOne.mockResolvedValue(null);
    await expect(validateCoupon("BAD", "pro")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("expired coupon → throws 400", async () => {
    mockFindOne.mockResolvedValue({ ...base, validUntil: new Date(Date.now() - 86400_000) });
    await expect(validateCoupon("SAVE20", "pro")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("coupon not yet expired → passes", async () => {
    mockFindOne.mockResolvedValue({ ...base, validUntil: new Date(Date.now() + 86400_000) });
    const result = await validateCoupon("SAVE20", "pro");
    expect(result.code).toBe("SAVE20");
  });

  test("usage limit reached (usedCount >= maxUses) → throws 400", async () => {
    mockFindOne.mockResolvedValue({ ...base, maxUses: 5, usedCount: 5 });
    await expect(validateCoupon("SAVE20", "pro")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("usage limit not yet reached → passes", async () => {
    mockFindOne.mockResolvedValue({ ...base, maxUses: 5, usedCount: 4 });
    const result = await validateCoupon("SAVE20", "pro");
    expect(result).toBeDefined();
  });

  test("unlimited uses (maxUses: 0) regardless of usedCount → passes", async () => {
    mockFindOne.mockResolvedValue({ ...base, maxUses: 0, usedCount: 9999 });
    const result = await validateCoupon("SAVE20", "pro");
    expect(result).toBeDefined();
  });

  test("planFilter mismatch → throws 400", async () => {
    mockFindOne.mockResolvedValue({ ...base, planFilter: ["premium"] });
    await expect(validateCoupon("SAVE20", "pro")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("planFilter matches → passes", async () => {
    mockFindOne.mockResolvedValue({ ...base, planFilter: ["pro", "premium"] });
    const result = await validateCoupon("SAVE20", "pro");
    expect(result).toBeDefined();
  });

  test("empty planFilter [] → valid for any plan", async () => {
    mockFindOne.mockResolvedValue({ ...base, planFilter: [] });
    const result = await validateCoupon("SAVE20", "free");
    expect(result).toBeDefined();
  });
});

// ── computeDiscount ───────────────────────────────────────────────────────────

describe("computeDiscount", () => {
  test("percent discount → rounds correctly", () => {
    const coupon = { discountType: "percent", discountValue: 20 };
    const { discountAmount, finalPrice, discountLabel } = computeDiscount(coupon, 19900);
    expect(discountAmount).toBe(3980);
    expect(finalPrice).toBe(15920);
    expect(discountLabel).toBe("20% off");
  });

  test("fixed discount → subtracts paise directly", () => {
    const coupon = { discountType: "fixed", discountValue: 5000 };
    const { discountAmount, finalPrice, discountLabel } = computeDiscount(coupon, 19900);
    expect(discountAmount).toBe(5000);
    expect(finalPrice).toBe(14900);
    expect(discountLabel).toBe("₹50 off");
  });

  test("discount capped so finalPrice never drops below 100 paise", () => {
    const coupon = { discountType: "percent", discountValue: 100 };
    const { finalPrice } = computeDiscount(coupon, 19900);
    expect(finalPrice).toBeGreaterThanOrEqual(100);
  });

  test("fixed discount larger than price → clamped to basePrice - 100", () => {
    const coupon = { discountType: "fixed", discountValue: 99999 };
    const { finalPrice } = computeDiscount(coupon, 19900);
    expect(finalPrice).toBe(100);
  });

  test("zero discount → no change", () => {
    const coupon = { discountType: "percent", discountValue: 0 };
    const { discountAmount, finalPrice } = computeDiscount(coupon, 19900);
    expect(discountAmount).toBe(0);
    expect(finalPrice).toBe(19900);
  });
});

// ── redeemCoupon ──────────────────────────────────────────────────────────────

describe("redeemCoupon", () => {
  test("unlimited coupon (maxUses 0) → always succeeds", async () => {
    const stub = { _id: "c1", maxUses: 0, usedCount: 5 };
    mockFindById.mockReturnValue({ lean: () => Promise.resolve(stub) });
    mockFindOneAndUpdate.mockResolvedValue({ ...stub, usedCount: 6 });
    const result = await redeemCoupon("c1");
    expect(result.usedCount).toBe(6);
    // filter should NOT include usedCount constraint for unlimited
    const filterArg = mockFindOneAndUpdate.mock.calls[0][0];
    expect(filterArg).not.toHaveProperty("usedCount");
  });

  test("limited coupon under limit → increments usedCount", async () => {
    const stub = { _id: "c2", maxUses: 10, usedCount: 7 };
    mockFindById.mockReturnValue({ lean: () => Promise.resolve(stub) });
    mockFindOneAndUpdate.mockResolvedValue({ ...stub, usedCount: 8 });
    const result = await redeemCoupon("c2");
    expect(result.usedCount).toBe(8);
    // filter should contain $lt guard
    const filterArg = mockFindOneAndUpdate.mock.calls[0][0];
    expect(filterArg.usedCount).toEqual({ $lt: 10 });
  });

  test("limit already exhausted (findOneAndUpdate returns null) → throws 400", async () => {
    const stub = { _id: "c3", maxUses: 5, usedCount: 5 };
    mockFindById.mockReturnValue({ lean: () => Promise.resolve(stub) });
    mockFindOneAndUpdate.mockResolvedValue(null);
    await expect(redeemCoupon("c3")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("coupon not found → throws 404", async () => {
    mockFindById.mockReturnValue({ lean: () => Promise.resolve(null) });
    await expect(redeemCoupon("missing")).rejects.toMatchObject({ statusCode: 404 });
  });

  test("update uses $inc to avoid overwrite race", async () => {
    const stub = { _id: "c4", maxUses: 0, usedCount: 0 };
    mockFindById.mockReturnValue({ lean: () => Promise.resolve(stub) });
    mockFindOneAndUpdate.mockResolvedValue({ ...stub, usedCount: 1 });
    await redeemCoupon("c4");
    const updateArg = mockFindOneAndUpdate.mock.calls[0][1];
    expect(updateArg).toHaveProperty("$inc.usedCount", 1);
  });
});
