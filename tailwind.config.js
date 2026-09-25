/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Primary accent (kept for buttons, links)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // AuthKit-inspired deep navy for dark mode surfaces
        ink: {
          950: '#05060f',
          900: '#0a0c1b',
          800: '#0f1221',
          700: '#14182b',
        },
        // AuthKit-inspired cool blue tints used in gradients / accents
        glow: {
          100: '#d8ecf8',
          200: '#bad6f7',
          300: '#98c0ef',
          400: '#7fa9d9',
        },
      },
      backgroundImage: {
        // Gradient used on section titles & badges (white → soft blue)
        'gradient-glow': 'linear-gradient(180deg, #d8ecf8 0%, #98c0ef 100%)',
      },
      fontSize: {
        display: [
          'clamp(2rem, 4.5vw, 3.25rem)',
          { lineHeight: '1.08', letterSpacing: '-0.035em', fontWeight: '600' },
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
