import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 27823,
      strictPort: false,
      open: false
    },
    preview: {
      port: 4173,
      strictPort: true
    },
    build: {
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'terser' : false,
      terserOptions:
        mode === 'production'
          ? {
              compress: {
                drop_console: true,
                drop_debugger: true
              }
            }
          : undefined,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) {
                return 'vendor-react-dom'
              }
              if (id.includes('react')) {
                return 'vendor-react'
              }
              if (id.includes('lucide-react')) {
                return 'vendor-lucide'
              }
              return 'vendor'
            }
          }
        }
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode)
    }
  }
})
