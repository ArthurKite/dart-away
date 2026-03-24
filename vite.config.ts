import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { apiPlugin } from './server/api'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiPlugin(),
  ],
  optimizeDeps: {
    include: ['prop-types', 'react-simple-maps', 'd3-geo'],
  },
})
