import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // React плагині қалды
    // tailwindcss() жолын алып тастадық, енді PostCSS арқылы іске қосылады
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @ = src
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'], // raw импорттар
});
