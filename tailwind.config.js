/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./index.html",
    "./main.tsx",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // enables dark mode with class strategy
  plugins: [], // add Tailwind plugins here if needed
};