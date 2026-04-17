import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, open: true },
  // ping-toast is installed via `file:../..` (symlink), and its own
  // node_modules may contain a stray React from sibling test tooling. Dedupe
  // forces Vite to resolve a single copy from this app's node_modules so React
  // hooks don't break with "Cannot read properties of null".
  resolve: { dedupe: ['react', 'react-dom'] },
})
