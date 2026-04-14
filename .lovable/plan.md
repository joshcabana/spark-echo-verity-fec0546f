

# Verity — Full Quality Assurance Audit

## Project Status Summary

Verity is a verified anonymous speed dating platform. **All 5 phases are code-complete.** The application builds, tests pass, and the preview renders correctly. The published site at `spark-echo-verity.lovable.app` requires a re-publish to reflect recent fixes.

---

## Issues Found (Requiring Fixes)

### 1. Duplicate OG/Twitter Meta Tags in `index.html`

**Severity**: Medium (SEO penalty — crawlers see conflicting metadata)

`index.html` contains **two sets** of Open Graph and Twitter Card meta tags (lines 10-23 and lines 40-51) with slightly different titles/descriptions. Crawlers may pick the wrong one or penalise for duplication.

**Fix**: Remove the duplicate block (lines 40-51). Keep only lines 10-23, which match the `react-helmet-async` overrides in `Landing.tsx`.

### 2. Sentry Double Initialisation in `main.tsx`

**Severity**: Low (functional but wasteful)

`main.tsx` calls `initSentry()` (which does a full `Sentry.init` with `beforeSend`, noise filtering, etc.) and then immediately calls `Sentry.init()` again (lines 9-15) with different settings (`tracesSampleRate: 0.2` vs `0.1`). The second call overwrites the first, losing the `beforeSend` noise filter.

**Fix**: Remove the redundant `Sentry.init` block in `main.tsx` (lines 9-15). `initSentry()` in `sentry.ts` already handles everything correctly.

### 3. `theme-color` Mismatch

**Severity**: Low (cosmetic)

`index.html` line 7 sets `theme-color` to `#7C3AED` (purple). Verity's brand colour is `#D4A853` / `#D4AF37` (gold), and the body background is `#0a0a0a`.

**Fix**: Change `theme-color` to `#0A0A0A` (matches body/dark theme) or `#D4AF37` (brand gold).

### 4. Stale Published Site

**Severity**: High (live site shows config error)

The Lighthouse audit confirmed the published site renders "Runtime configuration is incomplete" instead of the landing page. The `ConfigErrorScreen` guard has been removed in the codebase, but the live site has not been re-published.

**Fix**: Click **Publish → Update** in Lovable. This is the only remaining manual action.

---

## Verified — No Issues

| Area | Status | Notes |
|------|--------|-------|
| Build | Clean | `npx vite build` succeeds, no warnings |
| Tests | 40+ passing | All 11 test suites green |
| ConfigErrorScreen | Removed | No references remain in codebase |
| `runtimeEnv.ts` | Non-blocking | Falls back to empty strings |
| Agora imports | Fixed | Both edge functions use `esm.sh` |
| Font loading | Correct | 3 woff2 files, `font-display: swap`, preload hints |
| Routing | Complete | 25 routes, lazy-loaded, redirect aliases, 404 catch-all |
| Auth context | Correct | Roles from `user_roles` table, realtime trust updates |
| RLS policies | In place | All tables protected |
| Edge functions | 19 deployed | All use `esm.sh` or npm-compatible imports |
| Accessibility | Good | 44px tap targets, heading hierarchy, contrast |
| Bundle splitting | Optimal | 10 manual chunks (agora, radix, sentry, etc.) |
| SEO | Correct | JSON-LD, canonical, noscript fallback |
| Cookie consent | Present | 1.5s delay, essential-only |
| Error boundaries | Layered | Sentry outer + custom inner with retry UI |

---

## Implementation Plan

### Step 1: Remove duplicate meta tags from `index.html`

Delete lines 40-51 (the second `<!-- OpenGraph -->` and `<!-- Twitter Card -->` blocks). Keep the first set (lines 10-23).

### Step 2: Remove Sentry double-init from `main.tsx`

Delete lines 9-15 (the `if (import.meta.env.VITE_SENTRY_DSN)` block). The `initSentry()` call on line 7 already handles initialisation with proper noise filtering.

### Step 3: Fix `theme-color` in `index.html`

Change line 7 from `#7C3AED` to `#0A0A0A`.

### Step 4: Publish

After code changes, click **Publish → Update** to deploy. This resolves the stale config-error screen on the live site.

---

## Post-Publish Expected Scores

| Metric | Expected |
|--------|----------|
| Performance | 94+ |
| Accessibility | 98-100 |
| Best Practices | 100 |
| SEO | 100 (duplicate meta fix + landing page rendering) |

---

## Runbook: Items Beyond AI Control

1. **Publish the site**: Click Publish → Update in the Lovable editor (top-right button)
2. **DNS for getverity.com.au**: Configure DNS A/CNAME records pointing to the published URL — this must be done in your domain registrar
3. **Stripe webhook registration**: Register the `stripe-webhook` edge function URL in the Stripe Dashboard → Developers → Webhooks
4. **OG image**: `og-logo.png` is referenced but must be uploaded to `getverity.com.au/og-logo.png` (or the published domain) for social previews to work
5. **Favicon PNG files**: `favicon-32.png` and `favicon-apple-180.png` are referenced in `index.html` but need to exist in `public/`

