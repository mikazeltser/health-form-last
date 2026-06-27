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
        navy: {
          900: "#0f1f45",
          800: "#162d58",
          700: "#1e3a6e",
        },
        gold: {
          500: "#e8b420",
          400: "#f4c542",
          600: "#c99a10",
        },
      },
      fontFamily: {
        sans: ["Heebo", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
