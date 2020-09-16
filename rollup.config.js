/* eslint-disable @typescript-eslint/camelcase */

import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/recoil-actions.ts';
const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const excludeSpecFiles = { exclude: ['**/*.spec.ts', '**/*.spec.tsx'] };
const noDeclarationFiles = { compilerOptions: { declaration: false } };

export default [
  // CommonJS
  {
    input,
    output: { file: 'lib/recoil-actions.js', format: 'cjs', indent: false },
    external,
    plugins: [typescript({ tsconfigOverride: excludeSpecFiles })],
  },
  // ES
  {
    input,
    output: { file: 'es/recoil-actions.js', format: 'es', indent: false },
    external,
    plugins: [typescript({ tsconfigOverride: noDeclarationFiles })],
  },
  // ES for Browsers
  {
    input,
    output: { file: 'es/recoil-actions.mjs', format: 'es', indent: false },
    external,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
  // UMD Development
  {
    input,
    output: {
      file: 'umd/recoil-actions.js',
      format: 'umd',
      name: 'recoil-actions',
      indent: false,
      globals: { recoil: 'Recoil' },
    },
    external,
    plugins: [typescript({ tsconfigOverride: noDeclarationFiles })],
  },
  // UMD Production
  {
    input,
    output: {
      file: 'umd/recoil-actions.min.js',
      format: 'umd',
      name: 'recoil-actions',
      indent: false,
      globals: { recoil: 'Recoil' },
    },
    external,
    plugins: [
      typescript({ tsconfigOverride: noDeclarationFiles }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
];
