/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fff7ea",
        moss: "#17301f",
        coral: {
          DEFAULT: "#ff7a59",
          deep: "#eb5a36",
        },
        sky: "#91d7ff",
        lime: "#d5f06b",
      },
      fontFamily: {
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
      boxShadow: {
        soft: "0 16px 36px rgba(112, 72, 32, 0.1)",
        warm: "0 24px 70px rgba(112, 72, 32, 0.16)",
      },
    },
  },
  plugins: [],
  darkMode: 'media',
};
