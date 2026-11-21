import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The backend only allows the origin http://localhost:5173 (CORS), so keep this port fixed.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
})
