/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A202C',    // Deep Navy
        accent: '#38B2AC',     // Vibrant Teal
        neutral: '#EDF2F7',    // Soft Gray
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'greatvibes': ['"Great Vibes"', 'cursive'],
        'dancing': ['"Dancing Script"', 'cursive'],
        'cinzel': ['"Cinzel"', 'serif']
      },
    },
  },
  plugins: [],
} 