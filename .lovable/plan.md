

## Plan: Magic-link-only Auth page + Waitlist table + Delete orphan

### 1. Create waitlist table (database migration)
Run the provided SQL to create `public.waitlist` with RLS policies allowing anonymous inserts and admin-only reads, plus a unique email constraint and index.

### 2. Replace `src/pages/Auth.tsx`
Rewrite to magic-link-only authentication:
- Keep `AuthSkeleton` export unchanged
- Remove: password state, displayName state, mode toggle, `signUp`/`signInWithPassword` calls, resend verification logic, `searchParams` handling
- Add: `useAuth()` hook to detect logged-in user → redirect to `/lobby`
- Single email input with Mail icon, `signInWithOtp()` with `emailRedirectTo: origin + "/onboarding"`
- After send: "Waiting for you to click the link…" card, resend button, "Use a different email" link
- Subtitle: "Sign in with a magic link — no password needed."
- Footer text: "We never share your email. Ever."
- Proper `<form onSubmit>` with error toasts

### 3. Delete `src/components/onboarding/SignInStep.tsx`
Orphaned file with no imports elsewhere.

