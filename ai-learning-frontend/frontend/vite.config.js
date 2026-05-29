import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Pre-transform hot paths so first navigation doesn't trigger a cold compile
    warmup: {
      clientFiles: [
        "./src/pages/DashboardSwitch.jsx",
        "./src/pages/Analytics.jsx",
        "./src/pages/Profile.jsx",
        "./src/pages/PracticeSwitch.jsx",
        "./src/pages/professional/ProTopicView.jsx",
        "./src/components/dsa/VisualizerShell.jsx",
        "./src/components/dsa/modes/LinkedListSandbox.jsx",
        "./src/components/dsa/modes/TreeSandbox.jsx",
        "./src/components/dsa/modes/SortingSandbox.jsx",
        "./src/components/Layout.jsx",
      ],
    },
  },
  // Pre-bundle heavy deps at server start so they're ready before any page loads.
  // Without this Vite discovers them lazily and triggers a full-page reload.
  optimizeDeps: {
    include: [
      "framer-motion",
      "@monaco-editor/react",
      "recharts",
      "react-syntax-highlighter",
      "react-syntax-highlighter/dist/esm/styles/prism",
      "zustand",
      "axios",
    ],
  },
  test: {
    globals:     true,
    environment: "jsdom",
    setupFiles:  ["./src/__tests__/setup.js"],
    coverage: {
      provider:   "v8",
      reporter:   ["text", "html"],
      include:    ["src/**/*.{js,jsx}"],
      exclude:    ["src/__tests__/**", "src/main.jsx"],
    },
  },
});
