import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

// No-op sitemap to prevent Starlight's built-in sitemap from crashing
// (incompatibility between astro@4.16 and @astrojs/sitemap@3.x)
const noopSitemap = () => ({ name: '@astrojs/sitemap', hooks: {} });

export default defineConfig({
  site: 'https://thaparoyal.github.io',
  base: '/calendar',
  server: { port: 3000, host: true },
  redirects: {
    '/playground/vue/': '/playground/react/',
    '/playground/svelte/': '/playground/react/',
    '/playground/vanilla/': '/playground/react/',
  },
  integrations: [
    noopSitemap(),
    react(),
    vue(),
    svelte(),
    starlight({
      title: 'Patro',
      description: 'AD and BS (Bikram Sambat) calendar components for React, Vue, Svelte, and Vanilla JS',
      social: {
        github: 'https://github.com/thaparoyal/calendar',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/getting-started/introduction/' },
            { label: 'Installation', link: '/getting-started/installation/' },
            { label: 'CLI', link: '/getting-started/cli/' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Calendar', link: '/components/calendar/' },
            { label: 'DatePicker', link: '/components/date-picker/' },
            { label: 'RangeCalendar', link: '/components/range-calendar/' },
            { label: 'MultiCalendar', link: '/components/multi-calendar/' },
          ],
        },
        {
          label: 'React',
          items: [
            { label: 'Quick Start', link: '/react/quick-start/' },
            { label: 'Calendar', link: '/react/calendar/' },
            { label: 'DatePicker', link: '/react/date-picker/' },
            { label: 'RangeCalendar', link: '/react/range-calendar/' },
            { label: 'MultiCalendar', link: '/react/multi-calendar/' },
            { label: 'All Examples', link: '/react/examples/' },
          ],
        },
        {
          label: 'Vue',
          items: [
            { label: 'Guide', link: '/vue/guide/' },
            { label: 'Calendar', link: '/vue/calendar/' },
            { label: 'Range Selection', link: '/vue/range-selection/' },
            { label: 'Multi-Calendar', link: '/vue/multi-calendar/' },
            { label: 'Date Picker', link: '/vue/date-picker/' },
            { label: 'All Examples', link: '/vue/examples/' },
          ],
        },
        {
          label: 'Svelte',
          items: [
            { label: 'Guide', link: '/svelte/guide/' },
            { label: 'Calendar', link: '/svelte/calendar/' },
            { label: 'Range Selection', link: '/svelte/range-selection/' },
            { label: 'Multi-Calendar', link: '/svelte/multi-calendar/' },
            { label: 'Date Picker', link: '/svelte/date-picker/' },
            { label: 'All Examples', link: '/svelte/examples/' },
          ],
        },
        {
          label: 'Vanilla JS',
          items: [
            { label: 'Getting Started', link: '/vanilla/getting-started/' },
            { label: 'CDN Usage', link: '/vanilla/cdn/' },
            { label: 'Examples', link: '/vanilla/examples/' },
          ],
        },
        {
          label: 'Core',
          items: [
            { label: 'Date Conversion', link: '/core/date-conversion/' },
            { label: 'Themes', link: '/core/themes/' },
            { label: 'Localization', link: '/core/localization/' },
          ],
        },
        {
          label: 'Playground',
          items: [
            { label: 'Interactive Demo', link: '/playground/react/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
