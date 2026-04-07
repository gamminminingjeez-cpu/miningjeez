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
          bg: '#0a0a14',
          panel: 'rgba(255, 255, 255, 0.03)',
          panelHover: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#22d3ee',
          purple: '#a855f7',
          green: '#4ade80',
          red: '#f87171',
          yellow: '#fbbf24',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
        'glow-green': '0 0 15px rgba(74, 222, 128, 0.4)',
        'glow-red': '0 0 15px rgba(248, 113, 113, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(34, 211, 238, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 211, 238, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
