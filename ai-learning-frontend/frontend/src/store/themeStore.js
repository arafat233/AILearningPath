import { create } from "zustand";

function getInitial() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function apply(dark) {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

export const useThemeStore = create((set) => {
  const dark = getInitial();
  apply(dark);
  return {
    dark,
    toggle: () => set((s) => { apply(!s.dark); return { dark: !s.dark }; }),
  };
});
