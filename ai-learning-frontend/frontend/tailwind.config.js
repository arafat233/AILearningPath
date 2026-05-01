/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'SF Pro Display'", "'SF Pro Text'", "'Helvetica Neue'", "Arial", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "Menlo", "Monaco", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#1D1D1F",
          2: "#3C3C43",
          3: "#6E6E73",
        },
        paper: {
          DEFAULT: "#FBFBFD",
          2: "#F5F5F7",
          3: "#EEEEF2",
        },
        apple: {
          blue:    "#007AFF",
          indigo:  "#5856D6",
          purple:  "#AF52DE",
          pink:    "#FF2D55",
          red:     "#FF3B30",
          orange:  "#FF9500",
          yellow:  "#FFCC00",
          green:   "#34C759",
          teal:    "#5AC8FA",
          gray:    "#8E8E93",
          gray2:   "#AEAEB2",
          gray3:   "#C7C7CC",
          gray4:   "#D1D1D6",
          gray5:   "#E5E5EA",
          gray6:   "#F2F2F7",
        },
      },
      borderRadius: {
        apple:       "12px",
        "apple-lg":  "16px",
        "apple-xl":  "20px",
        "apple-2xl": "28px",
      },
      boxShadow: {
        apple:      "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)",
        "apple-md": "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)",
        "apple-lg": "0 12px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
        "apple-xl": "0 24px 80px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06)",
      },
      backdropBlur: {
        apple: "20px",
      },
    },
  },
  plugins: [],
};
