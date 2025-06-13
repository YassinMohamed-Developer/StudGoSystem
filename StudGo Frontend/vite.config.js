import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css'],
    alias: {
      '@': '/src',
      '@styles': '/src/styles'
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
