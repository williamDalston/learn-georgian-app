/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette - Soft and Deep Blues (Trust & Calm)
        primary: {
          50: '#e8f0f2',
          100: '#d1e1e5',
          200: '#b8c7cb',
          300: '#9fadb1',
          400: '#869397',
          500: '#6d7980',
          600: '#545f65',
          700: '#3b454a',
          800: '#222b2f',
          900: '#082434',
          DEFAULT: '#082434',
        },
        // Secondary Palette - Sage and Deep Greens (Growth & Balance)
        secondary: {
          50: '#eef0ee',
          100: '#dddcdd',
          200: '#ccc9cc',
          300: '#bbb6bb',
          400: '#aaa3aa',
          500: '#999099',
          600: '#887d88',
          700: '#776a77',
          800: '#665766',
          900: '#254B5A',
          DEFAULT: '#254B5A',
        },
        // Neutral Palette - Warm Whites, Beiges, Soft Grays (Clarity & Grounding)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eef0f0',
          300: '#e5e5e5',
          400: '#d4d4d4',
          500: '#a3a3a3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
          DEFAULT: '#eef0f0',
        },
        // Accent - Warm Orange/Coral for CTAs (Energy & Action)
        accent: {
          50: '#fff4ed',
          100: '#ffe8d6',
          200: '#ffd1ad',
          300: '#ffb584',
          400: '#ff995b',
          500: '#ff7d32',
          600: '#ff6109',
          700: '#e64900',
          800: '#b33800',
          900: '#802700',
          DEFAULT: '#ff7d32',
          dark: '#ff6109',
        },
      },
      fontFamily: {
        // Serif for headlines (Authority & Trust)
        serif: ['Playfair Display', 'Lora', 'Georgia', 'serif'],
        // Sans-serif for body (Readability)
        sans: ['Inter', 'Karla', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

