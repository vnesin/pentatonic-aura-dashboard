import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pentatonic: {
          black: '#171717',
          white: '#FFFFFF',
          grayLight: '#FAFAFA',
          grayMedium: '#A9A9A9',
          mint: '#00FBA9',
          coral: '#FF4C00',
          blue: '#3941EB',
          secondaryGreen: '#5BC48B',
          secondaryRed: '#FFB788',
          secondaryBlue: '#9EA8FF'
        }
      },
      fontFamily: {
        body: ['"Atkinson Hyperlegible Next"', 'sans-serif'],
        mono: ['"Atkinson Hyperlegible Mono"', 'monospace']
      }
    }
  },
  plugins: []
} satisfies Config;
