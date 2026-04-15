import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    treeshake: true,
  },
  {
    entry: { react: 'src/react.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    sourcemap: true,
    treeshake: true,
    external: ['react'],
  },
  {
    entry: { 'ping-toast.min': 'src/index.ts' },
    format: ['iife'],
    globalName: 'PingToast',
    minify: true,
    sourcemap: true,
  },
]);
