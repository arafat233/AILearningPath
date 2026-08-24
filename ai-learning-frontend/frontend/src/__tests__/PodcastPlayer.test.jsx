import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Stub Web Speech API BEFORE importing (SUPPORTED is read at import) ──
const speak = vi.fn();
const cancel = vi.fn();
const pause = vi.fn();
const resume = vi.fn();
const getVoices = vi.fn(() => [
  { name: "Teacher IN", lang: "en-IN" },
  { name: "Student US", lang: "en-US" },
]);
globalThis.speechSynthesis = { speak, cancel, pause, resume, getVoices, speaking: false, pending: false };
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.onend = null; } };

const SCRIPT = {
  lines: [
    { speaker: "teacher", line: "Today we learn quadratic equations." },
    { speaker: "student", line: "Why do we even need them?" },
    { speaker: "teacher", line: "Great question — think of a cricket ball's flight." },
  ],
};

const getTransformation = vi.fn(async () => ({ data: { data: SCRIPT } }));
const trackPodcastListen = vi.fn(async () => ({}));
vi.mock("../services/api", () => ({
  getTransformation: (...a) => getTransformation(...a),
  trackPodcastListen: (...a) => trackPodcastListen(...a),
}));

const { default: PodcastPlayer } = await import("../components/PodcastPlayer");

beforeEach(() => { vi.clearAllMocks(); });

describe("PodcastPlayer (dialogue podcast)", () => {
  it("renders the collapsed entry button", () => {
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    expect(screen.getByRole("button", { name: /Listen as conversation/i })).toBeInTheDocument();
  });

  it("fetches the podcast script and starts speaking the first line", async () => {
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    fireEvent.click(screen.getByRole("button", { name: /Listen as conversation/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    expect(getTransformation).toHaveBeenCalledWith("Quadratic Equations", "podcast", "Math", "10");
    expect(speak.mock.calls[0][0].text).toMatch(/Today we learn/);
    // transcript rendered with all lines
    expect(screen.getByText(/Why do we even need them/)).toBeInTheDocument();
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
  });

  it("assigns distinct voices to teacher and student lines", async () => {
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    fireEvent.click(screen.getByRole("button", { name: /Listen as conversation/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    // advance to the student line
    speak.mock.calls.at(-1)[0].onend();
    await waitFor(() => expect(speak).toHaveBeenCalledTimes(2));
    const [teacherUtt, studentUtt] = speak.mock.calls.map((c) => c[0]);
    expect(teacherUtt.voice?.name).toBe("Teacher IN");
    expect(studentUtt.voice?.name).toBe("Student US");
  });

  it("stop cancels speech and reports listen-through", async () => {
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    fireEvent.click(screen.getByRole("button", { name: /Listen as conversation/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    fireEvent.click(screen.getByTitle("Stop"));
    expect(cancel).toHaveBeenCalled();
    expect(trackPodcastListen).toHaveBeenCalledWith("Quadratic Equations", "Math", 1, 3);
  });

  it("finishing the episode reports full listen-through exactly once", async () => {
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    fireEvent.click(screen.getByRole("button", { name: /Listen as conversation/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    for (let i = 0; i < 3; i++) {
      speak.mock.calls.at(-1)[0].onend();
      await Promise.resolve();
    }
    await waitFor(() => expect(trackPodcastListen).toHaveBeenCalledTimes(1));
    expect(trackPodcastListen).toHaveBeenCalledWith("Quadratic Equations", "Math", 3, 3);
    // stopping after the fact must not double-report
    fireEvent.click(screen.getByTitle("Stop"));
    expect(trackPodcastListen).toHaveBeenCalledTimes(1);
  });

  it("shows an error state when the script fetch fails", async () => {
    getTransformation.mockRejectedValueOnce(new Error("503"));
    render(<PodcastPlayer topic="Quadratic Equations" subject="Math" />);
    fireEvent.click(screen.getByRole("button", { name: /Listen as conversation/i }));
    await waitFor(() => expect(screen.getByText(/Couldn't load the episode/)).toBeInTheDocument());
    expect(speak).not.toHaveBeenCalled();
  });
});
