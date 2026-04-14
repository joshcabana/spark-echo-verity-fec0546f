import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";
import { initSentry } from "@/lib/sentry";

initSentry();

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 0.2,
    replaysOnErrorSampleRate: 1.0,
  });
}

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
