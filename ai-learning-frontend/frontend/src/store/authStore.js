import { create } from "zustand";
import { persist } from "zustand/middleware";

// SEC-03: Token is stored in an httpOnly cookie set by the backend.
// Only the user *profile* is persisted here — no JWT in localStorage.
export const useAuthStore = create(
  persist(
    (set) => ({
      user:        null,
      activeChild: null,   // { _id, name, grade, examBoard, schoolName, location }
      setAuth:        (_token, user) => set({ user }),
      setActiveChild: (child)        => set({ activeChild: child }),
      logout: () => set({ user: null, activeChild: null }),
    }),
    { name: "auth-storage" }
  )
);
