import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// @see https://vite.dev/config/
export default defineConfig({
  clearScreen: false,
  server: {
    host: true,
    port: 8080,
    open: false,
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `static/[hash].js`,
        chunkFileNames: `static/[name]-[hash].js`,
        assetFileNames: `static/[hash].[ext]`,
        manualChunks(id: string) {
          // bundle all sync app modules into one chunk
          if (!id.includes('node_modules')) {
            return null
          }

          // bundle treejs and related stuff into one chunk
          if (id.includes('@tresjs') || id.includes('/three/')) {
            return 'treejs'
          }

          // bundle all other vendor modules into one chunk
          return 'vendor'
        },
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
