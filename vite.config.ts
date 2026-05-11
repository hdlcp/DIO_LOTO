import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sw-version',
      closeBundle() {
        const swPath = path.resolve(__dirname, 'dist/sw.js')
        if (fs.existsSync(swPath)) {
          let content = fs.readFileSync(swPath, 'utf-8')
          const version = `dioloto-${Date.now()}`
          content = content.replace(/dioloto-v\d+/g, version)
          fs.writeFileSync(swPath, content)
          console.log(`✅ SW version mise à jour : ${version}`)
        }
      }
    }
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
