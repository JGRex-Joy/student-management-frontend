import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  base: process.env.VERCEL ? '/' : '/react/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.statusCode === 302 || proxyRes.statusCode === 301) {
              proxyRes.statusCode = 401;
              delete proxyRes.headers['location'];
            }
          });
        },
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: '../src/main/resources/static/react',
    emptyOutDir: true,
  },
})