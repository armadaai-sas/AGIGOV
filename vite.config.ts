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
                cacheName: 'armada-public-api',
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
      // AGIGOV is a Windows junction → Armada-VZLA; keep the workspace path so Vite can read files.
      preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // Junction workspace (AGIGOV ↔ Armada-VZLA): allow both path names.
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
          // Prefer local API when running; fall back to live droplet for landing pulse.
          target: env.VITE_API_PROXY || 'http://137.184.66.163',
          changeOrigin: true,
        },
      },
    },
  };
});
