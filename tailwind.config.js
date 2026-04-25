/* eslint-disable quotes */
module.exports = {
  content: [
    './app/**/*.html',
    './app/components/**/*.js',
    './app/containers/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        paymentBg: "url('/public/images/deposit/depo.webp')",
        'blue-btn-gradient':
          'linear-gradient(278.15deg, #eef3f7 45%, #d9ecff 100%)',

        'pink-btn-gradient':
          'linear-gradient(278.15deg, #f3e6e9 45%, #f8d7df 100%)',
      },
      fontFamily: {
        josefin: ['Josefin', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      fontSize: {
        10: '10px',
        12: '12px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        36: '36px',
        46: '46px',
        76: '76px',
      },
      colors: {
        primary: {
          100: '#081420',
          200: '#192431',
          300: '#6D5AE6',
          400: '#1BCE93',
          500: '#FFFFFF',
          600: '#ffffff14',
          700: '#F9B223',
          800: '#ECECEC',
          900: '#B1B1B5',
          1000: '#70798B',
          1100: '#2B3541',
          1200: '#1f5158',
          1300: '#1E8067',
          1400: '#F4D821',
          1500: '#1E8067',
        },
        marketHead: '#DDDDDD',
        'odd-pink': {
          100: '#F9C9D4',
          300: '#F9C9D4',
          500: '#F9C9D4',
        },
        'odd-blue': {
          100: '#A7D8FD',
          300: '#A7D8FD',
          500: '#A7D8FD',
        },
      },
      borderRadius: {
        20: '20px',
      },
    },
    screens: {
      sm1: '450px',
      sm: '	660px',
      md: '768px',
      lg: '1024px',
      xl: '1140px',
      '2xl': '1320px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.75rem',
        sm: '0.75rem',
        lg: '0.75rem',
        xl: '0.75rem',
        '2xl': '0.75rem',
      },
    },
  },
};
