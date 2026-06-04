import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/api", () => ({
  communityList: vi.fn(),
  communityGet: vi.fn(),
  communityTags: vi.fn(),
  communityCreate: vi.fn(),
  communityEdit: vi.fn(),
  communityDelete: vi.fn(),
  communityUpvote: vi.fn(),
  communityComment: vi.fn(),
  communityDeleteComment: vi.fn(),
  communityReport: vi.fn(),
}));

import * as api from "../services/api";
import Community from "../pages/Community";

const POSTS = [
  { id: "p1", kind: "question", title: "How does consistent hashing work?", excerpt: "I keep seeing it...", tags: ["system-design"], authorName: "Ada", userId: "u9", upvotes: 3, upvotedByMe: false, commentCount: 2, views: 40, pinned: false, status: "published", isMine: false, createdAt: new Date().toISOString() },
  { id: "p2", kind: "article", title: "Sliding window, explained", excerpt: "A pattern guide...", tags: ["arrays"], authorName: "Lin", userId: "u8", upvotes: 9, upvotedByMe: true, commentCount: 0, views: 120, pinned: true, status: "published", isMine: false, createdAt: new Date().toISOString() },
];

beforeEach(() => {
  vi.clearAllMocks();
  api.communityList.mockResolvedValue({ data: { data: { items: POSTS, total: 2, limit: 20, skip: 0 } } });
  api.communityUpvote.mockResolvedValue({ data: { data: { upvotes: 4, upvotedByMe: true } } });
});

const renderPage = () => render(<MemoryRouter><Community /></MemoryRouter>);

describe("Community feed", () => {
  it("loads and renders posts from the feed", async () => {
    renderPage();
    expect(await screen.findByText(/How does consistent hashing work/i)).toBeInTheDocument();
    expect(screen.getByText(/Sliding window, explained/i)).toBeInTheDocument();
    expect(api.communityList).toHaveBeenCalled();
  });

  it("shows kind filter tabs and a New post button", async () => {
    renderPage();
    await screen.findByText(/How does consistent hashing work/i);
    expect(screen.getByRole("button", { name: "Articles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Questions" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New post/i })).toBeInTheDocument();
  });

  it("opens the composer when New post is clicked", async () => {
    renderPage();
    await screen.findByText(/How does consistent hashing work/i);
    fireEvent.click(screen.getByRole("button", { name: /New post/i }));
    expect(await screen.findByPlaceholderText(/your question, in one line/i)).toBeInTheDocument();
  });

  it("re-queries the feed when a kind tab is selected", async () => {
    renderPage();
    await screen.findByText(/How does consistent hashing work/i);
    api.communityList.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Articles" }));
    await waitFor(() => expect(api.communityList).toHaveBeenCalledWith(expect.objectContaining({ kind: "article" })));
  });

  it("upvotes a post optimistically", async () => {
    renderPage();
    await screen.findByText(/How does consistent hashing work/i);
    const upBtns = screen.getAllByTitle("Upvote");
    fireEvent.click(upBtns[0]);
    await waitFor(() => expect(api.communityUpvote).toHaveBeenCalledWith("p1"));
  });

  it("shows an empty state when there are no posts", async () => {
    api.communityList.mockResolvedValue({ data: { data: { items: [], total: 0, limit: 20, skip: 0 } } });
    renderPage();
    expect(await screen.findByText(/Nothing here yet/i)).toBeInTheDocument();
  });
});
