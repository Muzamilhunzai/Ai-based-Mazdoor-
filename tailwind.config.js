/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006e24',
        secondary: '#f87600',
        background: '#f7f9fb',
        text: '#191c1e',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        urdu: ['var(--font-urdu)', 'serif'],
      },
      boxShadow: {
        'tonal-lift': '0px 12px 32px rgba(31,41,55,0.06)',
      },
    },
  },
  plugins: [],
};