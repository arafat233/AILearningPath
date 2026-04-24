import { jest } from "@jest/globals";

const mockSessionSet  = jest.fn();
const mockSessionGet  = jest.fn();
const mockSessionDel  = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindById    = jest.fn();

jest.unstable_mockModule("../utils/redisClient.js", () => ({
  sessionSet: mockSessionSet,
  sessionGet: mockSessionGet,
  sessionDel: mockSessionDel,
}));
jest.unstable_mockModule("../models/index.js", () => ({
  User: { findByIdAndUpdate: mockFindByIdAndUpdate, findById: mockFindById },
}));
jest.unstable_mockModule("../utils/logger.js", () => ({
  default: { info: jest.fn(), warn: jest.fn() },
}));

// Mock Razorpay constructor
const mockOrdersCreate = jest.fn();
jest.unstable_mockModule("razorpay", () => ({
  default: jest.fn().mockImplementation(() => ({
    orders: { create: mockOrdersCreate },
  })),
}));

const { createOrder, verifyPayment, getSubscription, PLANS } = await import("../services/paymentService.js");
import crypto from "crypto";

beforeEach(() => {
  process.env.RAZORPAY_KEY_ID     = "rzp_test_key123";
  process.env.RAZORPAY_KEY_SECRET = "test_secret";
  mockSessionSet.mockResolvedValue(null);
  mockSessionGet.mockResolvedValue(null);
  mockSessionDel.mockResolvedValue(null);
});

afterEach(() => jest.clearAllMocks());

describe("createOrder", () => {
  test("valid planKey → stores planKey in Redis and returns orderId", async () => {
    mockOrdersCreate.mockResolvedValue({ id: "order_abc", amount: 19900, currency: "INR" });
    const result = await createOrder("user1", "pro");
    expect(mockSessionSet).toHaveBeenCalledWith("order_plan:order_abc", "pro", 1800);
    expect(result.orderId).toBe("order_abc");
    expect(result.planKey).toBe("pro");
  });

  test("unknown planKey → throws AppError 400", async () => {
    await expect(createOrder("user1", "superplan")).rejects.toMatchObject({ statusCode: 400 });
  });

  test("missing Razorpay env keys → throws AppError 503", async () => {
    delete process.env.RAZORPAY_KEY_ID;
    await expect(createOrder("user1", "pro")).rejects.toMatchObject({ statusCode: 503 });
  });
});

describe("verifyPayment", () => {
  function makeSignature(orderId, paymentId) {
    return crypto.createHmac("sha256", "test_secret").update(`${orderId}|${paymentId}`).digest("hex");
  }

  test("correct HMAC + valid Redis key → plan upgraded, Redis key deleted", async () => {
    mockSessionGet.mockResolvedValue("pro");
    mockFindByIdAndUpdate.mockResolvedValue({ name: "Alice", email: "a@b.com", plan: "pro", planExpiry: new Date(), isPaid: true });
    const sig = makeSignature("order_abc", "pay_xyz");
    const result = await verifyPayment("user1", {
      razorpayOrderId: "order_abc", razorpayPaymentId: "pay_xyz", razorpaySignature: sig,
    });
    expect(mockSessionDel).toHaveBeenCalled();
    expect(result.user.plan).toBe("pro");
  });

  test("tampered signature → throws AppError 400", async () => {
    mockSessionGet.mockResolvedValue("pro");
    await expect(verifyPayment("user1", {
      razorpayOrderId: "order_abc", razorpayPaymentId: "pay_xyz", razorpaySignature: "badhash",
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  test("missing Redis key (expired/swapped) → throws AppError 400", async () => {
    mockSessionGet.mockResolvedValue(null); // key not found
    await expect(verifyPayment("user1", {
      razorpayOrderId: "order_abc", razorpayPaymentId: "pay_xyz", razorpaySignature: "anything",
    })).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe("getSubscription", () => {
  test("active plan → isActive:true", async () => {
    mockFindById.mockReturnValue({ select: jest.fn().mockResolvedValue({
      plan: "pro", isPaid: true, planExpiry: new Date(Date.now() + 86400000), aiCallsToday: 5, aiCallsDate: "2026-01-01",
    })});
    const result = await getSubscription("user1");
    expect(result.isActive).toBe(true);
  });

  test("expired plan → isActive:false", async () => {
    mockFindById.mockReturnValue({ select: jest.fn().mockResolvedValue({
      plan: "pro", isPaid: true, planExpiry: new Date(Date.now() - 86400000), aiCallsToday: 0, aiCallsDate: "",
    })});
    const result = await getSubscription("user1");
    expect(result.isActive).toBe(false);
  });

  test("unknown user → throws AppError 404", async () => {
    mockFindById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    await expect(getSubscription("missing")).rejects.toMatchObject({ statusCode: 404 });
  });
});
