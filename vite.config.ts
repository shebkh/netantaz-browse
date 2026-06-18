import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Root-level asset dumps (`Statik/`, `video/`) are NOT part of the app — its assets
      // live in `public/`. On Windows another process (indexer/AV) intermittently locks
      // the .png files in these folders, and Vite's fs-watcher crashes with EBUSY when it
      // tries to watch them. Excluding them keeps the dev server stable; HMR of src/ is
      // unaffected.
      ignored: ['**/Statik/**', '**/video/**'],
    },
  },
})
