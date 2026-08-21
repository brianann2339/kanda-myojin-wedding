import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 的 project site 網址是 /<repo>/，打包時要帶這個 base
export default defineConfig({
  base: '/kanda-myojin-wedding/',
  plugins: [react()],
})
