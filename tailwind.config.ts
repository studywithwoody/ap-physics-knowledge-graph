import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f4efe6',
        ink: '#1c1915',
        panel: '#fbf8f1',
        line: '#e4d8c6',
        navy: '#1b333f',
        vermilion: '#c24d2c',
        mist: '#e8e2d4',
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
