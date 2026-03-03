import { defineConfig } from 'tsup';
import { copyFile } from 'fs/promises';
import { existsSync } from 'fs';

const isWatch = process.argv.includes('--watch');

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: !isWatch, // Skip DTS in watch mode to avoid build order issues
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom', '@thaparoyal/calendar-core'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    // Copy styles.css to dist so the package.json export resolves correctly
    if (existsSync('src/styles.css')) {
      await copyFile('src/styles.css', 'dist/styles.css');
    }
  },
});
