import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appEnv = env.VITE_APP_ENV || mode
  const isProduction = mode === 'production'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      open: false
    },
    preview: {
      port: 4173,
      strictPort: true
    },
    define: {
      __APP_ENV__: JSON.stringify(appEnv)
    },
    build: {
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 350,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/react-dom/')) {
              return 'vendor-react-dom'
            }

            if (id.includes('/node_modules/react/')) {
              return 'vendor-react'
            }

            if (id.includes('/node_modules/lucide-react/')) {
              return 'vendor-lucide'
            }
          }
        }
      }
    },
    esbuild: isProduction
      ? {
          drop: ['console', 'debugger']
        }
      : undefined
  }
})
