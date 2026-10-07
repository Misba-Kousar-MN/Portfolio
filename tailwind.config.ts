import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pastel palette inspired by user specification
        pastel: {
          blush: '#FFD1DC',
          sage: '#CFDBC5',
          peach: '#FFE4E1',
          lavender: '#D8BFD8',
          mint: '#E0F7FA',
        },
        'blush-sky': '#FFD1DC',
        'sage-mist': '#CFDBC5',
        'peach-sorbet': '#FFE4E1',
        'lavender-dusk': '#D8BFD8',
        'mint-frost': '#E0F7FA',
        // Semantic color tokens mapped to CSS variables
        background: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--accent-light)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.025em', fontWeight: '400' }],
        'display-xl': ['clamp(2.5rem, 5.5vw, 4.25rem)', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-lg': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.18', letterSpacing: '-0.015em', fontWeight: '400' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '500' }],
        'display-sm': ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '500' }],
        'heading-xl': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '500' }],
        'heading-lg': ['clamp(1.35rem, 2.5vw, 1.85rem)', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '500' }],
        'heading-md': ['1.15rem', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
        'heading-sm': ['1rem', { lineHeight: '1.45', letterSpacing: '0', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-xs': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.04em' }],
      },
      spacing: {
        'section-sm': 'clamp(4rem, 8vw, 6rem)',
        'section': 'clamp(6rem, 12vw, 10rem)',
        'section-lg': 'clamp(7.5rem, 15vw, 12rem)',
      },
      borderRadius: {
        'radius-sm': '0.375rem',
        'radius-md': '0.5rem',
        'radius-lg': '0.75rem',
        'radius-xl': '1rem',
        'radius-2xl': '1.5rem',
        'radius-3xl': '2rem',
        'radius-full': '9999px',
      },
      boxShadow: {
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 30px -8px rgba(0, 0, 0, 0.08), 0 8px 12px -4px rgba(0, 0, 0, 0.04)',
        'glow-accent': '0 0 30px -8px var(--accent)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        editorial: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};

export default config;