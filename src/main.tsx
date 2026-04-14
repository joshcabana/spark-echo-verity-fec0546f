import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import "./index.css";
import { initSentry } from "@/lib/sentry";
import ConfigErrorScreen from "@/components/ConfigErrorScreen";
import { getMissingRuntimeEnvKeys } from "@/lib/runtimeEnv";

initSentry();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[Verity] Service worker registration failed:", err);
    });
  });
}

const root = createRoot(document.getElementById("root")!);

const missingKeys = getMissingRuntimeEnvKeys();
if (missingKeys.length > 0) {
  root.render(<ConfigErrorScreen missingKeys={missingKeys} />);
} else {
  // Lazy-import App so the supabase client (which throws on empty URL)
  // is never loaded when the config guard above has already triggered.
  const App = lazy(() => import("./App"));
  root.render(
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <App />
    </Suspense>,
  );
}
