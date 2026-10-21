import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_ROUTER=hash — сборка для статического предпросмотра (HashRouter, относительные пути).
export default defineConfig(() => ({
  plugins: [react()],
  base: process.env.VITE_ROUTER === 'hash' ? './' : '/',
}));
