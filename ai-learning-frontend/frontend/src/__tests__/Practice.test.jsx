import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// ── Mocks ─────────────────────────────────────────────────────────────────────
vi.mock("../services/api", () => ({
  getTopics:           vi.fn(),
  startTopic:          vi.fn(),
  submitAnswer:        vi.fn(),
  flagQuestion:        vi.fn(),
  toggleBookmark:      vi.fn(),
  getHint:             vi.fn(),
  evaluateExplanation: vi.fn(),
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

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useLocation: () => ({ state: null }), useNavigate: () => vi.fn() };
});

import {
  getTopics, startTopic, submitAnswer,
} from "../services/api";
import Practice from "../pages/Practice";

// getTopics returns [{name, subject, ...}] and Practice maps to names
const MOCK_TOPICS = [
  { _id: "t1", name: "Algebra",  subject: "Math", grade: "10" },
  { _id: "t2", name: "Geometry", subject: "Math", grade: "10" },
];

// startTopic returns the question object directly as data
const MOCK_QUESTION = {
  _id: "q1",
  questionId: "q_alg_1",
  questionText: "Find the value of x in 2x + 4 = 10.",
  questionType: "mcq",
  options: [
    { text: "3" }, { text: "4" }, { text: "5" }, { text: "6" },
  ],
  confidence: "",
  difficulty: "easy",
  marks: 1,
  sessionId: "sess1",
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
  // getTopics returns array, Practice does r.data.map(t => t.name)
  getTopics.mockResolvedValue({ data: MOCK_TOPICS });
  // startTopic response.data IS the question object
  startTopic.mockResolvedValue({ data: MOCK_QUESTION });
  submitAnswer.mockResolvedValue({
    data: {
      correct: true,
      correctAnswer: "3",
      explanation: "2x = 6, x = 3",
      nextQuestion: null,
    },
  });
});

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

// Helper: render, wait for topics, click Algebra topic button, then start
async function startSession() {
  renderPractice();
  // Wait for topics to load — they appear as clickable buttons
  await waitFor(() => expect(getTopics).toHaveBeenCalled());
  // Click the Algebra topic button
  const topicBtn = await screen.findByRole("button", { name: /^algebra$/i });
  await userEvent.click(topicBtn);
  // Now click "Start Practice →"
  const startBtn = await screen.findByRole("button", { name: /start practice/i });
  await userEvent.click(startBtn);
  // Wait for question to appear
  await screen.findByText(/Find the value/i);
}

describe("Practice — session start", () => {
  it("clicking a topic then Start Practice loads the first question", async () => {
    await startSession();
    expect(startTopic).toHaveBeenCalledWith("Algebra");
    expect(screen.getByText(/Find the value/i)).toBeInTheDocument();
  });

  it("Start Practice button disabled until a topic is selected", async () => {
    renderPractice();
    await waitFor(() => expect(getTopics).toHaveBeenCalled());
    const startBtn = await screen.findByRole("button", { name: /start practice/i });
    expect(startBtn).toBeDisabled();
  });
});

describe("Practice — confidence tracking", () => {
  it("renders confidence options after question loads", async () => {
    await startSession();
    const hasLow    = screen.queryByText(/low/i);
    const hasMedium = screen.queryByText(/medium/i);
    const hasHigh   = screen.queryByText(/high/i);
    expect(hasLow || hasMedium || hasHigh).toBeTruthy();
  });
});

describe("Practice — answer submission", () => {
  // Options render as "A. 3", "B. 4" etc — match on full accessible name
  it("clicking an MCQ option calls submitAnswer directly", async () => {
    await startSession();
    // Option buttons contain "A." prefix + option text
    const optionBtn = await screen.findByRole("button", { name: /A\.\s*3/i });
    await userEvent.click(optionBtn);
    await waitFor(() => expect(submitAnswer).toHaveBeenCalled());
    expect(submitAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ selectedOptionIndex: 0 })
    );
  });

  it("selecting second option passes index 1 to submitAnswer", async () => {
    await startSession();
    const optionBtn = await screen.findByRole("button", { name: /B\.\s*4/i });
    await userEvent.click(optionBtn);
    await waitFor(() => expect(submitAnswer).toHaveBeenCalled());
    expect(submitAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ selectedOptionIndex: 1 })
    );
  });
});

describe("Practice — session summary", () => {
  async function startAndAnswer() {
    await startSession();
    // Submit one answer so sessionStats.total > 0 (End Session button becomes visible)
    const optionBtn = await screen.findByRole("button", { name: /A\.\s*3/i });
    await userEvent.click(optionBtn);
    await waitFor(() => expect(submitAnswer).toHaveBeenCalled());
  }

  it("End Session button appears after at least one answer", async () => {
    await startAndAnswer();
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /end session/i })).toBeInTheDocument();
    });
  });

  it("clicking End Session shows the summary screen", async () => {
    await startAndAnswer();
    const endBtn = await screen.findByRole("button", { name: /end session/i });
    await userEvent.click(endBtn);
    // Practice.jsx renders <h1>Session Summary</h1> on the summary screen
    await waitFor(() => {
      expect(screen.getByText(/session summary/i)).toBeInTheDocument();
    });
  });
});
