import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0f5f0",
          100: "#d8e8d8",
          200: "#a8c9a8",
          300: "#6fa36f",
          400: "#3d7a3d",
          500: "#2d5e2d",
          600: "#1f4a1f",
          700: "#1a3a1a",
          800: "#142e14",
          900: "#0e220e",
        },
        gold: {
          50: "#fdf8ed",
          100: "#f8ecd0",
          200: "#f0d49a",
          300: "#e5b85a",
          400: "#d4a020",
          500: "#C8860A",
          600: "#a86e08",
          700: "#875608",
          800: "#6b440a",
          900: "#5a390c",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FAF6ED",
          200: "#F5F0E1",
          300: "#EDE5D0",
          400: "#E0D5B8",
          500: "#CFC2A0",
        },
        soil: {
          100: "#E8DCC8",
          200: "#D4C4A0",
          300: "#B59F76",
          400: "#8B7D5E",
          500: "#6B5D42",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "soil-texture":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a3a1a' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
    keyframes: {
      marquee: {
        '0%': { transform: 'translateX(0%)' },
        '100%': { transform: 'translateX(-50%)' },
      }
    },
    animation: {
      marquee: 'marquee 30s linear infinite',
    },
  },
  plugins: [],
};
export default config;
