import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { logoutApi } from "../services/api";
import SearchOverlay from "./SearchOverlay";
import OfflineBanner from "./OfflineBanner";

function Icon({ id }) {
  const paths = {
    dashboard:   <><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></>,
    lessons:     <><path d="M3 2h9a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M8 2v12M5 6h3M5 9h3"/></>,
    practice:    <><path d="M11 3l2 2L5 13H3v-2L11 3z"/><path d="M9 5l2 2"/></>,
    analytics:   <><path d="M3 13V9M7 13V5M11 13V2M13 13V7"/><path d="M1 13h14"/></>,
    certificate: <><rect x="1.5" y="3" width="13" height="9" rx="1.5"/><path d="M5 7h6M5 9.5h3"/><circle cx="11.5" cy="10" r="2"/><path d="M10 12l-.5 2M13 12l.5 2"/></>,
    competition: <><path d="M5 2h6l-1 5H6L5 2z"/><path d="M3 2v2.5c0 1.5 1 2.5 2.5 2.5M13 2v2.5c0 1.5-1 2.5-2.5 2.5"/><path d="M8 7v4M5.5 11h5"/></>,
    live:        <><rect x="5.5" y="1.5" width="5" height="7" rx="2.5"/><path d="M3.5 8a4.5 4.5 0 009 0M8 12.5v2M5.5 14.5h5"/></>,
    bookmarks:   <><path d="M4 2h8a1 1 0 011 1v11l-5-3-5 3V3a1 1 0 011-1z"/></>,
    planner:     <><rect x="2" y="3.5" width="12" height="11" rx="1.5"/><path d="M2 7.5h12M5.5 2v3M10.5 2v3"/></>,
    voiceTutor:  <><path d="M3 8.5a5 5 0 0010 0"/><rect x="1.5" y="8" width="3" height="4.5" rx="1.5"/><rect x="11.5" y="8" width="3" height="4.5" rx="1.5"/></>,
    pyq:         <><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 5h6M5 8h4M5 11h3"/><path d="M11 9l2 2-2 2"/></>,
    parent:      <><circle cx="5.5" cy="5" r="2.5"/><path d="M1 13.5a4.5 4.5 0 019 0"/><circle cx="12" cy="6" r="2"/><path d="M10 13.5a3 3 0 016 0"/></>,
    profile:     <><circle cx="8" cy="5.5" r="3"/><path d="M2.5 14.5a5.5 5.5 0 0111 0"/></>,
    upgrade:     <><path d="M10 2L6 8.5h4L8 14l6-7.5h-4L10 2z"/></>,
    settings:    <><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.6 3.6l1.5 1.5M10.9 10.9l1.5 1.5M3.6 12.4l1.5-1.5M10.9 5.1l1.5-1.5"/></>,
    school:      <><path d="M8 2l6 4v1H2V6L8 2z"/><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M6 14v-4h4v4"/></>,
    mock:        <><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5 5h6M5 8h4M5 11h3"/><path d="M11 9l2 2-2 2"/></>,
  };
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round"
         className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}

const NAV = [
  { to: "/",            label: "Dashboard",    icon: "dashboard",   end: true },
  { to: "/lessons",     label: "Learn",        icon: "lessons"               },
  { to: "/practice",    label: "Practice",     icon: "practice"              },
  { to: "/bookmarks",   label: "Bookmarks",    icon: "bookmarks"             },
  { to: "/analytics",   label: "Analytics",    icon: "analytics"             },
  { to: "/certificate", label: "Certificate",  icon: "certificate"           },
  { to: "/competition", label: "Competition",  icon: "competition"           },
  { to: "/live",        label: "Live Room",    icon: "live"                  },
  { to: "/planner",     label: "Study Planner",icon: "planner"               },
  { to: "/pyq",         label: "PYQ Bank",     icon: "pyq"                   },
  { to: "/parent",      label: "Parent View",  icon: "parent"                },
  { to: "/school",      label: "School Groups",icon: "school"                },
  { to: "/mock-paper",  label: "Mock Paper",   icon: "mock"                  },
  { to: "/voice-tutor", label: "Voice Tutor",  icon: "voiceTutor"            },
  { to: "/profile",     label: "Profile",      icon: "profile"               },
];

