/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'primary': {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        // Secondary colors
        'secondary': {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
        },
        // Background colors
        'bg': {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          input: 'var(--color-bg-input)',
          card: 'var(--color-bg-card)',
        },
        // Text colors
        'text': {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          placeholder: 'var(--color-text-placeholder)',
          inverse: 'var(--color-text-inverse)',
        },
        // Border colors
        'border': {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          focus: 'var(--color-border-focus)',
        },
        // Status colors
        'success': {
          50: 'var(--color-success-50)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
        },
        'error': {
          50: 'var(--color-error-50)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
        },
        'warning': {
          50: 'var(--color-warning-50)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
        },
        // Google colors
        'google': {
          blue: 'var(--color-google-blue)',
          green: 'var(--color-google-green)',
          yellow: 'var(--color-google-yellow)',
          red: 'var(--color-google-red)',
        },
      },
    },
  },
  plugins: [],
}
