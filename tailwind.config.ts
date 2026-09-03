import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FCF8F9",
        blush: "#F6E8EA",
        "rose-soft": "#D8B4BE",
        burgundy: {
          DEFAULT: "#1A0A0F",
          dark: "#2A1117",
          hover: "#381920",
        },
        "text-dark": "#24171A",
        muted: "#806D73",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        'editorial': '14px',
      }
    },
  },
  plugins: [],
} satisfies Config;
