import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import electron from 'vite-plugin-electron/simple'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main/index.js',
        vite: {
          build: {
            outDir: 'dist/electron/main',
          },
        },
      },
      preload: {
        input: path.join(__dirname, 'electron/preload/index.js'),
        vite: {
          build: {
            outDir: 'dist/electron/preload',
          },
        },
      },
      renderer: {},
    }),
  ],
})