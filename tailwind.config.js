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
        background: {
          dark: '#080E1A',
          light: '#F4F6FA',
        },
        surface: {
          dark: '#0F1B2E',
          light: '#FFFFFF',
        },
        pulse: {
          saffron: '#FF8A3D',
          emerald: '#22C55E',
          amber: '#F5A623',
          crimson: '#EF4444',
          navy: '#0B1220',
          cyan: '#06B6D4',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'super': '28px',
        'super-lg': '32px',
        'super-xl': '40px',
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-glow-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
        'saffron-glow': '0 0 25px rgba(255, 138, 61, 0.35)',
        'emerald-glow': '0 0 25px rgba(34, 197, 94, 0.35)',
        'crimson-glow': '0 0 25px rgba(239, 68, 68, 0.35)',
        'brutalist-black': '4px 4px 0px #0A0A0A',
        'brutalist-saffron': '4px 4px 0px #FF8A3D',
        'brutalist-crimson': '4px 4px 0px #EF4444',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'heavy': '36px',
      },
      animation: {
        'blob-spin': 'blobSpin 25s infinite linear',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        blobSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
