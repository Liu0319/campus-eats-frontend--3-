import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', 
      manifest: {
        name: 'CampusEats 校園美食',       
        short_name: 'CampusEats',        
        description: '你的專屬校園美食指南',
        theme_color: '#f0ede8',          
        icons: [
          {
            src: 'pwa-192x192.png',      
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // 👇 記得把手機連線與 API 代理加回來！
  preview: {
    host: true, // 允許手機連線
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 後端網址
        changeOrigin: true,
      }
    }
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});