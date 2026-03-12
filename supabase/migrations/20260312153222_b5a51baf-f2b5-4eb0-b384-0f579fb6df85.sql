
-- Drop all existing policies on waitlist
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "allow_waitlist_insert" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_no_read" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_anon_insert" ON public.waitlist;
DROP POLICY IF EXISTS "waitlist_admin_select" ON public.waitlist;

-- Ensure RLS is enabled
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Fresh INSERT policy for anon and authenticated
CREATE POLICY waitlist_anon_insert ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Fresh SELECT policy: admin only via has_role
CREATE POLICY waitlist_admin_select ON public.waitlist FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
