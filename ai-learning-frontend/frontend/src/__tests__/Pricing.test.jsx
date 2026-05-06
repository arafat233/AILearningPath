import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// ── API mocks ──────────────────────────────────────────────────────────────────
vi.mock("../services/api", () => ({
  getPlans:       vi.fn(),
  getSubscription: vi.fn(),
  createOrder:    vi.fn(),
  verifyPayment:  vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  // Pricing calls useAuthStore() without a selector; VoiceTutor uses selector form.
  // This mock handles both styles.
  useAuthStore: vi.fn((selector) => {
    const state = { user: { id: "u1", name: "Test User", email: "test@test.com" } };
    return typeof selector === "function" ? selector(state) : state;
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { getPlans, getSubscription, createOrder, verifyPayment } from "../services/api";
import Pricing from "../pages/Pricing";

// ── Razorpay mock helpers ──────────────────────────────────────────────────────
const mockRazorpayOpen = vi.fn();
const mockRazorpayConstructor = vi.fn().mockImplementation(() => ({ open: mockRazorpayOpen }));

const MOCK_PLANS = {
  pro: {
    name: "Pro",
    price: 49900,
    features: ["All 5 subjects", "100 AI explanations/day"],
  },
  premium: {
    name: "Premium",
    price: 99900,
    features: ["Unlimited AI", "All 5 subjects", "Voice tutor"],
  },
};

const FREE_SUBSCRIPTION = { plan: "free", isActive: false };

function renderPricing() {
  return render(
    <MemoryRouter>
      <Pricing />
    </MemoryRouter>
  );
}

beforeEach(() => {
  // Simulate Razorpay script already present so loadRazorpayScript() returns true immediately
  const existingScript = document.getElementById("razorpay-script");
  if (!existingScript) {
    const s = document.createElement("script");
    s.id = "razorpay-script";
    document.body.appendChild(s);
  }
  window.Razorpay = mockRazorpayConstructor;

  getPlans.mockResolvedValue({ data: { data: MOCK_PLANS } });
  getSubscription.mockResolvedValue({ data: { data: FREE_SUBSCRIPTION } });
  createOrder.mockResolvedValue({
    data: {
      data: {
        orderId:  "order_test123",
        amount:   49900,
        currency: "INR",
        keyId:    "rzp_test_key",
        planName: "Pro",
      },
    },
  });
  verifyPayment.mockResolvedValue({ data: { success: true } });
});

afterEach(() => {
  document.getElementById("razorpay-script")?.remove();
  vi.clearAllMocks();
});

// ── Loading state ──────────────────────────────────────────────────────────────

describe("Pricing — loading state", () => {
  it("shows a loading spinner before data arrives", () => {
    getPlans.mockReturnValue(new Promise(() => {})); // never resolves
    renderPricing();
    expect(document.querySelector(".animate-spin")).toBeTruthy();
  });
});

// ── Error state ────────────────────────────────────────────────────────────────

describe("Pricing — error state", () => {
  it("shows an error message when API calls fail", async () => {
    getPlans.mockRejectedValue(new Error("Network error"));
    renderPricing();
    await waitFor(() =>
      expect(screen.getByText(/could not load pricing/i)).toBeInTheDocument()
    );
  });
});

// ── Rendering plans ────────────────────────────────────────────────────────────

describe("Pricing — plan rendering", () => {
  it("renders Free, Pro, and Premium plan headings", async () => {
    renderPricing();
    // ₹0 only appears once the free plan card has rendered
    await waitFor(() => expect(screen.getByText("₹0")).toBeInTheDocument());
    // Plan cards include upgrade buttons
    expect(screen.getByRole("button", { name: /upgrade to pro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upgrade to premium/i })).toBeInTheDocument();
  });

  it("shows formatted prices for paid plans", async () => {
    renderPricing();
    await waitFor(() => expect(screen.getByText("₹0")).toBeInTheDocument());
    // Pro: 49900 / 100 = 499, Premium: 99900 / 100 = 999
    expect(screen.getByText(/₹499/)).toBeInTheDocument();
    expect(screen.getByText(/₹999/)).toBeInTheDocument();
  });

  it("shows 'Most Popular' badge on Premium plan", async () => {
    renderPricing();
    await waitFor(() => screen.getByText("Most Popular"));
  });

  it("shows 'Current plan' badge when user is on free plan", async () => {
    renderPricing();
    await waitFor(() =>
      expect(screen.getAllByText(/current plan/i).length).toBeGreaterThan(0)
    );
  });

  it("shows active plan badge and expiry when on a paid plan", async () => {
    getSubscription.mockResolvedValue({
      data: {
        data: {
          plan: "pro",
          isActive: true,
          planExpiry: new Date("2026-12-31").toISOString(),
        },
      },
    });
    renderPricing();
    await waitFor(() => expect(screen.getByText(/you're on the pro plan/i)).toBeInTheDocument());
  });
});

// ── Upgrade flow ───────────────────────────────────────────────────────────────

describe("Pricing — upgrade flow", () => {
  it("clicking Upgrade to Pro calls createOrder with 'pro'", async () => {
    renderPricing();
    const upgradeBtn = await screen.findByRole("button", { name: /upgrade to pro/i });
    await userEvent.click(upgradeBtn);

    await waitFor(() => expect(createOrder).toHaveBeenCalledWith("pro"));
  });

  it("opens Razorpay checkout after createOrder succeeds", async () => {
    renderPricing();
    const upgradeBtn = await screen.findByRole("button", { name: /upgrade to pro/i });
    await userEvent.click(upgradeBtn);

    await waitFor(() => expect(mockRazorpayConstructor).toHaveBeenCalled());
    expect(mockRazorpayOpen).toHaveBeenCalled();
  });

  it("passes user name and email to Razorpay prefill", async () => {
    renderPricing();
    const upgradeBtn = await screen.findByRole("button", { name: /upgrade to pro/i });
    await userEvent.click(upgradeBtn);

    await waitFor(() => expect(mockRazorpayConstructor).toHaveBeenCalled());
    const options = mockRazorpayConstructor.mock.calls[0][0];
    expect(options.prefill.name).toBe("Test User");
    expect(options.prefill.email).toBe("test@test.com");
  });

  it("shows 'Processing…' spinner while payment is in progress", async () => {
    // createOrder never resolves — keep it pending to observe intermediate state
    createOrder.mockReturnValue(new Promise(() => {}));
    renderPricing();
    const upgradeBtn = await screen.findByRole("button", { name: /upgrade to pro/i });
    await userEvent.click(upgradeBtn);

    await waitFor(() => expect(screen.getByText(/processing/i)).toBeInTheDocument());
  });

  it("shows error message if Razorpay script fails to load", async () => {
    // Remove the script tag so loadRazorpayScript can't find it
    document.getElementById("razorpay-script")?.remove();
    // Also make the script injection fail by making createElement return a failing script
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag) => {
      if (tag === "script") {
        const s = origCreate("script");
        setTimeout(() => s.onerror?.(), 0);
        return s;
      }
      return origCreate(tag);
    });

    renderPricing();
    const upgradeBtn = await screen.findByRole("button", { name: /upgrade to pro/i });
    await userEvent.click(upgradeBtn);

    await waitFor(() =>
      expect(screen.getByText(/razorpay failed to load/i)).toBeInTheDocument()
    );
    vi.restoreAllMocks();
  });

  it("disables upgrade button for the user's current active plan", async () => {
    getSubscription.mockResolvedValue({
      data: { data: { plan: "pro", isActive: true, planExpiry: new Date("2099-01-01").toISOString() } },
    });
    renderPricing();
    const currentPlanBtn = await screen.findByRole("button", { name: /current plan/i });
    expect(currentPlanBtn).toBeDisabled();
  });
});
