/**
 * TrackTabs — the multi-track switcher at the top of Dashboard.
 *
 * PRO_TRACK_PLAN.md decision #9 (locked): single Dashboard with a
 * <TrackTabs /> switcher, URL synced via ?track=<key>.
 *
 * Reads `user.tracks[]` from the auth store. If the user has fewer than
 * two tracks the tabs render as a no-op (returns null) so existing
 * single-track users see no UI change.
 *
 * Behaviour:
 *   - Clicking a tab updates `?track=<key>` in the URL (no full reload).
 *   - Dashboard.jsx reads that param to decide which content tree to render.
 *   - "School" is always shown first so the legacy default is preserved.
 *   - Active-child viewing suppresses the tabs entirely — pro/competitive
 *     tracks are for the parent themselves (PRO_TRACK_PLAN.md decision #8).
 */
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTrackStore } from "../store/trackStore";

const TRACK_LABEL = {
  school:    { label: "School",       hint: "K-12 board curriculum" },
  pro_java:  { label: "Pro · Java",   hint: "Java track" },
};

function labelFor(key) {
  if (TRACK_LABEL[key]) return TRACK_LABEL[key];
  if (key?.startsWith("pro_")) {
    const lang = key.slice(4);
    return { label: `Pro · ${lang.charAt(0).toUpperCase() + lang.slice(1)}`, hint: `${lang} track` };
  }
  return { label: key, hint: "" };
}

export default function TrackTabs() {
  const { user, activeChild } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTrack = useTrackStore((s) => s.activeTrack);

  // Tabs are a parent-only concept. Hide while viewing-as-child.
  if (activeChild) return null;

  const tracks = (user?.tracks || []).map((t) => t.key);
  // School is implicit for every account that ever onboarded with a board+grade.
  // Make sure it appears as a tab even if it isn't literally in tracks[]
  // (legacy users created before the migration).
  if (!tracks.includes("school") && (user?.examBoard || user?.grade)) tracks.unshift("school");

  if (tracks.length < 2) return null; // only one track → no tabs

  // Prefer the store's activeTrack (persisted), fall back to URL param for
  // bookmarked /shared URLs, then fall back to "school".
  const active = activeTrack || searchParams.get("track") || "school";

  const onPick = (key) => {
    // Sync the URL param for bookmarkability, then let Dashboard read from the store.
    const next = new URLSearchParams(searchParams);
    next.set("track", key);
    setSearchParams(next, { replace: true });
    // Also call setActiveTrack so the store is updated for non-Dashboard pages.
    useTrackStore.getState().setActiveTrack(key);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 py-1">
      {tracks.map((key) => {
        const meta = labelFor(key);
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onPick(key)}
            className={[
              "px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all border",
              isActive
                ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
            ].join(" ")}
            title={meta.hint}
          >
            {meta.label}
          </button>
        );
      })}
      {/* Add-another-track entry — sends user back to /welcome to choose. */}
      <button
        onClick={() => navigate("/welcome")}
        className="px-3 py-2 rounded-full text-[13px] font-medium border border-dashed border-[var(--separator)] text-apple-gray hover:text-apple-blue hover:border-apple-blue transition-all"
      >
        + Add
      </button>
    </div>
  );
}
