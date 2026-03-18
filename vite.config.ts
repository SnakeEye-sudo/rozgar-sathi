import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rozgar-sathi/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
