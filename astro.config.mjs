import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://aonikenk.dev',
  output: 'server',
  adapter: vercel({
    edgeMiddleware: false,
  }),
});
