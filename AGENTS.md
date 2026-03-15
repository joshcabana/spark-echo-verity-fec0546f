# Verity — AGENTS.md

## Project
Speed-dating web app. React 18 + TypeScript + Vite frontend, Supabase backend (PostgreSQL, RLS, 19 Edge Functions in Deno), Agora RTC for video, Stripe for payments.
Repo: joshcabana/spark-echo-verity-fec0546f
Supabase project ID: nhpbxlvogqnqutmflwlk

## Rules
- Always run `npm run lint` before finishing any task. Fix all lint errors.
- Never push directly to main. Always create a new branch and open a PR.
- Use TypeScript strictly — no `any` unless adding eslint-disable comment with reason.
- Supabase migrations go in supabase/migrations/ with timestamp prefix YYYYMMDD_description.sql
- Edge functions go in supabase/functions/<function-name>/index.ts using Deno syntax.
- Follow existing RLS patterns: check user_roles table for admin access.

## Test command
npm run lint

## Branch naming
feat/<short-description> for features
fix/<short-description> for bug fixes
