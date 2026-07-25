import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        marigold: {
          50: "#FFF4E8",
          100: "#FFE4C7",
          400: "#FF9640",
          500: "#FF7A1A",
          600: "#E5620A",
          700: "#B84D06",
        },
        indigo: {
          50: "#EEF0FD",
          400: "#5B57D6",
          500: "#3730A9",
          600: "#2C2585",
          900: "#181454",
        },
        ink: {
          50: "#F7F7F5",
          100: "#EEEEEB",
          800: "#1C1D22",
          900: "#0B0F1A",
          950: "#070A12",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(11, 15, 26, 0.08)",
        glow: "0 0 0 1px rgba(255,122,26,0.15), 0 8px 24px rgba(255,122,26,0.18)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(11,15,26,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,15,26,0.04) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        ticker: "ticker 14s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
