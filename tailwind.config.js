// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        // Cosmic color palette
        space: {
          50: '#f0f2ff',
          100: '#e0e6ff',
          200: '#c7d1ff',
          300: '#a5b4ff',
          400: '#818dff',
          500: '#5d66ff',
          600: '#3d3df7',
          700: '#2d2dd9',
          800: '#2525ae',
          900: '#232389',
          950: '#0a0a4d',
        },
        neon: {
          50: '#f0fffd',
          100: '#e0fffa',
          200: '#b8fff5',
          300: '#79ffee',
          400: '#31f7e2',
          500: '#00f9d0',
          600: '#00d4b0',
          700: '#00a98e',
          800: '#008573',
          900: '#006c5e',
          950: '#003d36',
        },
        galaxy: {
          50: '#f5f5ff',
          100: '#ededff',
          200: '#dad9ff',
          300: '#beb9ff',
          400: '#9f8eff',
          500: '#825cff',
          600: '#7635ff',
          700: '#6723f2',
          800: '#561bce',
          900: '#4818a8',
          950: '#290b75',
        },
        cyber: {
          pink: '#ff2d75',
          blue: '#00f0ff',
          purple: '#9600ff'
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
      boxShadow: {
        'glow-sm': '0 0 4px 0 rgba(0, 249, 208, 0.3)',
        'glow-md': '0 0 8px 0 rgba(0, 249, 208, 0.4)',
        'glow-lg': '0 0 16px 0 rgba(0, 249, 208, 0.5)',
        'inner-glow': 'inset 0 0 8px 0 rgba(0, 249, 208, 0.3)',
        'cyber': '0 0 15px 0 rgba(150, 0, 255, 0.7)'
      },
      animation: {
        'pulse-slow': 'pulse 6s infinite',
        'float': 'float 6s ease-in-out infinite',
        'neon-flicker': 'flicker 4s infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            opacity: '1',
            textShadow: '0 0 5px rgba(0, 249, 208, 0.8)'
          },
          '20%, 24%, 55%': {
            opacity: '0.8',
            textShadow: 'none'
          }
        }
      }
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwindcss-animate'),
    function({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          background: 'linear-gradient(90deg, #00f9d0 0%, #9600ff 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.glass': {
          background: 'rgba(15, 23, 42, 0.6)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
        '.cyber-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            'border-radius': 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, #00f0ff, #ff2d75, #9600ff)',
            '-webkit-mask': 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            '-webkit-mask-composite': 'xor',
            'mask-composite': 'exclude',
          }
        }
      })
    }
  ],
}