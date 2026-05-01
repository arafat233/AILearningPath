import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCompanyStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout:   ()      => set({ token: null }),
    }),
    { name: "company-auth" }
  )
);
