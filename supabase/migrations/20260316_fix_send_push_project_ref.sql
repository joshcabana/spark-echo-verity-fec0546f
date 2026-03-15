-- Align database-triggered push notifications with the production Supabase project.
CREATE OR REPLACE FUNCTION public.notify_new_spark()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://nhpbxlvogqnqutmflwlk.supabase.co/functions/v1/send-push',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocGJ4bHZvZ3FucXV0bWZsd2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDQ4MzUsImV4cCI6MjA3OTM4MDgzNX0.BDZmwx15CSsjgHZYHodz8zSbE_pRCjXwiSoRf-UgwMc"}'::jsonb,
    body := jsonb_build_object(
      'user_ids', jsonb_build_array(NEW.user_a::text, NEW.user_b::text),
      'title', 'New Spark! ✨',
      'body', 'Someone sparked with you! Open Verity to connect.',
      'url', '/chat/' || NEW.id::text
    )::jsonb
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner_id uuid;
  v_spark record;
  v_sender_name text;
BEGIN
  SELECT user_a, user_b INTO v_spark FROM public.sparks WHERE id = NEW.spark_id;
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  v_partner_id := CASE
    WHEN v_spark.user_a = NEW.sender_id THEN v_spark.user_b
    ELSE v_spark.user_a
  END;

  SELECT display_name INTO v_sender_name FROM public.profiles WHERE user_id = NEW.sender_id;

  PERFORM net.http_post(
    url := 'https://nhpbxlvogqnqutmflwlk.supabase.co/functions/v1/send-push',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocGJ4bHZvZ3FucXV0bWZsd2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDQ4MzUsImV4cCI6MjA3OTM4MDgzNX0.BDZmwx15CSsjgHZYHodz8zSbE_pRCjXwiSoRf-UgwMc"}'::jsonb,
    body := jsonb_build_object(
      'user_ids', jsonb_build_array(v_partner_id::text),
      'title', COALESCE(v_sender_name, 'Your Spark'),
      'body', LEFT(COALESCE(NEW.content, '🎙️ Voice message'), 50),
      'url', '/chat/' || NEW.spark_id::text
    )::jsonb
  );
  RETURN NEW;
END;
$$;
