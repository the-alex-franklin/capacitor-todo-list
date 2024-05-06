import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import windicss from 'vite-plugin-windicss';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    windicss(),
  ],
  build: {
    outDir: 'build',
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
});
