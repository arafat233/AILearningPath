import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("../services/api", () => ({
  getTopics:               vi.fn(),
  startTopic:              vi.fn(),
  submitAnswer:            vi.fn(),
  flagQuestion:            vi.fn(),
  toggleBookmark:          vi.fn(),
  getHint:                 vi.fn(),
  evaluateExplanation:     vi.fn(),
  bmGetDue:                vi.fn(),
  getBookmarks:            vi.fn(),
  rateAIResponse:          vi.fn(),
  askTutor:                vi.fn(),
  getReport:               vi.fn(),
  startRetryPractice:      vi.fn(),
  startCollectionPractice: vi.fn(),
  startBookmarkPractice:   vi.fn(),
  // Called via useEffect when a question loads
  getQuestionStats:        vi.fn(),
  getPeerTime:             vi.fn(),
  getQuestionLineage:      vi.fn(),
  reportQuestion:          vi.fn(),
  submitSkipReason:        vi.fn(),
  submitErrorLabel:        vi.fn(),
  bmRate:                  vi.fn(),
  bmUpsertSection:         vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({
      user: { id: "u1", name: "Test", subject: "Math", plan: "free" },
      logout: vi.fn(),
    })
  ),
}));

vi.mock("../components/FeedbackWidget", () => ({ default: () => null }));
vi.mock("../components/AICreditsIndicator", () => ({ default: () => null }));

// offlineQueue uses IndexedDB which behaves inconsistently in jsdom
vi.mock("../utils/offlineQueue", () => ({
  enqueueAttempt: vi.fn().mockResolvedValue(1),
  flushQueue:     vi.fn().mockResolvedValue(0),
  getQueuedCount: vi.fn().mockResolvedValue(0),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useLocation: () => ({ state: null }), useNavigate: () => vi.fn() };
});

import {
  getTopics, startTopic, submitAnswer,
  bmGetDue, getBookmarks, getReport,
  startRetryPractice, startCollectionPractice,
  getQuestionStats, getPeerTime, getQuestionLineage,
} from "../services/api";
import Practice from "../pages/Practice";

const MOCK_TOPICS = [
  { _id: "t1", name: "Algebra",  subject: "Math", grade: "10" },
  { _id: "t2", name: "Geometry", subject: "Math", grade: "10" },
];

const MOCK_QUESTION = {
  _id: "q1",
  questionText: "Find the value of x.",
  questionType: "mcq",
  options: [{ text: "3" }, { text: "4" }, { text: "5" }, { text: "6" }],
  difficulty: "easy",
  marks: 1,
};

function renderPractice() {
  return render(
    <MemoryRouter>
      <Practice />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();

  getTopics.mockResolvedValue({ data: MOCK_TOPICS });
  startTopic.mockResolvedValue({ data: MOCK_QUESTION });
  submitAnswer.mockResolvedValue({
    data: { isCorrect: true, correctAnswer: "3", nextQuestion: null, selectedOptionIndex: 0 },
  });
  bmGetDue.mockResolvedValue({ data: [] });
  getBookmarks.mockResolvedValue({ data: [] });
  getReport.mockResolvedValue({ data: {} });
  startRetryPractice.mockResolvedValue({ data: MOCK_QUESTION });
  startCollectionPractice.mockResolvedValue({ data: MOCK_QUESTION });
  getQuestionStats.mockResolvedValue({ data: null });
  getPeerTime.mockResolvedValue({ data: null });
  getQuestionLineage.mockResolvedValue({ data: null });
});

// ── startSession ──────────────────────────────────────────────────────────────
// Navigates from topic selector → question view.
// Uses the same waitFor pattern as the passing initial-render tests.
async function startSession() {
  renderPractice();

  // Wait for getTopics to fire, then synchronously get Algebra button
  await waitFor(() => expect(getTopics).toHaveBeenCalled());
  const topicBtn = await screen.findByRole("button", { name: /algebra/i });
  await userEvent.click(topicBtn);

  // After topic click, start button text = "Start — <topic> →".
  // Find via textContent to avoid em-dash encoding issues.
  await waitFor(() => {
    const btn = Array.from(document.querySelectorAll("button"))
      .find(b => !b.disabled && /^Start/i.test(b.textContent.trim()));
    if (!btn) throw new Error("Start button not ready");
  });
  const startBtn = Array.from(document.querySelectorAll("button"))
    .find(b => !b.disabled && /^Start/i.test(b.textContent.trim()));
  await userEvent.click(startBtn);

  // Wait for question view — check startTopic was called
  await waitFor(() => expect(startTopic).toHaveBeenCalled());
  // Give React time to commit the setQuestion state update
  await waitFor(() => expect(screen.queryByText(/How Confident\?/i)).not.toBeNull());
}

