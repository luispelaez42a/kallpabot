import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import multiEntry from '@rollup/plugin-multi-entry';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: ['src/app.ts', 'src/flows/**/*.ts'], // Incluye los flows
  output: {
    file: 'dist/app.js',
    format: 'esm',
  },
  plugins: [
    json(), // Agrega el plugin JSON aquí
    commonjs(),
    resolve(),
    typescript(),
    multiEntry(), // Permite múltiples entradas
  ],
  external: ['@builderbot/bot', '@builderbot/provider-baileys'], // Excluye estas dependencias
};
