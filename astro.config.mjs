import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://aonikenk.dev',
  output: 'server',        // SSR — validation never reaches the browser
  adapter: vercel(),
});