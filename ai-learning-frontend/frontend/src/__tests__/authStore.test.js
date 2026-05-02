import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../store/authStore";

// Reset store state between tests
beforeEach(() => {
  useAuthStore.setState({ user: null });
});

describe("authStore", () => {
  it("starts with null user", () => {
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("setAuth stores user and ignores token arg", () => {
    const user = { id: "u1", name: "Alice", role: "student" };
    useAuthStore.getState().setAuth("ignored-token", user);
    expect(useAuthStore.getState().user).toEqual(user);
  });

  it("logout clears user", () => {
    useAuthStore.setState({ user: { id: "u1", name: "Alice" } });
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("setAuth with partial update preserves only the new user object", () => {
    const first  = { id: "u1", name: "Alice", role: "student" };
    const second = { id: "u2", name: "Bob",   role: "admin"   };
    useAuthStore.getState().setAuth(null, first);
    useAuthStore.getState().setAuth(null, second);
    expect(useAuthStore.getState().user).toEqual(second);
  });
});
