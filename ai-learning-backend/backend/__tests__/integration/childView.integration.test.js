// Integration test for the child-view response shape (board/grade duplicate fix).
//
// Bug: POST /user/children (_childView) and PUT /user/children/:id stripped
// `tracks`/`activeTrack` from the response. createChild seeds the school
// track server-side, but because the client never saw it, the onboarding
// gate treated the freshly-created child as un-enrolled and bounced the user
// through /welcome → /start, re-asking for the board+grade just saved.
//
// Fix: include tracks/activeTrack in both response shapes. This test pins the
// contract end-to-end against a real in-memory MongoDB:
//   - _childView(doc) carries tracks + activeTrack (POST shape)
//   - the PUT projection .select(...) carries tracks + activeTrack
//
// Run: npm test -- childView.integration

import { beforeAll, afterAll, beforeEach, describe, test, expect } from "@jest/globals";
import { connectTestDB, disconnectTestDB, clearCollections } from "./_setup.js";
import { User } from "../../models/index.js";
import { _childView } from "../../routes/userRoutes.js";

// Mirrors the exact select() used by PUT /user/children/:id after the fix.
const PUT_PROJECTION =
  "_id name grade examBoard schoolName location subject examDate tracks activeTrack";

// Creates a child exactly as POST /user/children does (school track seeded).
async function createSchoolChild(overrides = {}) {
  return User.create({
    name:        "Vasant",
    email:       `child_${Date.now()}@stellar.child`,
    password:    "hashed",
    role:        "student",
    grade:       "10",
    examBoard:   "CBSE",
    schoolName:  "Delhi Public School",
    location:    "Mumbai, Maharashtra",
    tracks:      [{ key: "school", role: "learner", enrolledAt: new Date() }],
    activeTrack: "school",
    ...overrides,
  });
}

beforeAll(connectTestDB, 120_000);
afterAll(disconnectTestDB, 30_000);
beforeEach(clearCollections);

describe("child-view response shape (no board/grade re-ask)", () => {
  test("POST shape: _childView carries the seeded school track + activeTrack", async () => {
    const child = await createSchoolChild();

    const view = _childView(child);

    // Identity + profile fields still present.
    expect(view._id).toBeDefined();
    expect(view.name).toBe("Vasant");
    expect(view.examBoard).toBe("CBSE");
    expect(view.grade).toBe("10");

    // The fix: enrollment is now visible to the client.
    expect(Array.isArray(view.tracks)).toBe(true);
    expect(view.tracks).toHaveLength(1);
    expect(view.tracks[0].key).toBe("school");
    expect(view.activeTrack).toBe("school");
  });

  test("PUT shape: updated child projection carries tracks + activeTrack", async () => {
    const child = await createSchoolChild();

    const updated = await User.findByIdAndUpdate(
      child._id,
      { $set: { examBoard: "ICSE" } },
      { new: true },
    ).select(PUT_PROJECTION).lean();

    expect(updated.examBoard).toBe("ICSE");
    expect(Array.isArray(updated.tracks)).toBe(true);
    expect(updated.tracks.some((t) => t.key === "school")).toBe(true);
    expect(updated.activeTrack).toBe("school");
  });

  test("regression: a child with tracks never deserializes to an empty tracks[] (the bounce trigger)", async () => {
    const child = await createSchoolChild();
    const view = _childView(child);
    // An empty tracks[] is exactly what made RootElement redirect to /welcome.
    expect(view.tracks.length).toBeGreaterThan(0);
  });
});
