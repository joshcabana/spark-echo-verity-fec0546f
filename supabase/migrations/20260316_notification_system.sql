-- ============================================================
-- Migration: 20260316_notification_system.sql
-- Purpose: Notification preferences, delivery tracking, referrals.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  quiet_hours JSONB NOT NULL DEFAULT '{"start":"22:00","end":"08:00","timezone":"Australia/Sydney"}'::jsonb,
  weekly_cap INT NOT NULL DEFAULT 15,
  transactional_only BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users manage own notification preferences"
  ON public.notification_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  template_key TEXT NOT NULL,
  dedupe_key TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_dedupe
  ON public.notification_deliveries (user_id, dedupe_key)
  WHERE dedupe_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_notification_user_time
  ON public.notification_deliveries (user_id, sent_at DESC);

ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notification deliveries" ON public.notification_deliveries;
CREATE POLICY "Users can read own notification deliveries"
  ON public.notification_deliveries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all notification deliveries" ON public.notification_deliveries;
CREATE POLICY "Admins can read all notification deliveries"
  ON public.notification_deliveries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.referral_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  invitee_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rewarded', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referral_inviter
  ON public.referral_invites (inviter_user_id);

CREATE INDEX IF NOT EXISTS idx_referral_code
  ON public.referral_invites (invite_code);

ALTER TABLE public.referral_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own referrals" ON public.referral_invites;
CREATE POLICY "Users can read own referrals"
  ON public.referral_invites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

DROP POLICY IF EXISTS "Users can insert own referrals" ON public.referral_invites;
CREATE POLICY "Users can insert own referrals"
  ON public.referral_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_user_id);

CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referral_invites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('tokens', 'premium_drop', 'badge')),
  reward_value INT NOT NULL DEFAULT 0,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own referral rewards" ON public.referral_rewards;
CREATE POLICY "Users can read own referral rewards"
  ON public.referral_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.check_notification_cap(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cap INT;
  v_sent_this_week INT;
BEGIN
  SELECT weekly_cap
  INTO v_cap
  FROM public.notification_preferences
  WHERE user_id = p_user_id;

  IF v_cap IS NULL THEN
    v_cap := 15;
  END IF;

  SELECT COUNT(*)
  INTO v_sent_this_week
  FROM public.notification_deliveries
  WHERE user_id = p_user_id
    AND sent_at >= date_trunc('week', now());

  RETURN v_sent_this_week < v_cap;
END;
$$;

REVOKE ALL ON FUNCTION public.check_notification_cap(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_notification_cap(UUID) TO authenticated;
