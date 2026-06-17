import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss'; // 1. ADD THIS IMPORT
import autoprefixer from 'autoprefixer'; // 2. ADD THIS IMPORT

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // 3. ADD THIS TO PLUGINS
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173, // Ensure this matches your expected port
  }
});