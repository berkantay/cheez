import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(import.meta.dirname, "package/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    outDir: "package-dist",
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
})
