/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      gridTemplateColumns: {
        19: "repeat(19, minmax(0, 1fr))",
      },
    },
  },
  plugins: [require("prettier-plugin-tailwindcss")],
};
