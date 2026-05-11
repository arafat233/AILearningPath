import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.jsx";

// ── Theme bootstrap — applies persisted dark mode before first paint ──
(function applyTheme() {
  try {
    const saved = localStorage.getItem("stellar_theme"); // "light" | "dark" | "system"
    const isDark = saved === "dark" ||
      (saved === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch {}
})();

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
