import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/SkillSwap_55_3/' : '/',

  plugins: [react(), svgr()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}))