const PARENT_NAV = [
  { to: "/parent",  label: "My Children",   icon: "parent",   end: true },
  { to: "/portal",  label: "Link Student",  icon: "profile"             },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { dark, toggle: toggleDark } = useThemeStore();
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [bellOpen,     setBellOpen]     = useState(false);
  const location = useLocation();
  const bellRef        = useRef(null);
  const bellDesktopRef = useRef(null);

  // Close bell dropdown when clicking outside
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e) => {
      const inMobile  = bellRef.current        && bellRef.current.contains(e.target);
      const inDesktop = bellDesktopRef.current && bellDesktopRef.current.contains(e.target);
      if (!inMobile && !inDesktop) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const { activeChild } = useAuthStore();
  const isParent = user?.role === "parent" || user?.role === "teacher";

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div className="flex h-screen overflow-hidden bg-apple-gray6">
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static on sm+ */}
      <aside
        className={`fixed sm:static inset-y-0 left-0 z-40 w-56 flex flex-col shrink-0 backdrop-blur-apple border-r border-apple-gray5 dark:border-apple-gray/20 transition-transform duration-200 ease-out sm:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* App header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded-lg bg-apple-blue flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-[13px] font-semibold text-[var(--label)]">Stellar</span>
          </div>
          {activeChild ? (
            <button onClick={() => navigate("/child-picker")}
              className="flex items-center gap-1 ml-9 text-[11px] text-apple-gray hover:text-apple-blue transition-colors group">
              <span>{activeChild.examBoard} · Class {activeChild.grade}</span>
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <path d="M2 4l3 3 3-3"/>
              </svg>
            </button>
          ) : (
            <p className="text-[11px] text-apple-gray ml-9">Stellar</p>
          )}
        </div>

        <div className="divider mx-4 mb-3" />

        {/* Navigation */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {isParent ? (
            <>
              <p className="section-label px-2 mb-2">Parent Portal</p>
              {PARENT_NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
              <div className="divider mx-1 my-2" />
              <p className="section-label px-2 mb-2">Student View</p>
              {NAV.filter((n) => ["/", "/analytics", "/planner", "/pyq"].includes(n.to)).map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              <p className="section-label px-2 mb-2">Menu</p>
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon id={n.icon} />
                  {n.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Notification bell — desktop sidebar */}
        <div className="px-3 mb-1 relative hidden sm:block" ref={bellDesktopRef}>
          <button
            onClick={() => setBellOpen((o) => !o)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-[13px] text-apple-gray hover:bg-apple-gray5 transition-colors"
            style={{ background: "var(--fill)" }}
          >
            <span className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-apple-red" />
            </span>
            <span className="flex-1 text-left">Notifications</span>
          </button>
          {bellOpen && (
            <div className="absolute left-3 right-3 bottom-full mb-1 bg-white dark:bg-[var(--sidebar-bg)] rounded-apple shadow-lg border border-apple-gray5 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-apple-gray5">
                <p className="text-[13px] font-semibold text-[var(--label)]">Notifications</p>
              </div>
              <div className="px-4 py-5 text-center">
                <p className="text-[13px] font-medium text-[var(--label)] mb-1">No new notifications</p>
                <p className="text-[12px] text-apple-gray leading-relaxed">
                  Check back later for practice reminders and achievement alerts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Search + dark mode toggle */}
        <div className="px-3 mb-2 flex flex-col gap-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-[13px] text-apple-gray bg-apple-gray6 hover:bg-apple-gray5 transition-colors"
            style={{ background: "var(--fill)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" className="w-3.5 h-3.5 shrink-0">
              <circle cx="6.5" cy="6.5" r="4.5"/>
              <path d="M10 10l3 3"/>
            </svg>
            <span className="flex-1 text-left">Search topics…</span>
            <kbd className="text-[10px] border border-apple-gray5 rounded px-1 py-0.5">⌘K</kbd>
          </button>
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-[13px] text-apple-gray hover:bg-apple-gray5 transition-colors"
            style={{ background: "var(--fill)" }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" className="w-3.5 h-3.5 shrink-0">
              {dark
                ? <><circle cx="8" cy="8" r="4"/><path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.2 3.2l.7.7M12.1 12.1l.7.7M3.2 12.8l.7-.7M12.1 3.9l.7-.7"/></>
                : <path d="M14 9.5A6 6 0 019.5 2a6 6 0 100 12 6 6 0 004.5-4.5z"/>
              }
            </svg>
            <span className="flex-1 text-left">{dark ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>

        <div className="divider mx-4 mb-3" />

        {/* Bottom links */}
        <div className="px-3 mb-2 flex flex-col gap-0.5">
          <NavLink
            to="/pricing"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon id="upgrade" />
            Upgrade
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon id="settings" />
            Settings
          </NavLink>
        </div>

        {/* Legal links */}
        <div className="px-4 pb-2 flex items-center gap-3">
          <a href="/terms"   className="text-[10px] text-apple-gray hover:text-apple-blue transition-colors">Terms</a>
          <span className="text-apple-gray5 text-[10px]">·</span>
          <a href="/privacy" className="text-[10px] text-apple-gray hover:text-apple-blue transition-colors">Privacy</a>
        </div>

        {/* User footer */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-semibold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-[var(--label)] truncate">
              {activeChild ? activeChild.name : user?.name}
            </p>
            {activeChild && (
              <button onClick={() => navigate("/child-picker")}
                className="text-[10px] text-apple-blue hover:opacity-70 transition-opacity">
                Switch child
              </button>
            )}
            <button
              onClick={async () => { await logoutApi().catch(() => {}); logout(); navigate("/login"); }}
              className="btn-destructive text-[11px]"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto transition-colors" style={{ background: "var(--gray6)" }}>
        {/* Mobile header with hamburger */}
        <div className="sm:hidden flex items-center gap-3 px-4 py-3 border-b border-apple-gray5 sticky top-0 z-20" style={{ background: "var(--sidebar-bg)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            aria-label="Open menu"
          >
            <span className="w-5 h-0.5 bg-[var(--label)] rounded-full" />
            <span className="w-5 h-0.5 bg-[var(--label)] rounded-full" />
            <span className="w-3.5 h-0.5 bg-[var(--label)] rounded-full" />
          </button>
          <div className="w-5 h-5 rounded-md bg-apple-blue flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">S</span>
          </div>
          <span className="text-[13px] font-semibold text-[var(--label)] flex-1">Stellar</span>
          {/* Bell — mobile */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setBellOpen((o) => !o)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-apple-gray5 transition-colors relative"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[var(--label)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {/* Red dot badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-apple-red border-2 border-white" />
            </button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[var(--sidebar-bg)] rounded-apple shadow-lg border border-apple-gray5 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-apple-gray5">
                  <p className="text-[13px] font-semibold text-[var(--label)]">Notifications</p>
                </div>
                <div className="px-4 py-5 text-center">
                  <p className="text-[13px] font-medium text-[var(--label)] mb-1">No new notifications</p>
                  <p className="text-[12px] text-apple-gray leading-relaxed">
                    Check back later for practice reminders and achievement alerts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <OfflineBanner />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
