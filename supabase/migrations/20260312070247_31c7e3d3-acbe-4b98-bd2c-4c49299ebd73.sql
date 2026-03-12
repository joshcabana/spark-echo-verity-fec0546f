
-- 1. user_blocks: change from {public} to {authenticated}
DROP POLICY IF EXISTS "Users can insert own blocks" ON public.user_blocks;
CREATE POLICY "Users can insert own blocks" ON public.user_blocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can view own blocks" ON public.user_blocks;
CREATE POLICY "Users can view own blocks" ON public.user_blocks FOR SELECT TO authenticated USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS "Users can delete own blocks" ON public.user_blocks;
CREATE POLICY "Users can delete own blocks" ON public.user_blocks FOR DELETE TO authenticated USING (auth.uid() = blocker_id);

-- 2. chemistry_replays: change from {public} to {authenticated}
DROP POLICY IF EXISTS "Participants can view own replays" ON public.chemistry_replays;
CREATE POLICY "Participants can view own replays" ON public.chemistry_replays FOR SELECT TO authenticated USING (auth.uid() = user_a OR auth.uid() = user_b);

DROP POLICY IF EXISTS "Admins can manage replays" ON public.chemistry_replays;
CREATE POLICY "Admins can manage replays" ON public.chemistry_replays FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 3. platform_stats: allow public read for Transparency page
DROP POLICY IF EXISTS "Authenticated users can view stats" ON public.platform_stats;
CREATE POLICY "Anyone can view stats" ON public.platform_stats FOR SELECT USING (true);
