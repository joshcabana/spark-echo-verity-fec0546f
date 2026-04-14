

## What la45-site-optimised has that could benefit Verity

The LA45 repo is a **Next.js marketing site** — a completely different framework and project. Most code is not directly portable. However, there are three framework-agnostic techniques worth adopting:

---

### 1. Accessibility: `prefers-reduced-motion` global reset (Quick win)

LA45's `globals.css` includes a blanket reduced-motion override that disables all animations and transitions for users who prefer it. Verity's `index.css` has no such rule.

**Change**: Add to `src/index.css`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 2. Accessibility: 44px minimum tap targets (Quick win)

LA45 enforces WCAG-compliant 44px minimum touch targets on all interactive elements globally. Verity relies on per-component sizing but has no global guarantee.

**Change**: Add to `src/index.css`:
```css
a, button, [role="button"], input[type="button"], input[type="submit"] {
  min-height: 44px;
  min-width: 44px;
  -webkit-tap-highlight-color: transparent;
}
```

---

### 3. Performance: `content-visibility: auto` utility class (Quick win)

LA45 uses a `.cv-auto` CSS class with `content-visibility: auto` to skip rendering of off-screen sections, improving initial paint time. This is a one-line utility that can be applied to below-the-fold landing page sections.

**Change**: Add to `src/index.css`:
```css
.cv-auto {
  content-visibility: auto;
  contain-intrinsic-size: 1px 800px;
}
```
Then apply `className="cv-auto"` to heavy below-the-fold sections in `Landing.tsx` (e.g. `FeaturesSection`, `HowItWorksSection`, `StatsSection`).

---

### What is NOT worth pulling

- **Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)** — These are set via Next.js `headers()` config. In a Vite SPA, these must be configured at the hosting/CDN layer (Vercel, Cloudflare, etc.), not in application code. Not applicable here.
- **Upstash rate limiting middleware** — LA45 uses `@upstash/ratelimit` in Next.js middleware. Verity already has in-memory rate limiting on its edge functions, which is the equivalent approach.
- **`useInView` hook with throttled fallback** — Verity already uses framer-motion's `useInView` / `whileInView`. The LA45 version adds an IntersectionObserver fallback with throttled scroll listeners, but this is unnecessary since all modern browsers support IntersectionObserver.
- **Glass/gold-vignette CSS effects** — Purely cosmetic and LA45-brand-specific.

---

### Technical details

| Item | Files affected | Effort |
|------|---------------|--------|
| Reduced-motion reset | `src/index.css` (add ~6 lines) | Trivial |
| 44px tap targets | `src/index.css` (add ~5 lines) | Trivial |
| content-visibility utility | `src/index.css` (add ~4 lines), `src/pages/Landing.tsx` (add class to sections) | Low |

All changes are purely additive CSS. No dependencies, no migrations, no risk.

