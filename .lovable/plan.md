

# Fix: Remove Runtime Config Guard Blocking the App

## Problem
`main.tsx` calls `getMissingRuntimeEnvKeys()` before rendering. This reads `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` — if either is missing/empty, it renders `ConfigErrorScreen` instead of the app. In the Lovable preview/publish environment, this check is failing and blocking the entire application.

The `client.ts` (auto-generated) also imports from `runtimeEnv.ts`, creating a fragile dependency chain.

## Root Cause
Lovable Cloud auto-generates `client.ts` with hardcoded Supabase credentials from the `.env` file. The project added a custom `runtimeEnv.ts` abstraction and a `ConfigErrorScreen` gate that intercepts the boot process — this defensive layer is unnecessary in the Lovable environment and is actively blocking the app.

## Fix (2 files)

### 1. Simplify `main.tsx`
Remove the `runtimeEnv` check and `ConfigErrorScreen` gate. Import and render `App` directly (keeping Sentry ErrorBoundary and service worker registration):

```tsx
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import "./index.css";
import { initSentry } from "@/lib/sentry";

initSentry();

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN, tracesSampleRate: 0.2, replaysOnErrorSampleRate: 1.0 });
}

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.warn);
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <Sentry.ErrorBoundary>
    <App />
  </Sentry.ErrorBoundary>
);
```

### 2. Keep `runtimeEnv.ts` but make it non-blocking
The `client.ts` file (auto-generated, cannot edit) currently imports `getSupabaseRuntimeConfig` from `runtimeEnv.ts`. When Lovable regenerates `client.ts`, it will use hardcoded values. Until then, ensure `runtimeEnv.ts` doesn't throw by falling back gracefully — but since we can't edit `client.ts`, the safest path is to leave `runtimeEnv.ts` as-is (it only throws when called, and `client.ts` calls it at import time).

**If `client.ts` gets auto-regenerated** (which removes the runtimeEnv import), no further changes needed. **If it doesn't**, we update `runtimeEnv.ts` to fall back to empty strings instead of throwing, letting the Supabase client handle the error gracefully.

### 3. Verify
- Run `npx vite build` to confirm clean build
- Confirm the preview renders the landing page instead of the config error screen

## Files changed
- `src/main.tsx` — remove ConfigErrorScreen gate, direct App render
- `src/lib/runtimeEnv.ts` — make `resolveSupabaseRuntimeConfigFromSource` non-throwing (fallback)
- `src/components/ConfigErrorScreen.tsx` — can be deleted (no longer used)

