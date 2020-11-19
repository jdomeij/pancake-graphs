'use strict';
const path = require('path');

module.exports = {
  extensions: [".css"],
  modules: false,
  extract: true,
  plugins: [
    require('tailwindcss')(),
    require('autoprefixer')(),
  ]
}