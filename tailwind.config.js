module.exports = {
  purge: {
    enable: true,
    content: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    preserveHtmlElements: false,
    options: {
      keyframes: true
    }
  },
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
