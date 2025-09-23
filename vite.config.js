import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // 👇 important: set this to match your Tomcat context path
  base: '/Taskflow/', 

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: 'dist',       // default build output
    assetsDir: 'assets',  // keep assets in /assets
  },

  server: {
    port: 5173,           // dev server port
    open: true,           // auto-open in browser on dev
  },
})
