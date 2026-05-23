/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        indigo: {
          650: '#4f46e5',
        },
        emerald: {
          650: '#059669',
          850: '#065f46',
        },
        slate: {
          450: '#94a3b8',
          550: '#64748b',
          650: '#475569',
        }
      }
    },
  },
  plugins: [],
}
