-- Run this migration in the Supabase SQL editor before deploying the activity pages.
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS body text,
  ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

UPDATE public.news
SET external_url = COALESCE(external_url, url)
WHERE external_url IS NULL AND url IS NOT NULL;

UPDATE public.news
SET
  slug = CASE id
    WHEN 1 THEN 'electrical-maintenance-february-2024'
    WHEN 2 THEN 'arduino-embedded-systems-workshop-2024'
    WHEN 3 THEN 'led-bulb-making-workshop-2024'
    WHEN 4 THEN 'pcb-design-workshop-vydhyuth-2024'
    ELSE CONCAT('activity-', id)
  END,
  summary = CASE id
    WHEN 1 THEN 'EMRC members carried out electrical maintenance work across the GEC Sreekrishnapuram campus.'
    WHEN 2 THEN 'EMRC hosted a two-day workshop introducing Arduino programming and embedded-system design.'
    WHEN 3 THEN 'EMRC and NSS Unit 185 collaborated on a hands-on LED bulb making workshop for students.'
    WHEN 4 THEN 'Vydhyuth 2024 included an EMRC-led practical workshop on PCB design fundamentals.'
    ELSE title
  END,
  body = CASE id
    WHEN 1 THEN 'EMRC members conducted electrical maintenance activities in the college on 16 February 2024. The work gave student volunteers practical exposure to maintaining campus electrical infrastructure.\n\nThe activity reflects EMRC’s focus on responsible maintenance, collaboration, and hands-on engineering learning.'
    WHEN 2 THEN 'EMRC conducted a two-day Arduino programming and embedded-system design workshop on 22 and 23 February 2024. Participants explored core programming concepts and their use in practical electronic systems.\n\nThe workshop supported students who want to move from basic circuit ideas to building and controlling embedded projects.'
    WHEN 3 THEN 'NSS Unit 185 of GEC Palakkad collaborated with EMRC to conduct an LED bulb making workshop on 5 April 2024. Participants learned the components and assembly steps involved in a basic LED lighting circuit.\n\nThe hands-on session connected electrical engineering fundamentals with a useful everyday application.'
    WHEN 4 THEN 'EMRC conducted a PCB design workshop as part of Vydhyuth 2024 on 25 October 2024. The session introduced participants to the process of translating a circuit concept into a printed circuit board layout.\n\nStudents gained an accessible starting point for designing reliable and manufacturable electronics projects.'
    ELSE title
  END,
  published_at = CASE id
    WHEN 1 THEN '2024-02-16T00:00:00Z'::timestamp with time zone
    WHEN 2 THEN '2024-02-23T00:00:00Z'::timestamp with time zone
    WHEN 3 THEN '2024-04-05T00:00:00Z'::timestamp with time zone
    WHEN 4 THEN '2024-10-25T00:00:00Z'::timestamp with time zone
    ELSE NULL
  END
WHERE slug IS NULL OR summary IS NULL OR body IS NULL OR published_at IS NULL;

ALTER TABLE public.news
  ALTER COLUMN slug SET NOT NULL,
  ALTER COLUMN summary SET NOT NULL,
  ALTER COLUMN body SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS news_slug_key ON public.news (slug);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON public.news (published_at DESC) WHERE published_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.set_news_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_news_updated_at ON public.news;
CREATE TRIGGER set_news_updated_at
BEFORE UPDATE ON public.news
FOR EACH ROW EXECUTE FUNCTION public.set_news_updated_at();
