import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Explicitly use the new automatic JSX transform (React 17+)
      // This means you don't NEED to import React in every JSX file,
      // but we import it anyway for maximum compatibility.
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
