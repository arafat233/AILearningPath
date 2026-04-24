import { create } from "zustand";
import { persist } from "zustand/middleware";

// SEC-03: Token is stored in an httpOnly cookie set by the backend.
// Only the user *profile* is persisted here — no JWT in localStorage.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setAuth: (_token, user) => set({ user }),   // token arg ignored — cookie handles it
      logout: () => set({ user: null }),
    }),
    { name: "auth-storage" }
  )
);
