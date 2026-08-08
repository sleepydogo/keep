import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  (window as any).global = window;
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