// ── submitOneAnswer ───────────────────────────────────────────────────────────
// Finds MCQ option by position (0-indexed), clicks it, clicks Submit.
// Waits for submitAnswer to be called AND for feedback UI to appear
// (so sessionStats.total has been committed before returning).
async function submitOptionByIndex(index) {
  const allBtns = screen.getAllByRole("button");
  // MCQ options: textContent starts with letter immediately followed by digit, e.g. "A3"/"B4"
  const optionBtns = allBtns.filter(b => /^[A-D]\d/.test(b.textContent.trim()));
  expect(optionBtns.length).toBeGreaterThan(index);
  await userEvent.click(optionBtns[index]);

  const submitBtn = await screen.findByRole("button", { name: /submit/i });
  await userEvent.click(submitBtn);

  await waitFor(() => expect(submitAnswer).toHaveBeenCalled());
  // Wait for feedback to appear — confirms React committed sessionStats.total++
  // Use queryAllByText to avoid "Found multiple elements" error (feedback has several "correct" strings)
  await waitFor(() =>
    expect(screen.queryAllByText(/correct|incorrect/i).length).toBeGreaterThan(0)
  );
}

// ─────────────────────────────────────────────────────────────────────────────

describe("Practice — initial render", () => {
  it("shows topic selector on first load", async () => {
    renderPractice();
    await waitFor(() => expect(getTopics).toHaveBeenCalled());
    expect(screen.getByText(/algebra/i)).toBeInTheDocument();
  });

  it("shows no question until a topic is started", async () => {
    renderPractice();
    await waitFor(() => screen.getByText(/algebra/i));
    expect(screen.queryByText(/Find the value/i)).not.toBeInTheDocument();
  });
});

describe("Practice — session start", () => {
  it("clicking a topic then Start loads the question view", async () => {
    await startSession();
    // startTopic is called with (topic, currentQId, practiceMode)
    expect(startTopic).toHaveBeenCalledWith("Algebra", null, expect.any(String));
    expect(screen.getByText(/How Confident\?/i)).toBeInTheDocument();
  });

  it("Start button is disabled until a topic is selected", async () => {
    renderPractice();
    await waitFor(() => expect(getTopics).toHaveBeenCalled());
    // Before topic selection, button text = "Select a topic above" and is disabled
    const startBtn = await screen.findByRole("button", { name: /select a topic above/i });
    expect(startBtn).toBeDisabled();
  });
});

describe("Practice — confidence tracking", () => {
  it("renders confidence buttons after question loads", async () => {
    await startSession();
    // Confidence buttons show "Sure", "Likely", "Unsure" (not low/medium/high)
    const sure   = screen.queryByRole("button", { name: /^sure$/i });
    const likely = screen.queryByRole("button", { name: /^likely$/i });
    const unsure = screen.queryByRole("button", { name: /^unsure$/i });
    expect(sure || likely || unsure).toBeTruthy();
  });
});

describe("Practice — answer submission", () => {
  it("selecting option A then submitting calls submitAnswer with index 0", async () => {
    await startSession();
    await submitOptionByIndex(0);
    expect(submitAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ selectedOptionIndex: 0 })
    );
  });

  it("selecting option B then submitting passes index 1 to submitAnswer", async () => {
    await startSession();
    await submitOptionByIndex(1);
    expect(submitAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ selectedOptionIndex: 1 })
    );
  });
});

describe("Practice — session summary", () => {
  it("End Session button appears after at least one answer", async () => {
    await startSession();
    await submitOptionByIndex(0);
    // sessionStats.total > 0 → End Session button renders in header
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: /end session/i })).toBeInTheDocument()
    );
  });

  it("clicking End Session shows the summary screen", async () => {
    await startSession();
    await submitOptionByIndex(0);

    const endBtn = await screen.findByRole("button", { name: /end session/i });
    await userEvent.click(endBtn);
    // Summary screen renders "Session Complete"
    await waitFor(() =>
      expect(screen.getByText(/session complete/i)).toBeInTheDocument()
    );
  });
});
