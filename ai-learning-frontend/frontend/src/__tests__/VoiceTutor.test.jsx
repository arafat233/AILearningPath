import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// ── API mocks ───────────────────────────────────────────────���──────────────────
vi.mock("../services/api", () => ({
  voiceAnswer:       vi.fn(),
  askTutor:          vi.fn(),
  getVoiceHistory:   vi.fn(),
  clearVoiceHistory: vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn((selector) =>
    selector({ user: { id: "u1", name: "Test", subject: "Math" } })
  ),
}));

import { voiceAnswer, askTutor, getVoiceHistory, clearVoiceHistory } from "../services/api";
import VoiceTutor from "../pages/VoiceTutor";

// ── Browser API mocks ───────────────────────────────────────────────��──────────
let mockRecognitionInstance = null;
const mockRecStart  = vi.fn();
const mockRecStop   = vi.fn();
const mockSynthCancel = vi.fn();
const mockSynthSpeak  = vi.fn();

const MockSpeechRecognition = vi.fn().mockImplementation(() => {
  mockRecognitionInstance = {
    continuous:     false,
    interimResults: false,
    lang:           "",
    onstart:        null,
    onend:          null,
    onerror:        null,
    onresult:       null,
    start: mockRecStart.mockImplementation(function () {
      mockRecognitionInstance?.onstart?.();
    }),
    stop: mockRecStop.mockImplementation(function () {
      mockRecognitionInstance?.onend?.();
    }),
  };
  return mockRecognitionInstance;
});

beforeAll(() => {
  Object.defineProperty(window, "webkitSpeechRecognition", {
    value:        MockSpeechRecognition,
    writable:     true,
    configurable: true,
  });

  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    value: vi.fn().mockImplementation((text) => ({
      text, rate: 1, pitch: 1, lang: "", onstart: null, onend: null,
    })),
    writable:     true,
    configurable: true,
  });

  Object.defineProperty(window, "speechSynthesis", {
    value: {
      cancel: mockSynthCancel,
      speak:  mockSynthSpeak.mockImplementation((utterance) => {
        utterance.onstart?.();
      }),
    },
    writable:     true,
    configurable: true,
  });
});

beforeEach(() => {
  getVoiceHistory.mockResolvedValue({ data: { history: [] } });
  vi.clearAllMocks();
  mockRecognitionInstance = null;
});

function renderTutor() {
  return render(
    <MemoryRouter>
      <VoiceTutor />
    </MemoryRouter>
  );
}

// ── Initial render ────────────────────────────���────────────────────────────��───

describe("VoiceTutor — initial render", () => {
  it("shows the Voice Tutor heading", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());
    expect(screen.getByText(/voice tutor/i)).toBeInTheDocument();
  });

  it("shows the mic button when SpeechRecognition is supported", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());
    expect(screen.getByText("🎤")).toBeInTheDocument();
  });

  it("loads persisted history on mount", async () => {
    getVoiceHistory.mockResolvedValue({
      data: { history: [{ role: "user", content: "Hello" }] },
    });
    renderTutor();
    await waitFor(() => expect(screen.getByText("Hello")).toBeInTheDocument());
  });

  it("shows empty state when history is empty", async () => {
    renderTutor();
    await waitFor(() =>
      expect(screen.getByText(/press the mic or type/i)).toBeInTheDocument()
    );
  });
});

// ── Mic state transitions ────────────────────────────────���─────────────────────

describe("VoiceTutor — microphone state transitions", () => {
  it("clicking mic starts recognition and shows 'Listening…'", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn);

    expect(mockRecStart).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.getByText(/listening/i)).toBeInTheDocument()
    );
  });

  it("clicking mic again (while listening) stops recognition", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn); // start

    await waitFor(() => screen.getByText(/listening/i));

    // The button now shows the stop icon "■"
    const stopBtn = screen.getByText("■").closest("button");
    await userEvent.click(stopBtn);

    expect(mockRecStop).toHaveBeenCalled();
  });

  it("shows error message when microphone fires an error event", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn);

    await waitFor(() => mockRecognitionInstance !== null);
    mockRecognitionInstance.onerror?.();

    await waitFor(() =>
      expect(screen.getByText(/could not hear you/i)).toBeInTheDocument()
    );
  });
});

// ── Voice → API → TTS flow ─────────────────────────────���──────────────────────

