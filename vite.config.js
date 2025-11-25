import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,     // 👈 Mobile access enable
    port: 5173,     // 👈 Optional but recommended
  },
})
