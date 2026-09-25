import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Use VITE_BASE for GitHub Pages project sites (e.g. VITE_BASE=/repo-name/).
 * Default `./` keeps JS/CSS paths relative so static hosting works from any subpath
 * (avoids a blank page when `/assets/*.js` 404s under `user.github.io/repo/`).
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? './',
  server: {
    port: 3002,
  },
});
