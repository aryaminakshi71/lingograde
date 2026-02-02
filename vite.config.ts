import { defineConfig, loadEnv } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env from current directory since NOT a monorepo structure with apps/web
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    optimizeDeps: {
      exclude: [
        '@shared/saas-core',
      ],
    },
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: Number(process.env.PORT) || 3000,
      host: true,
      strictPort: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared/saas-core': path.resolve(__dirname, './shared-saas-core'),
      },
    },
    plugins: [
      viteTsConfigPaths(),
      ...(process.env.SKIP_CLOUDFLARE !== 'true' ? [
        cloudflare({
          viteEnvironment: { name: 'ssr' },
          persist: true,
        })
      ] : []),
      tailwindcss(),
      tanstackStart({
        srcDirectory: "src",
        start: { entry: "./start.tsx" },
        server: { entry: "./server.ts" },
      }),
      viteReact(),
      // Bundle analyzer (only in production builds when ANALYZE=true)
      process.env.ANALYZE === 'true' && visualizer({
        filename: './dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
    ].filter(Boolean),
  };
})
