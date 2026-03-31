/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        primary: '#3b82f6',
        success: '#22c55e',
        warning: '#f59e0b',
        text: '#fafafa',
        'text-secondary': '#a1a1a1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'panel': '12px',
        'btn': '8px',
        'input': '8px',
      },
      spacing: {
        'panel': '16px',
        'component': '12px',
      }
    },
  },
  plugins: [],
}
