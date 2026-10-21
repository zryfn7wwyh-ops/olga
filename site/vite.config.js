import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Относительные пути: собранный сайт открывается из любой папки и с диска.
export default defineConfig({
  plugins: [react()],
  base: './',
});
