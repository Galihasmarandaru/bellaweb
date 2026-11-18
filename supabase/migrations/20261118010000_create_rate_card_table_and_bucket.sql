-- Create rate_cards table and rate-card-images storage bucket

CREATE TABLE IF NOT EXISTS public.rate_cards (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_cards ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_cards TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can manage rate_cards" ON public.rate_cards;
CREATE POLICY "Authenticated users can manage rate_cards"
  ON public.rate_cards
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('rate-card-images', 'rate-card-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public read rate-card-images" ON storage.objects;
CREATE POLICY "Public read rate-card-images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'rate-card-images');

DROP POLICY IF EXISTS "Authenticated upload rate-card-images" ON storage.objects;
CREATE POLICY "Authenticated upload rate-card-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'rate-card-images');

DROP POLICY IF EXISTS "Authenticated update rate-card-images" ON storage.objects;
CREATE POLICY "Authenticated update rate-card-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'rate-card-images')
  WITH CHECK (bucket_id = 'rate-card-images');

DROP POLICY IF EXISTS "Authenticated delete rate-card-images" ON storage.objects;
CREATE POLICY "Authenticated delete rate-card-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'rate-card-images');
