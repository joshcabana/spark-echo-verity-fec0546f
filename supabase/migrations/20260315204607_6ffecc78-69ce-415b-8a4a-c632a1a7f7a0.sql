
CREATE OR REPLACE FUNCTION public.check_notification_cap(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT COUNT(*) FROM public.notification_deliveries
     WHERE user_id = p_user_id
       AND sent_at > now() - interval '7 days')
    <
    (SELECT COALESCE(weekly_cap, 20) FROM public.notification_preferences
     WHERE user_id = p_user_id),
    true
  );
$$;
