import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { uploadPlugin } from './src/utils/vite-plugin-upload'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), uploadPlugin()],
})
