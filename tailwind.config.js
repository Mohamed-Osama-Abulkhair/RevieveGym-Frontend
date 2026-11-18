/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        gym: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#eaddd7",
          300: "#e05326", // Energetic Gym Orange / Red Accent
          400: "#c73e16",
          500: "#ad2e0c",
          600: "#1e293b",
          700: "#0f172a",
          800: "#0b0f19",
          900: "#05070c",
        },
        brandSilver: "#BDBEC1",
        brandSlate: "#1e293b",
        brandCanvas: {
          light: "#f8fafc",
          dark: "#0b0f19",
        },
        brandSurface: {
          light: "#ffffff",
          dark: "#131926",
          cardDark: "#182032",
        },
      },
      fontFamily: {
        cairo: [
          "Cairo",
          "'Noto Sans Arabic'",
          "'Segoe UI Arabic'",
          "'Segoe UI'",
          "Tahoma",
          "sans-serif",
        ],
        almarai: [
          "Almarai",
          "Cairo",
          "'Noto Sans Arabic'",
          "'Segoe UI Arabic'",
          "'Segoe UI'",
          "Tahoma",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
