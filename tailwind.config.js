/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Brand tokens — PROJECT.md §3 (sampled from screenshots, provisional)
      colors: {
        base: '#b4b3ac', // page background (greige)
        ink: '#121115', // text / primary actions
        clay: '#856157', // accent
        sage: '#5d6964', // accent
        ochre: '#a69b85', // accent
        lavender: '#77698a', // accent
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
