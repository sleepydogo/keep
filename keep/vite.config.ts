import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

// El glue de wasm-bindgen de Midnight es target "bundler": importa el .wasm como
// modulo ESM. Sin el plugin, Vite entrega un namespace sin inicializar y explota
// en __wbindgen_start. Los dos paquetes que traen .wasm van excluidos de
// optimizeDeps para que el plugin los vea; compact-runtime NO, porque necesita el
// pre-bundle que le da un default export a object-inspect (CJS).
const MIDNIGHT_WASM = [
  "@midnight-ntwrk/onchain-runtime-v3",
  "@midnight-ntwrk/ledger-v8",
];

export default defineConfig({
  plugins: [wasm(), react()],
  envDir: "..",
  optimizeDeps: { exclude: MIDNIGHT_WASM },
  build: { target: "esnext" },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:5175",
    },
  },
});
