import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette — deep forest/emerald green
        brand: {
          50:  '#f0fdf0',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',  // primary action green
          700: '#15803d',
          800: '#166534',  // deep forest
          900: '#14532d',
          950: '#052e16',
        },
        // Warm earth accent for secondary highlights
        earth: {
          50:  '#faf8f5',
          100: '#f3ede4',
          200: '#e5d7c3',
          300: '#d4bc9d',
          400: '#c29d74',
          500: '#a87f54',
          600: '#8c6442',
          700: '#6f4c34',
          800: '#5a3d2c',
          900: '#4a3326',
        },
        // Accent palette
        accent: {
          gold:    '#f59e0b',
          amber:   '#d97706',
          sky:     '#0284c7',
          emerald: '#10b981',
          rose:    '#f43f5e',
          teal:    '#0d9488',
        },
        // Warm neutral grays for backgrounds/surfaces
        stone: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'soft':      '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card':      '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md':   '0 4px 12px -2px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
        'highlight': '0 0 0 2px #16a34a, 0 4px 16px -4px rgba(22,163,74,0.3)',
        'inner-sm':  'inset 0 1px 2px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.02em',
        tight:    '-0.01em',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      }
    },
  },
  plugins: [],
};
export default config;

