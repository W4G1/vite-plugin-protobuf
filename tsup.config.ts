// import { copyFile } from 'fs/promises'
import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  outDir: 'dist',
  entry: ['src'],
  splitting: false,
  bundle: false,
  sourcemap: true,
  clean: true,
  target: 'node18',
  platform: 'node',
  dts: true,
})
