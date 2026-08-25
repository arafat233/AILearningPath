/**
 * Track resolution — ?track= must beat the persisted activeTrack.
 *
 * Regression: every surface resolved the track as
 *   `activeTrack || searchParams.get("track") || "school"`
 * so the URL param was only reachable when nothing was stored. Any user who
 * had ever opened the pro track had activeTrack="pro_java" persisted (in
 * localStorage AND on the user record), which made /?track=school a no-op —
 * they were stuck on the Java surface with no URL escape.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { resolveTrack } from "../store/trackStore";

describe("resolveTrack precedence", () => {
  it("an explicit ?track= overrides a persisted pro track (the reported bug)", () => {
    expect(resolveTrack("school", "pro_java")).toBe("school");
  });

  it("uses the stored track when no param is present", () => {
    expect(resolveTrack(null, "pro_java")).toBe("pro_java");
  });

  it("falls back to school when neither is set", () => {
    expect(resolveTrack(null, null)).toBe("school");
  });

  it("a param can select a pro track for a school user", () => {
    expect(resolveTrack("pro_java", "school")).toBe("pro_java");
  });

  it("ignores an empty param rather than treating it as a choice", () => {
    expect(resolveTrack("", "pro_java")).toBe("pro_java");
  });

  it("honours a caller-supplied fallback", () => {
    expect(resolveTrack(null, null, "pro_java")).toBe("pro_java");
  });
});

// DashboardSwitch is the surface the user actually hit: "/?track=school"
// kept rendering the pro dashboard.
const trackState = { activeTrack: "pro_java", hydrated: true };
vi.mock("../store/trackStore", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // keep the real resolveTrack — that is what is under test
    useTrackStore: vi.fn((selector) => selector(trackState)),
  };
});

vi.mock("./../pages/Dashboard", () => ({ default: () => <div>SCHOOL DASHBOARD</div> }));
vi.mock("./../components/pro/ProDashboard", () => ({ default: () => <div>PRO DASHBOARD</div> }));

import DashboardSwitch from "../pages/DashboardSwitch";

describe("DashboardSwitch", () => {
  const renderAt = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <DashboardSwitch />
      </MemoryRouter>
    );

  it("renders the school dashboard for ?track=school even with pro_java stored", () => {
    trackState.activeTrack = "pro_java";
    trackState.hydrated = true;
    renderAt("/?track=school");
    expect(screen.getByText("SCHOOL DASHBOARD")).toBeInTheDocument();
  });

  it("still renders the pro dashboard when no param is given", () => {
    trackState.activeTrack = "pro_java";
    trackState.hydrated = true;
    renderAt("/");
    expect(screen.getByText("PRO DASHBOARD")).toBeInTheDocument();
  });

  it("trusts the param before the store has hydrated (no wrong-surface flash)", () => {
    trackState.activeTrack = "pro_java";
    trackState.hydrated = false;
    renderAt("/?track=pro_java");
    expect(screen.getByText("PRO DASHBOARD")).toBeInTheDocument();
  });

  it("falls back to school before hydration when no param is given", () => {
    trackState.activeTrack = "pro_java";
    trackState.hydrated = false;
    renderAt("/");
    expect(screen.getByText("SCHOOL DASHBOARD")).toBeInTheDocument();
  });
});
