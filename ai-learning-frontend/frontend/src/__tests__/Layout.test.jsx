import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ── Auth store mock ───────────────────────────────────────────────────────────
const authState = { user: null };

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn((selector) => selector(authState)),
}));

vi.mock("../store/themeStore", () => ({
  useThemeStore: () => ({ dark: false, toggle: vi.fn() }),
}));

vi.mock("../services/api", () => ({
  logoutApi: vi.fn(),
  getFlags:  vi.fn().mockResolvedValue({ data: { data: {} } }),
}));

// Mock heavy child components so Layout renders fast
vi.mock("../components/SearchOverlay", () => ({ default: () => null }));
vi.mock("../components/OfflineBanner",  () => ({ default: () => null }));

// ── Protected / PublicOnly guards (mirrored from App.jsx) ─────────────────────
import { useAuthStore } from "../store/authStore";

function Protected({ children }) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" replace />;
}

function AdminOnly({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function PublicOnly({ children }) {
  const user = useAuthStore((s) => s.user);
  return user ? <Navigate to="/" replace /> : children;
}

function renderWithRouter(initialPath, element) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login"  element={<div data-testid="login-page">Login</div>} />
        <Route path="/"       element={<div data-testid="dashboard">Dashboard</div>} />
        <Route path="/admin"  element={element} />
        <Route path="/protected" element={element} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default to logged-out
  authState.user = null;
});

describe("Protected route guard", () => {
  it("unauthenticated user is redirected to /login", () => {
    authState.user = null;
    renderWithRouter(
      "/protected",
      <Protected><div data-testid="secret">Secret Page</div></Protected>
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("secret")).not.toBeInTheDocument();
  });

  it("authenticated user sees the protected content", () => {
    authState.user = { id: "u1", role: "student" };
    renderWithRouter(
      "/protected",
      <Protected><div data-testid="secret">Secret Page</div></Protected>
    );
    expect(screen.getByTestId("secret")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });
});

describe("AdminOnly route guard", () => {
  it("unauthenticated user → redirected to /login", () => {
    authState.user = null;
    renderWithRouter(
      "/admin",
      <AdminOnly><div data-testid="admin-page">Admin</div></AdminOnly>
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-page")).not.toBeInTheDocument();
  });

  it("student role → redirected to / (Dashboard), not admin panel", () => {
    authState.user = { id: "u2", role: "student" };
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/login"  element={<div data-testid="login-page">Login</div>} />
          <Route path="/"       element={<div data-testid="dashboard">Dashboard</div>} />
          <Route path="/admin"  element={
            <AdminOnly><div data-testid="admin-page">Admin</div></AdminOnly>
          } />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-page")).not.toBeInTheDocument();
  });

  it("admin role → sees admin panel", () => {
    authState.user = { id: "u3", role: "admin" };
    renderWithRouter(
      "/admin",
      <AdminOnly><div data-testid="admin-page">Admin Panel</div></AdminOnly>
    );
    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
  });
});

describe("PublicOnly route guard", () => {
  it("unauthenticated user → sees public page", () => {
    authState.user = null;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={
            <PublicOnly><div data-testid="login-form">Login Form</div></PublicOnly>
          } />
          <Route path="/" element={<div data-testid="dashboard">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("authenticated user on public route → redirected to /", () => {
    authState.user = { id: "u1", role: "student" };
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={
            <PublicOnly><div data-testid="login-form">Login Form</div></PublicOnly>
          } />
          <Route path="/" element={<div data-testid="dashboard">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
  });
});
