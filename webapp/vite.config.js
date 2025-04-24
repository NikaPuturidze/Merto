import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/index',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "../styles.scss" as *;`,
      },
    },
  },
})