describe("VoiceTutor — voice answer flow", () => {
  it("sends spoken text via voiceAnswer API and displays reply", async () => {
    voiceAnswer.mockResolvedValue({ data: { answer: "Algebra is the study of symbols." } });
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn);

    await waitFor(() => mockRecognitionInstance !== null);

    // Simulate the recognition returning a result
    mockRecognitionInstance.onresult?.({
      results: [[{ transcript: "Explain algebra" }]],
    });

    await waitFor(() => expect(voiceAnswer).toHaveBeenCalledWith("Explain algebra", "Math"));
    await waitFor(() =>
      expect(screen.getByText("Algebra is the study of symbols.")).toBeInTheDocument()
    );
  });

  it("calls speechSynthesis.speak after receiving a reply", async () => {
    voiceAnswer.mockResolvedValue({ data: { answer: "Great question!" } });
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn);
    await waitFor(() => mockRecognitionInstance !== null);

    mockRecognitionInstance.onresult?.({
      results: [[{ transcript: "What is calculus?" }]],
    });

    await waitFor(() => expect(mockSynthSpeak).toHaveBeenCalled());
    const utterance = mockSynthSpeak.mock.calls[0][0];
    expect(utterance.text).toBe("Great question!");
  });

  it("shows 'AI is speaking…' while TTS is active", async () => {
    voiceAnswer.mockResolvedValue({ data: { answer: "Sure, let me explain." } });
    // Fire onstart but NOT onend so the speaking state remains true
    mockSynthSpeak.mockImplementation((utterance) => {
      utterance.onstart?.();
    });

    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const micBtn = screen.getByText("🎤").closest("button");
    await userEvent.click(micBtn);
    await waitFor(() => mockRecognitionInstance !== null);

    // Fire result then onend (recognition stops after getting a result)
    mockRecognitionInstance.onresult?.({
      results: [[{ transcript: "Explain" }]],
    });
    mockRecognitionInstance.onend?.(); // clears listening so speaking text can show

    await waitFor(() => expect(voiceAnswer).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByText(/AI is speaking/i)).toBeInTheDocument()
    );
  });
});

// ── Text input flow ───────────────────────────────────���────────────────────────

describe("VoiceTutor — text input", () => {
  it("typing and clicking Ask sends message via askTutor", async () => {
    askTutor.mockResolvedValue({ data: { reply: "Here is your answer." } });
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/type your question/i);
    await userEvent.type(input, "What is Pi?");

    const askBtn = screen.getByRole("button", { name: /ask/i });
    await userEvent.click(askBtn);

    await waitFor(() => expect(askTutor).toHaveBeenCalledWith(
      "What is Pi?", [], "Math"
    ));
    await waitFor(() =>
      expect(screen.getByText("Here is your answer.")).toBeInTheDocument()
    );
  });

  it("pressing Enter submits the text message", async () => {
    askTutor.mockResolvedValue({ data: { reply: "Answer." } });
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/type your question/i);
    await userEvent.type(input, "Explain gravity{Enter}");

    await waitFor(() => expect(askTutor).toHaveBeenCalled());
  });

  it("Ask button is disabled when input is empty", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const askBtn = screen.getByRole("button", { name: /ask/i });
    expect(askBtn).toBeDisabled();
  });

  it("does not call askTutor when submitting whitespace-only input", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/type your question/i);
    await userEvent.type(input, "   {Enter}");

    expect(askTutor).not.toHaveBeenCalled();
  });
});

// ── Error handling ───────────────────────────────────────────────────────────��─

describe("VoiceTutor — error handling", () => {
  it("shows error message when API call fails", async () => {
    askTutor.mockRejectedValue(new Error("backend down"));
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const input = screen.getByPlaceholderText(/type your question/i);
    await userEvent.type(input, "What is x?");
    await userEvent.click(screen.getByRole("button", { name: /ask/i }));

    await waitFor(() =>
      expect(screen.getByText(/could not reach AI tutor/i)).toBeInTheDocument()
    );
  });
});

// ── Clear history ─────────────────────────────────────────────────────────────��

describe("VoiceTutor — clear history", () => {
  it("Clear history button appears only when chat has messages", async () => {
    getVoiceHistory.mockResolvedValue({
      data: { history: [{ role: "user", content: "Test" }] },
    });
    renderTutor();
    await waitFor(() => screen.getByText("Test"));

    expect(screen.getByRole("button", { name: /clear history/i })).toBeInTheDocument();
  });

  it("clear history button is absent when chat is empty", async () => {
    renderTutor();
    await waitFor(() => screen.getByText(/press the mic/i));

    expect(screen.queryByRole("button", { name: /clear history/i })).toBeNull();
  });

  it("clicking Clear history empties the chat and calls clearVoiceHistory", async () => {
    getVoiceHistory.mockResolvedValue({
      data: { history: [{ role: "user", content: "Test message" }] },
    });
    clearVoiceHistory.mockResolvedValue({});
    renderTutor();

    const clearBtn = await screen.findByRole("button", { name: /clear history/i });
    await userEvent.click(clearBtn);

    expect(clearVoiceHistory).toHaveBeenCalled();
    await waitFor(() =>
      expect(screen.queryByText("Test message")).not.toBeInTheDocument()
    );
  });
});

// ── Quick prompts ─────────────────────────────────��────────────────────────────

describe("VoiceTutor — quick prompts", () => {
  it("renders quick prompt buttons for the user's subject", async () => {
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    // Math quick prompts include "Explain the discriminant"
    expect(screen.getByText(/explain the discriminant/i)).toBeInTheDocument();
  });

  it("clicking a quick prompt sends it as a text message", async () => {
    askTutor.mockResolvedValue({ data: { reply: "Here is info on the discriminant." } });
    renderTutor();
    await waitFor(() => expect(getVoiceHistory).toHaveBeenCalled());

    const promptBtn = screen.getByText(/explain the discriminant/i);
    await userEvent.click(promptBtn);

    await waitFor(() => expect(askTutor).toHaveBeenCalledWith(
      expect.stringMatching(/discriminant/i), expect.any(Array), "Math"
    ));
  });
});
