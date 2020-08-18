'use strict';
const path = require('path');

module.exports = {
  extensions: [".css"],
  modules: false,
  extract: true,
  plugins: [
    require('tailwindcss')(path.join(__dirname, 'src/tailwind/tailwind.config.js')),
    require('autoprefixer')(),
  ]
}