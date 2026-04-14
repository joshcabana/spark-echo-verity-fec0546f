
-- 1. Remove the DELETE policy on token_transactions (financial records should never be deletable by users)
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.token_transactions;

-- 2. Remove sensitive tables from Realtime publication to prevent data leakage
ALTER PUBLICATION supabase_realtime DROP TABLE public.moderation_flags;
ALTER PUBLICATION supabase_realtime DROP TABLE public.runtime_alert_events;
