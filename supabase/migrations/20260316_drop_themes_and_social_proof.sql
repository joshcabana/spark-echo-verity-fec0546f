-- ============================================================
-- Migration: 20260316_drop_themes_and_social_proof.sql
-- Purpose: Drop theming system, icebreakers, success stories, social proof.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.drop_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('chill', 'adventure', 'deep_talk', 'flirty', 'creative', 'seasonal', 'professional')),
  vibe TEXT,
  accent_color TEXT NOT NULL DEFAULT '#C49A4A',
  description TEXT,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  seasonal_start TIMESTAMPTZ,
  seasonal_end TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drop_theme_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES public.drop_themes(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_theme_prompts
  ON public.drop_theme_prompts (theme_id, position);

ALTER TABLE public.drops
  ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.drop_themes(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymized_name TEXT NOT NULL,
  city TEXT,
  story_text TEXT NOT NULL CHECK (char_length(story_text) BETWEEN 20 AND 500),
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read published success stories" ON public.success_stories;
CREATE POLICY "Anyone can read published success stories"
  ON public.success_stories
  FOR SELECT
  USING (is_approved = true AND published_at IS NOT NULL);

DROP POLICY IF EXISTS "Users can submit own success stories" ON public.success_stories;
CREATE POLICY "Users can submit own success stories"
  ON public.success_stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_user_id);

DROP POLICY IF EXISTS "Admins can manage success stories" ON public.success_stories;
CREATE POLICY "Admins can manage success stories"
  ON public.success_stories
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.verification_signals (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signal_key TEXT NOT NULL CHECK (signal_key IN ('age_18plus', 'face_verified', 'linkedin_verified', 'friendfluence_introduced', 'community_good_standing')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'expired', 'revoked')),
  verified_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (user_id, signal_key)
);

ALTER TABLE public.verification_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own verification signals" ON public.verification_signals;
CREATE POLICY "Users can read own verification signals"
  ON public.verification_signals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage verification signals" ON public.verification_signals;
CREATE POLICY "Admins can manage verification signals"
  ON public.verification_signals
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE VIEW public.drop_social_proof AS
SELECT
  d.id AS drop_id,
  d.title,
  d.theme_id,
  d.max_capacity,
  COUNT(r.id) AS rsvp_count,
  GREATEST(d.max_capacity - COUNT(r.id), 0)::INT AS spots_remaining,
  MAX(r.rsvp_at) AS last_rsvp_at
FROM public.drops d
LEFT JOIN public.drop_rsvps r ON r.drop_id = d.id
WHERE d.scheduled_at > now()
  AND d.status IN ('upcoming', 'live')
GROUP BY d.id, d.title, d.theme_id, d.max_capacity;

INSERT INTO public.drop_themes (slug, title, category, vibe, description) VALUES
  ('chill-vibes', 'Chill Vibes', 'chill', 'relaxed', 'Low-pressure, easy-going conversations. Just be yourself.'),
  ('no-small-talk', 'No Small Talk', 'deep_talk', 'meaningful', 'Skip the weather. Go straight to what matters.'),
  ('adventure-seekers', 'Adventure Seekers', 'adventure', 'energetic', 'For people who''d rather be outside than on their phones.'),
  ('creative-souls', 'Creative Souls', 'creative', 'expressive', 'Artists, musicians, writers, makers — find your spark.'),
  ('friday-flirts', 'Friday Flirts', 'flirty', 'playful', 'End the week with a little chemistry. Playful energy welcome.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.drop_theme_prompts (theme_id, prompt_text, position) VALUES
  ((SELECT id FROM public.drop_themes WHERE slug = 'chill-vibes'), 'What''s your go-to comfort show?', 1),
  ((SELECT id FROM public.drop_themes WHERE slug = 'chill-vibes'), 'Coffee or tea? Defend your choice.', 2),
  ((SELECT id FROM public.drop_themes WHERE slug = 'chill-vibes'), 'Best meal you''ve had this month?', 3),
  ((SELECT id FROM public.drop_themes WHERE slug = 'no-small-talk'), 'What''s something you changed your mind about recently?', 1),
  ((SELECT id FROM public.drop_themes WHERE slug = 'no-small-talk'), 'What do you wish more people understood about you?', 2),
  ((SELECT id FROM public.drop_themes WHERE slug = 'no-small-talk'), 'What''s the bravest thing you''ve done?', 3),
  ((SELECT id FROM public.drop_themes WHERE slug = 'adventure-seekers'), 'Best trip you''ve ever taken?', 1),
  ((SELECT id FROM public.drop_themes WHERE slug = 'adventure-seekers'), 'Sunrise or sunset — and where?', 2),
  ((SELECT id FROM public.drop_themes WHERE slug = 'adventure-seekers'), 'What''s next on your bucket list?', 3),
  ((SELECT id FROM public.drop_themes WHERE slug = 'creative-souls'), 'What are you creating right now?', 1),
  ((SELECT id FROM public.drop_themes WHERE slug = 'creative-souls'), 'What inspires you most?', 2),
  ((SELECT id FROM public.drop_themes WHERE slug = 'creative-souls'), 'Song that changed your life?', 3),
  ((SELECT id FROM public.drop_themes WHERE slug = 'friday-flirts'), 'Best opening line you''ve ever heard?', 1),
  ((SELECT id FROM public.drop_themes WHERE slug = 'friday-flirts'), 'What''s your signature move?', 2),
  ((SELECT id FROM public.drop_themes WHERE slug = 'friday-flirts'), 'Describe your ideal Friday night.', 3)
ON CONFLICT DO NOTHING;
