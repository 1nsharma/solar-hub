import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the app from /solar-hub/ until the custom domain is connected.
export default defineConfig({
  base: '/solar-hub/',
  plugins: [react()],
})
