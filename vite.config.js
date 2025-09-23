import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Replace '/your-app/' with the path your app is served from
export default defineConfig({
  base: '/', 
  plugins: [react(), tailwindcss()],
})
