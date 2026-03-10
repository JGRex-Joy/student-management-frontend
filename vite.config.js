import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/react/',
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/dashboard': 'http://localhost:8080',
    }
  },
  build: {
    outDir: '../src/main/resources/static/react',
    emptyOutDir: true,
  }
})