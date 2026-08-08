import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

const MIDNIGHT_WASM = [
  "@midnight-ntwrk/onchain-runtime-v3",
  "@midnight-ntwrk/ledger-v8",
];

export default defineConfig({
  plugins: [wasm(), react()],
  envDir: "..",
  define: {
    "process.env": {},
    global: "window",
  },
  optimizeDeps: { exclude: [...MIDNIGHT_WASM, "@midnight-ntwrk/*", "@midnames/*"] },
  build: { target: "esnext" },
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:5175",
    },
  },
});
