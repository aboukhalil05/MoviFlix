/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mv: {
          red: {
            50:  '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3',
            400: '#fb7185', 500: '#e11d48', 600: '#be123c',
            700: '#9f1239', 800: '#881337', 900: '#4c0519',
          },
          blue: {
            50:  '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
            400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb',
            700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
          },
          dark: {
            50:  '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
            300: '#94a3b8', 400: '#64748b', 500: '#475569',
            600: '#334155', 700: '#1e293b', 800: '#0f172a', 900: '#020617',
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
