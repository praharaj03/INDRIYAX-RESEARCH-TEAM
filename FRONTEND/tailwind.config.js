/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Ensures dark mode is controlled by your ThemeContext
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        indriya: {
          // Light Mode
          bg: '#F8F8F6',
          secondary: '#F3F3F1',
          card: '#FFFFFF',
          text: '#111111',
          muted: '#666666',
          border: 'rgba(0,0,0,0.06)',
          
          // Dark Mode (Cinematic True Black)
          darkBg: '#0A0A0A',
          darkSecondary: '#141414',
          darkCard: '#111111',
          darkText: '#F3F3F1',
          darkMuted: '#A3A3A3',
          darkBorder: 'rgba(255,255,255,0.08)',

          // Accents
          accent: '#0D6EFD',
          accentLight: '#4CA6FF',
          success: '#4CAF50',
          warning: '#FFB020',
          danger: '#E53935',
        }
      },
      boxShadow: {
        'premium': '0 4px 40px rgba(0, 0, 0, 0.04)',
        'premium-dark': '0 4px 40px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}