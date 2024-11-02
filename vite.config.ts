import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-25-5-clock/',
  css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
        }
      }
    }
});