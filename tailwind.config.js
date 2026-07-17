module.exports = {
  darkMode: 'class', // use a .dark class on <html> or <body> to enable dark styles
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6feff',
          100: '#e6fbff',
          200: '#c8f5fb',
          300: '#9feaf6',
          400: '#6fe0f0',
          500: '#38d6ea',
          600: '#09b3c1',
          700: '#07838f',
          800: '#056066',
          900: '#03383b'
        }
      }
    },
  },
  plugins: [],
};
