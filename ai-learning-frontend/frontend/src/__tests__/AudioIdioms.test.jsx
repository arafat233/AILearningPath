import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ── Stub Web Speech API BEFORE importing ListenButton (SUPPORTED is read at import) ──
const speak = vi.fn();
const cancel = vi.fn();
const pause = vi.fn();
const resume = vi.fn();
globalThis.speechSynthesis = { speak, cancel, pause, resume, speaking: false, pending: false };
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; this.onend = null; } };

const { default: ListenButton } = await import("../components/ListenButton");
const { default: Idioms } = await import("../pages/Idioms");

beforeEach(() => { vi.clearAllMocks(); });

describe("ListenButton (audio mode)", () => {
  it("renders a Listen button when SpeechSynthesis is available", () => {
    render(<ListenButton text="Hello world. This is a test." />);
    expect(screen.getByRole("button", { name: /Listen/i })).toBeInTheDocument();
  });

  it("speaks the first chunk and shows transport controls on play", async () => {
    render(<ListenButton text="First sentence here. Second sentence here." />);
    fireEvent.click(screen.getByRole("button", { name: /Listen/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    const utt = speak.mock.calls[0][0];
    expect(utt.text).toMatch(/First sentence here/);
    // transport (stop ■) + progress now visible
    expect(screen.getByTitle("Stop")).toBeInTheDocument();
    expect(screen.getByText(/1\/2/)).toBeInTheDocument();
  });

  it("stop cancels speech and returns to idle", async () => {
    render(<ListenButton text="One. Two. Three." />);
    fireEvent.click(screen.getByRole("button", { name: /Listen/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    fireEvent.click(screen.getByTitle("Stop"));
    expect(cancel).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Listen/i })).toBeInTheDocument();
  });

  it("gathers semantic text from a contentRef when no text prop is given", async () => {
    const Wrapper = () => {
      const ref = { current: null };
      return (
        <div>
          <div ref={(el) => { ref.current = el; }}>
            <h2>Title heading</h2><p>Body paragraph one.</p><button>ignore me</button><li>List point.</li>
          </div>
          <ListenButton contentRef={ref} />
        </div>
      );
    };
    render(<Wrapper />);
    fireEvent.click(screen.getByRole("button", { name: /Listen/i }));
    await waitFor(() => expect(speak).toHaveBeenCalled());
    // Advance through the queued chunks by firing each utterance's onend.
    for (let guard = 0; guard < 10 && speak.mock.calls.length < 3; guard++) {
      const last = speak.mock.calls.at(-1)[0];
      if (last?.onend) last.onend();
      await Promise.resolve();
    }
    const spoken = speak.mock.calls.map((c) => c[0].text).join(" ");
    expect(spoken).toMatch(/Title heading/);
    expect(spoken).toMatch(/Body paragraph one/);
    expect(spoken).not.toMatch(/ignore me/); // button chrome excluded
  });
});

describe("Idioms page", () => {
  it("renders the catalog with titles and category filters", () => {
    render(<Idioms />);
    expect(screen.getByRole("heading", { name: /Java Idioms/i })).toBeInTheDocument();
    expect(screen.getByText(/Fast input with BufferedReader/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bit Tricks" })).toBeInTheDocument();
  });

  it("filters by search query", () => {
    render(<Idioms />);
    fireEvent.change(screen.getByPlaceholderText(/Search idioms/i), { target: { value: "overflow" } });
    expect(screen.getByText(/Overflow-safe midpoint/i)).toBeInTheDocument();
    expect(screen.queryByText(/Fast input with BufferedReader/i)).not.toBeInTheDocument();
  });

  it("filters by category chip", () => {
    render(<Idioms />);
    fireEvent.click(screen.getByRole("button", { name: "Strings" }));
    expect(screen.getByText(/Never \+= String in a loop/i)).toBeInTheDocument();
    expect(screen.queryByText(/Overflow-safe midpoint/i)).not.toBeInTheDocument();
  });

  it("shows an empty state for no matches", () => {
    render(<Idioms />);
    fireEvent.change(screen.getByPlaceholderText(/Search idioms/i), { target: { value: "zzzznotathing" } });
    expect(screen.getByText(/No idioms match/i)).toBeInTheDocument();
  });
});
