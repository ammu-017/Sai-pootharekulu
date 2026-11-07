/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#02130c',
          900: '#041f14', // Primary deep emerald background
          850: '#062b1c',
          800: '#083a26',
          700: '#0e5538',
          600: '#15734d',
        },
        gold: {
          50: '#fcfbf2',
          100: '#f9f6e0',
          200: '#f4ebb8',
          300: '#ecda86',
          400: '#e2c554',
          500: '#d4af37', // Official Royal Gold
          600: '#b89028',
          700: '#946f20',
          800: '#79581f',
          900: '#674a1e',
        },
        ivory: '#fdfbf7',
        cream: {
          DEFAULT: '#f7f1e5',
          light: '#fbf8f2',
          dark: '#efe3cd',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Playfair Display', 'serif'],
        traditional: ['Cormorant Garamond', 'serif'],
        heading: ['Rozha One', 'Cinzel', 'serif'],
        sans: ['Outfit', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gold-metallic':
          'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
        'gold-subtle':
          'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(245, 215, 127, 0.35) 50%, rgba(184, 144, 40, 0.2) 100%)',
        'emerald-gradient':
          'linear-gradient(180deg, #02130c 0%, #041f14 50%, #073522 100%)',
      },
      boxShadow: {
        gold: '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'gold-lg': '0 0 40px -5px rgba(212, 175, 55, 0.5)',
        'emerald-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

