import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNav, setActiveTrackApi } from "../services/api";

/**
 * trackStore — single source of truth for which track the user is in.
 *
 * On mount, Layout calls `refreshNav()` once. After that, the TrackSwitcher
 * mutates the active track and the sidebar re-renders from this store.
 *
 * `activeTrack` + `tracks` are persisted to localStorage so the correct
 * track loads instantly on page reload — even before the async /user/nav
 * call completes. Zustand's persist rehydrates asynchronously, so callers
 * MUST use `hydrated` (not null-check) to know when persisted data is ready.
 */
/**
 * resolveTrack — the single precedence rule for "which track is the UI in".
 *
 * An explicit ?track= beats the persisted value: it is a deliberate, more
 * recent instruction than a stored preference. The old order (stored first)
 * meant ?track= silently did nothing for anyone who already had a track
 * saved — the param was only ever reachable by a brand-new user, so
 * /?track=school could never move a pro user back to the school surface.
 *
 * Pass `storeTrack` as null while the store is still rehydrating, so the
 * param carries the first paint and no wrong surface flashes.
 */
export const resolveTrack = (paramTrack, storeTrack, fallback = "school") =>
  paramTrack || storeTrack || fallback;

export const useTrackStore = create(
  persist(
    (set, get) => ({
      activeTrack: null,   // persisted — rehydrated from localStorage
      tracks:      [],     // persisted — rehydrated from localStorage
      items:       [],     // NOT persisted — always fetched fresh
      loaded:      false, // NOT persisted — always re-fetched on load
      hydrated:    false, // goes true after Zustand rehydrates from localStorage

      refreshNav: async () => {
        try {
          const { data } = await getNav();
          const nav = data?.data || data;
          set({
            activeTrack: nav.activeTrack,
            tracks:      nav.tracks || [],
            items:       nav.items  || [],
            loaded:      true,
          });
        } catch {
          set({ loaded: true });
        }
      },

      setActiveTrack: async (key) => {
        if (!key || key === get().activeTrack) return;
        const { data } = await setActiveTrackApi(key);
        const nav = data?.data || data;
        set({
          activeTrack: nav.activeTrack,
          tracks:      nav.tracks || [],
          items:       nav.items  || [],
        });
      },

      reset: () => set({ activeTrack: null, tracks: [], items: [], loaded: false }),
    }),
    {
      name: "track-storage",
      onRehydrateStorage: () => (state) => {
        // Called after Zustand reads from localStorage and merges into state.
        // At this point persisted values are safe to read.
        if (state) state.hydrated = true;
      },
      // Persist the track identity so the correct track loads instantly.
      // items + loaded are NOT persisted — always fetched fresh.
      partialize: (s) => ({ activeTrack: s.activeTrack, tracks: s.tracks }),
    }
  )
);
