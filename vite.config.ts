import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(async()=>{
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  return {
    plugins: [react(), tailwindcss()],
    base: './',
    build: {
      rollupOptions: {
        input: {
          primary: "index.html", // Main entry point (default)
          secondary: "secondary.html", // Additional entry
        },
      },
    }
  }
})
