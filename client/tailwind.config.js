/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vercel-dark': '#0A0F1E',
        'vercel-card': 'rgba(17, 24, 39, 0.6)', // glass backdrop
        'vercel-border': 'rgba(255, 255, 255, 0.08)',
        'electric-indigo': '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
        tight: '-.025em',
        normal: '0',
      }
    },
  },
  plugins: [],
}
