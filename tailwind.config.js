/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1E3A8A',
        },
        purple: {
          primary: '#6D5DFB',
          deep: '#4F46E5',
          soft: '#EEF2FF',
          border: '#DDD6FE',
        },
        bg: {
          primary: '#FFFFFF',
          soft: '#F8FAFC',
          section: '#F5F3FF',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        text: {
          primary: '#111827',
          secondary: '#475569',
          tertiary: '#64748B',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#CBD5E1',
          purple: '#DDD6FE',
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#6D5DFB',
        },
      },
      textColor: {
        main: 'var(--text-main)',
        muted: 'var(--text-muted)',
        dim: 'var(--text-dim)',
      },
      borderColor: {
        glass: 'var(--border-glass)',
      },
      fontFamily: {
        sans: ['Tajawal', 'Cairo', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        display: ['Tajawal', 'Cairo', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        none: 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      });
    },
  ],
  corePlugins: {
    // Disable default RTL since we use plugin
    direction: false,
  },
};

module.exports = config;
