/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
        accent:  { DEFAULT: '#f59e0b', light: '#fcd34d', dark: '#d97706' },
        sold:    '#16a34a',
        unsold:  '#dc2626',
      },
      animation: {
        'bid-flash': 'bidFlash 0.6s ease-in-out',
        'sold-pop':  'soldPop 0.5s ease-out',
        'pulse-slow':'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.25s ease-out',
      },
      keyframes: {
        bidFlash: {
          '0%,100%': { backgroundColor: 'transparent' },
          '50%':     { backgroundColor: '#fef08a' },
        },
        soldPop: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '60%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      }
    }
  },
  plugins: []
}
