import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock the API the page calls on mount.
vi.mock("../services/api", () => ({
  proGetTopic: vi.fn(),
  proListExercises: vi.fn(),
  proToggleTopicBookmark: vi.fn(),
  proListBookmarks: vi.fn(),
  proRecordReveal: vi.fn(),
  proGetProject: vi.fn(),
  proGetProgress: vi.fn(),
}));
// The discussion widget fetches on mount — stub it out for this render test.
vi.mock("../components/pro/TopicDiscussion", () => ({ default: () => null }));

import * as api from "../services/api";
import ProTopicView from "../pages/professional/ProTopicView";

const TOPIC = {
  trackKey: "pro_lld", moduleId: "lld_m1", topicId: "lld_m1_t4", topicNumber: 4,
  name: "Strategy Pattern",
  hook: { question: "Why?", insight: "Because." },
  teaching: {
    blocks: [
      { kind: "concept", heading: "Intent", body: "Strategy defines a family of interchangeable algorithms." },
      { kind: "code", heading: "Structure (Java)", body: "interface PaymentStrategy { void pay(int c); }" },
      { kind: "concept", heading: "Why it wins", body: "New algorithms are added without editing the context." },
    ],
  },
  interviewRelevance: "Asked everywhere.",
  commonGaps: { gaps: ["Editing the context to add a strategy."] },
};

beforeEach(() => {
  vi.clearAllMocks();
  api.proGetTopic.mockResolvedValue({ data: { data: TOPIC } });
  api.proListExercises.mockResolvedValue({ data: { data: [] } });
  api.proListBookmarks.mockResolvedValue({ data: { data: [] } });
  api.proGetProgress.mockResolvedValue({ data: { data: { completedExercises: [] } } });
  api.proGetProject.mockResolvedValue({ data: { data: null } });
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/pro/lld/lld_m1/lld_m1_t4"]}>
      <Routes>
        <Route path="/pro/:trackSlug/:moduleId/:topicId" element={<ProTopicView />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProTopicView — teaching.blocks renderer", () => {
  it("renders concept blocks with their headings and bodies", async () => {
    renderPage();
    expect(await screen.findByText("Intent")).toBeInTheDocument();
    expect(screen.getByText(/family of interchangeable algorithms/i)).toBeInTheDocument();
    expect(screen.getByText("Why it wins")).toBeInTheDocument();
  });

  it("renders code blocks (not as a flattened JSON dump)", async () => {
    renderPage();
    await screen.findByText("Intent");
    // code body shows in the syntax-highlighter (or its <pre> fallback)
    expect(screen.getByText(/interface PaymentStrategy/)).toBeInTheDocument();
  });

  it("shows a dedicated 'Lesson' section, not the generic 'More' dump", async () => {
    renderPage();
    await screen.findByText("Intent");
    expect(screen.getByRole("heading", { name: "Lesson" })).toBeInTheDocument();
    // The old fallback rendered teaching.blocks under a 'More' heading — must be gone.
    expect(screen.queryByRole("heading", { name: "More" })).not.toBeInTheDocument();
    // And it must NOT leak the raw block-shape labels ("Kind", "Body") from GenericBlock.
    expect(screen.queryByText(/^Kind$/)).not.toBeInTheDocument();
  });
});
