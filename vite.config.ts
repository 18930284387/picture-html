import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
    build: {
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react'],
          }
        }
      }
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
    server: {
      port: 27823,
      strictPort: false,
      open: false
    },
    preview: {
      port: 27823,
      strictPort: false
    }
  }
})
