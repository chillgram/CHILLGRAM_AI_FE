import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/assets/index.css";
import Providers from "./providers";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
