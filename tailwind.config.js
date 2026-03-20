/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#222222",
        muted: "#888888",
        subtle: "#999999",
        faint: "#aaaaaa",
        line: "#eeeeee",
        surface: "#ffffff",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
