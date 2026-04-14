

# Fix Build Error & Config Guard Regression

## Issues

### 1. Edge Function Build Error (blocking)
Both `generate-vapid-keys/index.ts` and `send-push/index.ts` import `npm:web-push@3.6.7`. The Lovable edge function runtime cannot resolve bare `npm:` specifiers without a `deno.json` manifest. Switch to `esm.sh`.

### 2. `main.tsx` / `client.ts` Regression
The `ConfigErrorScreen` guard and lazy-import pattern were re-introduced (likely by an auto-regeneration of `client.ts`). This re-creates the original blocking issue on the published site.

## Plan

### Step 1: Fix web-push imports in edge functions

**`supabase/functions/generate-vapid-keys/index.ts`** — line 2:
```
- import webpush from "npm:web-push@3.6.7";
+ import webpush from "https://esm.sh/web-push@3.6.7";
```

**`supabase/functions/send-push/index.ts`** — line 2:
```
- import webpush from "npm:web-push@3.6.7";
+ import webpush from "https://esm.sh/web-push@3.6.7";
```

### Step 2: Remove ConfigErrorScreen guard (again)

**`src/main.tsx`** — simplify to direct App render without the config gate:
```tsx
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
root.render(<App />);
```

This removes the `ConfigErrorScreen` import and the `getMissingRuntimeEnvKeys` check entirely.

### Step 3: Verify build
Run `npx vite build` to confirm zero errors.

## Files changed
- `supabase/functions/generate-vapid-keys/index.ts` — esm.sh import
- `supabase/functions/send-push/index.ts` — esm.sh import
- `src/main.tsx` — remove config guard, direct render

