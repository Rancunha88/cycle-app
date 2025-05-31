import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // build: {
  //   chunkSizeWarningLimit: 1600,
  // },

  server: {
    allowedHosts: ['568d-80-233-52-175.ngrok-free.app']
  }

})
