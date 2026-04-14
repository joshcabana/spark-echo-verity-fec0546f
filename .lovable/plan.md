

# Fix: Agora Token Import Build Error

## Problem
The build fails because `npm:agora-token@2.0.4` in `supabase/functions/agora-demo-token/index.ts` (and `agora-token/index.ts`) can't be resolved by the Deno module checker. The `npm:` specifier requires either a `deno.json` with `nodeModulesDir` config or switching to an ESM-compatible URL.

## Fix
Replace the `npm:` import with an `esm.sh` URL in both agora edge functions:

**Files to change:**
1. `supabase/functions/agora-demo-token/index.ts` — line 2
2. `supabase/functions/agora-token/index.ts` — line 3

Change:
```typescript
import { RtcTokenBuilder, RtcRole } from "npm:agora-token@2.0.4";
```
To:
```typescript
import { RtcTokenBuilder, RtcRole } from "https://esm.sh/agora-token@2.0.4";
```

This uses the same pattern as the `@supabase/supabase-js` import on line 2 of `agora-token/index.ts` and is fully compatible with Deno edge functions.

## Verification
- Run `npx vite build` to confirm clean build
- Both edge functions deploy automatically

