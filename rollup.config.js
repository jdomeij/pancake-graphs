"use strict";

import path from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginCopy from 'rollup-plugin-copy-glob';
import pluginSizes from 'rollup-plugin-sizes';
import pluginPostcss from 'rollup-plugin-postcss';

import pluginProgress from 'rollup-plugin-progress';
import pluginServe from 'rollup-plugin-serve';
import pluginLiveReload from 'rollup-plugin-livereload';

import sveltePreprocess from 'svelte-preprocess';
import pluginSvelte from 'rollup-plugin-svelte';
import pluginTypescript from '@rollup/plugin-typescript';

const production = process.env.BUILD === 'production';

const inputFile    = production ? 'src/package.dist.ts' : 'src/package.demo.ts';
const outputFolder = production ? 'output_dist': 'output_demo';
const outputName   = production ? 'graphlib' : 'graphlib';

export default [
  // Tailwind output
  {
    input: 'src/tailwind/tailwind.input.css',
    output: {
      sourcemap: false,
      format: 'iife',
      name: 'Tailwind',
      file: path.join(outputFolder, 'delete.me'),
    },
    plugins: [
      pluginPostcss({
        extract: path.resolve(path.join(outputFolder, 'tailwind.css')),
        modules: false,
        config: {
          path: 'postcss.config.js'
        },
      }),
    ]
  },

  // GraphLib
  {

    input: inputFile,
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'GraphLib',
      file: path.join(outputFolder, outputName + '.js'),
    },

    plugins: [
      // Svelte
      pluginSvelte({
        hydratable: true,
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file for better for performance
        css: css => {
          css.write(path.join(outputName + '.css'));
        },
        preprocess: sveltePreprocess({
          postcss: true,
        }),
      }),

      // Typescript
      pluginTypescript(),

      // Show progress
      pluginProgress(),

      // Generate detailed bundle size (before minification)
      production && pluginSizes({details:true}),

      // Resolve
      pluginResolve({
         include: 'node_modules/**',  // Default: undefined
         mainFields: ['browser'],
      }),
      pluginCommonjs(),

      // Minify
      production && pluginTerser({
        output: {
          max_line_len: 250,
        },
      }),


      pluginCopy([
        {dest: outputFolder, files: 'src/demo/index_static.html'},
      ]),

      !production && pluginServe({
        contentBase: [
          path.join(__dirname, 'src/demo/'),
          outputFolder,
        ],
        //host: '10.0.0.3',
        port: 5000,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      !production && pluginLiveReload(),
    ],
  }
];
