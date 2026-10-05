/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#005ca8', // 99acres signature rich blue
          600: '#004a87',
          700: '#003b6d',
          800: '#002e54',
          900: '#00203d',
        },
        accent: {
          500: '#00b074', // Green highlight
          600: '#009660',
        },
        amber: {
          500: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.08), 0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 6px 16px -2px rgba(0, 0, 0, 0.06)',
        'search': '0 10px 40px -10px rgba(0, 50, 120, 0.25)',
      }
    },
  },
  plugins: [],
}
