import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import ConfigErrorScreen from "@/components/ConfigErrorScreen";
import { getMissingRuntimeEnvKeys } from "@/lib/runtimeEnv";

// ---------- Sentry ----------
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    tracesSampleRate: 0.2,
    replaysOnErrorSampleRate: 1.0,
  });
}

// ---------- Service Worker ----------
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[Verity] Service worker registration failed:", err);
    });
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("[Verity] Root element #root is missing.");
}

const root = createRoot(rootElement);

const bootstrap = async () => {
  const missingKeys = getMissingRuntimeEnvKeys();
  if (missingKeys.length > 0) {
    root.render(<ConfigErrorScreen missingKeys={missingKeys} />);
    return;
  }

  const { default: App } = await import("./App.tsx");
  root.render(
    <Sentry.ErrorBoundary>
      <App />
    </Sentry.ErrorBoundary>
  );
};

bootstrap().catch((error) => {
  console.error("[Verity] Failed to bootstrap app:", error);
  root.render(<ConfigErrorScreen missingKeys={["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]} />);
});
