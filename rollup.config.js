// rollup.config.js
// =================
// Bundler configuration for building JS and TS declarations.
// Outputs:
//  - dist/index.esm.js (ES module)
//  - dist/index.cjs.js (CommonJS module)
//  - dist/index.d.ts (TypeScript types)

import resolve from '@rollup/plugin-node-resolve';             // Locate and bundle third-party deps in node_modules
import commonjs from '@rollup/plugin-commonjs';                // Convert CommonJS modules to ES6
import esbuild from 'rollup-plugin-esbuild';                  // Fast TS and JSX transpilation
import dts from 'rollup-plugin-dts';                           // Bundle all .d.ts into one file

export default [
  // ———————————————————————————————————————————————————————————————
  // 1) JavaScript/TypeScript build
  // — outputs both ESM and CJS bundles with sourcemaps
  {
    input: 'src/index.ts',                                     // Entry point
    external: ['react', 'react-dom'],                          // Peer deps: do not bundle React
    plugins: [
      resolve(),                                               // so Rollup can find deps
      commonjs(),                                              // so Rollup can convert CJS to ESM
      esbuild({
        target: 'es2017',                                      // modern JS target
        jsx: 'transform',                                      // handle JSX in TSX files
        minify: process.env.NODE_ENV === 'production',         // optional: minify in prod
      }),
    ],
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'esm',                                         // ES module for modern bundlers
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',                                         // CommonJS for Node/npm
        sourcemap: true,
        exports: 'named',                                      // named exports
      },
    ],
  },

  // ———————————————————————————————————————————————————————————————
  // 2) Type definitions bundling
  // — outputs a single .d.ts file for consumers
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
  },
];
