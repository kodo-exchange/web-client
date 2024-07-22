/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: ['./src/components/**/*.{js,jsx}', './src/pages/**/*.{js,jsx}', './src/pages/**/**/*.{js,jsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(at 70% 5%, rgba(6,101,216,.18) 0, transparent 50%)',
        'gradient-primary': 'linear-gradient(180deg, #1A1A1A 0%, #101010 100%)',
        'swap-highlight':
          'radial-gradient(80% 62% at 0% 100%, rgba(222,222,222,0.08) 0%, rgba(222,222,222,0) 100%), linear-gradient(180deg, #1A1A1A 0%, #101010 100%)',
      },
      colors: {
        'black-50': 'rgba(0, 0, 0, 0.5)',
        'blue-gray': {
          // ここで削除できます
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        table: '#11143c',
        'table-light': 'hsl(231, 45%, 20%)',
        'pink-primary': '#FD009C', // メインカラー1
        'table-dark': '#000000', // 'table-dark': '#0c0d27',
        border: '#262626',
        'border-highlight': '#FD009C',
        'text-gray': 'rgba(128,128,136,1)',
        'text-green': '#4ACC8B',
        'bg-light': '#1A1A1A', // メインカラー2
        'bg-highlight': 'rgba(253, 0, 156, 0.10)',
        'bg-table': '#0B0B0B',
        'bg-disable': '#242424',
        'text-unselected': '#666666',
        'text-disabled': '#484848',
      },
      fontFamily: {
        // sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        sans: ['NTSomic', ...defaultTheme.fontFamily.sans],
      },
      opacity: {
        8: '0.08',
      },
      // gridTemplateColumns: {
      //   vote: 'minmax(68px, 12%) 1fr minmax(68px, 12%) 1fr',
      //   'vote-lg': 'minmax(68px, 6%) 1fr minmax(68px, 6%) 1fr minmax(68px, 6%) 1fr minmax(68px, 6%) 1fr',
      // },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes like form-{name}
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // require('daisyui'),
  ],
}
