/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#1D1D21',
        stone: '#9E9E9E',
        diamond: '#00BFFF',
        grass: '#4CFF00',
        redstone: '#FF2E2E',
        gold: '#FFD700',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}
