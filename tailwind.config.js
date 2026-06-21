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
          DEFAULT: '#1D9E75',
          light: '#28be8e',
          dark: '#157556',
          50: '#f0fbf7',
          100: '#daf6eb',
          500: '#1D9E75',
          600: '#17815f',
          700: '#146e51'
        },
        accent: '#1D9E75',
        bgApp: '#F7F9F8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        nav: '0 -2px 10px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
