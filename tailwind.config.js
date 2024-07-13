/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'genjyuugothic': ['GenJyuuGothic', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#FFB800',
      }
    },
  },
  plugins: [],
}

