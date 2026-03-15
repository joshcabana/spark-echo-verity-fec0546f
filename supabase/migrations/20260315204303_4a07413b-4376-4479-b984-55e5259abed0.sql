
-- 1. drop_themes
CREATE TABLE IF NOT EXISTS public.drop_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  vibe TEXT,
  accent_color TEXT NOT NULL DEFAULT '#C49A4A',
  description TEXT,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  seasonal_start TEXT,
  seasonal_end TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.drop_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active themes" ON public.drop_themes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage themes" ON public.drop_themes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. drop_theme_prompts
CREATE TABLE IF NOT EXISTS public.drop_theme_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES public.drop_themes(id),
  prompt_text TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);
ALTER TABLE public.drop_theme_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active prompts" ON public.drop_theme_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage prompts" ON public.drop_theme_prompts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. experiment_assignments
CREATE TABLE IF NOT EXISTS public.experiment_assignments (
  user_id UUID NOT NULL,
  experiment_key TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, experiment_key)
);
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assignments" ON public.experiment_assignments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assignments" ON public.experiment_assignments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage assignments" ON public.experiment_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. product_events
CREATE TABLE IF NOT EXISTS public.product_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  event_name TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own events" ON public.product_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all events" ON public.product_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. notification_deliveries
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_key TEXT NOT NULL,
  channel TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  dedupe_key TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own deliveries" ON public.notification_deliveries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage deliveries" ON public.notification_deliveries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 6. notification_preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY NOT NULL,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  transactional_only BOOLEAN NOT NULL DEFAULT false,
  quiet_hours JSONB NOT NULL DEFAULT '{"start":"22:00","end":"08:00"}',
  weekly_cap INTEGER NOT NULL DEFAULT 20,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own prefs" ON public.notification_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prefs" ON public.notification_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own prefs" ON public.notification_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 7. referral_invites
CREATE TABLE IF NOT EXISTS public.referral_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL,
  invite_code TEXT NOT NULL,
  invitee_user_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.referral_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invites" ON public.referral_invites FOR SELECT TO authenticated USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);
CREATE POLICY "Users can create invites" ON public.referral_invites FOR INSERT TO authenticated WITH CHECK (auth.uid() = inviter_user_id);
CREATE POLICY "Admins can manage invites" ON public.referral_invites FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 8. referral_rewards
CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id UUID NOT NULL REFERENCES public.referral_invites(id),
  user_id UUID NOT NULL,
  reward_type TEXT NOT NULL,
  reward_value INTEGER NOT NULL DEFAULT 0,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own rewards" ON public.referral_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage rewards" ON public.referral_rewards FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 9. success_stories
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID,
  anonymized_name TEXT NOT NULL,
  story_text TEXT NOT NULL,
  city TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved stories" ON public.success_stories FOR SELECT TO authenticated USING (is_approved = true);
CREATE POLICY "Users can submit stories" ON public.success_stories FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_user_id);
CREATE POLICY "Admins can manage stories" ON public.success_stories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 10. survey_responses
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  survey_key TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own responses" ON public.survey_responses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can submit responses" ON public.survey_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all responses" ON public.survey_responses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 11. verification_signals
CREATE TABLE IF NOT EXISTS public.verification_signals (
  user_id UUID NOT NULL,
  signal_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB NOT NULL DEFAULT '{}',
  verified_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, signal_key)
);
ALTER TABLE public.verification_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own signals" ON public.verification_signals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own signals" ON public.verification_signals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own signals" ON public.verification_signals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage signals" ON public.verification_signals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
