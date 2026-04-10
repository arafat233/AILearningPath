/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: { 50: "#f0f4ff", 100: "#dde6ff", 500: "#4361ee", 600: "#3451d1", 700: "#2a40b8" },
        surface: { DEFAULT: "#f8f9fc", card: "#ffffff", border: "#e4e7ef" },
      },
    },
  },
  plugins: [],
};
