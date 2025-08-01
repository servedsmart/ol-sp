import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";

let externalPaths = ["src/config.js"];
externalPaths = externalPaths.map((path) => {
  return fileURLToPath(new URL(path, import.meta.url));
});

export default defineConfig({
  build: {
    emptyOutDir: true,
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      external: [...externalPaths],
      input: "src/main.js",
      output: {
        entryFileNames: "ol-sp.min.esm.js",
        assetFileNames: "ol-sp.min.css",
        format: "es",
      },
    },
  },
});
