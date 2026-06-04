import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/api", () => ({
  notesForItem: vi.fn(),
  notesNotebook: vi.fn(),
  notesTags: vi.fn(),
  notesStats: vi.fn(),
  notesCreate: vi.fn(),
  notesUpdate: vi.fn(),
  notesDelete: vi.fn(),
}));

import * as api from "../services/api";
import NotesPanel from "../components/NotesPanel";
import Notebook from "../pages/Notebook";

beforeEach(() => {
  vi.clearAllMocks();
  api.notesForItem.mockResolvedValue({ data: { data: [] } });
  api.notesNotebook.mockResolvedValue({ data: { data: { items: [], total: 0 } } });
  api.notesTags.mockResolvedValue({ data: { data: [] } });
  api.notesStats.mockResolvedValue({ data: { data: { notes: 0, highlights: 0, pinned: 0, total: 0 } } });
});

const ITEM = { scope: "pro", kind: "exercise", refId: "java_m30_t1_ex_8", trackKey: "pro_java", title: "Move Zeroes", url: "/pro/exercise/java_m30_t1_ex_8" };

describe("NotesPanel", () => {
  it("renders the panel header and composer", async () => {
    render(<NotesPanel item={ITEM} />);
    expect(await screen.findByText(/My notes & highlights/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write a note/i)).toBeInTheDocument();
    await waitFor(() => expect(api.notesForItem).toHaveBeenCalledWith("exercise", "java_m30_t1_ex_8"));
  });

  it("creates a note with the item context + parsed tags", async () => {
    api.notesCreate.mockResolvedValue({ data: { data: { _id: "n1", type: "note", body: "my note", tags: ["dp"] } } });
    render(<NotesPanel item={ITEM} />);
    await screen.findByText(/My notes & highlights/i);
    fireEvent.change(screen.getByPlaceholderText(/Write a note/i), { target: { value: "my note" } });
    fireEvent.change(screen.getByPlaceholderText(/tags, comma separated/i), { target: { value: "dp, revisit" } });
    fireEvent.click(screen.getByRole("button", { name: /Add note/i }));
    await waitFor(() => expect(api.notesCreate).toHaveBeenCalledTimes(1));
    const arg = api.notesCreate.mock.calls[0][0];
    expect(arg).toMatchObject({ scope: "pro", kind: "exercise", refId: "java_m30_t1_ex_8", type: "note", body: "my note" });
    expect(arg.tags).toEqual(["dp", "revisit"]);
    expect(await screen.findByText("my note")).toBeInTheDocument();
  });

  it("Add note is disabled until text is entered", async () => {
    render(<NotesPanel item={ITEM} />);
    await screen.findByText(/My notes & highlights/i);
    expect(screen.getByRole("button", { name: /Add note/i })).toBeDisabled();
  });

  it("renders existing notes and highlights from the API", async () => {
    api.notesForItem.mockResolvedValue({ data: { data: [
      { _id: "n1", type: "note", body: "Saved note", tags: ["greedy"] },
      { _id: "h1", type: "highlight", quote: "two-pointer", color: "yellow" },
    ] } });
    render(<NotesPanel item={ITEM} />);
    expect(await screen.findByText("Saved note")).toBeInTheDocument();
    expect(screen.getByText(/two-pointer/)).toBeInTheDocument();
    expect(screen.getByText("#greedy")).toBeInTheDocument();
  });
});

describe("Notebook page", () => {
  const renderNB = () => render(<MemoryRouter><Notebook /></MemoryRouter>);

  it("renders the heading and search box", async () => {
    renderNB();
    expect(await screen.findByRole("heading", { name: "Notebook" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search your notes/i)).toBeInTheDocument();
    await waitFor(() => expect(api.notesNotebook).toHaveBeenCalled());
  });

  it("shows the empty state when there are no notes", async () => {
    renderNB();
    expect(await screen.findByText(/Nothing here yet/i)).toBeInTheDocument();
  });

  it("lists notes returned from the API with a source link", async () => {
    api.notesNotebook.mockResolvedValue({ data: { data: { items: [
      { _id: "n1", type: "note", kind: "lesson", subject: "Science", title: "Reactions", body: "conserve atoms", tags: [], url: "/ncert/topics/sci10_ch1" },
    ], total: 1 } } });
    api.notesStats.mockResolvedValue({ data: { data: { notes: 1, highlights: 0, pinned: 0, total: 1 } } });
    renderNB();
    expect(await screen.findByText("conserve atoms")).toBeInTheDocument();
    expect(screen.getByText("Reactions")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open source/i })).toHaveAttribute("href", "/ncert/topics/sci10_ch1");
  });

  it("re-queries when a filter chip is toggled", async () => {
    renderNB();
    await screen.findByRole("heading", { name: "Notebook" });
    await waitFor(() => expect(api.notesNotebook).toHaveBeenCalled());
    const before = api.notesNotebook.mock.calls.length;
    fireEvent.click(screen.getByRole("button", { name: "Highlights" }));
    await waitFor(() => expect(api.notesNotebook.mock.calls.length).toBeGreaterThan(before));
    const lastArgs = api.notesNotebook.mock.calls.at(-1)[0];
    expect(lastArgs).toMatchObject({ type: "highlight" });
  });
});
