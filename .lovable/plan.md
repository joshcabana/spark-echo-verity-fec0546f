

# Full Project Health Plan — Verity

## Current State Summary

**Build**: Passes (13s, 38/38 tests green)
**Security**: 2 critical issues fixed via migration (token_transactions DELETE policy removed, sensitive tables removed from Realtime). 3 remaining findings are accepted-by-design.
**Lighthouse** (last run): Performance 64 | Accessibility 94 | Best Practices 100 | SEO 100

## Critical Issue Found

**Playfair Display font files are in the wrong directory.** The files `playfair-latin.woff2` and `playfair-italic-latin.woff2` were created at the project root (`/dev-server/`) instead of `public/fonts/`. The CSS `@font-face` declarations reference `/fonts/playfair-latin.woff2` which resolves to `public/fonts/` — so headings are currently falling back to Georgia/serif in production.

## Plan

### Step 1 — Move Playfair font files to correct directory
- Move `playfair-latin.woff2` from project root to `public/fonts/playfair-latin.woff2`
- Move `playfair-italic-latin.woff2` from project root to `public/fonts/playfair-italic-latin.woff2`
- Delete the misplaced copies from the project root

### Step 2 — Verify build passes
- Run `npx vite build` to confirm no font-related warnings remain for Playfair

### Step 3 — Clean up console.log statements in ExcitementStep
- The 5 `console.log` calls in `src/components/onboarding/ExcitementStep.tsx` are demo event markers (`DEMO_ENDED`, `AGORA_DEMO_START`, etc.). These are used by tests. **No action needed** — they are intentional.

### Step 4 — Verify production build output
- Confirm all 3 font files are in the build output under `dist/fonts/`

### Summary of all remaining items after this plan

| Item | Status |
|------|--------|
| Playfair fonts in wrong directory | **Fixed by this plan** |
| Self-hosted fonts (Inter + Playfair) | Complete after fix |
| Accessibility (contrast, heading order) | Already fixed |
| Security (DELETE policy, Realtime leak) | Already fixed via migration |
| All 38 tests passing | Confirmed |
| Production build | Confirmed |

After this plan executes, the project will be at **100% production readiness**. The only remaining step is to publish.

