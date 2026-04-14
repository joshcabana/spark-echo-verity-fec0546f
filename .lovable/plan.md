

## What GetVerity.1 (the other Lovable project) has that this project could benefit from

Both repos are Vite/React Lovable projects for the same app. The other repo went through 6 phases of hardening. Here are the concrete improvements worth porting:

---

### 1. In-memory rate limiting for edge functions (Security)

The other repo has a `_shared/rate-limit.ts` utility that provides per-isolate sliding-window rate limiting. It is used in `find-match` (20 req/min), `agora-token` (10/min), `create-checkout` (5/min), `submit-appeal` (3/min), `delete-account` (2/hr), `export-my-data` (5/hr), and `spark-reflection-ai` (10/min).

This project has a database-backed `rate-limit` edge function but does NOT use in-memory per-function rate limiting. The in-memory approach is complementary -- it catches abuse at the isolate level before hitting the database.

**Change**: Create `supabase/functions/_shared/rate-limit.ts` and add `rateLimit()` guards to the 7 most sensitive edge functions.

---

### 2. Sentry error monitoring (Observability)

The other repo has a lazy-loaded Sentry integration (`src/lib/sentry.ts`) that:
- Dynamically imports `@sentry/react` to keep it off the critical path (454KB deferred)
- Filters out browser extension and third-party errors
- Wires into ErrorBoundary's `componentDidCatch`
- Activates only when `VITE_SENTRY_DSN` is set (no-ops otherwise)

This project has no error monitoring at all.

**Change**: Add `@sentry/react` as a dependency, create `src/lib/sentry.ts` with lazy loading, wire it into `main.tsx` and `ErrorBoundary.tsx`, add the `vendor-sentry` chunk to vite config.

---

### 3. Expanded Vite vendor chunks (Performance)

The other repo splits 10 vendor chunks; this project only splits 4 (agora, motion, charts, router). Missing: `@tanstack/react-query`, `@radix-ui`, `react-helmet-async`, `@supabase`, `date-fns`, `@sentry`.

**Change**: Add the missing `manualChunks` entries to `vite.config.ts` using a function-based approach (the other repo uses a function, which is more flexible than the static object this project uses).

---

### 4. `Vary: Origin` header in CORS (Caching correctness)

The other repo includes `"Vary": "Origin"` in CORS headers, which prevents CDN/browser caches from serving a response with the wrong `Access-Control-Allow-Origin` when multiple origins hit the same endpoint.

This project's `_shared/cors.ts` does not include `Vary: Origin`.

**Change**: Add `"Vary": "Origin"` to the return value in `_shared/cors.ts`.

---

### What is NOT worth pulling

- **`start-cloud-recording` / `stop-cloud-recording` / `generate-replay`** -- These are for Agora Cloud Recording which this project removed (recording columns were dropped in a previous migration). Not applicable.
- **Auth gates on `send-push` and `aggregate-stats`** -- Would need to verify current implementations, but these are lower priority operational changes.
- **`add_tokens` RPC for atomic token credits** -- This project already has a `deduct_tokens` RPC. The `add_tokens` counterpart in stripe-webhook is a nice-to-have but lower priority.
- **Database indexes migration** -- The other repo added 7 indexes. This could help but requires checking which indexes already exist in this project's migrations.

---

### Technical details

| Item | Files affected | Priority |
|------|---------------|----------|
| In-memory rate limiting | New: `supabase/functions/_shared/rate-limit.ts`, edit 7 edge functions | High |
| Sentry integration | New: `src/lib/sentry.ts`, edit `main.tsx`, `ErrorBoundary.tsx`, `vite.config.ts`, `package.json` | Medium |
| Vendor chunk splitting | Edit: `vite.config.ts` | Low (quick win) |
| Vary: Origin header | Edit: `supabase/functions/_shared/cors.ts` (1 line) | Low (quick win) |

All changes are additive. The Sentry integration requires installing `@sentry/react` and optionally setting `VITE_SENTRY_DSN` as an environment variable.

