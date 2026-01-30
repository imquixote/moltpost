import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { HttpsProxyAgent } from 'https-proxy-agent'

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:7890')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.moltbook.com',
        changeOrigin: true,
        secure: true,
        agent: proxyAgent,
      },
    },
  },
})
