import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM + CJS build for bundlers
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: ['@thaparoyal/calendar-core'],
  },
  // IIFE build for CDN usage
  {
    entry: { index: 'src/index.ts' },
    format: ['iife'],
    globalName: 'TRCalendar',
    outDir: 'dist/cdn',
    splitting: false,
    sourcemap: true,
    clean: false,
    treeshake: true,
    minify: true,
    // Do NOT externalize core - bundle it into the IIFE output
    noExternal: ['@thaparoyal/calendar-core'],
  },
]);
