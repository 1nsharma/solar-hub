/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        secondary: '#4CAF50',
        'bg-dark': '#0A0A0A',
        'text-dim': '#A0A0A0',
      }
    },
  },
  plugins: [],
}
