import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0910",
        surface: "#17131dcc",
        "surface-border": "#392d4d99",
        card: "#17131dcc",
        border: "#392d4d99",
        muted: {
          DEFAULT: "#8E96A0",
          foreground: "#8E96A0",
        },
        brand: {
          orange: "#F97316",
          amber: "#F59E0B",
          light: "#FB923C",
          lilac: "#C4B5FD",
          purple: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        "orange-glow": "0 0 30px -5px rgba(249, 115, 22, 0.35)",
        "amber-glow": "0 0 30px -5px rgba(245, 158, 11, 0.35)",
        "elegant": "0 10px 30px -10px rgba(0, 0, 0, 0.42)",
      },
      backgroundImage: {
        "orange-gradient": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        "amber-gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
      },
    },
  },
  plugins: [],
};

export default config;