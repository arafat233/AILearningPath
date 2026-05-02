import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import axios from "axios";

vi.mock("axios");

// Reset module-level _cached between tests by re-importing after clearing the module cache
// We use vi.resetModules() before each test to get a fresh module instance.

describe("useFeatureFlags", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  async function importHook() {
    const mod = await import("../hooks/useFeatureFlags.js");
    return mod.useFeatureFlags;
  }

  it("fetches flags on mount and returns them", async () => {
    axios.get = vi.fn().mockResolvedValue({ data: { data: { newUI: true, darkMode: false } } });
    const useFeatureFlags = await importHook();
    const { result } = renderHook(() => useFeatureFlags());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.flags).toEqual({ newUI: true, darkMode: false });
    expect(result.current.isEnabled("newUI")).toBe(true);
    expect(result.current.isEnabled("darkMode")).toBe(false);
  });

  it("isEnabled returns false for unknown flag", async () => {
    axios.get = vi.fn().mockResolvedValue({ data: { data: { someFlag: true } } });
    const useFeatureFlags = await importHook();
    const { result } = renderHook(() => useFeatureFlags());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isEnabled("nonexistentFlag")).toBe(false);
  });

  it("falls back to empty flags on network error (no crash)", async () => {
    axios.get = vi.fn().mockRejectedValue(new Error("Network error"));
    const useFeatureFlags = await importHook();
    const { result } = renderHook(() => useFeatureFlags());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.flags).toEqual({});
    expect(result.current.isEnabled("anything")).toBe(false);
  });

  it("loading is true initially, false after fetch completes", async () => {
    let resolve;
    axios.get = vi.fn().mockReturnValue(new Promise((r) => { resolve = r; }));
    const useFeatureFlags = await importHook();
    const { result } = renderHook(() => useFeatureFlags());

    expect(result.current.loading).toBe(true);

    await act(async () => resolve({ data: { data: {} } }));
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("caches result — second hook instance skips fetch", async () => {
    axios.get = vi.fn().mockResolvedValue({ data: { data: { cached: true } } });
    const useFeatureFlags = await importHook();

    const { result: r1 } = renderHook(() => useFeatureFlags());
    await waitFor(() => expect(r1.current.loading).toBe(false));

    // Second instance — should use cache, NOT make a second network call
    const { result: r2 } = renderHook(() => useFeatureFlags());
    // r2 starts with loading false because _cached is populated
    expect(r2.current.loading).toBe(false);
    expect(r2.current.flags).toEqual({ cached: true });
    expect(axios.get).toHaveBeenCalledTimes(1); // only one fetch
  });

  it("isEnabled returns false while loading (flags is {})", async () => {
    let resolve;
    axios.get = vi.fn().mockReturnValue(new Promise((r) => { resolve = r; }));
    const useFeatureFlags = await importHook();
    const { result } = renderHook(() => useFeatureFlags());

    expect(result.current.loading).toBe(true);
    expect(result.current.isEnabled("anything")).toBe(false);

    await act(async () => resolve({ data: { data: { anything: true } } }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isEnabled("anything")).toBe(true);
  });
});
