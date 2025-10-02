import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile() // Inline everything into a single HTML file for offline use
  ],
  base: './', // Use relative paths for offline compatibility
  build: {
    // Inline all assets for single HTML file
    assetsInlineLimit: 100000000,
    rollupOptions: {
      output: {
        // Create single file
        manualChunks: undefined,
        inlineDynamicImports: true,
      }
    },
    minify: 'terser'
  }
})
