import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isDesktop = process.env.VITE_DESKTOP === '1';

  return {
    base: isDesktop ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        disable: isDesktop,
        registerType: 'autoUpdate',
        includeAssets: ['icons/*.svg'],
        manifest: {
          name: 'AGIGOV — Plataforma institucional',
          short_name: 'AGIGOV',
          description: 'Gobernanza y política verificables — modelo genérico e implementaciones nacionales.',
          theme_color: '#050810',
          background_color: '#050810',
          display: 'standalone',
          start_url: '/',
          lang: 'es',
          categories: ['government', 'productivity'],
          icons: [
            {
              src: 'icons/icon-192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: 'icons/icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: 'icons/icon-512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^\/api\/public\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'agigov-public-api',
                networkTimeoutSeconds: 5,
              },
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      // AGIGOV may be a Windows junction → local AGIGOV/Armada-VZLA folder; keep the workspace path so Vite can read files.
      preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('react-dom') || id.includes('react-router') || /\/react\//.test(id)) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) return 'vendor-icons';
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      fs: {
        strict: false,
        allow: [
          path.resolve(__dirname),
          path.resolve(__dirname, '..', 'AGIGOV'),
          path.resolve(__dirname, '..', 'Armada-VZLA'),
        ],
      },
      proxy: {
        '/api': {
          // Local API by default (npm run api:public). A public clone must not
          // fall through to a private host. Override with VITE_API_PROXY.
          target: env.VITE_API_PROXY || 'http://127.0.0.1:3001',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const raw = proxyRes.headers['set-cookie'];
              if (!raw) return;
              const cookies = Array.isArray(raw) ? raw : [raw];
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, '')
                  .replace(/;\s*Domain=[^;]+/gi, ''),
              );
            });
          },
        },
      },
    },
  };
});
