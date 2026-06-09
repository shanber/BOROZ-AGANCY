/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          navy: '#0B132B',
          purple: '#06B6D4',
          cyan: '#06B6D4',
          green: '#22C55E',
          light: '#F8FAFC',
          dark: '#111827',
          muted: '#475569',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        main: 'var(--bg-main)',
        card: 'var(--bg-card)',
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
        sans: ['var(--font-ibm-plex-arabic)', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
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
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
    require('@tailwindcss/typography'),
  ],
  corePlugins: {
    // Disable default RTL since we use plugin
    direction: false,
  },
};

module.exports = config;
