import { defineConfig } from '@tanstack/start/config'

export default defineConfig({
  routesDirectory: './src/routes',
  server: {
    preset: 'bun',
  },
})
