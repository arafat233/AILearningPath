import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNav, setActiveTrackApi } from "../services/api";

/**
 * trackStore — single source of truth for which track the user is in.
 *
 * On mount, Layout calls `refreshNav()` once. After that, the TrackSwitcher
 * mutates the active track and the sidebar re-renders from this store.
 *
 * `items` is persisted to localStorage so the sidebar paints instantly on
 * reload before /user/nav finishes — same trick as themeStore.
 */
export const useTrackStore = create(
  persist(
    (set, get) => ({
      activeTrack: null,                // "school" | "pro_java" | ...
      tracks:      [],                  // [{ key, role }, ...]
      items:       [],                  // sidebar nav list for activeTrack
      loaded:      false,

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
          // Fall back to cached values silently; an offline reload should
          // still render the sidebar from persist.
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
    { name: "track-storage" }
  )
);
