import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  integrations: [
    starlight({
      title: '@thaparoyal/calendar',
      description: 'Multi-calendar UI library for AD and BS (Bikram Sambat) calendars',
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
            { label: 'Date Picker', link: '/components/date-picker/' },
            { label: 'Date Range Picker', link: '/components/date-range-picker/' },
          ],
        },
        {
          label: 'Calendars',
          items: [
            { label: 'Gregorian (AD)', link: '/calendars/gregorian/' },
            { label: 'Bikram Sambat (BS)', link: '/calendars/bikram-sambat/' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Core', link: '/api/core/' },
            { label: 'React', link: '/api/react/' },
            { label: 'Vue', link: '/api/vue/' },
            { label: 'Svelte', link: '/api/svelte/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
