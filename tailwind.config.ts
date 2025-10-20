import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed' // violet-600 vibe for neon accents
      },
      boxShadow: {
        glow: '0 0 20px rgba(124, 58, 237, 0.35)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      }
    }
  },
  plugins: []
};

export default config;