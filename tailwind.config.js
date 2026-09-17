/** @type {import('tailwindcss').Config} */
export default {
    // 1. Tell Tailwind where your React components are
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // 2. Map your custom CSS variables to Tailwind classes
        colors: {
          background: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          hover: 'var(--bg-hover)',

          main: 'var(--text-main)',
          subtle: 'var(--text-subtle)',
          inverse: 'var(--text-inverse)',
          
          outline: 'var(--border)',
          'outline-focus': 'var(--border-focus)',
          
          brand: 'var(--color-primary)',
          success: 'var(--color-success)',
          error: 'var(--color-error)',
        }
      },
    },
    plugins: [],
  }