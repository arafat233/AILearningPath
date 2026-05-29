// Unit tests for services/navService.js — the per-track sidebar nav resolver.
import { describe, test, expect } from "@jest/globals";
import { NAV_CONFIG, resolveActiveTrack, getNavForUser, isValidTrackKey } from "../services/navService.js";

describe("navService.resolveActiveTrack", () => {
  test("returns 'school' when user is null", () => {
    expect(resolveActiveTrack(null)).toBe("school");
  });

  test("returns 'school' when user has no tracks and no activeTrack", () => {
    expect(resolveActiveTrack({})).toBe("school");
  });

  test("uses explicit activeTrack when valid", () => {
    expect(resolveActiveTrack({ activeTrack: "pro_java", tracks: [{ key: "school" }, { key: "pro_java" }] })).toBe("pro_java");
  });

  test("ignores unknown activeTrack and falls back to first enrolled", () => {
    expect(resolveActiveTrack({ activeTrack: "pro_python_does_not_exist", tracks: [{ key: "pro_java" }] })).toBe("pro_java");
  });

  test("falls back to tracks[0] when activeTrack is null", () => {
    expect(resolveActiveTrack({ activeTrack: null, tracks: [{ key: "pro_java" }] })).toBe("pro_java");
  });
});

describe("navService.getNavForUser", () => {
  test("returns the school nav list for a school user", () => {
    const nav = getNavForUser({ tracks: [{ key: "school" }], activeTrack: "school" });
    expect(nav.activeTrack).toBe("school");
    expect(nav.items.find((i) => i.to === "/pyq")).toBeDefined(); // PYQ Bank present
    expect(nav.items.find((i) => i.to === "/lessons")).toBeDefined();
  });

  test("returns the pro_java nav list for a pro user (no school-only links)", () => {
    const nav = getNavForUser({ tracks: [{ key: "pro_java" }], activeTrack: "pro_java" });
    expect(nav.activeTrack).toBe("pro_java");
    expect(nav.items.find((i) => i.to === "/pyq")).toBeUndefined();
    expect(nav.items.find((i) => i.to === "/parent")).toBeUndefined();
    expect(nav.items.find((i) => i.to === "/mock-paper")).toBeUndefined();
    expect(nav.items.find((i) => i.to === "/pro")).toBeDefined();
  });

  test("hides /pro from pure-school users (not enrolled in any pro_* track)", () => {
    const nav = getNavForUser({ tracks: [{ key: "school" }], activeTrack: "school" });
    expect(nav.items.find((i) => i.to === "/pro")).toBeUndefined();
    // Sanity: PYQ Bank still there
    expect(nav.items.find((i) => i.to === "/pyq")).toBeDefined();
  });

  test("keeps /pro in school nav for dual-mode users (school + pro_java)", () => {
    const nav = getNavForUser({
      tracks: [{ key: "school" }, { key: "pro_java" }],
      activeTrack: "school",
    });
    expect(nav.items.find((i) => i.to === "/pro")).toBeDefined();
  });

  test("strips internal crossMode flag from returned items", () => {
    const nav = getNavForUser({
      tracks: [{ key: "school" }, { key: "pro_java" }],
      activeTrack: "school",
    });
    const proItem = nav.items.find((i) => i.to === "/pro");
    expect(proItem.crossMode).toBeUndefined();
  });

  test("reports enrolled tracks back so the switcher can render", () => {
    const nav = getNavForUser({ tracks: [{ key: "school", role: "learner" }, { key: "pro_java", role: "learner" }], activeTrack: "school" });
    expect(nav.tracks).toEqual([{ key: "school", role: "learner" }, { key: "pro_java", role: "learner" }]);
  });
});

describe("navService.isValidTrackKey", () => {
  test("accepts known keys", () => {
    expect(isValidTrackKey("school")).toBe(true);
    expect(isValidTrackKey("pro_java")).toBe(true);
  });
  test("rejects unknown keys and non-strings", () => {
    expect(isValidTrackKey("pro_python")).toBe(false);
    expect(isValidTrackKey(null)).toBe(false);
    expect(isValidTrackKey(123)).toBe(false);
  });
});
