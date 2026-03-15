-- Create rate_limit_buckets table for sliding-window rate limiting
CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT        NOT NULL,
  count         INT         NOT NULL DEFAULT 1,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast key + window lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_key_window
  ON rate_limit_buckets (key, window_start DESC);

CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_window_start
  ON rate_limit_buckets (window_start);

-- Unique constraint on (key, window_start) to support atomic upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limit_buckets_key_window_unique
  ON rate_limit_buckets (key, window_start);

-- RLS: enabled so direct table access requires explicit policy;
-- the edge function uses the service-role key which bypasses RLS.
ALTER TABLE rate_limit_buckets ENABLE ROW LEVEL SECURITY;

-- No direct client access allowed
-- (edge function accesses via service-role key, bypassing RLS by design)

-- Expose check_rate_limit RPC callable from edge functions or server-side code
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key           TEXT,
  p_max_requests  INT,
  p_window_seconds INT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now           TIMESTAMPTZ := NOW();
  v_window_start  TIMESTAMPTZ;
  v_count         INT;
  v_reset_at      TIMESTAMPTZ;
  v_allowed       BOOLEAN;
  v_remaining     INT;
  v_bucket_start  TIMESTAMPTZ;
BEGIN
  v_window_start := v_now - (p_window_seconds || ' seconds')::INTERVAL;

  -- Purge expired buckets
  DELETE FROM public.rate_limit_buckets
  WHERE key = p_key AND window_start < v_window_start;

  -- Atomically insert or increment the counter for the current second bucket
  v_bucket_start := date_trunc('second', v_now);

  INSERT INTO public.rate_limit_buckets (key, count, window_start)
  VALUES (p_key, 1, v_bucket_start)
  ON CONFLICT (key, window_start)
  DO UPDATE SET count = public.rate_limit_buckets.count + 1;

  -- Sum all counts within the sliding window
  SELECT COALESCE(SUM(count), 0)
  INTO v_count
  FROM public.rate_limit_buckets
  WHERE key = p_key AND window_start >= v_window_start;

  -- reset_at is when the oldest active bucket expires
  SELECT window_start + (p_window_seconds || ' seconds')::INTERVAL
  INTO v_reset_at
  FROM public.rate_limit_buckets
  WHERE key = p_key AND window_start >= v_window_start
  ORDER BY window_start ASC
  LIMIT 1;

  v_reset_at  := COALESCE(v_reset_at, v_now + (p_window_seconds || ' seconds')::INTERVAL);
  v_allowed   := v_count <= p_max_requests;
  v_remaining := GREATEST(0, p_max_requests - v_count);

  RETURN json_build_object(
    'allowed',    v_allowed,
    'remaining',  v_remaining,
    'reset_at',   v_reset_at
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INT, INT) TO service_role;
