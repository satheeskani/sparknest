/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        gold: "#FFD700",
        ember: "#FF3D00",
        dark: "#0A0500",
        card: "#1A0F00",
      },
      fontFamily: {
        heading: ["'Cinzel Decorative'", "serif"],
        body: ["'Outfit'", "sans-serif"],
      },
    },
  },
  plugins: [],
}