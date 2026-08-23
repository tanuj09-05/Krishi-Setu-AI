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
        brand: {
          50: '#f2f9f1',
          100: '#e1f2e0',
          200: '#c4e4c2',
          300: '#97cf94',
          400: '#64b360',
          500: '#3e953a', // Primary Agro Green
          600: '#2f792b',
          700: '#266023',
          800: '#224d20',
          900: '#1d401c',
          950: '#0b230b',
        },
        earth: {
          50: '#faf8f5',
          100: '#f3ede4',
          200: '#e5d7c3',
          300: '#d4bc9d',
          400: '#c29d74',
          500: '#a87f54', // Earthy Accent
          600: '#8c6442',
          700: '#6f4c34',
          800: '#5a3d2c',
          900: '#4a3326',
        },
        accent: {
          gold: '#f59e0b',
          amber: '#d97706',
          sky: '#0284c7',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'highlight': '0 0 0 2px #3e953a, 0 8px 20px -4px rgba(62, 149, 58, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
