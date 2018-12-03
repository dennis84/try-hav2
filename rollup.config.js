import {uglify} from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'assets/index.tsx',
  output: {
    file: 'dist/js/index.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    typescript({tsconfig: 'tsconfig.json'}),
    resolve(),
    production && uglify(),
  ],
}
