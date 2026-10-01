/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          950: '#0b0f19',
        },
        security: {
          pass: '#10b981',
          warn: '#f59e0b',
          critical: '#f43f5e',
          info: '#3b82f6',
        }
      },
    },
  },
  plugins: [],
}
