/**
 * navService — sidebar nav config per active track.
 *
 * The sidebar shell stays the same; what changes is the list of links shown
 * in the middle. We keep that list server-side so we can A/B nav variants
 * without a frontend deploy and so the truth lives in one place.
 *
 * Resolution order in getNavForUser:
 *   1. user.activeTrack (explicit choice)
 *   2. user.tracks[0]?.key (first enrolled track)
 *   3. "school" (legacy fallback for users created before tracks[] existed)
 *
 * If a track key has no nav entry (e.g. pro_python later), we fall back to
 * the school nav so the user is never stranded on a blank sidebar.
 */

// Sentinel `crossMode: true` items are kept in school mode ONLY when the
// user is also enrolled in at least one pro_* track — they're a quick
// jump back to the other track, not an upsell. Pure-school users won't
// see them. Adult/pro discovery happens via /welcome and Settings.
export const NAV_CONFIG = {
  school: [
    { to: "/",            label: "Dashboard",     icon: "dashboard",   end: true },
    { to: "/lessons",     label: "Learn",         icon: "lessons"               },
    { to: "/practice",    label: "Practice",      icon: "practice"              },
    { to: "/bookmarks",   label: "Bookmarks",     icon: "bookmarks"             },
    { to: "/analytics",   label: "Analytics",     icon: "analytics"             },
    { to: "/certificate", label: "Certificate",   icon: "certificate"           },
    { to: "/competition", label: "Competition",   icon: "competition"           },
    { to: "/live",        label: "Live Room",     icon: "live"                  },
    { to: "/planner",     label: "Study Planner", icon: "planner"               },
    { to: "/pyq",         label: "PYQ Bank",      icon: "pyq"                   },
    { to: "/parent",      label: "Parent View",   icon: "parent"                },
    { to: "/school",      label: "School Groups", icon: "school"                },
    { to: "/mock-paper",  label: "Mock Paper",    icon: "mock"                  },
    { to: "/voice-tutor", label: "Voice Tutor",   icon: "voiceTutor"            },
    { to: "/pro",         label: "Pro Tracks",    icon: "upgrade", crossMode: true },
    { to: "/profile",     label: "Profile",       icon: "profile"               },
  ],
  pro_java: [
    { to: "/",            label: "Dashboard",     icon: "dashboard",   end: true },
    { to: "/pro",         label: "Pro Tracks",    icon: "upgrade"               },
    { to: "/practice",    label: "Practice",      icon: "practice"              },
    { to: "/bookmarks",   label: "Bookmarks",     icon: "bookmarks"             },
    { to: "/analytics",   label: "Analytics",     icon: "analytics"             },
    { to: "/certificate", label: "Certificate",   icon: "certificate"           },
    { to: "/planner",     label: "Plan",          icon: "planner"               },
    { to: "/voice-tutor", label: "Voice Tutor",   icon: "voiceTutor"            },
    { to: "/profile",     label: "Profile",       icon: "profile"               },
  ],
};

export function resolveActiveTrack(user) {
  if (!user) return "school";
  if (user.activeTrack && NAV_CONFIG[user.activeTrack]) return user.activeTrack;
  const first = user.tracks?.[0]?.key;
  if (first && NAV_CONFIG[first]) return first;
  return "school";
}

export function getNavForUser(user) {
  const activeTrack = resolveActiveTrack(user);
  const baseItems = NAV_CONFIG[activeTrack] || NAV_CONFIG.school;
  const hasProTrack = (user?.tracks || []).some((t) => t.key && t.key.startsWith("pro_"));
  // Drop crossMode items unless the user is actually enrolled across modes.
  // Strip the crossMode flag itself before returning — it's an internal hint.
  const items = baseItems
    .filter((i) => !i.crossMode || hasProTrack)
    .map(({ crossMode, ...rest }) => rest);
  return {
    activeTrack,
    tracks: (user?.tracks || []).map((t) => ({ key: t.key, role: t.role })),
    items,
  };
}

export function isValidTrackKey(key) {
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(NAV_CONFIG, key);
}
