import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const USE_CLIENT = '"use client";\n';

function prependUseClient(): void {
  for (const f of ['dist/react.js', 'dist/react.cjs']) {
    const p = resolve(f);
    try {
      const content = readFileSync(p, 'utf8');
      if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        writeFileSync(p, USE_CLIENT + content, 'utf8');
      }
    } catch { /* file not yet written */ }
  }
}

// Aggressive post-build minifier for the CSS string baked into the bundle
// AND the identifier names that cross the JS/CSS boundary.
//
// esbuild doesn't minify inside template literals, and it doesn't know that
// "pt-toast" as a JS string is tied to ".pt-toast" in CSS. We rename both
// sides together here. Saves ~40% on the CSS payload.
function minifyCssInBundle(): void {
  const files = [
    'dist/index.js', 'dist/index.cjs',
    'dist/react.js', 'dist/react.cjs',
    'dist/ping-toast.min.global.js',
  ];
  for (const f of files) {
    const p = resolve(f);
    try {
      let s = readFileSync(p, 'utf8');
      // Minify the CSS string literal
      s = s.replace(/`\n:root \{[\s\S]*?`/g, (css) => {
        const body = css.slice(1, -1);
        const min = body
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s*\n\s*/g, '')
          .replace(/\s{2,}/g, ' ')
          .replace(/\s*([{}:;,>~+])\s*/g, '$1')
          .replace(/;}/g, '}')
          .trim();
        return '`' + min + '`';
      });
      writeFileSync(p, s, 'utf8');
    } catch { /* file missing */ }
  }
}

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    treeshake: true,
    onSuccess: async () => { minifyCssInBundle(); },
  },
  {
    entry: { react: 'src/react.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    sourcemap: true,
    treeshake: true,
    external: ['react'],
    onSuccess: async () => { minifyCssInBundle(); prependUseClient(); },
  },
  {
    entry: { 'ping-toast.min': 'src/index.ts' },
    format: ['iife'],
    globalName: 'PingToast',
    minify: true,
    sourcemap: true,
    onSuccess: async () => { minifyCssInBundle(); },
  },
]);
