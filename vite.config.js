import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths so GitHub Pages project sites load CSS and JS.
  base: './',
  server: {
    forwardConsole: false,
  },
});
