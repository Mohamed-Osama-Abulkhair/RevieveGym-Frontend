/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Gold & Metallic Identity extracted directly from ReViVe GYM official logo
        gold: {
          50: "#fbf8eb",
          100: "#f5eccd",
          200: "#edd99b",
          300: "#e3c263",
          400: "#d9ab36",
          500: "#c8941f", // Official Core Metallic Gold
          600: "#ad7617",
          700: "#8a5615",
          800: "#734518",
          900: "#623a1a",
          950: "#391e0a",
        },
        gym: {
          accent: "#D4AF37", // Luxury Metallic Gold
          accentHover: "#E5C048",
          darkBg: "#0B0D13", // Pitch Carbon Gym Black
          darkCard: "#131722",
          darkCardHover: "#1A2030",
          darkBorder: "#242B3D",
        },
        brandCanvas: {
          light: "#F8FAFC",
          dark: "#0B0D13",
        },
        brandSurface: {
          light: "#FFFFFF",
          dark: "#131722",
          cardDark: "#181E2C",
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
