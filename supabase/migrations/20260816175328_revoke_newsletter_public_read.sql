DROP POLICY IF EXISTS "Allow public select by anyone" ON public.newsletter_subscribers;
REVOKE ALL PRIVILEGES ON public.newsletter_subscribers FROM anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
