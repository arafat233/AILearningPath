import { jest } from "@jest/globals";
import { fullModelMock } from "./helpers/modelMock.js";

const mockUserFindById = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();

jest.unstable_mockModule("../models/index.js", () => ({
  ...fullModelMock(),
  User: { findById: mockUserFindById, findByIdAndUpdate: mockUserFindByIdAndUpdate },
}));

const { listCareerPaths, getCareerState, setCareerPath, toggleScholarship, SCHOLARSHIPS } =
  await import("../services/careerService.js");

const chain = (val) => {
  const c = { select: () => c, lean: () => Promise.resolve(val) };
  return c;
};

beforeEach(() => {
  mockUserFindByIdAndUpdate.mockResolvedValue({});
});
afterEach(() => jest.clearAllMocks());

describe("career paths + scholarship tracker", () => {
  test("every roadmap is complete (exams, subjects, 4 stages, app links)", () => {
    const paths = listCareerPaths();
    expect(paths.length).toBeGreaterThanOrEqual(5);
    for (const p of paths) {
      expect(p.key).toBeTruthy();
      expect(p.exams.length).toBeGreaterThan(0);
      expect(p.subjects.length).toBeGreaterThan(0);
      expect(p.stages.length).toBeGreaterThanOrEqual(4);
      expect(p.appLinks.length).toBeGreaterThan(0);
    }
  });

  test("scholarships are filtered by the student's grade, with tracked flags", async () => {
    mockUserFindById.mockReturnValue(chain({ grade: "10", careerPath: "medicine_neet", trackedScholarships: ["imo_ioqm"] }));
    const state = await getCareerState("u1");
    expect(state.careerPath).toBe("medicine_neet");
    // every returned scholarship must be valid for grade 10
    expect(state.scholarships.length).toBeGreaterThan(0);
    for (const s of state.scholarships) expect(s.grades).toContain("10");
    // grade-8-only NMMS must be excluded
    expect(state.scholarships.find((s) => s.id === "nmms")).toBeUndefined();
    expect(state.scholarships.find((s) => s.id === "imo_ioqm")?.tracked).toBe(true);
  });

  test("no grade → all scholarships returned", async () => {
    mockUserFindById.mockReturnValue(chain({ grade: null, trackedScholarships: [] }));
    const state = await getCareerState("u1");
    expect(state.scholarships).toHaveLength(SCHOLARSHIPS.length);
  });

  test("setCareerPath rejects unknown keys, accepts valid + null", async () => {
    await expect(setCareerPath("u1", "astronaut")).rejects.toMatchObject({ statusCode: 400 });
    await expect(setCareerPath("u1", "engineering_iit")).resolves.toEqual({ careerPath: "engineering_iit" });
    await expect(setCareerPath("u1", null)).resolves.toEqual({ careerPath: null });
  });

  test("toggleScholarship adds then removes", async () => {
    mockUserFindById.mockReturnValue(chain({ trackedScholarships: [] }));
    expect(await toggleScholarship("u1", "nmms")).toEqual({ id: "nmms", tracked: true });
    expect(mockUserFindByIdAndUpdate.mock.calls[0][1]).toEqual({ $addToSet: { trackedScholarships: "nmms" } });

    mockUserFindById.mockReturnValue(chain({ trackedScholarships: ["nmms"] }));
    expect(await toggleScholarship("u1", "nmms")).toEqual({ id: "nmms", tracked: false });
    expect(mockUserFindByIdAndUpdate.mock.calls[1][1]).toEqual({ $pull: { trackedScholarships: "nmms" } });
  });

  test("toggleScholarship rejects unknown ids", async () => {
    await expect(toggleScholarship("u1", "fake")).rejects.toMatchObject({ statusCode: 400 });
  });
});
