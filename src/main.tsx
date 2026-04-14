import { createRoot } from "react-dom/client";
import App from "./App";
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
  root.render(<App />);
}
