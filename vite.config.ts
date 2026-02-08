import { defineConfig, loadEnv } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import path from "path";

export default defineConfig(({ mode }) => {
  // Capture PORT from shell BEFORE loadEnv (which might load PORT from .env)
  const shellPort = process.env.PORT;
  // Load env from current directory since NOT a monorepo structure with apps/web
  const env = loadEnv(mode, process.cwd(), "");
  // PORT from shell environment takes highest priority
  const port = shellPort || env.PORT || "3009";
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
      rollupOptions: {
        external: [
          // Externalize Cloudflare-specific modules
          "cloudflare:workers",
        ],
      },
    },
    server: {
      port: Number(port),
      host: true,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@shared/saas-core': path.resolve(__dirname, './shared-saas-core'),
      },
    },
    plugins: [
      viteTsConfigPaths(),
      ...(process.env.SKIP_CLOUDFLARE !== 'true' && process.env.WRANGLER_REMOTE !== 'false' ? [
        cloudflare({
          viteEnvironment: { name: 'ssr' },
          persist: true,
        })
      ] : []),
      // tailwindcss(),
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
