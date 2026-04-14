

## What the GitHub repo (`verity-app`) has that this Lovable project could benefit from

After comparing both codebases, here is what is worth pulling over. The GitHub repo is a Next.js version of the same app — most component code is framework-specific and not portable. But there are three concrete wins:

---

### 1. Banned user check in `find-match` (Security fix)

The GitHub repo has a critical safety fix: `find-match` selects `banned_at` from `user_trust` and blocks suspended users from entering the matchmaking queue. This project's version does NOT check `banned_at`.

**Change**: Add `banned_at` to the select in `find-match/index.ts` and throw `"Account suspended"` if set.

---

### 2. `collect-product-event` edge function (Product analytics)

This project created the `product_events` table but has no edge function to write to it. The GitHub repo has a full `collect-product-event` function with:
- Allowlisted event names (30+ events covering the entire funnel)
- Public vs authenticated event distinction
- Session ID support
- Milestone tracking (auto-stamps `first_call_at`, `first_rsvp_at`, etc. on profiles)
- Input validation and type safety

**Change**: Port the function as a new edge function `supabase/functions/collect-product-event/index.ts`, updated to use the shared `getCorsHeaders` helper.

---

### 3. `rate-limit` edge function (Abuse prevention)

The GitHub repo has a `rate-limit` edge function that uses a `check_rate_limit` database RPC for sliding-window rate limiting by user or IP. This project does not have this function or the underlying DB function.

**Change**: Port `rate-limit/index.ts` as a new edge function, and create a migration for the `check_rate_limit` database function if it doesn't already exist.

---

### 4. OG/Twitter meta tags (SEO)

The GitHub repo has proper OpenGraph and Twitter Card meta tags. This project's `index.html` has none — no `og:title`, `og:description`, `og:image`, or `twitter:card` tags.

**Change**: Add OG and Twitter meta tags to `index.html` using the existing `/og-logo.png` asset.

---

### What is NOT worth pulling

- **V-mark logo assets** — The Lovable project already has its own favicon set (`favicon-32.png`, `favicon-192.png`, `favicon-512.png`). The V-mark PNGs from the other repo are for the Next.js version's manifest.
- **Next.js components** — Different framework (Next.js App Router vs Vite/React Router). Not portable.
- **Vercel Analytics/Speed Insights** — Vercel-specific packages, not applicable here.
- **Loading skeletons** — This project already has its own skeleton components.
- **Homepage/page.tsx** — This project already has a more mature landing page with multiple sections.

---

### Technical details

| Item | Files affected |
|------|---------------|
| Banned user check | `supabase/functions/find-match/index.ts` (add `banned_at` to select + guard) |
| collect-product-event | New: `supabase/functions/collect-product-event/index.ts` |
| rate-limit | New: `supabase/functions/rate-limit/index.ts` + migration for `check_rate_limit` RPC |
| OG meta tags | `index.html` (add 6-8 meta tags in `<head>`) |

All changes are additive except the `find-match` fix, which modifies one existing file.

