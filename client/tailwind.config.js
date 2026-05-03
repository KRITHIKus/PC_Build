/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './providers/**/*.{js,jsx}',
    './features/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: {
          1: '#0d0d0f',
          2: '#141416',
          3: '#1a1a1e',
          4: '#222228',
        },
        accent: {
          DEFAULT: '#ff3b1f',
          deep:    '#e11d2e',
          glow:    'rgba(255,59,31,0.35)',
          muted:   'rgba(255,59,31,0.12)',
          border:  'rgba(255,59,31,0.3)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong:  'rgba(255,255,255,0.15)',
        },
        'text-1': '#f5f5f5',
        'text-2': '#a1a1aa',
        'text-3': '#52525b',
      },

      fontFamily: {
        sans:    ['var(--font-inter)',  'system-ui', 'sans-serif'],
        display: ['var(--font-sora)',   'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },

      boxShadow: {
        'red-sm':  '0 0 10px rgba(255,59,31,0.3)',
        'red':     '0 0 20px rgba(255,59,31,0.4)',
        'red-lg':  '0 0 40px rgba(255,59,31,0.3)',
        'red-xl':  '0 0 80px rgba(255,59,31,0.2)',
        'card':    '0 4px 24px rgba(0,0,0,0.6)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.8)',
      },

      backgroundImage: {
        'gradient-radial':     'radial-gradient(var(--tw-gradient-stops))',
        'gradient-red-radial': 'radial-gradient(ellipse at center, rgba(255,59,31,0.15) 0%, transparent 70%)',
      },

      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
      },

      keyframes: {
        fadeIn:    { from: { opacity: '0' },                             to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 10px rgba(255,59,31,0.3)' },
          '50%':     { boxShadow: '0 0 30px rgba(255,59,31,0.7)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },

      transitionTimingFunction: {
        spring: 'cubic-bezier(0.175,0.885,0.32,1.275)',
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
}