-- ============================================================
-- MATCHMAKING PREFERENCES UPGRADE
-- Adds cached gender/interest columns for high-performance atomic matching
-- ============================================================

-- 1. Add columns to matchmaking_queue
ALTER TABLE public.matchmaking_queue 
ADD COLUMN IF NOT EXISTS user_gender TEXT,
ADD COLUMN IF NOT EXISTS interested_in TEXT;

-- 2. Create indices for faster matching
CREATE INDEX IF NOT EXISTS idx_mq_pref_matching 
ON public.matchmaking_queue (drop_id, status, user_gender, interested_in);

-- 3. Upgrade claim_match_candidate RPC
CREATE OR REPLACE FUNCTION public.claim_match_candidate(
  p_user_id uuid,
  p_drop_id uuid
)
RETURNS TABLE(candidate_user_id uuid, candidate_queue_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_self_gender TEXT;
  v_self_interest TEXT;
  v_candidate_user_id uuid;
  v_candidate_queue_id uuid;
BEGIN
  -- Fetch my own cached preferences from the queue entry
  SELECT user_gender, interested_in
  INTO v_self_gender, v_self_interest
  FROM public.matchmaking_queue
  WHERE user_id = p_user_id 
    AND drop_id = p_drop_id
    AND status = 'waiting';

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Atomic claim of a compatible candidate
  -- Match Logic:
  -- 1. Candidate must be in this drop and waiting
  -- 2. Candidate must not be me
  -- 3. Mutual Gender Interest Check
  -- 4. Bidirectional Block Check
  SELECT mq.user_id, mq.id
  INTO v_candidate_user_id, v_candidate_queue_id
  FROM public.matchmaking_queue mq
  WHERE mq.drop_id = p_drop_id
    AND mq.status = 'waiting'
    AND mq.user_id <> p_user_id
    -- Mutual Interest Check
    AND (
      (v_self_interest = 'everyone' OR mq.user_gender = v_self_interest) AND
      (mq.interested_in = 'everyone' OR v_self_gender = mq.interested_in)
    )
    -- Bidirectional Block Check
    AND NOT EXISTS (
      SELECT 1 FROM public.user_blocks ub 
      WHERE (ub.blocker_id = p_user_id AND ub.blocked_id = mq.user_id)
         OR (ub.blocker_id = mq.user_id AND ub.blocked_id = p_user_id)
    )
  ORDER BY mq.joined_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_candidate_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Phase 1: Mark candidate as claiming
  UPDATE public.matchmaking_queue
  SET status = 'claiming'
  WHERE id = v_candidate_queue_id;

  -- Phase 2: Mark self as claiming
  UPDATE public.matchmaking_queue
  SET status = 'claiming'
  WHERE user_id = p_user_id
    AND drop_id = p_drop_id
    AND status = 'waiting';

  RETURN QUERY SELECT v_candidate_user_id, v_candidate_queue_id;
END;
$$;
