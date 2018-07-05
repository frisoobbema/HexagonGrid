import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: {
    file: 'build/javascripts/main.js',
    format: 'iife',
    name: 'Main'
  },
  plugins: [
    json(),
    resolve(),
    // uglify(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],

};
