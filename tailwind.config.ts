import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green":  "#39FF14",
        "neon-pink":   "#FF007F",
        "neon-amber":  "#FFD700",
        "neon-blue":   "#00F5FF",
        "hud-bg":      "#0A0A0F",
        "hud-surface": "#12121A",
        "hud-border":  "#1E1E2E",
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        mono:  ["'Share Tech Mono'", "monospace"],
      },
      boxShadow: {
        "neon-green": "0 0 10px #39FF14, 0 0 30px #39FF1440",
        "neon-pink":  "0 0 10px #FF007F, 0 0 30px #FF007F40",
        "neon-amber": "0 0 10px #FFD700, 0 0 30px #FFD70040",
        "neon-blue":  "0 0 10px #00F5FF, 0 0 30px #00F5FF40",
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        flicker:  "flicker 3s infinite",
        pulse:    "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%":      { opacity: "1" },
          "93%":      { opacity: "0.4" },
          "94%":      { opacity: "1" },
          "96%":      { opacity: "0.6" },
          "97%":      { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;