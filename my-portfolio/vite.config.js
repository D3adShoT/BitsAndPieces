import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, new URL('.', import.meta.url).pathname, '')
  const sheetsUrl = env.SHEETS_API_URL
  const sheetsPath = sheetsUrl ? new URL(sheetsUrl).pathname : ''
  const sheetsOrigin = sheetsUrl ? new URL(sheetsUrl).origin : ''

  return {
    plugins: [react()],
    server: sheetsUrl ? {
      proxy: {
        '/api/sheets': {
          target: sheetsOrigin,
          changeOrigin: true,
          followRedirects: true,
          rewrite: path => path.replace('/api/sheets', sheetsPath),
        },
      },
    } : {},
  }
})
