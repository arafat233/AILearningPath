import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VoiceTutorView from "../pages/VoiceTutorView";

const defaultProps = {
  subject: "Math",
  isHindi: false,
  isSupported: true,
  chat: [],
  text: "",
  topic: "",
  listening: false,
  speaking: false,
  speakingIdx: null,
  loading: false,
  historyLoading: false,
  status: "ready",
  error: "",
  listenSecs: 0,
  followUps: [],
  savedIdx: new Set(),
  weakTopics: [],
  summaryOpen: true,
  limitReached: false,
  user: { name: "Test" },
  quickPrompts: ["Explain the discriminant"],
  exchanges: [],
  sessionCovered: [],
  showSummary: false,
  setText: vi.fn(),
  setTopic: vi.fn(),
  handleClearHistory: vi.fn(),
  startListening: vi.fn(),
  stopListening: vi.fn(),
  speak: vi.fn(),
  stopSpeaking: vi.fn(),
  sendMessage: vi.fn(),
  handleSaveNote: vi.fn(),
  setSummaryOpen: vi.fn(),
};

describe("VoiceTutorView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the header with subject", () => {
    render(<VoiceTutorView {...defaultProps} />);
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText(/Ask anything/)).toBeInTheDocument();
  });

  it("renders the topic picker with General button", () => {
    render(<VoiceTutorView {...defaultProps} />);
    expect(screen.getByRole("button", { name: "General" })).toBeInTheDocument();
  });

  it("renders error when error prop is set", () => {
    render(<VoiceTutorView {...defaultProps} error="Test error" />);
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("renders daily limit message when limitReached is true", () => {
    render(<VoiceTutorView {...defaultProps} limitReached={true} />);
    expect(screen.getByText("Daily AI limit reached")).toBeInTheDocument();
  });

  it("renders loading spinner when historyLoading is true", () => {
    render(<VoiceTutorView {...defaultProps} historyLoading={true} />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders empty state with quick prompts when no chat", () => {
    render(<VoiceTutorView {...defaultProps} />);
    expect(screen.getByText(/Stellar is ready/)).toBeInTheDocument();
    expect(screen.getByText("Explain the discriminant")).toBeInTheDocument();
  });

  it("renders chat messages correctly", () => {
    const chat = [
      { role: "user", content: "What is algebra?" },
      { role: "assistant", content: "Algebra is a branch of math." }
    ];
    render(<VoiceTutorView {...defaultProps} chat={chat} />);
    expect(screen.getByText("What is algebra?")).toBeInTheDocument();
    expect(screen.getByText("Algebra is a branch of math.")).toBeInTheDocument();
  });

  it("calls sendMessage when quick prompt is clicked", async () => {
    const sendMessage = vi.fn();
    render(<VoiceTutorView {...defaultProps} sendMessage={sendMessage} />);
    const promptButton = screen.getByText("Explain the discriminant");
    fireEvent.click(promptButton);
    expect(sendMessage).toHaveBeenCalledWith("Explain the discriminant");
  });

  it("renders session summary when showSummary is true", () => {
    const exchanges = [
      { role: "user", content: "What is the area?" }
    ];
    render(<VoiceTutorView {...defaultProps} showSummary={true} exchanges={exchanges} sessionCovered={["What is the area?"]} />);
    expect(screen.getByText(/What we covered/)).toBeInTheDocument();
  });

  it("calls setText when input changes", () => {
    const setText = vi.fn();
    render(<VoiceTutorView {...defaultProps} setText={setText} />);
    const input = screen.getByPlaceholderText("Type your question…");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(setText).toHaveBeenCalledWith("Hello");
  });

  it("calls sendMessage when Ask button is clicked", () => {
    const sendMessage = vi.fn();
    render(<VoiceTutorView {...defaultProps} text="What is algebra?" sendMessage={sendMessage} />);
    const askButton = screen.getByRole("button", { name: "Ask" });
    fireEvent.click(askButton);
    expect(sendMessage).toHaveBeenCalledWith("What is algebra?");
  });

  it("renders mic button when isSupported is true", () => {
    render(<VoiceTutorView {...defaultProps} isSupported={true} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders listening indicator when listening is true", () => {
    render(<VoiceTutorView {...defaultProps} listening={true} />);
    expect(screen.getByText(/Listening/)).toBeInTheDocument();
  });

  it("renders speaking indicator when speaking is true", () => {
    render(<VoiceTutorView {...defaultProps} speaking={true} />);
    expect(screen.getByText("Stellar is speaking…")).toBeInTheDocument();
  });

  it("calls handleClearHistory when Clear button is clicked", () => {
    const handleClearHistory = vi.fn();
    const chat = [{ role: "user", content: "Hello" }];
    render(<VoiceTutorView {...defaultProps} chat={chat} handleClearHistory={handleClearHistory} />);
    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);
    expect(handleClearHistory).toHaveBeenCalled();
  });

  it("renders replay button for assistant messages", () => {
    const chat = [
      { role: "assistant", content: "Test response" }
    ];
    render(<VoiceTutorView {...defaultProps} chat={chat} />);
    expect(screen.getByText("Replay")).toBeInTheDocument();
  });

  it("renders save button for assistant messages", () => {
    const chat = [
      { role: "assistant", content: "Test response" }
    ];
    render(<VoiceTutorView {...defaultProps} chat={chat} />);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renders follow-up chips when available", () => {
    const followUps = ["How to solve it?", "Give an example"];
    render(<VoiceTutorView {...defaultProps} followUps={followUps} loading={false} />);
    expect(screen.getByText("How to solve it?")).toBeInTheDocument();
    expect(screen.getByText("Give an example")).toBeInTheDocument();
  });

  it("renders typing indicator when loading is true", () => {
    render(<VoiceTutorView {...defaultProps} loading={true} />);
    const dots = document.querySelectorAll(".animate-bounce");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("disables Ask button when text is empty", () => {
    render(<VoiceTutorView {...defaultProps} text="" />);
    const askButton = screen.getByRole("button", { name: "Ask" });
    expect(askButton).toBeDisabled();
  });

  it("disables Ask button when loading is true", () => {
    render(<VoiceTutorView {...defaultProps} text="Question" loading={true} />);
    const askButton = screen.getByRole("button", { name: "Ask" });
    expect(askButton).toBeDisabled();
  });

  it("calls handleSaveNote when Save button is clicked", () => {
    const handleSaveNote = vi.fn();
    const chat = [
      { role: "assistant", content: "Test response" }
    ];
    render(<VoiceTutorView {...defaultProps} chat={chat} handleSaveNote={handleSaveNote} />);
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);
    expect(handleSaveNote).toHaveBeenCalledWith("Test response", 0);
  });
});
