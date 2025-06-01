import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // build: {
  //   chunkSizeWarningLimit: 1600,
  // },

  server: {
    allowedHosts: ['ea17-80-233-56-175.ngrok-free.app']
  }

})
