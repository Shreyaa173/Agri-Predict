import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',  // Make sure the build output directory is set correctly
    assetsDir: 'assets',  // Optional: Specify assets directory inside 'dist'
  },
  server: {
    proxy: {
      '/api/predict': {
        target: 'http://localhost:10000',
        changeOrigin: true,
      }
    }
  }
})
