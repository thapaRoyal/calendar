import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  server: { port: 3000, host: true },
  integrations: [
    react(),
    vue(),
    svelte(),
    starlight({
      title: '@thaparoyal/calendar',
      description: 'AD and BS (Bikram Sambat) calendar components for React, Vue, and Svelte',
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
            { label: 'React', link: '/playground/react/' },
            { label: 'Vue', link: '/playground/vue/' },
            { label: 'Svelte', link: '/playground/svelte/' },
            { label: 'Vanilla JS', link: '/playground/vanilla/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
