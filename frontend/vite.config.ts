import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: { usePolling: true },
  },
  resolve: {
    alias: {
      '@api': '/src/api',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@context': '/src/context',
      '@types': '/src/types',
    },
  },
});
