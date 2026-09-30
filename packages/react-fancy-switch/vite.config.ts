import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**'],
      // Emit one declaration entry per module format so that both ESM
      // (`import`) and CommonJS (`require`) consumers get correct types.
      outDirs: [{ dir: 'dist' }, { dir: 'dist', moduleFormat: 'cjs' }],
      bundleTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: 'react-fancy-switch',
      formats: ['es', 'cjs']
    },
    rolldownOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: {
        exports: 'named'
      }
    },
    sourcemap: true
  }
})
