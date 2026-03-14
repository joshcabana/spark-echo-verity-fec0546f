CREATE OR REPLACE FUNCTION public.get_public_drop_schedule()
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  scheduled_at timestamptz,
  duration_minutes integer,
  max_capacity integer,
  status text,
  room_id uuid,
  timezone text,
  is_friendfluence boolean,
  room_name text,
  rsvp_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    d.id,
    d.title,
    d.description,
    d.scheduled_at,
    d.duration_minutes,
    d.max_capacity,
    d.status,
    d.room_id,
    d.timezone,
    d.is_friendfluence,
    r.name AS room_name,
    COALESCE((SELECT COUNT(*) FROM public.drop_rsvps dr WHERE dr.drop_id = d.id), 0) AS rsvp_count
  FROM public.drops d
  LEFT JOIN public.rooms r ON r.id = d.room_id
  WHERE d.status IN ('upcoming', 'live')
  ORDER BY d.scheduled_at ASC;
$$;