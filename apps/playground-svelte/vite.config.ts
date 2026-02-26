import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
  resolve: {
    alias: {
      '@thaparoyal/calendar-core': path.resolve(__dirname, '../../packages/core/dist/index.js'),
    },
  },
  optimizeDeps: {
    include: ['@thaparoyal/calendar-core'],
  },
});
