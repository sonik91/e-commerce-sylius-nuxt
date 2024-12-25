/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.vue', // Cible uniquement les fichiers dans /pages
    './components/**/*.vue', // Cible uniquement les fichiers dans /components
    './layouts/**/*.vue', // Cible uniquement les fichiers dans /layouts
    './app.vue', // Cible spécifiquement le fichier app.vue (si utilisé)
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#e9f3ff',
          200: '#c8e0ff',
          300: '#a6ccff',
          400: '#6ea1ff',
          500: '#3375ff',
          600: '#2e6ae6',
          700: '#264ebf',
          800: '#1d3f99',
          900: '#132f72',
        },
      },
      animation:{
        'shake': 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'blur': 'blur 0.5s linear both',
      },
      keyframes: {
          'shake' : {
              '10%, 90%': {
                  transform: 'translate3d(-1px, 0, 0)'
              },
              '20%, 80%' : {
                  transform: 'translate3d(2px, 0, 0)'
              },
              '30%, 50%, 70%': {
                  transform: 'translate3d(-4px, 0, 0)'
              },
              '40%, 60%': {
                  transform: 'translate3d(4px, 0, 0)'
              }
          },
          'blur': {
            '0%': { filter: "blur(10px)", opacity: "0" },
            '100%': { filter: "blur(0px)", opacity: "1"  },
          }
      }
    },
  },
  safelist: [
    'w-1/2',
    'w-1/3',
    'w-1/4',
    'w-1/5',
    'w-1/6',
  ],
  plugins: [],
};