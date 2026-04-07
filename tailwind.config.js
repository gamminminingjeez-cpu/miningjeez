/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0a0f',
          panel: 'rgba(20, 20, 30, 0.8)',
          border: 'rgba(0, 255, 255, 0.2)',
          cyan: '#00ffff',
          purple: '#a855f7',
          green: '#22c55e',
          red: '#ef4444',
          yellow: '#eab308',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
    },
  },
  plugins: [],
}
