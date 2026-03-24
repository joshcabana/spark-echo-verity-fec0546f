
-- Remove unused recording columns from calls table
ALTER TABLE calls
  DROP COLUMN IF EXISTS recording_resource_id,
  DROP COLUMN IF EXISTS recording_sid,
  DROP COLUMN IF EXISTS recording_url;

-- Update delete_my_account to cascade properly across all related tables
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  DELETE FROM guardian_alerts WHERE user_id = _uid;
  DELETE FROM reports WHERE reporter_id = _uid OR reported_user_id = _uid;
  DELETE FROM chemistry_vault_items WHERE user_id = _uid;
  DELETE FROM spark_reflections WHERE user_id = _uid;
  DELETE FROM messages WHERE sender_id = _uid;
  DELETE FROM sparks WHERE user_a = _uid OR user_b = _uid;
  DELETE FROM calls WHERE caller_id = _uid OR callee_id = _uid;
  DELETE FROM matchmaking_queue WHERE user_id = _uid;
  DELETE FROM drop_rsvps WHERE user_id = _uid;
  DELETE FROM push_subscriptions WHERE user_id = _uid;
  DELETE FROM notification_preferences WHERE user_id = _uid;
  DELETE FROM notification_deliveries WHERE user_id = _uid;
  DELETE FROM product_events WHERE user_id = _uid;
  DELETE FROM experiment_assignments WHERE user_id = _uid;
  DELETE FROM referral_invites WHERE inviter_user_id = _uid;
  DELETE FROM survey_responses WHERE user_id = _uid;
  DELETE FROM verification_signals WHERE user_id = _uid;
  DELETE FROM token_transactions WHERE user_id = _uid;
  DELETE FROM user_payment_info WHERE user_id = _uid;
  DELETE FROM user_blocks WHERE blocker_id = _uid OR blocked_id = _uid;
  DELETE FROM user_trust WHERE user_id = _uid;
  DELETE FROM user_roles WHERE user_id = _uid;
  DELETE FROM profiles WHERE user_id = _uid;
END;
$$;
