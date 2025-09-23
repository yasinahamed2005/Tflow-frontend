import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/', // keep '/' if app is at root URL
  plugins: [react(), tailwindcss()],
})
