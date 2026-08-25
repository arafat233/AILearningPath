// Unit tests for services/navService.js — the per-track sidebar nav resolver.
import { describe, test, expect } from "@jest/globals";
import { NAV_CONFIG, resolveActiveTrack, getNavForUser, isValidTrackKey, tracksForUser } from "../services/navService.js";

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

describe("navService — Hindi locale labels", () => {
  test("locale=hi translates sidebar labels; routes and icons unchanged", () => {
    const nav = getNavForUser({ tracks: [{ key: "school" }], activeTrack: "school", locale: "hi" });
    const practice = nav.items.find((i) => i.to === "/practice");
    expect(practice.label).toBe("अभ्यास");
    expect(practice.icon).toBe("practice"); // icon key untouched
    expect(nav.items.find((i) => i.to === "/mistakes").label).toBe("गलतियाँ");
  });

  test("locale=en (or absent) keeps English labels", () => {
    const nav = getNavForUser({ tracks: [{ key: "school" }], activeTrack: "school" });
    expect(nav.items.find((i) => i.to === "/practice").label).toBe("Practice");
  });

  test("every school + pro nav label has a Hindi translation (no silent English leaks)", () => {
    const hiNav = getNavForUser({
      tracks: [{ key: "school" }, { key: "pro_java" }], activeTrack: "school", locale: "hi",
    });
    const enNav = getNavForUser({
      tracks: [{ key: "school" }, { key: "pro_java" }], activeTrack: "school",
    });
    hiNav.items.forEach((item, i) => {
      expect(item.label).not.toBe(enNav.items[i].label);
    });
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

// Regression: a pro_java user with a board/grade but no school row in tracks[]
// was stranded on the Java surface. ProDashboard renders no TrackTabs, so the
// sidebar TrackSwitcher is the only switcher there — and it lists exactly what
// getNavForUser returns. Returning [pro_java] left it with no way back.
describe("navService.tracksForUser — implicit school track", () => {
  test("prepends school for a pro-only tracks[] when examBoard is set", () => {
    const tracks = tracksForUser({ tracks: [{ key: "pro_java", role: "learner" }], examBoard: "CBSE" });
    expect(tracks.map((t) => t.key)).toEqual(["school", "pro_java"]);
  });

  test("prepends school when only grade is set", () => {
    const tracks = tracksForUser({ tracks: [{ key: "pro_java", role: "learner" }], grade: 10 });
    expect(tracks.map((t) => t.key)).toEqual(["school", "pro_java"]);
  });

  test("does not duplicate an existing school row", () => {
    const tracks = tracksForUser({ tracks: [{ key: "school" }, { key: "pro_java" }], examBoard: "CBSE" });
    expect(tracks.map((t) => t.key)).toEqual(["school", "pro_java"]);
  });

  test("does not invent school for a pro-only adult account", () => {
    const tracks = tracksForUser({ tracks: [{ key: "pro_java", role: "learner" }] });
    expect(tracks.map((t) => t.key)).toEqual(["pro_java"]);
  });

  test("handles a user with no tracks at all", () => {
    expect(tracksForUser({})).toEqual([]);
    expect(tracksForUser(null)).toEqual([]);
  });

  test("getNavForUser surfaces school so the sidebar can offer the way back", () => {
    const nav = getNavForUser({ tracks: [{ key: "pro_java" }], activeTrack: "pro_java", examBoard: "CBSE" });
    expect(nav.activeTrack).toBe("pro_java");            // still on Java, as stored
    expect(nav.tracks.map((t) => t.key)).toContain("school"); // but school is reachable
  });
});
