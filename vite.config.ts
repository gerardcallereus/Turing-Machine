import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      {
        name: 'dev-html-transform',
        transformIndexHtml: {
          order: 'pre',
          handler(html: string) {
            return html
              .replace(/<script type="module" crossorigin src="\.\/assets\/[^"]+"><\/script>/g, '<script type="module" src="/src/main.tsx"></script>')
              .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+">/g, '');
          },
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
