// tailwind.config.js
const {heroui} = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Custom font families for unified typography
        'title': ['"Cherry Cream Soda"', 'cursive'],
        'body': ['"Crimson Text"', 'serif'],
        'heading': ['"IM Fell French Canon SC"', 'serif'],
        'button': ['"Coustard"', 'serif'],
        'label': ['"Montserrat Alternates"', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};