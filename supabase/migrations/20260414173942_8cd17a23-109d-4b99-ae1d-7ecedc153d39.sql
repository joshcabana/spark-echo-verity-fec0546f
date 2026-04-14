
-- Add banned_at to user_trust
ALTER TABLE public.user_trust
  ADD COLUMN IF NOT EXISTS banned_at timestamptz DEFAULT NULL;
