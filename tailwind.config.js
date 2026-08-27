/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         'brand-dark': '#112E81',
        'brand-primary': '#4647AE',
        'brand-accent': '#4382DF',
        'brand-light': '#AACCD6',
      }
    },
  },
  plugins: [],
}