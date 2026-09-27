import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { adminApiPlugin } from './server/vite-api-plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), adminApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});

