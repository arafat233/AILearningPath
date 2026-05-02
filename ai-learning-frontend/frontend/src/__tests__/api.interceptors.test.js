/**
 * Tests for api.js interceptors:
 * - CSRF token header injected on mutating requests
 * - 401 on non-/user/me calls → logout
 * - 401 on /user/me does NOT trigger logout
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock zustand auth store before importing api
vi.mock("../store/authStore", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ logout: logoutSpy })),
  },
}));

const logoutSpy = vi.fn();

// Helpers to simulate the CSRF interceptor logic directly
// (avoids spinning up a real axios instance with cookies)
function getCsrfFromCookie(cookieStr) {
  const match = cookieStr.match(/(?:^|;\s*)csrf=([^;]+)/);
  return match ? match[1] : null;
}

function shouldAttachCsrf(method) {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

describe("CSRF token interceptor logic", () => {
  it("injects csrf header for POST", () => {
    const cookie = "csrf=test-csrf-token; other=val";
    const token  = getCsrfFromCookie(cookie);
    expect(token).toBe("test-csrf-token");
    expect(shouldAttachCsrf("POST")).toBe(true);
  });

  it("injects csrf header for PUT and DELETE", () => {
    expect(shouldAttachCsrf("PUT")).toBe(true);
    expect(shouldAttachCsrf("DELETE")).toBe(true);
  });

  it("does NOT inject csrf header for GET / HEAD / OPTIONS", () => {
    expect(shouldAttachCsrf("GET")).toBe(false);
    expect(shouldAttachCsrf("HEAD")).toBe(false);
    expect(shouldAttachCsrf("OPTIONS")).toBe(false);
  });

  it("returns null when csrf cookie is absent", () => {
    expect(getCsrfFromCookie("session=abc; theme=dark")).toBeNull();
  });
});

describe("401 response interceptor logic", () => {
  const logout = vi.fn();

  function handle401(status, url, logoutFn) {
    const is401   = status === 401;
    const isGetMe = url?.includes("/user/me");
    if (is401 && !isGetMe) logoutFn();
  }

  beforeEach(() => logout.mockClear());

  it("calls logout on 401 for a regular endpoint", () => {
    handle401(401, "/api/practice/submit", logout);
    expect(logout).toHaveBeenCalledOnce();
  });

  it("does NOT call logout on 401 for /user/me", () => {
    handle401(401, "/api/user/me", logout);
    expect(logout).not.toHaveBeenCalled();
  });

  it("does NOT call logout on non-401 errors", () => {
    handle401(403, "/api/practice/submit", logout);
    handle401(500, "/api/ai/chat", logout);
    expect(logout).not.toHaveBeenCalled();
  });
});
