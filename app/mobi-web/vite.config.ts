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
    cssCodeSplit: true,
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-dom',
              test: /node_modules[\\/]react-dom[\\/]/,
              priority: 35,
            },
            {
              name: 'framer-motion',
              test: /node_modules[\\/]framer-motion[\\/]/,
              priority: 35,
            },
            {
              name: 'react-core',
              test: /node_modules[\\/](react|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'react-router',
              test: /node_modules[\\/]react-router[\\/]/,
              priority: 25,
            },
            {
              name: 'i18n-vendor',
              test: /node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector|i18next-http-backend)[\\/]/,
              priority: 20,
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
