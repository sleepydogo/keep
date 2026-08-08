import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [react(), wasm()],
  envDir: "..",
  define: {
    "process.env": {},
    global: "window",
  },
  optimizeDeps: {
    exclude: ["@midnight-ntwrk/*", "@midnames/*"],
  },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:5175",
    },
  },
});
