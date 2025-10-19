/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cosmicBlack: '#0B0014',
        deepPlum: '#1A0B2E',
        galaxyGold: '#E5C07B',
        starlight: '#F8E3C2',
        midnight: '#100720',
        lilithPurple: '#2E184B',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
