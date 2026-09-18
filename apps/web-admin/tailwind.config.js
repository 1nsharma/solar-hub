/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700',
          hover: '#FFE033',
          dark: '#E6C200',
          glow: 'rgba(255, 215, 0, 0.25)',
        },
        solar: {
          gold: '#FFB800',
          amber: '#F59E0B',
          warm: '#FFF8E7',
          emerald: '#10B981',
          green: '#22C55E',
          cyan: '#06B6D4',
        },
        obsidian: {
          950: '#030504',
          900: '#060907',
          850: '#0A0F0D',
          800: '#111815',
          700: '#1A2420',
          600: '#23302B',
        },
        'bg-dark': '#060907',
        'text-dim': '#94A3B8',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.25)',
        'glow-gold-lg': '0 0 60px rgba(255, 215, 0, 0.35)',
        'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.25)',
        'glow-emerald-lg': '0 0 50px rgba(16, 185, 129, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      }
    },
  },
  plugins: [],
}
