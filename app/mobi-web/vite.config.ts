import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api/mobi'),
      }
    }
  },
  resolve: {
    alias: {
      '@app/mobi-web': path.resolve(__dirname, './src'),
    }
  },
  build: {
    minify: 'oxc',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)/,
              priority: 20,
            },
            {
              name: 'ui-vendor',
              test: /node_modules[\\/]@heroui/,
              priority: 15,
            },
            {
              name: 'vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
