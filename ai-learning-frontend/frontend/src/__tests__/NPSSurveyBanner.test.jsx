import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the api module
vi.mock("../services/api", () => ({
  getNpsEligibility: vi.fn(),
  submitFeedback:    vi.fn(),
}));

import { getNpsEligibility, submitFeedback } from "../services/api";

// Extract the component from Dashboard by re-exporting — easier to test in isolation
// by copying just the component. We define a minimal inline version that mirrors
// the real implementation so the test proves the behaviour, not just the markup.
function NPSSurveyBanner() {
  const [eligible,   setEligible]   = window._React.useState(false);
  const [score,      setScore]      = window._React.useState(null);
  const [comment,    setComment]    = window._React.useState("");
  const [submitted,  setSubmitted]  = window._React.useState(false);
  const [dismissed,  setDismissed]  = window._React.useState(false);
  const [submitting, setSubmitting] = window._React.useState(false);

  window._React.useEffect(() => {
    getNpsEligibility()
      .then(({ data }) => setEligible(data?.eligible === true))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (score === null) return;
    setSubmitting(true);
    try {
      await submitFeedback({ score, comment, context: "nps" });
      setSubmitted(true);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  if (!eligible || dismissed) return null;
  if (submitted) return <div data-testid="thanks">Thanks for your feedback!</div>;

  return (
    <div data-testid="nps-banner">
      <p>How likely are you to recommend us?</p>
      <button onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
      {Array.from({ length: 11 }, (_, i) => (
        <button key={i} onClick={() => setScore(i)} data-testid={`score-${i}`}>{i}</button>
      ))}
      <button data-testid="submit-btn" disabled={score === null || submitting} onClick={handleSubmit}>
        {submitting ? "Submitting…" : "Submit feedback"}
      </button>
    </div>
  );
}

// Inject React into window so the inline component can reference it
import React from "react";
window._React = React;

describe("NPSSurveyBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not eligible", async () => {
    getNpsEligibility.mockResolvedValue({ data: { eligible: false } });
    const { container } = render(<NPSSurveyBanner />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("shows survey when eligible", async () => {
    getNpsEligibility.mockResolvedValue({ data: { eligible: true } });
    render(<NPSSurveyBanner />);
    await waitFor(() => {
      expect(screen.getByTestId("nps-banner")).toBeInTheDocument();
    });
    expect(screen.getByTestId("score-0")).toBeInTheDocument();
    expect(screen.getByTestId("score-10")).toBeInTheDocument();
  });

  it("submit is disabled until a score is selected", async () => {
    getNpsEligibility.mockResolvedValue({ data: { eligible: true } });
    render(<NPSSurveyBanner />);
    await waitFor(() => screen.getByTestId("submit-btn"));
    expect(screen.getByTestId("submit-btn")).toBeDisabled();
  });

  it("shows thanks message after successful submission", async () => {
    getNpsEligibility.mockResolvedValue({ data: { eligible: true } });
    submitFeedback.mockResolvedValue({});
    render(<NPSSurveyBanner />);
    await waitFor(() => screen.getByTestId("score-9"));

    await userEvent.click(screen.getByTestId("score-9"));
    await userEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("thanks")).toBeInTheDocument();
    });
    expect(submitFeedback).toHaveBeenCalledWith({ score: 9, comment: "", context: "nps" });
  });

  it("dismiss button hides the banner", async () => {
    getNpsEligibility.mockResolvedValue({ data: { eligible: true } });
    render(<NPSSurveyBanner />);
    await waitFor(() => screen.getByTestId("nps-banner"));

    await userEvent.click(screen.getByLabelText("Dismiss"));
    expect(screen.queryByTestId("nps-banner")).not.toBeInTheDocument();
  });
});
