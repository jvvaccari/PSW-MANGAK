import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('C:/Users/jvvac/OneDrive/Área de Trabalho/estudo/PSW/PSW-MANGAK/PSW-MANGAK/server/certification/localhost_decrypted.key'),
      cert: fs.readFileSync('C:/Users/jvvac/OneDrive/Área de Trabalho/estudo/PSW/PSW-MANGAK/PSW-MANGAK/server/certification/localhost.crt'),
    },
    port: 5173,  // você pode manter ou mudar para outra porta, caso necessário
  },
})
