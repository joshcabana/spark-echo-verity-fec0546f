-- ============================================================
-- Migration: 20260316_product_events_and_experiments.sql
-- Purpose: First-party analytics foundation for activation funnel,
--          experiment assignment, and post-call feedback.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.product_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_events_user_event
  ON public.product_events (user_id, event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_events_name_time
  ON public.product_events (event_name, created_at DESC);

ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can insert own product events" ON public.product_events;
CREATE POLICY "Authenticated users can insert own product events"
  ON public.product_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anonymous can insert public product events" ON public.product_events;
CREATE POLICY "Anonymous can insert public product events"
  ON public.product_events
  FOR INSERT
  TO anon
  WITH CHECK (
    user_id IS NULL
    AND event_name = ANY (ARRAY['landing_viewed', 'landing_cta_clicked'])
  );

DROP POLICY IF EXISTS "Users can read own product events" ON public.product_events;
CREATE POLICY "Users can read own product events"
  ON public.product_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all product events" ON public.product_events;
CREATE POLICY "Admins can read all product events"
  ON public.product_events
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.experiment_assignments (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experiment_key TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, experiment_key)
);

ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own experiment assignments" ON public.experiment_assignments;
CREATE POLICY "Users can read own experiment assignments"
  ON public.experiment_assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own experiment assignments" ON public.experiment_assignments;
CREATE POLICY "Users can insert own experiment assignments"
  ON public.experiment_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_lobby_seen_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_rsvp_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_call_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS first_mutual_spark_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_variant TEXT DEFAULT 'control';

CREATE TABLE IF NOT EXISTS public.post_call_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  reason_codes TEXT[] NOT NULL DEFAULT '{}'::text[],
  free_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (call_id, user_id)
);

ALTER TABLE public.post_call_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own post-call feedback" ON public.post_call_feedback;
CREATE POLICY "Users can insert own post-call feedback"
  ON public.post_call_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own post-call feedback" ON public.post_call_feedback;
CREATE POLICY "Users can read own post-call feedback"
  ON public.post_call_feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all post-call feedback" ON public.post_call_feedback;
CREATE POLICY "Admins can read all post-call feedback"
  ON public.post_call_feedback
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE MATERIALIZED VIEW IF NOT EXISTS public.activation_funnel AS
SELECT
  date_trunc('day', p.created_at) AS cohort_day,
  COUNT(*) AS signups,
  COUNT(p.first_lobby_seen_at) AS saw_lobby,
  COUNT(p.first_rsvp_at) AS first_rsvp,
  COUNT(p.first_call_at) AS first_call,
  COUNT(p.first_mutual_spark_at) AS first_mutual_spark
FROM public.profiles p
GROUP BY 1;

CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  survey_key TEXT NOT NULL,
  score SMALLINT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own survey responses" ON public.survey_responses;
CREATE POLICY "Users can insert own survey responses"
  ON public.survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own survey responses" ON public.survey_responses;
CREATE POLICY "Users can read own survey responses"
  ON public.survey_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
