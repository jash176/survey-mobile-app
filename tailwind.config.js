/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0b0c11",
        textSecondary: "#b2b8cd99",
        textPrimary: "#DEE1EA",
        primary: "#4652F2",
        borderPrimary: "#2b304099",
        card: '#151823'
      },
    },
  },
  plugins: [],
}