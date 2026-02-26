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
            { label: 'Introduction', link: '/docs/getting-started/introduction/' },
            { label: 'Installation', link: '/docs/getting-started/installation/' },
            { label: 'CLI', link: '/docs/getting-started/cli/' },
          ],
        },
        {
          label: 'Components',
          items: [
            { label: 'Calendar', link: '/docs/components/calendar/' },
            { label: 'DatePicker', link: '/docs/components/date-picker/' },
            { label: 'RangeCalendar', link: '/docs/components/range-calendar/' },
            { label: 'MultiCalendar', link: '/docs/components/multi-calendar/' },
          ],
        },
        {
          label: 'Playground',
          items: [
            { label: 'React', link: '/playground/react/' },
            { label: 'Vue', link: '/playground/vue/' },
            { label: 'Svelte', link: '/playground/svelte/' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
