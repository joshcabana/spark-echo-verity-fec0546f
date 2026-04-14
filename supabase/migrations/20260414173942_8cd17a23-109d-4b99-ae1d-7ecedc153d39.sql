
-- Add banned_at to user_trust
ALTER TABLE public.user_trust
  ADD COLUMN IF NOT EXISTS banned_at timestamptz DEFAULT NULL;

-- Rate limits table for sliding-window rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (key)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Service-role only access (edge functions use service role)
CREATE POLICY "Service role manages rate limits"
  ON public.rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- check_rate_limit: returns true if under limit, false if exceeded
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_max_requests integer DEFAULT 60,
  p_window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start timestamptz;
  v_count integer;
BEGIN
  -- Try to get existing record
  SELECT window_start, request_count
  INTO v_window_start, v_count
  FROM public.rate_limits
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    -- First request for this key
    INSERT INTO public.rate_limits (key, window_start, request_count)
    VALUES (p_key, now(), 1)
    ON CONFLICT (key) DO UPDATE
    SET request_count = rate_limits.request_count + 1;
    RETURN true;
  END IF;

  -- Check if window has expired
  IF v_window_start + (p_window_seconds || ' seconds')::interval < now() THEN
    -- Reset window
    UPDATE public.rate_limits
    SET window_start = now(), request_count = 1
    WHERE key = p_key;
    RETURN true;
  END IF;

  -- Window still active, check count
  IF v_count >= p_max_requests THEN
    RETURN false;
  END IF;

  -- Increment
  UPDATE public.rate_limits
  SET request_count = request_count + 1
  WHERE key = p_key;

  RETURN true;
END;
$$;
