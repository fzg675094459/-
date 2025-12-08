
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This prevents "Uncaught ReferenceError: process is not defined"
    // which causes the black screen issue in production
    'process.env': {}
  }
})
