/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        kuriftu: {
          50: '#fef9f0',
          100: '#fef2e0',
          200: '#fde0b8',
          300: '#fcd38d',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400e',
          800: '#6b3a10',
          900: '#2c1810',
        },
        sand: {
          50: '#faf8f5',
          100: '#f0ebe4',
          200: '#e7e0d8',
          300: '#d4c8b8',
          400: '#b5a898',
          500: '#8c7e6f',
          600: '#6b5c4d',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
