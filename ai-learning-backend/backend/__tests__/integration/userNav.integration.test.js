// Integration tests for the per-track sidebar nav — exercises the User schema
// (activeTrack + tracks), the navService resolver, and the data contracts the
// GET /api/user/nav + PATCH /api/user/active-track handlers depend on.
// HTTP layer isn't covered here (no supertest in deps); auth.integration tests
// already prove the middleware swap path.

import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";
import { getNavForUser, isValidTrackKey } from "../../services/navService.js";

beforeAll(connectTestDB,  120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

describe("nav resolver — real DB", () => {
  test("school-only user gets school nav without /pro (crossMode hidden)", async () => {
    const u = await User.create({
      name: "Sara", email: "s@test", password: "h",
      tracks: [{ key: "school", role: "learner" }],
      activeTrack: "school",
    });
    const saved = await User.findById(u._id).lean();
    const nav = getNavForUser(saved);
    expect(nav.activeTrack).toBe("school");
    expect(nav.items.find((i) => i.to === "/pyq")).toBeDefined();
    expect(nav.items.find((i) => i.to === "/pro")).toBeUndefined();
  });

  test("dual-track user (school + pro_java) sees /pro in the school nav", async () => {
    const u = await User.create({
      name: "Aarav", email: "a@test", password: "h",
      tracks: [{ key: "school" }, { key: "pro_java" }],
      activeTrack: "school",
    });
    const saved = await User.findById(u._id).lean();
    const nav = getNavForUser(saved);
    expect(nav.tracks.map((t) => t.key)).toEqual(["school", "pro_java"]);
    expect(nav.items.find((i) => i.to === "/pro")).toBeDefined();
    expect(nav.items.find((i) => i.to === "/pro").crossMode).toBeUndefined();
  });

  test("flipping activeTrack via DB write changes the resolved nav", async () => {
    const u = await User.create({
      name: "Riya", email: "r@test", password: "h",
      tracks: [{ key: "school" }, { key: "pro_java" }],
      activeTrack: "school",
    });
    let nav = getNavForUser(await User.findById(u._id).lean());
    expect(nav.activeTrack).toBe("school");
    expect(nav.items.length).toBeGreaterThan(10);

    await User.updateOne({ _id: u._id }, { $set: { activeTrack: "pro_java" } });
    nav = getNavForUser(await User.findById(u._id).lean());
    expect(nav.activeTrack).toBe("pro_java");
    expect(nav.items.length).toBeLessThan(11);
    expect(nav.items.find((i) => i.to === "/pyq")).toBeUndefined();
  });

  test("user with no activeTrack but tracks present falls back to tracks[0]", async () => {
    const u = await User.create({
      name: "Kabir", email: "k@test", password: "h",
      tracks: [{ key: "pro_java", role: "learner" }],
      // activeTrack intentionally null
    });
    const saved = await User.findById(u._id).lean();
    expect(saved.activeTrack).toBeNull();
    const nav = getNavForUser(saved);
    expect(nav.activeTrack).toBe("pro_java");
  });

  test("user with empty tracks falls back to school nav", async () => {
    const u = await User.create({ name: "Zoya", email: "z@test", password: "h" });
    const saved = await User.findById(u._id).lean();
    const nav = getNavForUser(saved);
    expect(nav.activeTrack).toBe("school");
    expect(nav.items.find((i) => i.to === "/lessons")).toBeDefined();
  });

  test("PATCH /user/active-track enrolment check rejects keys the user isn't enrolled in", async () => {
    // The route handler does: if (!isValidTrackKey(key)) 400; if (!enrolled) 403.
    // Replicate that contract here without the HTTP layer.
    const u = await User.create({
      name: "Maya", email: "m@test", password: "h",
      tracks: [{ key: "school" }],
      activeTrack: "school",
    });
    const target = "pro_java";
    expect(isValidTrackKey(target)).toBe(true);
    const saved = await User.findById(u._id).lean();
    const enrolled = saved.tracks.some((t) => t.key === target);
    expect(enrolled).toBe(false); // would be rejected with 403
  });
});
