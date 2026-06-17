/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables class-based dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional medical-tech color palette
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7', // Primary Brand Color (e.g., Clinical Blue)
          600: '#0369a1',
          700: '#075985',
        }
      }
    },
  },
  plugins: [],
}