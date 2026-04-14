import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSentry } from "@/lib/sentry";

initSentry();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[Verity] Service worker registration failed:", err);
    });
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <Sentry.ErrorBoundary>
    <App />
  </Sentry.ErrorBoundary>
);
