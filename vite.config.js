import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',  // Si tu archivo index.html está en la carpeta src
  build: {

    outDir: '../dist', // Establece la carpeta de salida del build
  },
  base:"/portfolio/"
});

