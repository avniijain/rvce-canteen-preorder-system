import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // 👈 IMPORTANT for localhost
      },
      manifest: {
        name: 'RVCE Canteen',
        short_name: 'Canteen',
        description: ' Canteen Pre-Ordering System',
        theme_color: '#3F7D58',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/divide.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/square.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
