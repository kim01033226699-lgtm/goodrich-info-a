import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/goodrich-info-a/', // GitHub Pages 배포를 위한 저장소 경로 설정
})
