import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../services/api", () => ({
  getDoubtThread:   vi.fn(),
  sendDoubtMessage: vi.fn(),
  clearDoubtThread: vi.fn(),
}));

import { getDoubtThread, sendDoubtMessage, clearDoubtThread } from "../services/api";
import DoubtChat from "../components/DoubtChat";

beforeEach(() => {
  vi.clearAllMocks();
  getDoubtThread.mockResolvedValue({ data: { messages: [] } });
  clearDoubtThread.mockResolvedValue({});
});

describe("DoubtChat — render guard", () => {
  it("renders nothing when questionId is not provided", () => {
    const { container } = render(<DoubtChat />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing for ai-generated question IDs", () => {
    const { container } = render(<DoubtChat questionId="ai-generated" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the toggle button for a valid questionId", () => {
    render(<DoubtChat questionId="q123" topic="Algebra" subject="Math" />);
    expect(screen.getByRole("button", { name: /confused|follow-up/i })).toBeInTheDocument();
  });
});

describe("DoubtChat — open/close toggle", () => {
  it("chat panel hidden by default", () => {
    render(<DoubtChat questionId="q123" />);
    expect(screen.queryByPlaceholderText(/follow-up/i)).not.toBeInTheDocument();
  });

  it("clicking toggle opens the chat panel", async () => {
    render(<DoubtChat questionId="q123" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    expect(await screen.findByPlaceholderText(/follow-up/i)).toBeInTheDocument();
  });

  it("clicking toggle again closes the panel", async () => {
    render(<DoubtChat questionId="q123" />);
    const btn = screen.getByRole("button", { name: /confused|follow-up/i });
    await userEvent.click(btn);
    await screen.findByPlaceholderText(/follow-up/i);
    await userEvent.click(btn);
    expect(screen.queryByPlaceholderText(/follow-up/i)).not.toBeInTheDocument();
  });
});

describe("DoubtChat — thread loading", () => {
  it("fetches thread history when opened", async () => {
    getDoubtThread.mockResolvedValue({
      data: { messages: [{ role: "user", content: "What is BPT?" }] },
    });
    render(<DoubtChat questionId="q123" topic="Geometry" subject="Math" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await waitFor(() => expect(getDoubtThread).toHaveBeenCalledWith("q123"));
    expect(await screen.findByText("What is BPT?")).toBeInTheDocument();
  });

  it("does NOT fetch thread for ai-generated questionId (guarded)", () => {
    render(<DoubtChat questionId="ai-generated" />);
    expect(getDoubtThread).not.toHaveBeenCalled();
  });
});

describe("DoubtChat — send message", () => {
  async function openChat(questionId = "q1") {
    render(<DoubtChat questionId={questionId} topic="Algebra" subject="Math" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await screen.findByPlaceholderText(/follow-up/i);
  }

  it("Send button disabled when input is empty", async () => {
    await openChat();
    const sendBtn = screen.getByRole("button", { name: /^send$/i });
    expect(sendBtn).toBeDisabled();
  });

  it("Send button enabled when input has text", async () => {
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/follow-up/i), "Explain step 2");
    expect(screen.getByRole("button", { name: /^send$/i })).toBeEnabled();
  });

  it("sends message and appends assistant reply", async () => {
    sendDoubtMessage.mockResolvedValue({ data: { reply: "Here's the explanation." } });
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/follow-up/i), "How does this work?");
    await userEvent.click(screen.getByRole("button", { name: /^send$/i }));
    expect(await screen.findByText("How does this work?")).toBeInTheDocument();
    expect(await screen.findByText("Here's the explanation.")).toBeInTheDocument();
  });

  it("pressing Enter sends the message", async () => {
    sendDoubtMessage.mockResolvedValue({ data: { reply: "Enter reply." } });
    await openChat();
    const input = screen.getByPlaceholderText(/follow-up/i);
    await userEvent.type(input, "Enter test{Enter}");
    expect(await screen.findByText("Enter reply.")).toBeInTheDocument();
  });

  it("clears input after sending", async () => {
    sendDoubtMessage.mockResolvedValue({ data: { reply: "Done." } });
    await openChat();
    const input = screen.getByPlaceholderText(/follow-up/i);
    await userEvent.type(input, "My question");
    await userEvent.click(screen.getByRole("button", { name: /^send$/i }));
    await waitFor(() => expect(input.value).toBe(""));
  });

  it("blocks empty submissions (whitespace only)", async () => {
    await openChat();
    const input = screen.getByPlaceholderText(/follow-up/i);
    await userEvent.type(input, "   ");
    // Send button should remain disabled for whitespace-only input
    expect(screen.getByRole("button", { name: /^send$/i })).toBeDisabled();
  });
});

describe("DoubtChat — error handling", () => {
  it("shows error banner when AI call fails", async () => {
    sendDoubtMessage.mockRejectedValue({
      response: { data: { error: "AI limit reached" } },
    });
    render(<DoubtChat questionId="q1" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await userEvent.type(screen.getByPlaceholderText(/follow-up/i), "test question");
    await userEvent.click(screen.getByRole("button", { name: /^send$/i }));
    expect(await screen.findByText(/AI limit reached/i)).toBeInTheDocument();
  });
});

describe("DoubtChat — clear thread", () => {
  it("Clear button appears only when messages exist", async () => {
    getDoubtThread.mockResolvedValue({
      data: { messages: [{ role: "user", content: "Hello" }] },
    });
    render(<DoubtChat questionId="q1" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await waitFor(() => screen.getByText("Hello"));
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("Clear button not shown when no messages", async () => {
    render(<DoubtChat questionId="q1" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await waitFor(() => expect(getDoubtThread).toHaveBeenCalled());
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("clicking Clear calls clearDoubtThread and empties messages", async () => {
    getDoubtThread.mockResolvedValue({
      data: { messages: [{ role: "assistant", content: "Old reply" }] },
    });
    render(<DoubtChat questionId="q1" />);
    await userEvent.click(screen.getByRole("button", { name: /confused|follow-up/i }));
    await screen.findByText("Old reply");
    await userEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(clearDoubtThread).toHaveBeenCalledWith("q1");
    await waitFor(() => expect(screen.queryByText("Old reply")).not.toBeInTheDocument());
  });
});
