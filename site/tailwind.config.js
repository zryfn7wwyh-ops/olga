const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: v('navy'),
        accent: v('accent'),
        'accent-dark': v('accent-dark'),
        soft: v('soft'),
        surface: v('surface'),
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      maxWidth: { content: '1240px' },
      boxShadow: {
        card: '0 1px 2px rgba(16,43,69,.06), 0 8px 24px -12px rgba(16,43,69,.18)',
        'card-hover': '0 2px 4px rgba(16,43,69,.08), 0 16px 32px -12px rgba(16,43,69,.28)',
      },
      borderRadius: { xl2: '1rem' },
    },
  },
  plugins: [],
};
