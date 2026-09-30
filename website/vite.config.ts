import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Vercel sets `VERCEL=1` for every deployment build.
    __VERCEL_DEPLOYMENT__: JSON.stringify(process.env.VERCEL === '1')
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src')
    }
  }
})
