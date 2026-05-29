import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useTrackStore } from "../store/trackStore";
import { logoutApi } from "../services/api";
import SearchOverlay from "./SearchOverlay";
import OfflineBanner from "./OfflineBanner";
import StellarLogo from "./StellarLogo";
import TrackSwitcher from "./TrackSwitcher";

function Icon({ id }) {
  const paths = {
    // House with centre door — home/dashboard
    dashboard:   <><path d="M8 2L2 7V14h4.5V10h3v4H14V7L8 2z"/></>,
    // Grid box with inner cross — learn/lessons
    lessons:     <><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M8 2v12M2 8h12"/></>,
    // Target/bullseye — practice
    practice:    <><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3.5"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/></>,
    // Bookmark — single ribbon bookmark
    bookmarks:   <><path d="M4.5 1.5h7a1 1 0 011 1v12l-4.5-2.8-4.5 2.8v-12a1 1 0 011-1z"/></>,
    // BarChart2 — 3 ascending bars + baseline
    analytics:   <><path d="M1.5 13.5h13"/><rect x="2.5" y="8.5" width="2.5" height="5" rx=".5"/><rect x="6.75" y="5.5" width="2.5" height="8" rx=".5"/><rect x="11" y="2.5" width="2.5" height="11" rx=".5"/></>,
    // Award — medal circle + ribbon tails
    certificate: <><circle cx="8" cy="6.5" r="3.5"/><path d="M5.5 9.3L4 14l4-1.5L12 14l-1.5-4.7"/><path d="M6.5 6l1.2 1.2L10 5"/></>,
    // Trophy — cup body + handles + stem + base
    competition: <><path d="M5 1.5h6l-1 5a2.5 2.5 0 01-5 0L5 1.5z"/><path d="M2 1.5h3M11 1.5h3"/><path d="M2 1.5v2a2.5 2.5 0 002.5 2.5"/><path d="M14 1.5v2A2.5 2.5 0 0111.5 6"/><path d="M8 11V13M5.5 13h5"/></>,
    // Mic — capsule + stand arc + base line (live room)
    live:        <><rect x="5.5" y="1.5" width="5" height="7" rx="2.5"/><path d="M3 8.5a5 5 0 0010 0"/><path d="M8 13.5v-1.5M5.5 13.5h5"/></>,
    // CalendarDays — calendar with dot grid
    planner:     <><rect x="2" y="3" width="12" height="11.5" rx="1.5"/><path d="M2 7h12M5.5 1.5v3M10.5 1.5v3"/><circle cx="5.5" cy="10" r=".7" fill="currentColor" stroke="none"/><circle cx="8" cy="10" r=".7" fill="currentColor" stroke="none"/><circle cx="10.5" cy="10" r=".7" fill="currentColor" stroke="none"/><circle cx="5.5" cy="12.5" r=".7" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r=".7" fill="currentColor" stroke="none"/></>,
    // Sparkle — centre dot + 8 radiating rays (voice tutor / AI)
    voiceTutor:  <><circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/><path d="M8 1.5V4M8 12V14.5M1.5 8H4M12 8H14.5M3.2 3.2l1.8 1.8M11 11l1.8 1.8M12.8 3.2L11 5M5 11L3.2 12.8"/></>,
    // Zap/Lightning — bolt shape (past year questions)
    pyq:         <><path d="M9.5 1.5L5.5 8.5h4l-2 6 6-8h-4l2-5z"/></>,
    // User — single person (parent view)
    parent:      <><circle cx="8" cy="6" r="3"/><path d="M2.5 14.5a5.5 5.5 0 0111 0"/></>,
    // Users — two overlapping silhouettes (school groups)
    school:      <><circle cx="5.5" cy="5" r="2.5"/><path d="M1 14a4.5 4.5 0 019 0"/><circle cx="12" cy="5.5" r="2"/><path d="M14.5 14a3.5 3.5 0 00-3.5-3.5"/></>,
    // ClipboardList — clipboard with text lines
    mock:        <><rect x="3.5" y="3" width="9" height="11.5" rx="1.2"/><path d="M6 3V2a2 2 0 014 0v1"/><path d="M6 7h4M6 9.5h4M6 12h2.5"/></>,
    // User — single person circle + shoulders
    profile:     <><circle cx="8" cy="6" r="3"/><path d="M2.5 14.5a5.5 5.5 0 0111 0"/></>,
    // Zap — lightning bolt
    upgrade:     <><path d="M9.5 1.5L5.5 8.5h4l-2 6 6-8h-4l2-5z"/></>,
    // Settings — gear with inner circle
    settings:    <><circle cx="8" cy="8" r="2.5"/><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.6 3.6l1.3 1.3M11.1 11.1l1.3 1.3M3.6 12.4l1.3-1.3M11.1 4.9l1.3-1.3"/></>,
  };
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
         strokeLinecap="round" strokeLinejoin="round"
         className="w-4 h-4 shrink-0" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}

function DarkToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className="relative inline-flex items-center w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none"
      style={{ background: dark ? "#007AFF" : "#E5E5EA" }}
    >
      <span
        className="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: dark ? "translateX(22px)" : "translateX(3px)" }}
      />
    </button>
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
  { to: "/pro",         label: "Pro Tracks",   icon: "upgrade"               },
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
  const { items: trackNav, refreshNav, activeTrack } = useTrackStore();
  const activeChildId = useAuthStore((s) => s.activeChild?._id);

  // Fetch nav whenever the effective actor changes — either the logged-in
  // user OR the child the parent is "viewing as". The api interceptor adds
  // x-child-id automatically, so the backend resolves to the child's
  // activeTrack on the second case.
  useEffect(() => {
    if (user?._id) refreshNav();
  }, [user?._id, activeChildId, refreshNav]);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen,    setBellOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const location = useLocation();
  const bellRef    = useRef(null);
  const userRef    = useRef(null);

  useEffect(() => {
    if (!bellOpen && !userOpen) return;
    const handler = (e) => {
      if (bellRef.current  && !bellRef.current.contains(e.target))  setBellOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen, userOpen]);

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

  const { activeChild, setActiveChild } = useAuthStore();
  const profile = activeChild || user;
  const isParent = user?.role === "parent" || user?.role === "teacher";

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  const handleSignOut = async () => {
    await logoutApi().catch(() => {});
    logout();
    useTrackStore.getState().reset();
    navigate("/login");
  };

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
        {/* App logo */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center gap-2.5">
            <StellarLogo size={28} />
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[14px] font-bold text-[var(--label)] tracking-tight leading-tight">Stellar</span>
              <span className="text-[11px] text-apple-gray leading-tight">
                {activeTrack === "pro_java"
                  ? "Java · Professional"
                  : `${profile?.examBoard || "CBSE"} · Class ${profile?.grade || "10"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Track switcher — only renders if user has 2+ enrolled tracks */}
        {!isParent && <TrackSwitcher />}

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
              {(trackNav && trackNav.length ? trackNav : NAV).map((n) => (
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

        {/* Boards countdown badge — school track only */}
        {activeTrack !== "pro_java" && (() => {
          const profile = activeChild || user;
          let targetDate = profile?.examDate ? new Date(profile.examDate) : null;
          if (!targetDate) {
            // Default: next CBSE boards (Feb 15 next year, or this year if not yet passed)
            const now = new Date();
            const year = now.getMonth() >= 1 && now.getDate() > 15 && now.getMonth() <= 2
              ? now.getFullYear() + 1
              : now.getMonth() < 1
              ? now.getFullYear()
              : now.getFullYear() + 1;
            targetDate = new Date(year, 1, 15);
          }
          const days = Math.ceil((targetDate - new Date()) / 86400000);
          if (days <= 0) return null;
          return (
            <div className="mx-3 mb-4 mt-2 rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(120deg,#d4b8f0 0%,#f0b8d0 50%,#fad4b0 100%)" }}>
              <div className="px-4 py-3.5">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(40,20,80,0.55)" }}>Boards in</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[34px] font-bold leading-none tracking-tight" style={{ color: "#1a0f3a" }}>{days}</span>
                  <span className="text-[14px] font-semibold" style={{ color: "rgba(40,20,80,0.65)" }}>days</span>
                </div>
              </div>
            </div>
          );
        })()}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto transition-colors" style={{ background: "var(--gray6)" }}>

        {/* Top bar */}
        <div
          className="sticky top-0 z-20 flex items-center gap-2 px-4 sm:px-6 py-2.5 border-b border-apple-gray5"
          style={{ background: "var(--sidebar-bg)", backdropFilter: "blur(12px)" }}
        >
          {/* Mobile hamburger */}
          <button
            className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span className="w-5 h-0.5 bg-[var(--label)] rounded-full" />
            <span className="w-5 h-0.5 bg-[var(--label)] rounded-full" />
            <span className="w-3.5 h-0.5 bg-[var(--label)] rounded-full" />
          </button>

          {/* Mobile logo / viewing-as */}
          <div className="sm:hidden flex items-center gap-1.5 flex-1">
            {activeChild ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-apple-blue/10 border border-apple-blue/20">
                <span className="text-[11px] font-semibold text-apple-blue truncate max-w-[120px]">
                  {activeChild.name} · Class {activeChild.grade}
                </span>
                <button
                  onClick={() => setActiveChild(null)}
                  className="text-apple-blue/60 hover:text-apple-blue transition-colors shrink-0"
                  aria-label="Exit child view"
                >
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-2.5 h-2.5">
                    <path d="M2 2l6 6M8 2l-6 6"/>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <StellarLogo size={22} />
                <span className="text-[13px] font-bold text-[var(--label)] tracking-tight">Stellar</span>
              </>
            )}
          </div>

          {/* Desktop left — viewing-as pill when child active, spacer otherwise */}
          <div className="hidden sm:flex flex-1 items-center">
            {activeChild && (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-apple-blue/8 border border-apple-blue/15">
                <div className="w-5 h-5 rounded-full bg-apple-blue flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-bold">
                    {activeChild.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-[12px] font-medium text-apple-blue">
                  Viewing as <strong>{activeChild.name}</strong> · Class {activeChild.grade}
                </span>
                <button
                  onClick={() => setActiveChild(null)}
                  className="text-apple-blue/50 hover:text-apple-blue transition-colors ml-0.5 shrink-0"
                  aria-label="Exit child view"
                >
                  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-2.5 h-2.5">
                    <path d="M2 2l6 6M8 2l-6 6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-1.5">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-apple text-[12px] text-apple-gray hover:bg-apple-gray5 transition-colors border border-apple-gray5"
              style={{ background: "var(--fill)" }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" className="w-3.5 h-3.5 shrink-0">
                <circle cx="6.5" cy="6.5" r="4.5"/>
                <path d="M10 10l3 3"/>
              </svg>
              <span>Search…</span>
              <kbd className="text-[10px] border border-apple-gray5 rounded px-1 py-0.5 ml-1">⌘K</kbd>
            </button>

            {/* Dark mode toggle */}
            <div className="flex items-center gap-2 px-2">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" className="w-3.5 h-3.5 text-apple-gray shrink-0">
                {dark
                  ? <><circle cx="8" cy="8" r="3.5"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.2 3.2l1 1M11.8 11.8l1 1M3.2 12.8l1-1M11.8 4.2l1-1"/></>
                  : <path d="M14 9.5A6 6 0 019.5 2a6 6 0 100 12 6 6 0 004.5-4.5z"/>
                }
              </svg>
              <DarkToggle dark={dark} onToggle={toggleDark} />
            </div>

            {/* Bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((o) => !o)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-apple-gray5 transition-colors relative"
                aria-label="Notifications"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4.5 h-4.5 text-[var(--label)]" style={{ width: 18, height: 18 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-apple-red border-2 border-white" />
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-apple shadow-lg border border-apple-gray5 z-50 overflow-hidden" style={{ background: "var(--card-bg)" }}>
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

            {/* User avatar + dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Account menu"
              >
                <span className="text-white text-[11px] font-semibold">{initials}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-apple shadow-lg border border-apple-gray5 z-50 overflow-hidden" style={{ background: "var(--card-bg)" }}>
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-apple-gray5">
                    <p className="text-[13px] font-semibold text-[var(--label)] truncate">
                      {activeChild ? activeChild.name : user?.name}
                    </p>
                    <p className="text-[11px] text-apple-gray truncate">{user?.email}</p>
                    {activeChild && (
                      <button onClick={() => { setUserOpen(false); navigate("/child-picker"); }}
                        className="text-[11px] text-apple-blue hover:opacity-70 transition-opacity mt-0.5">
                        Switch child
                      </button>
                    )}
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <button onClick={() => { setUserOpen(false); navigate("/tracks"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[var(--label)] hover:bg-apple-gray6 transition-colors">
                      <Icon id="upgrade" />
                      My tracks
                    </button>
                    <button onClick={() => { setUserOpen(false); navigate("/pricing"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[var(--label)] hover:bg-apple-gray6 transition-colors">
                      <Icon id="upgrade" />
                      Upgrade
                    </button>
                    <button onClick={() => { setUserOpen(false); navigate("/settings"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[var(--label)] hover:bg-apple-gray6 transition-colors">
                      <Icon id="settings" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-apple-gray5 py-1">
                    <div className="px-4 py-2 flex items-center gap-3">
                      <a href="/terms"   className="text-[11px] text-apple-gray hover:text-apple-blue transition-colors">Terms</a>
                      <span className="text-apple-gray5 text-[10px]">·</span>
                      <a href="/privacy" className="text-[11px] text-apple-gray hover:text-apple-blue transition-colors">Privacy</a>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-apple-red hover:bg-apple-gray6 transition-colors"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                           strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
                        <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"/>
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <OfflineBanner />
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
