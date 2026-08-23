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
        // Deep forest & refined emerald brand palette
        brand: {
          50:  '#f2f8f4',
          100: '#e1efe6',
          200: '#c5dfce',
          300: '#9ec7ad',
          400: '#6fa784',
          500: '#46875f',
          600: '#2f6c47',
          700: '#245538',  // Primary brand deep green
          800: '#1d442d',  // Forest
          900: '#173725',
          950: '#0c1f14',
        },
        // Sage accent
        sage: {
          50:  '#f6f7f4',
          100: '#eaede5',
          200: '#d7ded0',
          300: '#becbb5',
          400: '#9fb393',
          500: '#7f9872',
          600: '#637a57',
          700: '#4d5f43',
          800: '#3e4d37',
          900: '#34402f',
        },
        // Purposeful status accents
        accent: {
          amber:   '#b45309',
          amberBg: '#fef3c7',
          rose:    '#be123c',
          roseBg:  '#ffe4e6',
          sky:     '#0369a1',
          skyBg:   '#e0f2fe',
        },
        // Warm neutral stone grays
        stone: {
          50:  '#fafaf9',  // Base warm canvas
          100: '#f5f5f4',  // Light surface / hover
          200: '#e7e5e4',  // Subtle 1px border
          300: '#d6d3d1',  // Stronger border
          400: '#a8a29e',  // Muted icons / placeholders
          500: '#78716c',  // Secondary labels
          600: '#57534e',  // Medium body text
          700: '#44403c',  // Body text
          800: '#292524',  // High contrast text
          900: '#1c1917',  // Primary heading
          950: '#0c0a09',
        }
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.9375rem' }],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card':   '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card-md':'0 4px 12px -2px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.02)',
        'menu':   '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'sm': '0.25rem',  // 4px
        'md': '0.375rem', // 6px
        'lg': '0.5rem',   // 8px (default button/input)
        'xl': '0.75rem',  // 12px (default surface)
        '2xl':'1rem',     // 16px (modal/large container)
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter:  '-0.02em',
        tight:    '-0.01em',
        wide:     '0.025em',
        wider:    '0.05em',
      },
    },
  },
  plugins: [],
};
export default config;
