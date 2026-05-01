/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // =========================
      // DESIGN SYSTEM COLORS
      // =========================
      colors: {
        background: 'var(--background)',
        'on-background': 'var(--on-background)',

        'surface-variant': 'var(--surface-variant)',

        primary: 'var(--primary)',
        'on-primary': 'var(--on-primary)',

        'primary-container': 'var(--primary-container)',
        'on-primary-container': 'var(--on-primary-container)',

        secondary: 'var(--secondary)',
        'on-secondary': 'var(--on-secondary)',

        error: 'var(--error)',

        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
      },

      // =========================
      // FONTS
      // =========================
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],

        urdu: [
          'Noto Nastaliq Urdu',
          'Jameel Noori Nastaleeq',
          'serif',
        ],
      },

      // Optional (good for SaaS UI)
      boxShadow: {
        'tonal-lift': '0px 12px 32px rgba(31,41,55,0.06)',
      },
    },
  },

  plugins: [],
};