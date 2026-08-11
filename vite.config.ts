import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mirrors the "paths" entries in tsconfig.json. Vite needs this for
    // bundling; tsconfig needs its own copy for type-checking.
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
