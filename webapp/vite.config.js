import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "../styles.scss" as *;`,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './catalog/about.html',
      },
    },
  },
})
