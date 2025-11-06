/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{tsx,jsx,js}", "./components/**/*.{tsx,jsx,js}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
