import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Assets will be served under /react/assets/...
  // Matches Spring Security PUBLIC_PATH: /react/**
  base: '/react/',

  server: {
    proxy: {
      // Proxy ALL /api calls — and intercept Spring's redirect-to-login
      // so the browser never crosses origins (5173 → 8080/login)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Spring Security redirects unauthenticated requests to /login (302).
            // Convert that to 401 so our React client.js handles it client-side.
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
      '/dashboard': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Output goes to src/main/resources/static/react/
    // Run: npm run build  (from project root where package.json lives)
    outDir: '../src/main/resources/static/react',
    emptyOutDir: true,
  },
})