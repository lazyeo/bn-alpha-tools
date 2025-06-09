import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// 智能检测部署平台
const getBasePath = () => {
  // GitHub Pages 部署
  if (process.env.GITHUB_PAGES === 'true') {
    return '/bn-alpha-tools/'
  }
  // Cloudflare Pages 或本地开发
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  // 🚀 生产环境配置
  base: getBasePath(), // 智能检测部署平台
  build: {
    outDir: 'dist',
    // 优化构建大小
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'fontawesome': ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
          'chart-libs': ['bignumber.js', 'qrcode']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      // 代理CoinMarketCap API
      '/api/cmc': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cmc/, '')
      },
      // 代理CoinGecko Pro API (必须在普通CoinGecko之前)
      '/api/coingecko-pro': {
        target: 'https://pro-api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko-pro/, '')
      },
      // 代理CoinGecko API
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
